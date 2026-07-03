"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { SidebarNav } from "@/components/sidebar";
import { Menu, Sparkles } from "lucide-react";

export function DashboardHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 md:px-6">
      {/* Mobile menu trigger */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild className="md:hidden">
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] p-0">
          <div className="flex h-14 items-center gap-2 border-b px-6">
            <Sparkles className="h-5 w-5 text-primary" />
            <span className="font-bold text-lg">VibeGuide</span>
          </div>
          <div className="py-4">
            <SidebarNav onNavigate={() => setOpen(false)} />
          </div>
          <div className="absolute bottom-0 left-0 right-0 border-t p-4">
            <ThemeSwitcher />
          </div>
        </SheetContent>
      </Sheet>

      {/* Brand for mobile */}
      <div className="flex items-center gap-2 md:hidden">
        <Sparkles className="h-5 w-5 text-primary" />
        <span className="font-bold text-lg">VibeGuide</span>
      </div>

      <div className="flex-1" />
    </header>
  );
}
