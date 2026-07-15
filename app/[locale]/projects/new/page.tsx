import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { getDb, credits } from "@/db";
import { eq } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import { ProjectWizard } from "@/components/project-wizard";
import { isAdmin } from "@/lib/admin";
import type { AppLocale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function NewProjectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const projectLocale: AppLocale = locale === "en" ? "en" : "zh";
  const t = await getTranslations("Dashboard.newProject");
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    return redirect({ href: "/auth/login", locale: projectLocale });
  }

  const admin = isAdmin(user.email);
  const db = getDb();
  const [creditRecord] = await db
    .select({ balance: credits.balance })
    .from(credits)
    .where(eq(credits.userId, user.sub))
    .limit(1);

  const balance = admin ? 999 : (creditRecord?.balance ?? 0);

  if (balance <= 0 && !admin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("description")}
          </p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>{t("insufficientTitle")}</CardTitle>
            <CardDescription>
              {t("insufficientDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Button asChild>
              <Link href="/pricing">{t("topUp")}</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/projects">{t("back")}</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t("title")}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t("description")}
        </p>
      </div>
      <ProjectWizard locale={projectLocale} />
    </div>
  );
}
