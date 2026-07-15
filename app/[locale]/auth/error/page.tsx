import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";
import { getTranslations } from "next-intl/server";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;
  const t = await getTranslations("Auth.error");

  return (
    <>
      {params?.error ? (
        <p className="text-sm text-muted-foreground">
          {t("code", { message: params.error })}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          {t("unspecified")}
        </p>
      )}
    </>
  );
}

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const t = await getTranslations("Auth.error");
  return (
    <div className="min-h-svh w-full bg-background">
      <SiteHeader />
      <div className="flex min-h-[calc(100svh-3.5rem)] w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  {t("title")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense>
                  <ErrorContent searchParams={searchParams} />
                </Suspense>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
