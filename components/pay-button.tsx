"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

interface PayButtonProps {
  plan: "10" | "30";
  label?: string;
  variant?: "default" | "outline";
  size?: "default" | "sm" | "lg";
  className?: string;
}

export function PayButton({
  plan,
  label,
  variant = "default",
  size = "lg",
  className,
}: PayButtonProps) {
  const t = useTranslations("Pricing");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, locale }),
      });
      const data = await res.json();
      if (data.payUrl) {
        window.location.href = data.payUrl;
      } else {
        alert(t("paymentError"));
      }
    } catch {
      alert(t("paymentError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handlePay} disabled={loading} variant={variant} size={size} className={className}>
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          {t("processing")}
        </>
      ) : (
        <>
          {label ?? t("buyNow")} <ArrowRight className="h-4 w-4 ml-1" />
        </>
      )}
    </Button>
  );
}
