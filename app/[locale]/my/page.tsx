import { createClient } from "@/lib/supabase/server";
import { getDb, credits } from "@/db";
import { eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { UserProfile } from "@/components/user-profile";
import { isAdmin } from "@/lib/admin";
import type { AppLocale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function MyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: AppLocale = localeParam === "en" ? "en" : "zh";
  const t = await getTranslations("Dashboard.account");
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    return redirect({ href: "/auth/login", locale });
  }

  const userEmail = user.email || t("unknown");
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
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t("description")}
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
