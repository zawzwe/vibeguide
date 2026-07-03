"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Coins, ArrowRight, ShoppingCart } from "lucide-react";
import Link from "next/link";

interface UserProfileProps {
  email: string;
  credits: number;
}

export function UserProfile({ email, credits }: UserProfileProps) {
  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>个人信息</CardTitle>
          </div>
          <CardDescription>你的账户基本信息</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-muted-foreground">邮箱</span>
            <span className="text-sm font-medium">{email}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Coins className="h-5 w-5 text-primary" />
            <CardTitle>项目点数</CardTitle>
          </div>
          <CardDescription>每个项目消耗 1 个点数</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">剩余点数</span>
            <Badge variant={credits > 0 ? "default" : "destructive"} className="text-lg px-4 py-2">
              {credits} 点
            </Badge>
          </div>

          {credits === 0 ? (
            <div className="space-y-3">
              <p className="text-sm text-destructive">
                你的项目点数已用完，请充值后继续使用。
              </p>
              <Button asChild className="w-full gap-2">
                <Link href="/pricing">
                  <ShoppingCart className="h-4 w-4" />
                  获取点数
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          ) : (
            <Button asChild variant="outline" className="w-full gap-2">
              <Link href="/pricing">
                <ShoppingCart className="h-4 w-4" />
                获取更多点数
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
