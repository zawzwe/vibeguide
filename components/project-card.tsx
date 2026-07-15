"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { FolderOpen, Clock } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string | null;
  description: string;
  status: string;
  createdAt: string;
}

export function ProjectCard({ id, title, description, status, createdAt }: ProjectCardProps) {
  const t = useTranslations("Dashboard.projects");
  const locale = useLocale();
  const router = useRouter();

  const date = new Date(createdAt);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  const timeAgo = diffMins < 1
    ? t("justNow")
    : diffMins < 60
      ? t("minutesAgo", { count: diffMins })
      : diffHours < 24
        ? t("hoursAgo", { count: diffHours })
        : diffDays < 30
          ? t("daysAgo", { count: diffDays })
          : new Intl.DateTimeFormat(locale).format(date);

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
      onClick={() => router.push(`/projects/${id}`)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{title || t("unnamed")}</CardTitle>
          </div>
          <Badge variant={status === "completed" ? "default" : "secondary"}>
            {status === "completed" ? t("completed") : t("draft")}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 mt-2">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {timeAgo}
        </div>
      </CardContent>
    </Card>
  );
}
