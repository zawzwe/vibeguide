"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileText, Download, Eye, Code, ArrowLeft, Save, Package } from "lucide-react";

interface QA {
  question: string;
  answer: string;
}

interface StepDocumentsProps {
  description: string;
  qa: QA[];
  initialDocuments: Record<string, string>;
  onSave: (documents: Record<string, string>) => Promise<void>;
  onBack: () => void;
  projectId?: string;
  isSaving?: boolean;
}

const docTypes = [
  { key: "journey-map", label: "用户旅程地图" },
  { key: "prd", label: "产品需求PRD" },
  { key: "frontend", label: "前端设计文档" },
  { key: "backend", label: "后端设计文档" },
  { key: "database", label: "数据库设计" },
];

function formatMarkdown(markdown: string) {
  return markdown
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/<br\s*\/?>/gi, "\n")
    .trim();
}

export function StepDocuments({
  description,
  qa,
  initialDocuments,
  onSave,
  onBack,
  projectId,
  isSaving,
}: StepDocumentsProps) {
  const [documents, setDocuments] = useState<Record<string, string>>(initialDocuments);
  const [loading, setLoading] = useState(Object.keys(initialDocuments).length === 0);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState(docTypes[0].key);
  const [viewMode, setViewMode] = useState<"markdown" | "preview">("preview");

  useEffect(() => {
    if (Object.keys(initialDocuments).length > 0) return;

    async function fetchDocuments() {
      try {
        const res = await fetch("/api/ai/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description, qa }),
        });
        if (!res.ok) throw new Error("Failed to generate documents");
        const data = await res.json();
        setDocuments(data.documents || {});
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to generate documents");
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, [description, qa, initialDocuments]);

  const handleDownloadSingle = (key: string) => {
    const content = documents[key];
    if (!content) return;
    const docType = docTypes.find((d) => d.key === key);
    const blob = new Blob([content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${docType?.label || key}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadZip = async () => {
    if (!projectId) {
      const JSZip = (await import("jszip")).default;
      const zip = new JSZip();
      for (const doc of docTypes) {
        if (documents[doc.key]) {
          zip.file(`${doc.label}.md`, documents[doc.key]);
        }
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "documents.zip";
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    window.open(`/api/projects/${projectId}/download-zip`, "_blank");
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>正在生成文档...</CardTitle>
          <CardDescription>AI 正在为你生成专业的开发文档，请稍候</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {docTypes.map((doc) => (
            <div key={doc.key} className="space-y-2">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-red-500">生成失败</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button variant="outline" onClick={() => window.location.reload()}>
            重试
          </Button>
        </CardContent>
      </Card>
    );
  }

  const hasAllDocs = docTypes.every((d) => documents[d.key]);

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <div>
                <CardTitle>生成的文档</CardTitle>
                <CardDescription>AI 已为你生成了 5 份专业开发文档</CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === "markdown" ? "preview" : "markdown")}
              >
                {viewMode === "markdown" ? (
                  <>
                    <Eye className="h-4 w-4 mr-1" /> 预览
                  </>
                ) : (
                  <>
                    <Code className="h-4 w-4 mr-1" /> 源码
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadSingle(activeTab)}
                disabled={!documents[activeTab]}
              >
                <Download className="h-4 w-4 mr-1" /> 下载当前
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadZip}>
                <Package className="h-4 w-4 mr-1" /> ZIP 下载
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start overflow-x-auto">
              {docTypes.map((doc) => (
                <TabsTrigger key={doc.key} value={doc.key} className="text-sm">
                  {doc.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {docTypes.map((doc) => {
              const content = formatMarkdown(documents[doc.key] || "暂无内容");
              return (
                <TabsContent key={doc.key} value={doc.key} className="mt-4">
                  <div className="min-h-[520px] max-h-[760px] overflow-auto rounded-2xl border bg-gradient-to-br from-background via-background to-muted/20 p-6 shadow-inner">
                    <div className="mx-auto max-w-4xl rounded-2xl border bg-background/95 p-6 shadow-sm">
                      <div className="mb-6 border-b pb-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                              {doc.label}
                            </p>
                            <h3 className="mt-2 text-2xl font-semibold tracking-tight">
                              {doc.label}
                            </h3>
                          </div>
                          <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                            Structured Document
                          </div>
                        </div>
                      </div>

                      {viewMode === "markdown" ? (
                        <pre className="whitespace-pre-wrap break-words rounded-xl bg-muted/40 p-5 font-mono text-sm leading-7 text-foreground">
                          {content}
                        </pre>
                      ) : (
                        <div className="prose prose-lg dark:prose-invert max-w-none prose-headings:scroll-mt-20 prose-headings:tracking-tight prose-p:leading-7 prose-li:leading-7 prose-table:display-block prose-table:overflow-x-auto prose-table:border-collapse prose-th:border prose-th:border-border prose-th:bg-muted prose-th:px-3 prose-th:py-2 prose-td:border prose-td:border-border prose-td:px-3 prose-td:py-2 prose-img:rounded-xl prose-hr:my-8 prose-hr:border-border">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
              );
            })}
          </Tabs>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-1" /> 上一步
        </Button>
        <Button onClick={() => onSave(documents)} disabled={!hasAllDocs || isSaving}>
          <Save className="h-4 w-4 mr-1" />
          {isSaving ? "保存中..." : "保存项目"}
        </Button>
      </div>
    </div>
  );
}
