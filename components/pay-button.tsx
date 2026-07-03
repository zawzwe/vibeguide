"use client";

import { useState } from "react";
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
  label = "立即购买",
  variant = "default",
  size = "lg",
  className,
}: PayButtonProps) {
  const [loading, setLoading] = useState(false);

  const handlePay = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/pay/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (data.payUrl) {
        window.location.href = data.payUrl;
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
    <Button onClick={handlePay} disabled={loading} variant={variant} size={size} className={className}>
      {loading ? (
        <>
          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          处理中...
        </>
      ) : (
        <>
          {label} <ArrowRight className="h-4 w-4 ml-1" />
        </>
      )}
    </Button>
  );
}
