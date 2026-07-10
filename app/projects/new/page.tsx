import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";
import { getDb, credits } from "@/db";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ProjectWizard } from "@/components/project-wizard";
import { isAdmin } from "@/lib/admin";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    redirect("/auth/login");
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
          <h1 className="text-2xl font-bold">创建新项目</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            使用 AI Agent 辅助你完成专业的项目需求分析
          </p>
        </div>

        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>项目点数不足</CardTitle>
            <CardDescription>
              你当前没有可用项目点数，请先充值后再创建新项目。
            </CardDescription>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <Button asChild>
              <Link href="/pricing">去充值</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/projects">返回我的项目</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">创建新项目</h1>
        <p className="text-muted-foreground text-sm mt-1">
          使用 AI Agent 辅助你完成专业的项目需求分析
        </p>
      </div>
      <ProjectWizard userId={user.sub} />
    </div>
  );
}
