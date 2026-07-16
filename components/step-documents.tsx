"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { FileText, Download, Eye, Code, ArrowLeft, Save, Package } from "lucide-react";
import type { AppLocale } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface QA {
  question: string;
  answer: string;
}

interface StepDocumentsProps {
  description: string;
  qa: QA[];
  initialDocuments: Record<string, string>;
  onDocumentsGenerated: (documents: Record<string, string>) => void;
  onSave: (documents: Record<string, string>) => Promise<void>;
  onBack: () => void;
  projectId?: string;
  isSaving?: boolean;
  locale: AppLocale;
}

const docTypeKeys = ["journey-map", "prd", "frontend", "backend", "database"] as const;

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
  onDocumentsGenerated,
  onSave,
  onBack,
  projectId,
  isSaving,
  locale,
}: StepDocumentsProps) {
  const t = useTranslations("Wizard.documents");
  const docTypes = [
    { key: "journey-map", label: t("types.journey") },
    { key: "prd", label: t("types.prd") },
    { key: "frontend", label: t("types.frontend") },
    { key: "backend", label: t("types.backend") },
    { key: "database", label: t("types.database") },
  ];
  const [documents, setDocuments] = useState<Record<string, string>>(initialDocuments);
  const [loading, setLoading] = useState(Object.keys(initialDocuments).length === 0);
  const [error, setError] = useState<string | null>(null);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [generationId, setGenerationId] = useState(() => crypto.randomUUID());
  const [requestVersion, setRequestVersion] = useState(0);
  const requestedGenerationId = useRef<string | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof docTypeKeys)[number]>(docTypeKeys[0]);
  const [viewMode, setViewMode] = useState<"markdown" | "preview">("preview");

  useEffect(() => {
    if (Object.keys(initialDocuments).length > 0) return;
    if (requestedGenerationId.current === generationId) return;
    requestedGenerationId.current = generationId;

    async function fetchDocuments() {
      try {
        setError(null);
        setErrorCode(null);
        const res = await fetch("/api/ai/documents", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ generationId, description, qa, locale }),
        });
        const data = await res.json().catch(() => ({}));

        if (!res.ok) {
          const code = typeof data.code === "string" ? data.code : null;
          setErrorCode(code);

          if (code === "INSUFFICIENT_CREDITS") {
            throw new Error(t("insufficientCredits"));
          }
          if (code === "GENERATION_IN_PROGRESS") {
            throw new Error(t("generationInProgress"));
          }
          if (code === "GENERATION_FAILED" && data.refunded) {
            throw new Error(t("generationFailedRefunded"));
          }
          throw new Error(t("generationFailedDescription"));
        }

        const generatedDocuments = data.documents || {};
        setDocuments(generatedDocuments);
        onDocumentsGenerated(generatedDocuments);
      } catch (e) {
        setError(e instanceof Error ? e.message : t("generationFailed"));
      } finally {
        setLoading(false);
      }
    }

    fetchDocuments();
  }, [
    description,
    qa,
    initialDocuments,
    locale,
    t,
    generationId,
    requestVersion,
    onDocumentsGenerated,
  ]);

  const handleRetry = () => {
    setError(null);
    setErrorCode(null);
    setLoading(true);

    if (errorCode === "GENERATION_IN_PROGRESS") {
      requestedGenerationId.current = null;
      setRequestVersion((version) => version + 1);
      return;
    }

    setGenerationId(crypto.randomUUID());
  };

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
      a.download = t("zipName");
      a.click();
      URL.revokeObjectURL(url);
      return;
    }
    window.open(`/api/projects/${projectId}/download-zip?locale=${locale}`, "_blank");
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{t("generating")}</CardTitle>
          <CardDescription>{t("generatingDescription")}</CardDescription>
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
          <CardTitle className="text-red-500">{t("generationFailed")}</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          {errorCode === "INSUFFICIENT_CREDITS" ? (
            <Button asChild>
              <Link href="/pricing">{t("getCredits")}</Link>
            </Button>
          ) : (
            <Button variant="outline" onClick={handleRetry}>
              {errorCode === "GENERATION_IN_PROGRESS"
                ? t("checkAgain")
                : t("retry")}
            </Button>
          )}
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
                <CardTitle>{t("title")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
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
                    <Eye className="h-4 w-4 mr-1" /> {t("preview")}
                  </>
                ) : (
                  <>
                    <Code className="h-4 w-4 mr-1" /> {t("source")}
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDownloadSingle(activeTab)}
                disabled={!documents[activeTab]}
              >
                <Download className="h-4 w-4 mr-1" /> {t("downloadCurrent")}
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadZip}>
                <Package className="h-4 w-4 mr-1" /> {t("downloadZip")}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={(value) => setActiveTab(value as (typeof docTypeKeys)[number])}
          >
            <TabsList className="w-full justify-start overflow-x-auto">
              {docTypes.map((doc) => (
                <TabsTrigger key={doc.key} value={doc.key} className="text-sm">
                  {doc.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {docTypes.map((doc) => {
              const content = formatMarkdown(documents[doc.key] || t("empty"));
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
          <ArrowLeft className="h-4 w-4 mr-1" /> {t("back")}
        </Button>
        <Button onClick={() => onSave(documents)} disabled={!hasAllDocs || isSaving}>
          <Save className="h-4 w-4 mr-1" />
          {isSaving ? t("saving") : t("save")}
        </Button>
      </div>
    </div>
  );
}
