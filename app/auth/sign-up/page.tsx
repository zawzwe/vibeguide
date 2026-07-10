import { SiteHeader } from "@/components/site-header";
import { SignUpForm } from "@/components/sign-up-form";

export default function Page() {
  return (
    <div className="min-h-svh w-full bg-background">
      <SiteHeader />
      <div className="flex min-h-[calc(100svh-3.5rem)] w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
