"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { FolderOpen, Clock } from "lucide-react";

interface ProjectCardProps {
  id: string;
  title: string | null;
  description: string;
  status: string;
  createdAt: string;
}

export function ProjectCard({ id, title, description, status, createdAt }: ProjectCardProps) {
  const router = useRouter();

  const date = new Date(createdAt);
  const timeAgo = getTimeAgo(date);

  return (
    <Card
      className="cursor-pointer hover:shadow-md transition-shadow border-2 hover:border-primary/50"
      onClick={() => router.push(`/projects/${id}`)}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">{title || "未命名项目"}</CardTitle>
          </div>
          <Badge variant={status === "completed" ? "default" : "secondary"}>
            {status === "completed" ? "已完成" : "草稿"}
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

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "刚刚";
  if (diffMins < 60) return `${diffMins} 分钟前`;
  if (diffHours < 24) return `${diffHours} 小时前`;
  if (diffDays < 30) return `${diffDays} 天前`;
  return date.toLocaleDateString("zh-CN");
}
