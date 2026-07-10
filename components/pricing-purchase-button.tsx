"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Loader2 } from "lucide-react";

interface PricingPurchaseButtonProps {
  plan: "10" | "30";
  className?: string;
}

export function PricingPurchaseButton({ plan, className }: PricingPurchaseButtonProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        router.push(`/auth/login?redirect=${encodeURIComponent("/pricing")}`);
        return;
      }

      const res = await fetch("/api/pay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });

      const dataRes = await res.json();
      if (dataRes.payUrl) {
        window.location.href = dataRes.payUrl;
      } else {
        alert("支付创建失败，请稍后再试");
      }
    } catch {
      alert("支付创建失败，请稍后再试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={handleClick} disabled={loading} className={className} size="lg">
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          处理中...
        </>
      ) : (
        <>
          立即购买 <ArrowRight className="h-4 w-4 ml-1" />
        </>
      )}
    </Button>
  );
}
