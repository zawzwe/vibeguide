import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export async function HeroCtaButton() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const user = data?.claims;

  return (
    <Button asChild size="lg" className="gap-2">
      <Link href={user ? "/projects" : "/auth/login"}>
        立即开始 <ArrowRight className="h-4 w-4" />
      </Link>
    </Button>
  );
}
