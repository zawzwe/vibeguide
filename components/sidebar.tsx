"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { LanguageSwitcher } from "@/components/language-switcher";
import { Folders, PlusCircle, User, Sparkles } from "lucide-react";

const navItems = [
  { href: "/projects", labelKey: "projects", icon: Folders },
  { href: "/projects/new", labelKey: "newProject", icon: PlusCircle },
  { href: "/my", labelKey: "account", icon: User },
] as const;

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("Dashboard.navigation");
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === "/projects") {
      return pathname === "/projects" || pathname.startsWith("/projects/");
    }
    return pathname === href;
  };

  return (
    <nav className="flex flex-col gap-1 px-2">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          onClick={onNavigate}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isActive(item.href)
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <item.icon className="h-4 w-4" />
          {t(item.labelKey)}
        </Link>
      ))}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[240px] border-r bg-background md:flex md:flex-col">
      <Link href="/" className="flex h-14 items-center gap-2 border-b px-6 hover:bg-accent/50 transition-colors">
        <Sparkles className="h-5 w-5 text-primary" />
        <span className="font-bold text-lg">VibeGuide</span>
      </Link>
      <div className="flex-1 overflow-auto py-4">
        <SidebarNav />
      </div>
      <div className="border-t p-4">
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitcher />
        </div>
      </div>
    </aside>
  );
}
