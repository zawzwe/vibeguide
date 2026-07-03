import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDb, credits } from "@/db";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const [record] = await db
      .select({ balance: credits.balance })
      .from(credits)
      .where(eq(credits.userId, user.sub))
      .limit(1);

    const balance = record?.balance ?? 0;

    return NextResponse.json({
      hasCredits: balance > 0,
      balance,
    });
  } catch (error) {
    console.error("Credits check error:", error);
    return NextResponse.json({ error: "Failed to check credits" }, { status: 500 });
  }
}
