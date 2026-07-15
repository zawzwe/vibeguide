"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";

const steps = [
  { num: 1, labelKey: "description" },
  { num: 2, labelKey: "requirements" },
  { num: 3, labelKey: "documents" },
] as const;

interface StepIndicatorProps {
  currentStep: number;
}

export function StepIndicator({ currentStep }: StepIndicatorProps) {
  const t = useTranslations("Wizard.steps");
  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {steps.map((step, i) => (
        <div key={step.num} className="flex items-center">
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors",
                currentStep > step.num
                  ? "border-primary bg-primary text-primary-foreground"
                  : currentStep === step.num
                  ? "border-primary text-primary"
                  : "border-muted-foreground/30 text-muted-foreground"
              )}
            >
              {currentStep > step.num ? (
                <Check className="h-4 w-4" />
              ) : (
                step.num
              )}
            </div>
            <span
              className={cn(
                "text-xs mt-1.5 font-medium",
                currentStep >= step.num ? "text-foreground" : "text-muted-foreground"
              )}
            >
              {t(step.labelKey)}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div
              className={cn(
                "h-0.5 w-12 md:w-24 mx-2 mt-[-18px] transition-colors",
                currentStep > step.num ? "bg-primary" : "bg-muted-foreground/30"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );
}
