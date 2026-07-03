"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Coins, ArrowRight, ShoppingCart, Shield } from "lucide-react";
import Link from "next/link";

interface UserProfileProps {
  email: string;
  credits: number;
  isAdmin?: boolean;
}

export function UserProfile({ email, credits, isAdmin }: UserProfileProps) {
  return (
    <div className="space-y-6 max-w-2xl">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            <CardTitle>个人信息</CardTitle>
            {isAdmin && (
              <Badge variant="default" className="gap-1 bg-amber-500 hover:bg-amber-600">
                <Shield className="h-3 w-3" /> 内部管理员
              </Badge>
            )}
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
            {isAdmin && (
              <Badge variant="secondary" className="gap-1 text-xs">
                无限
              </Badge>
            )}
          </div>
          <CardDescription>
            {isAdmin ? "管理员账户，无需购买点数" : "每个项目消耗 1 个点数"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">剩余点数</span>
            <Badge
              variant={isAdmin ? "default" : credits > 0 ? "default" : "destructive"}
              className={`text-lg px-4 py-2 ${isAdmin ? "bg-amber-500 hover:bg-amber-600" : ""}`}
            >
              {isAdmin ? "∞ 无限" : `${credits} 点`}
            </Badge>
          </div>

          {!isAdmin && credits === 0 ? (
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
          ) : !isAdmin ? (
            <Button asChild variant="outline" className="w-full gap-2">
              <Link href="/pricing">
                <ShoppingCart className="h-4 w-4" />
                获取更多点数
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
