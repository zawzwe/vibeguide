import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDb, credits } from "@/db";
import { isAdmin } from "@/lib/admin";
import { sql } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;

    if (!user || !user.email || !isAdmin(user.email)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();

    const result = await db.execute(sql`
      insert into ${credits} (user_id, balance, updated_at)
      select u.id, 2, now()
      from auth.users u
      left join ${credits} c on c.user_id = u.id
      where c.user_id is null
      returning user_id
    `);

    return NextResponse.json({ success: true, inserted: result.rowCount ?? 0 });
  } catch (error) {
    console.error("Backfill trial credits error:", error);
    return NextResponse.json({ error: "Failed to backfill trial credits" }, { status: 500 });
  }
}
