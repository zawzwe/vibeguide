"use client";

import { ProjectCard } from "@/components/project-card";
import { FileQuestion } from "lucide-react";
import Link from "next/link";
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
  if (projects.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FileQuestion className="h-16 w-16 text-muted-foreground/50 mb-4" />
        <h3 className="text-lg font-medium mb-2">还没有项目</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          你还没有创建任何项目。创建一个新项目，让 AI 帮你生成专业的开发文档。
        </p>
        <Button asChild>
          <Link href="/projects/new">创建新项目</Link>
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
