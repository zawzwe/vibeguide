import { SiteHeader } from "@/components/site-header";
import { HeroCtaButton } from "@/components/hero-cta-button";
import { Suspense } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Map,
  FileText,
  Layout,
  Server,
  Database,
  Download,
  Sparkles,
  FileCode,
  Zap,
  Check,
} from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SiteFooter } from "@/components/site-footer";
import { PricingPurchaseButton } from "@/components/pricing-purchase-button";
import { CreemBuyButton } from "@/components/creem-buy-button";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";

const CREEM_PRODUCT_ID = process.env.NEXT_PUBLIC_CREEM_PRODUCT_ID || "";

const features = [
  { icon: Map, key: "journey" },
  { icon: FileText, key: "prd" },
  { icon: Layout, key: "frontend" },
  { icon: Server, key: "backend" },
  { icon: Database, key: "database" },
  { icon: Download, key: "export" },
] as const;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  const isEn = locale === "en";
  const t = await getTranslations("Home");
  const faqItems = t.raw("faq.items") as { q: string; a: string }[];

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32 relative">
          <div className="text-center max-w-5xl mx-auto space-y-6">
            <Badge variant="outline" className="gap-1">
              <Sparkles className="h-3 w-3" /> {t("hero.badge")}
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
              <span className="block md:whitespace-nowrap">{t("hero.titleLine1")}</span>
              <span className="text-primary block md:whitespace-nowrap">
                {t("hero.titleLine2")}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
              {t("hero.description")}
              <br />
              {t("hero.descriptionLine2")}
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Suspense fallback={<Button size="lg" disabled>{t("loading")}</Button>}>
                <HeroCtaButton />
              </Suspense>
              <Button variant="outline" size="lg" asChild>
                <Link href="#features">{t("hero.learnMore")}</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl font-bold">{t("features.title")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("features.description")}
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.key} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{t(`features.${feature.key}.title`)}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{t(`features.${feature.key}.description`)}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Bento Grid Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl font-bold">{t("workflow.title")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("workflow.description")}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                  <FileCode className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>{t("workflow.step1.title")}</CardTitle>
                <CardDescription>{t("workflow.step1.description")}</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
                  <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>{t("workflow.step2.title")}</CardTitle>
                <CardDescription>{t("workflow.step2.description")}</CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                  <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>{t("workflow.step3.title")}</CardTitle>
                <CardDescription>{t("workflow.step3.description")}</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold">{t("cta.title")}</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            {t("cta.description")}
          </p>
          <Suspense fallback={<Button size="lg" disabled>{t("loading")}</Button>}>
            <HeroCtaButton />
          </Suspense>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl font-bold">{t("pricing.title")}</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("pricing.description")}
            </p>
          </div>
          <div className="max-w-sm mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle className="text-xl">{t("pricing.basicName")}</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{t("pricing.currency")}{t("pricing.basicPrice")}</span>
                  <span className="text-muted-foreground ml-2">/ {t("pricing.projects", { count: 10 })}</span>
                </div>
                <CardDescription>{t("pricing.basicDescription")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {(t.raw("pricing.basicFeatures") as string[]).map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    {f}
                  </div>
                ))}
                {isEn ? (
                  <CreemBuyButton productId={CREEM_PRODUCT_ID}>
                    {t("pricing.buyNow")}
                  </CreemBuyButton>
                ) : (
                  <PricingPurchaseButton plan="10" className="w-full mt-4" />
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl font-bold">{t("faq.title")}</h2>
            <p className="text-muted-foreground text-lg">{t("faq.subtitle")}</p>
          </div>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{item.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{item.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
