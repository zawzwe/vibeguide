"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, MessageSquare } from "lucide-react";

interface StepDescriptionProps {
  initialValue: string;
  onNext: (description: string) => void;
}

export function StepDescription({ initialValue, onNext }: StepDescriptionProps) {
  const [description, setDescription] = useState(initialValue);
  const minLength = 20;

  const isValid = description.trim().length >= minLength;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          <CardTitle>描述你的项目</CardTitle>
        </div>
        <CardDescription>
          尽可能详细地描述你的项目想法，AI 将基于你的描述生成专业的开发文档
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Textarea
            placeholder="例如：我想开发一个在线书店，用户可以浏览、搜索书籍，加入购物车，下单购买。管理员可以管理书籍库存、处理订单..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="min-h-[200px] resize-y"
          />
          <div className="flex items-center justify-between text-sm">
            <span
              className={description.trim().length >= minLength ? "text-green-600" : "text-muted-foreground"}
            >
              已输入 {description.trim().length} 字
            </span>
            <span className="text-muted-foreground">最少 {minLength} 字</span>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => onNext(description)} disabled={!isValid} className="gap-2">
            下一步 <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
