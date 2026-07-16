import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDb, payments } from "@/db";
import {
  generateSignature,
  generateOutTradeNo,
  buildPaymentUrl,
  PRICING_PLANS,
} from "@/lib/zpay";
import { createCheckout, PRICING_PLANS_USD } from "@/lib/lemon-squeezy";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const planType = body.plan as keyof typeof PRICING_PLANS;
    const locale = body.locale === "en" ? "en" : "zh";

    if (!planType || !PRICING_PLANS[planType]) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const outTradeNo = generateOutTradeNo();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const db = getDb();

    // English users → Lemon Squeezy (USD)
    if (locale === "en") {
      const lsPlan = PRICING_PLANS_USD[planType];

      await db.insert(payments).values({
        userId: user.sub,
        outTradeNo,
        amount: lsPlan.price.toString(),
        productName: lsPlan.name,
        creditsAmount: lsPlan.credits,
        status: "pending",
        provider: "lemon-squeezy",
        currency: "USD",
      });

      const { checkoutUrl } = await createCheckout({
        plan: planType,
        userId: user.sub,
        outTradeNo,
        siteUrl,
      });

      return NextResponse.json({ payUrl: checkoutUrl, outTradeNo });
    }

    // Chinese users → Z-Pay (CNY, unchanged)
    const plan = PRICING_PLANS[planType];
    const productName = plan.names[locale];

    await db.insert(payments).values({
      userId: user.sub,
      outTradeNo,
      amount: plan.price.toString(),
      productName,
      creditsAmount: plan.credits,
      status: "pending",
    });

    const params: Record<string, string | number> = {
      pid: process.env.ZPAY_PID!,
      type: "alipay",
      name: productName,
      money: plan.price,
      out_trade_no: outTradeNo,
      notify_url: `${siteUrl}/api/pay/notify`,
      return_url: `${siteUrl}/api/pay/return?locale=${locale}`,
      sign_type: "MD5",
    };

    const sign = generateSignature(params, process.env.ZPAY_PKEY!);
    params.sign = sign;

    const payUrl = buildPaymentUrl(params);

    return NextResponse.json({ payUrl, outTradeNo });
  } catch (error) {
    console.error("Payment creation error:", error);
    return NextResponse.json({ error: "Failed to create payment" }, { status: 500 });
  }
}
