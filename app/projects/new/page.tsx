import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ProjectWizard } from "@/components/project-wizard";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    redirect("/auth/login");
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
