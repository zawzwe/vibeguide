import { updateSession } from "@/lib/supabase/proxy";
import createMiddleware from "next-intl/middleware";
import { type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";

const handleI18nRouting = createMiddleware(routing);

export async function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // API routes and the Supabase email callback are not locale-prefixed.
  if (pathname.startsWith("/api") || pathname === "/auth/confirm") {
    return updateSession(request);
  }

  const intlResponse = handleI18nRouting(request);

  // Let locale canonicalization and first-visit negotiation finish before auth.
  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  return updateSession(request, intlResponse);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|_vercel|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
