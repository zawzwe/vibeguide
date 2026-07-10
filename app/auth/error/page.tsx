import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Suspense } from "react";
import { SiteHeader } from "@/components/site-header";

async function ErrorContent({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  const params = await searchParams;

  return (
    <>
      {params?.error ? (
        <p className="text-sm text-muted-foreground">
          Code error: {params.error}
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          An unspecified error occurred.
        </p>
      )}
    </>
  );
}

export default function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>;
}) {
  return (
    <div className="min-h-svh w-full bg-background">
      <SiteHeader />
      <div className="flex min-h-[calc(100svh-3.5rem)] w-full items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">
                  Sorry, something went wrong.
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
