import { redirect } from "@/i18n/navigation";
import type { AppLocale } from "@/i18n/routing";

export default async function ProtectedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: localeParam } = await params;
  const locale: AppLocale = localeParam === "en" ? "en" : "zh";
  redirect({ href: "/projects", locale });
}
