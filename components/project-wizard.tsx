"use client";

import { useState } from "react";
import { StepIndicator } from "@/components/step-indicator";
import { StepDescription } from "@/components/step-description";
import { StepRequirements } from "@/components/step-requirements";
import { StepDocuments } from "@/components/step-documents";
import { useRouter } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

interface QA {
  question: string;
  answer: string;
}

interface WizardData {
  description: string;
  qa: QA[];
  documents: Record<string, string>;
  title: string;
}

interface ProjectWizardProps {
  initialData?: WizardData;
  projectId?: string;
  locale: AppLocale;
}

export function ProjectWizard({
  initialData,
  projectId,
  locale,
}: ProjectWizardProps) {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(
    initialData?.documents && Object.keys(initialData.documents).length > 0
      ? 3
      : initialData?.qa && initialData.qa.length > 0
      ? 2
      : 1
  );
  const [data, setData] = useState<WizardData>(
    initialData || {
      description: "",
      qa: [],
      documents: {},
      title: "",
    }
  );
  const [isSaving, setIsSaving] = useState(false);

  const handleDescriptionNext = (description: string) => {
    setData((prev) => ({ ...prev, description }));
    setCurrentStep(2);
  };

  const handleRequirementsNext = (qa: QA[]) => {
    setData((prev) => ({ ...prev, qa }));
    setCurrentStep(3);
  };

  const handleSave = async (documents: Record<string, string>) => {
    setIsSaving(true);
    try {
      const completeData = { ...data, documents, locale };

      if (projectId) {
        // Update existing project
        await fetch(`/api/projects/${projectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(completeData),
        });
      } else {
        // Create new project
        const res = await fetch("/api/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(completeData),
        });
        const result = await res.json();
        if (result.id) {
          router.push(`/projects/${result.id}`);
          return;
        }
      }

      router.push("/projects");
      router.refresh();
    } catch (error) {
      console.error("Failed to save project:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <StepIndicator currentStep={currentStep} />

      {currentStep === 1 && (
        <StepDescription
          initialValue={data.description}
          onNext={handleDescriptionNext}
        />
      )}

      {currentStep === 2 && (
        <StepRequirements
          locale={locale}
          description={data.description}
          initialQA={data.qa}
          onNext={handleRequirementsNext}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {currentStep === 3 && (
        <StepDocuments
          locale={locale}
          description={data.description}
          qa={data.qa}
          initialDocuments={data.documents}
          onSave={handleSave}
          onBack={() => setCurrentStep(2)}
          projectId={projectId}
          isSaving={isSaving}
        />
      )}
    </div>
  );
}
