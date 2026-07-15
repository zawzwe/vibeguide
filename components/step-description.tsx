"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MessageSquare } from "lucide-react";
import { useTranslations } from "next-intl";

interface StepDescriptionProps {
  initialValue: string;
  onNext: (description: string) => void;
}

export function StepDescription({ initialValue, onNext }: StepDescriptionProps) {
  const t = useTranslations("Wizard.description");
  const [description, setDescription] = useState(initialValue);
  const minLength = 20;

  const isValid = description.trim().length >= minLength;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <CardTitle>{t("title")}</CardTitle>
        </div>
        <CardDescription>
          {t("help")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder={t("placeholder")}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[200px] resize-y"
          />
          <div className="flex items-center justify-between text-sm">
            <span
              className={description.trim().length >= minLength ? "text-green-600" : "text-muted-foreground"}
            >
              {t("characters", { count: description.trim().length })}
            </span>
            <span className="text-muted-foreground">{t("minimum", { count: minLength })}</span>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => onNext(description)} disabled={!isValid} className="gap-2">
            {t("next")} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
