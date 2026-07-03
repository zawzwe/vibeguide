import { createClient } from "@/lib/supabase/server";
import { getDb, projects } from "@/db";
import { eq, desc } from "drizzle-orm";
import { ProjectList } from "@/components/project-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    redirect("/auth/login");
  }

  const db = getDb();
  const projectList = await db
    .select({
      id: projects.id,
      title: projects.title,
      description: projects.description,
      status: projects.status,
      createdAt: projects.createdAt,
    })
    .from(projects)
    .where(eq(projects.userId, user.sub))
    .orderBy(desc(projects.updatedAt));

  const serialized = projectList.map((p) => ({
    id: p.id,
    title: p.title,
    description: p.description,
    status: p.status,
    createdAt: p.createdAt instanceof Date ? p.createdAt.toISOString() : String(p.createdAt),
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">我的项目</h1>
          <p className="text-muted-foreground text-sm mt-1">
            管理你的所有项目文档
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="h-4 w-4 mr-1" />
            新建项目
          </Link>
        </Button>
      </div>
      <ProjectList projects={serialized} />
    </div>
  );
}
