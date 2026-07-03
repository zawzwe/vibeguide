"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Folders, PlusCircle, User, Sparkles } from "lucide-react";

const navItems = [
  { href: "/projects", label: "我的项目", icon: Folders },
  { href: "/projects/new", label: "新建项目", icon: PlusCircle },
  { href: "/my", label: "我的", icon: User },
];

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
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
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

export function Sidebar() {
  return (
    <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[240px] border-r bg-background md:flex md:flex-col">
      <div className="flex h-14 items-center gap-2 border-b px-6">
        <Sparkles className="h-5 w-5 text-primary" />
        <span className="font-bold text-lg">VibeGuide</span>
      </div>
      <div className="flex-1 overflow-auto py-4">
        <SidebarNav />
      </div>
      <div className="border-t p-4">
        <ThemeSwitcher />
      </div>
    </aside>
  );
}
