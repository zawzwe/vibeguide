import { NextRequest, NextResponse } from "next/server";
import { getDb, payments, credits } from "@/db";
import { eq, sql } from "drizzle-orm";
import { verifySignature } from "@/lib/zpay";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params: Record<string, string> = {};

    searchParams.forEach((value, key) => {
      params[key] = value;
    });

    const receivedSign = params.sign || "";
    const secretKey = process.env.ZPAY_PKEY!;

    // Verify signature
    if (!verifySignature(params, secretKey, receivedSign)) {
      return new NextResponse("sign verification failed", { status: 400 });
    }

    // Check trade status
    if (params.trade_status !== "TRADE_SUCCESS") {
      return new NextResponse("trade not success", { status: 200 });
    }

    const outTradeNo = params.out_trade_no;
    const zpayTradeNo = params.trade_no;
    const db = getDb();

    // Check existing payment record (idempotency)
    const [existingPayment] = await db
      .select()
      .from(payments)
      .where(eq(payments.outTradeNo, outTradeNo))
      .limit(1);

    if (!existingPayment) {
      return new NextResponse("order not found", { status: 404 });
    }

    if (existingPayment.status === "success") {
      // Already processed — idempotent
      return new NextResponse("success");
    }

    // Update payment status
    await db
      .update(payments)
      .set({
        status: "success",
        zpayTradeNo,
        rawNotify: params,
        updatedAt: new Date(),
      })
      .where(eq(payments.outTradeNo, outTradeNo));

    // Add credits to user
    const userId = existingPayment.userId;
    const creditsAmount = existingPayment.creditsAmount;

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
    console.error("Payment notify error:", error);
    return new NextResponse("error", { status: 500 });
  }
}
