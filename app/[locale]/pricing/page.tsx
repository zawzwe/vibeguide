import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { PricingPurchaseButton } from "@/components/pricing-purchase-button";

type PricingPlan = {
  name: string;
  price: string;
  projects: number;
  description: string;
  features: string[];
  popular: boolean;
  plan: "10" | "30";
};

export default async function PricingPage() {
  const t = await getTranslations("Pricing");
  const nav = await getTranslations("Navigation");
  const footer = await getTranslations("Home.footer");
  const plans: PricingPlan[] = [
    {
      name: t("plans.basic.name"),
      price: "20",
      projects: 10,
      description: t("plans.basic.description"),
      features: t.raw("plans.basic.features") as string[],
      popular: false,
      plan: "10",
    },
    {
      name: t("plans.pro.name"),
      price: "40",
      projects: 30,
      description: t("plans.pro.description"),
      features: t.raw("plans.pro.features") as string[],
      popular: true,
      plan: "30",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="flex-1 py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 space-y-4">
            <Badge variant="outline" className="gap-1">
              <Sparkles className="h-3 w-3" /> {t("badge")}
            </Badge>
            <h1 className="text-4xl font-bold">{t("title")}</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              {t("description")}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-2xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${plan.popular ? "border-primary border-2" : "border-2"}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">{t("recommended")}</Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">{t("currency")}{plan.price}</span>
                    <span className="text-muted-foreground ml-2">
                      / {t("projects", { count: plan.projects })}
                    </span>
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    {plan.features.map((f) => (
                      <div key={f} className="flex items-center gap-2 text-sm">
                        <Check className="h-4 w-4 text-primary flex-shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                  <PricingPurchaseButton plan={plan.plan} className="w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>VibeGuide</span>
            </div>
            <nav className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                {nav("home")}
              </Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">
                {nav("pricing")}
              </Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              {footer("copyright")}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
