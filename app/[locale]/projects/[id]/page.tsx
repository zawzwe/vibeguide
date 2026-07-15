import { createClient } from "@/lib/supabase/server";
import { getDb, projects } from "@/db";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { redirect } from "@/i18n/navigation";
import { ProjectWizard } from "@/components/project-wizard";
import type { AppLocale } from "@/i18n/routing";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string; locale: string }>;
}

export default async function ProjectDetailPage({ params }: Props) {
  const { id, locale: localeParam } = await params;
  const locale: AppLocale = localeParam === "en" ? "en" : "zh";
  const t = await getTranslations("Dashboard.detail");

  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  if (!user) {
    return redirect({ href: "/auth/login", locale });
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
        <h1 className="text-2xl font-bold">{project.title || t("fallbackTitle")}</h1>
        <p className="text-muted-foreground text-sm mt-1">
          {t("description")}
        </p>
      </div>
      <ProjectWizard
        initialData={initialData}
        projectId={project.id}
        locale={(project.locale === "en" ? "en" : "zh") as AppLocale}
      />
    </div>
  );
}
