import { Suspense } from "react";
import { getTranslations } from "next-intl/server";
import { AuthButton } from "@/components/auth-button";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Link } from "@/i18n/navigation";
import { Sparkles } from "lucide-react";

export async function SiteHeader() {
  const t = await getTranslations("Navigation");

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          <span>VibeGuide</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            {t("home")}
          </Link>
          <Link href="/pricing" className="text-muted-foreground hover:text-foreground transition-colors">
            {t("pricing")}
          </Link>
        </nav>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <Suspense fallback={<div className="h-9 w-20 rounded bg-muted animate-pulse" />}>
            <AuthButton />
          </Suspense>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
