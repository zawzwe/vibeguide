import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const tradeStatus = searchParams.get("trade_status");

  if (tradeStatus === "TRADE_SUCCESS") {
    return NextResponse.redirect(
      new URL("/my?payment=success", request.url)
    );
  }

  return NextResponse.redirect(
    new URL("/pricing?payment=failed", request.url)
  );
}
