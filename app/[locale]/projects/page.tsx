import { createClient } from "@/lib/supabase/server";
import { getDb, projects } from "@/db";
import { eq, desc } from "drizzle-orm";
import { ProjectList } from "@/components/project-list";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link, redirect } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

export default async function ProjectsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: AppLocale = localeParam === "en" ? "en" : "zh";
  const t = await getTranslations("Dashboard.projects");
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    return redirect({ href: "/auth/login", locale });
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
          <h1 className="text-2xl font-bold">{t("title")}</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t("description")}
          </p>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="h-4 w-4 mr-1" />
            {t("newProject")}
          </Link>
        </Button>
      </div>
      <ProjectList projects={serialized} />
    </div>
  );
}
