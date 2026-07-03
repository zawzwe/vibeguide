import { createClient } from "@/lib/supabase/server";
import { getDb, projects } from "@/db";
import { eq, and } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { ProjectWizard } from "@/components/project-wizard";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    redirect("/auth/login");
  }

  const db = getDb();
  const [project] = await db
    .select()
    .from(projects)
    .where(and(eq(projects.id, id), eq(projects.userId, user.sub)))
    .limit(1);

  if (!project) {
    notFound();
  }

  const initialData = {
    description: project.description,
    qa: (project.qa as { question: string; answer: string }[]) || [],
    documents: (project.documents as Record<string, string>) || {},
    title: project.title || "",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{project.title || "项目详情"}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          查看和编辑你的项目文档
        </p>
      </div>
      <ProjectWizard
        initialData={initialData}
        projectId={project.id}
        userId={user.sub}
      />
    </div>
  );
}
