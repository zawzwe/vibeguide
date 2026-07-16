"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { FileText, Folders, Mail, PlusCircle, ShieldCheck, User } from "lucide-react";
import { SUPPORT_EMAIL } from "@/lib/site-config";

const navItems = [
  { href: "/projects", labelKey: "projects", icon: Folders },
  { href: "/projects/new", labelKey: "newProject", icon: PlusCircle },
  { href: "/my", labelKey: "account", icon: User },
] as const;

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("Dashboard.navigation");
  const footer = useTranslations("Footer");
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

      <div className="mt-6 flex flex-col gap-1 border-t pt-4">
        <Link
          href="/privacy"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ShieldCheck className="h-4 w-4" />
          {footer("privacy")}
        </Link>
        <Link
          href="/terms"
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <FileText className="h-4 w-4" />
          {footer("terms")}
        </Link>
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          onClick={onNavigate}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <Mail className="h-4 w-4 shrink-0" />
          <span className="break-all">{SUPPORT_EMAIL}</span>
        </a>
      </div>
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-14 z-40 hidden h-[calc(100vh-3.5rem)] w-[240px] border-r bg-background md:flex md:flex-col">
      <div className="flex-1 overflow-auto py-4">
        <SidebarNav />
      </div>
    </aside>
  );
}
