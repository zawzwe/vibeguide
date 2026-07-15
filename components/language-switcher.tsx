"use client";

import { useLocale, useTranslations } from "next-intl";
import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getPathname, usePathname } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export function LanguageSwitcher() {
  const locale = useLocale() as AppLocale;
  const t = useTranslations("Navigation");
  const pathname = usePathname();

  const changeLocale = (nextLocale: string) => {
    if (nextLocale === locale) return;

    const targetLocale = nextLocale as AppLocale;
    const localizedPathname = getPathname({
      locale: targetLocale,
      href: pathname,
    });

    // Switching the locale replaces the root locale layout. A full navigation
    // keeps next-themes' initialization script in the server-rendered HTML and
    // avoids React 19 rendering that script again on the client.
    document.cookie = `NEXT_LOCALE=${targetLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
    window.location.replace(
      `${localizedPathname}${window.location.search}${window.location.hash}`,
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" aria-label={t("language")}>
          <Languages className="h-4 w-4" />
          <span className="hidden sm:inline">{locale === "zh" ? "中文" : "EN"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuRadioGroup value={locale} onValueChange={changeLocale}>
          <DropdownMenuRadioItem value="zh">{t("chinese")}</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="en">{t("english")}</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
