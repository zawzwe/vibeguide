import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/legal-document";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getLegalContent } from "@/lib/legal-content";
import { routing, type AppLocale } from "@/i18n/routing";

type TermsPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: TermsPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const terms = getLegalContent(locale as AppLocale).terms;
  return {
    title: `${terms.title} | VibeGuide`,
    description: terms.introduction,
  };
}

export default async function TermsPage({ params }: TermsPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const terms = getLegalContent(locale as AppLocale).terms;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <LegalDocument {...terms} />
      </main>
      <SiteFooter />
    </div>
  );
}
