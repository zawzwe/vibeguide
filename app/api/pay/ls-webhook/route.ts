import { NextRequest, NextResponse } from "next/server";
import { getDb, payments, credits } from "@/db";
import { eq, sql } from "drizzle-orm";
import { verifyWebhookSignature } from "@/lib/lemon-squeezy";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("X-Signature") || "";
    const secret = process.env.LS_WEBHOOK_SECRET!;

    if (!verifyWebhookSignature(rawBody, signature, secret)) {
      console.error("LS webhook: invalid signature");
      return new NextResponse("Invalid signature", { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventName = payload.meta?.event_name;

    if (eventName !== "order_created") {
      return new NextResponse("Event ignored", { status: 200 });
    }

    const orderId = payload.data?.id;
    const customData =
      payload.data?.attributes?.first_order_item?.product_options?.custom_data ||
      {};

    const outTradeNo: string | undefined = customData.out_trade_no;
    const creditsAmount: number = parseInt(customData.credits || "0", 10);
    const userId: string | undefined = customData.user_id;

    if (!outTradeNo || !userId || !creditsAmount) {
      console.error("LS webhook: missing custom data", {
        outTradeNo,
        userId,
        creditsAmount,
      });
      return new NextResponse("Missing custom data", { status: 400 });
    }

    const db = getDb();

    // Idempotency check
    const [existingPayment] = await db
      .select()
      .from(payments)
      .where(eq(payments.outTradeNo, outTradeNo))
      .limit(1);

    if (!existingPayment) {
      console.error("LS webhook: order not found", { outTradeNo });
      return new NextResponse("Order not found", { status: 404 });
    }

    if (existingPayment.status === "success") {
      return new NextResponse("success");
    }

    // Mark payment as success
    await db
      .update(payments)
      .set({
        status: "success",
        checkoutId: orderId,
        rawNotify: payload,
        updatedAt: new Date(),
      })
      .where(eq(payments.outTradeNo, outTradeNo));

    // Add credits
    await db
      .insert(credits)
      .values({
        userId,
        balance: creditsAmount,
      })
      .onConflictDoUpdate({
        target: credits.userId,
        set: {
          balance: sql`${credits.balance} + ${creditsAmount}`,
          updatedAt: new Date(),
        },
      });

    return new NextResponse("success");
  } catch (error) {
    console.error("LS webhook error:", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
