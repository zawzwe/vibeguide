import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDb, credits } from "@/db";
import { eq, sql } from "drizzle-orm";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin users don't get deducted
    if (isAdmin(user.email)) {
      return NextResponse.json({ success: true, isAdmin: true });
    }

    const db = getDb();

    // Atomically deduct 1 credit
    const result = await db
      .update(credits)
      .set({
        balance: sql`GREATEST(${credits.balance} - 1, 0)`,
        updatedAt: new Date(),
      })
      .where(eq(credits.userId, user.sub));

    if (result.count === 0) {
      return NextResponse.json({ error: "No credits record found" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Credits deduct error:", error);
    return NextResponse.json({ error: "Failed to deduct credits" }, { status: 500 });
  }
}
