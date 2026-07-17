import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { notFound } from "next/navigation";
import { LegalDocument } from "@/components/legal-document";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getLegalContent } from "@/lib/legal-content";
import { routing, type AppLocale } from "@/i18n/routing";

type AupPageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: AupPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const aup = getLegalContent(locale as AppLocale).aup;
  return {
    title: `${aup.title} | VibeGuide`,
    description: aup.introduction,
  };
}

export default async function AupPage({ params }: AupPageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const aup = getLegalContent(locale as AppLocale).aup;

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1">
        <LegalDocument {...aup} />
      </main>
      <SiteFooter />
    </div>
  );
}
