"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Coins, ArrowRight, ShoppingCart, Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

interface UserProfileProps {
  email: string;
  credits: number;
  isAdmin?: boolean;
}

export function UserProfile({ email, credits, isAdmin }: UserProfileProps) {
  const t = useTranslations("Dashboard.account");
  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>{t("profileTitle")}</CardTitle>
            {isAdmin && (
              <Badge variant="default" className="gap-1 bg-amber-500 hover:bg-amber-600">
                <Shield className="h-3 w-3" /> {t("adminBadge")}
              </Badge>
            )}
          </div>
          <CardDescription>{t("profileDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">{t("email")}</span>
            <span className="text-sm font-medium">{email}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            <CardTitle>{t("creditsTitle")}</CardTitle>
            {isAdmin && (
              <Badge variant="secondary" className="gap-1 text-xs">
                {t("unlimited")}
              </Badge>
            )}
          </div>
          <CardDescription>
            {isAdmin ? t("adminDescription") : t("creditsDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">{t("remaining")}</span>
            <Badge
              variant={isAdmin ? "default" : credits > 0 ? "default" : "destructive"}
              className={`text-lg px-4 py-2 ${isAdmin ? "bg-amber-500 hover:bg-amber-600" : ""}`}
            >
              {isAdmin ? `∞ ${t("unlimited")}` : t("points", { count: credits })}
            </Badge>
          </div>

          {!isAdmin && credits === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-destructive">
                {t("noCredits")}
              </p>
              <Button asChild className="w-full gap-2">
                <Link href="/pricing">
                  <ShoppingCart className="h-4 w-4" />
                  {t("getCredits")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : !isAdmin ? (
            <Button asChild variant="outline" className="w-full gap-2">
              <Link href="/pricing">
                <ShoppingCart className="h-4 w-4" />
                {t("getMoreCredits")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
