import { getTranslations } from "next-intl/server";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";

export async function HeroCtaButton() {
  const t = await getTranslations("Home.hero");
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return (
    <Button asChild size="lg" className="gap-2">
      <Link href={user ? "/projects" : "/auth/login"}>
        {t("getStarted")} <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}
