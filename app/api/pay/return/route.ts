import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tradeStatus = searchParams.get("trade_status");
  const localePrefix = searchParams.get("locale") === "en" ? "/en" : "";

  if (tradeStatus === "TRADE_SUCCESS") {
    return NextResponse.redirect(
      new URL(`${localePrefix}/my?payment=success`, request.url)
    );
  }

  return NextResponse.redirect(
    new URL(`${localePrefix}/pricing?payment=failed`, request.url)
  );
}
