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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Map,
  FileText,
  Layout,
  Server,
  Database,
  Sparkles,
  Users,
  FileCode,
  Zap,
  Check,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    icon: Map,
    title: "用户旅程地图",
    description: "可视化用户使用产品的完整流程，帮助团队理解用户需求与痛点",
  },
  {
    icon: FileText,
    title: "产品需求 PRD",
    description: "结构化的产品需求文档，明确功能边界与验收标准",
  },
  {
    icon: Layout,
    title: "前端设计文档",
    description: "包含组件树、状态管理、路由设计的前端架构方案",
  },
  {
    icon: Server,
    title: "后端设计文档",
    description: "API 设计、业务逻辑、服务架构的完整后端方案",
  },
  {
    icon: Database,
    title: "数据库设计",
    description: "ER 图、表结构、索引策略的完整数据库设计方案",
  },
];

const stats = [
  { value: "10,000+", label: "已生成文档" },
  { value: "5,000+", label: "活跃开发者" },
  { value: "50,000+", label: "AI 分析次数" },
  { value: "98%", label: "用户满意度" },
];

const faqItems = [
  {
    q: "VibeGuide 是什么？",
    a: "VibeGuide 是一个智能 AI 开发文档平台，专门为编程新手设计。你只需描述你的项目想法，AI 就能自动生成完整的开发文档，包括用户旅程地图、PRD、前端设计、后端设计和数据库设计。",
  },
  {
    q: "如何开始使用？",
    a: "点击「立即开始」按钮，注册账号后即可创建你的第一个项目。在项目向导中描述你的项目，AI 会引导你逐步完成需求分析和文档生成。",
  },
  {
    q: "生成文档需要多长时间？",
    a: "根据项目复杂度，通常在 1-3 分钟内即可完成所有 5 份文档的生成。我们的 AI 会并行处理，确保快速交付。",
  },
  {
    q: "文档可以下载吗？",
    a: "当然可以！你可以下载单个 Markdown 文档，也可以一键打包下载所有文档的 ZIP 压缩包。",
  },
  {
    q: "如何充值项目点数？",
    a: "访问价格页面，选择适合你的套餐（20 元/10 个项目 或 40 元/30 个项目），点击购买后通过支付宝或微信支付即可完成充值。",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <SiteHeader />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-20 md:py-32 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <Badge variant="outline" className="gap-1">
              <Sparkles className="h-3 w-3" /> AI 驱动
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              让 AI 为你的项目
              <span className="text-primary block">生成专业开发文档</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              VibeGuide 帮助编程新手在几分钟内完成从需求分析到技术设计的全部文档，
              让你专注于真正重要的事情——写代码。
            </p>
            <div className="flex items-center justify-center gap-4 pt-4">
              <Suspense fallback={<Button size="lg" disabled>加载中...</Button>}>
                <HeroCtaButton />
              </Suspense>
              <Button variant="outline" size="lg" asChild>
                <Link href="#features">了解更多</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl font-bold">一键生成全套开发文档</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              从用户旅程到数据库设计，覆盖软件开发的每一个关键环节
            </p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <Card key={feature.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{feature.description}</CardDescription>
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
            <h2 className="text-3xl font-bold">AI 工作流，三步搞定</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              简单三步，AI 帮你完成从需求分析到技术文档的全部工作
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-2">
                  <FileCode className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle>1. 描述项目</CardTitle>
                <CardDescription>
                  用自然语言描述你的项目想法和需求，AI 会理解你的意图
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-2">
                  <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <CardTitle>2. 深入需求</CardTitle>
                <CardDescription>
                  AI 分析你的描述，提出关键问题帮你厘清需求边界
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="border-0 shadow-sm bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900">
              <CardHeader>
                <div className="h-12 w-12 rounded-full bg-green-500/20 flex items-center justify-center mb-2">
                  <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <CardTitle>3. 生成文档</CardTitle>
                <CardDescription>
                  一键生成 5 份专业开发文档，支持 Markdown 编辑和下载
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5">
        <div className="max-w-7xl mx-auto px-4 md:px-6 text-center space-y-6">
          <h2 className="text-3xl font-bold">准备好开始了吗？</h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            加入数千名开发者，用 AI 加速你的项目文档编写
          </p>
          <Suspense fallback={<Button size="lg" disabled>加载中...</Button>}>
            <HeroCtaButton />
          </Suspense>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl font-bold">简单透明的定价</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              选择适合你的套餐，随时可以充值更多
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 max-w-2xl mx-auto">
            <Card className="relative border-2">
              <CardHeader>
                <CardTitle className="text-xl">基础版</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">¥20</span>
                  <span className="text-muted-foreground ml-2">/ 10 个项目</span>
                </div>
                <CardDescription>适合个人开发者快速上手</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {["生成 10 个项目的完整文档", "5 种文档类型", "Markdown 下载", "ZIP 批量下载", "AI 需求分析"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    {f}
                  </div>
                ))}
                <Button className="w-full mt-4" asChild>
                  <Link href="/pricing">立即购买 <ArrowRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              </CardContent>
            </Card>
            <Card className="relative border-2 border-primary">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">推荐</Badge>
              <CardHeader>
                <CardTitle className="text-xl">专业版</CardTitle>
                <div className="mt-4">
                  <span className="text-4xl font-bold">¥40</span>
                  <span className="text-muted-foreground ml-2">/ 30 个项目</span>
                </div>
                <CardDescription>适合有多个项目需求的用户</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {["生成 30 个项目的完整文档", "5 种文档类型", "Markdown 下载", "ZIP 批量下载", "AI 需求分析", "优先支持"].map((f) => (
                  <div key={f} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary flex-shrink-0" />
                    {f}
                  </div>
                ))}
                <Button className="w-full mt-4" asChild>
                  <Link href="/pricing">立即购买 <ArrowRight className="h-4 w-4 ml-1" /></Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label} className="space-y-2">
                <div className="text-3xl md:text-4xl font-bold text-primary">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 md:px-6">
          <div className="text-center mb-12 space-y-4">
            <h2 className="text-3xl font-bold">常见问题</h2>
            <p className="text-muted-foreground text-lg">关于 VibeGuide 的常见疑问</p>
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

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 font-bold text-lg">
              <Sparkles className="h-5 w-5 text-primary" />
              <span>VibeGuide</span>
            </div>
            <nav className="flex gap-6 text-sm text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">首页</Link>
              <Link href="/pricing" className="hover:text-foreground transition-colors">价格</Link>
              <Link href="#features" className="hover:text-foreground transition-colors">功能</Link>
              <Link href="#faq" className="hover:text-foreground transition-colors">FAQ</Link>
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
