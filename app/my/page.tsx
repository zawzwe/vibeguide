import { createClient } from "@/lib/supabase/server";
import { getDb, credits } from "@/db";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { UserProfile } from "@/components/user-profile";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function MyPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    redirect("/auth/login");
  }

  const userEmail = user.email || "未知";
  const admin = isAdmin(user.email);

  const db = getDb();
  const [creditRecord] = await db
    .select({ balance: credits.balance })
    .from(credits)
    .where(eq(credits.userId, user.sub))
    .limit(1);

  const displayCredits = admin ? 999 : (creditRecord?.balance ?? 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">我的</h1>
        <p className="text-muted-foreground text-sm mt-1">
          管理你的账户信息和项目点数
        </p>
      </div>
      <UserProfile
        email={userEmail}
        credits={displayCredits}
        isAdmin={admin}
      />
    </div>
  );
}
