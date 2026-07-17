import { Mail, Sparkles } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { SUPPORT_EMAIL } from "@/lib/site-config";

export async function SiteFooter() {
  const t = await getTranslations("Footer");

  return (
    <footer className="border-t bg-background py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 text-center md:px-6">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-lg font-bold">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>VibeGuide</span>
          </div>
          <span className="text-sm text-muted-foreground">{t("operator")}</span>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-sm text-muted-foreground">
          <Link href="/privacy" className="hover:text-foreground transition-colors">
            {t("privacy")}
          </Link>
          <Link href="/terms" className="hover:text-foreground transition-colors">
            {t("terms")}
          </Link>
          <Link href="/aup" className="hover:text-foreground transition-colors">
            {t("aup")}
          </Link>
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
          >
            <Mail className="h-4 w-4" />
            {SUPPORT_EMAIL}
          </a>
        </nav>

        <div className="w-full border-t pt-5 space-y-1">
          <p className="text-sm text-muted-foreground">
            {t("copyright")}
          </p>
          <p className="text-xs text-muted-foreground">
            {t("aiDisclosure")}
          </p>
        </div>
      </div>
    </footer>
  );
}
