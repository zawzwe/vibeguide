import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/legal-document";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getLegalContent } from "@/lib/legal-content";
import { routing, type AppLocale } from "@/i18n/routing";

type PrivacyPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: PrivacyPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const privacy = getLegalContent(locale as AppLocale).privacy;
  return {
    title: `${privacy.title} | VibeGuide`,
    description: privacy.introduction,
  };
}

export default async function PrivacyPage({ params }: PrivacyPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const privacy = getLegalContent(locale as AppLocale).privacy;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <LegalDocument {...privacy} />
      </main>
      <SiteFooter />
    </div>
  );
}
