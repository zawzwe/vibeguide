import { SiteHeader } from "@/components/site-header";
import { Sidebar } from "@/components/sidebar";
import { DashboardHeader } from "@/components/dashboard-header";

export default function ProjectsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="md:hidden">
        <DashboardHeader className="relative" />
      </div>
      <Sidebar />
      <div className="md:pl-[240px]">
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
