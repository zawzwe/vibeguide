"use client";

import { ProjectCard } from "@/components/project-card";
import { FileQuestion } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";

interface Project {
  id: string;
  title: string | null;
  description: string;
  status: string;
  createdAt: string;
}

interface ProjectListProps {
  projects: Project[];
}

export function ProjectList({ projects }: ProjectListProps) {
  const t = useTranslations("Dashboard.projects");
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FileQuestion className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">{t("emptyTitle")}</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          {t("emptyDescription")}
        </p>
        <Button asChild>
          <Link href="/projects/new">{t("emptyAction")}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          id={project.id}
          title={project.title}
          description={project.description}
          status={project.status}
          createdAt={project.createdAt}
        />
      ))}
    </div>
  );
}
