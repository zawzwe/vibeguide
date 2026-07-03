import { SiteHeader } from "@/components/site-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Check, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "基础版",
    price: "20",
    projects: 10,
    description: "适合个人开发者快速上手",
    features: [
      "生成 10 个项目的完整文档",
      "5 种文档类型全覆盖",
      "Markdown 格式下载",
      "ZIP 批量下载",
      "AI 需求分析",
    ],
    popular: false,
    plan: "10",
  },
  {
    name: "专业版",
    price: "40",
    projects: 30,
    description: "适合有多个项目需求的用户",
    features: [
      "生成 30 个项目的完整文档",
      "5 种文档类型全覆盖",
      "Markdown 格式下载",
      "ZIP 批量下载",
      "AI 需求分析",
      "优先技术支持",
    ],
    popular: true,
    plan: "30",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      <section className="flex-1 py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 space-y-4">
            <Badge variant="outline" className="gap-1">
              <Sparkles className="h-3 w-3" /> 简单定价
            </Badge>
            <h1 className="text-4xl font-bold">选择适合你的套餐</h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              每个项目消耗 1 个点数，点数永不过期，随时可以充值
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 max-w-2xl mx-auto">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative ${plan.popular ? "border-primary border-2" : "border-2"}`}
              >
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">推荐</Badge>
                )}
                <CardHeader>
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">¥{plan.price}</span>
                    <span className="text-muted-foreground ml-2">
                      / {plan.projects} 个项目
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
                  <Button className="w-full" size="lg" asChild>
                    <Link href={`/auth/login?redirect=/pricing`}>
                      立即购买 <ArrowRight className="h-4 w-4 ml-1" />
                    </Link>
                  </Button>
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
                首页
              </Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">
                价格
              </Link>
            </nav>
            <p className="text-sm text-muted-foreground">
              © 2024 VibeGuide. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
