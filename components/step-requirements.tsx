"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowRight, Brain, AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

interface QA {
  question: string;
  answer: string;
}

interface StepRequirementsProps {
  description: string;
  initialQA: QA[];
  onNext: (qa: QA[]) => void;
  onBack: () => void;
  locale: AppLocale;
}

export function StepRequirements({
  description,
  initialQA,
  onNext,
  onBack,
  locale,
}: StepRequirementsProps) {
  const t = useTranslations("Wizard.requirements");
  const [questions, setQuestions] = useState<string[]>(
    initialQA.map((qa) => qa.question)
  );
  const [answers, setAnswers] = useState<Record<number, string>>(() => {
    const map: Record<number, string> = {};
    initialQA.forEach((qa, i) => {
      map[i] = qa.answer;
    });
    return map;
  });
  const [loading, setLoading] = useState(initialQA.length === 0);
  const [error, setError] = useState<string | null>(null);
  const [showNoCredits, setShowNoCredits] = useState(false);
  const [checkingCredits, setCheckingCredits] = useState(false);
  const [creditCheckError, setCreditCheckError] = useState<string | null>(null);

  useEffect(() => {
    if (initialQA.length > 0) return;

    async function fetchQuestions() {
      try {
        const res = await fetch("/api/ai/questions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ description, locale }),
        });
        if (res.status === 402) {
          setShowNoCredits(true);
          return;
        }
        if (!res.ok) throw new Error(t("loadError"));
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : t("loadError"));
      } finally {
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [description, initialQA, locale, t]);

  const allAnswered = questions.every(
    (_, i) => (answers[i] || "").trim().length > 0
  );

  const handleNext = async () => {
    setCheckingCredits(true);
    setCreditCheckError(null);
    try {
      const res = await fetch("/api/credits/check", { method: "POST" });
      if (!res.ok) {
        throw new Error(t("creditCheckError"));
      }
      const data = await res.json();
      if (!data.hasCredits) {
        setShowNoCredits(true);
        return;
      }

      const qa: QA[] = questions.map((q, i) => ({
        question: q,
        answer: answers[i] || "",
      }));
      onNext(qa);
    } catch (checkError) {
      setCreditCheckError(
        checkError instanceof Error ? checkError.message : t("creditCheckError"),
      );
    } finally {
      setCheckingCredits(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            <CardTitle>{t("title")}</CardTitle>
          </div>
          <CardDescription>
            {t("help")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-20 w-full" />
            </div>
          ) : error ? (
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{error}</p>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((question, i) => (
                <div key={i} className="space-y-2">
                  <label className="text-sm font-medium">
                    {i + 1}. {question}
                  </label>
                  <Textarea
                    placeholder={t("placeholder")}
                    value={answers[i] || ""}
                    onChange={(e) =>
                      setAnswers((prev) => ({ ...prev, [i]: e.target.value }))
                    }
                    className="resize-y min-h-[80px]"
                  />
                </div>
              ))}
            </div>
          )}

          {creditCheckError && (
            <div className="flex items-center gap-2 text-red-500">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">{creditCheckError}</p>
            </div>
          )}

          <div className="flex justify-between">
            <Button variant="outline" onClick={onBack}>
              {t("back")}
            </Button>
            <Button
              onClick={handleNext}
              disabled={loading || !allAnswered || checkingCredits}
              className="gap-2"
            >
              {checkingCredits ? t("checking") : t("next")}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showNoCredits} onOpenChange={setShowNoCredits}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("noCreditsTitle")}</DialogTitle>
            <DialogDescription>
              {t("noCreditsDescription")}
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowNoCredits(false)} className="flex-1">
              {t("cancel")}
            </Button>
            <Button asChild className="flex-1">
              <Link href="/pricing">{t("topUp")}</Link>
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
