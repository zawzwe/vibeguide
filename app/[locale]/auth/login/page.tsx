import { LoginForm } from "@/components/login-form";
import { SiteHeader } from "@/components/site-header";

export default function Page() {
  return (
    <div className="min-h-svh w-full">
      <SiteHeader />
      <main className="flex min-h-[calc(100vh-3.5rem)] w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <LoginForm />
        </div>
      </main>
    </div>
  );
}
