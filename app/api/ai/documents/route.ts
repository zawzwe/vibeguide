import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const DOC_TYPES = [
  {
    key: "journey-map",
    title: "用户旅程地图",
    prompt: `你是一位用户体验设计专家。请根据以下项目描述和需求分析，生成一份详细的用户旅程地图文档。
包含以下内容：
1. 用户角色画像 (Persona)
2. 用户场景 (Scenarios)
3. 用户旅程阶段 (Awareness → Consideration → Onboarding → Usage → Advocacy)
4. 每个阶段的关键行为、情感曲线、痛点和机会点
5. 服务蓝图要点

使用Markdown格式，包含适当的标题层级和表格。`,
  },
  {
    key: "prd",
    title: "产品需求PRD",
    prompt: `你是一位资深产品经理。请根据以下项目描述和需求分析，生成一份专业的产品需求文档(PRD)。
包含以下内容：
1. 产品概述与愿景
2. 目标用户与市场分析
3. 功能需求（按优先级P0/P1/P2分类）
4. 非功能性需求（性能、安全、可访问性等）
5. 验收标准
6. 发布计划与里程碑
7. 风险与假设

使用Markdown格式，包含适当的标题层级和表格。`,
  },
  {
    key: "frontend",
    title: "前端设计文档",
    prompt: `你是一位前端架构师。请根据以下项目描述和需求分析，生成一份前端设计文档。
包含以下内容：
1. 技术栈推荐（框架、状态管理、UI库等）
2. 组件树架构图（文字描述）
3. 路由设计（列出所有路由及其对应的页面组件）
4. 状态管理方案
5. 响应式设计策略
6. 性能优化方案
7. 前端项目目录结构建议

使用Markdown格式，包含适当的标题层级和代码块。`,
  },
  {
    key: "backend",
    title: "后端设计文档",
    prompt: `你是一位后端架构师。请根据以下项目描述和需求分析，生成一份后端设计文档。
包含以下内容：
1. 技术栈推荐（语言、框架、数据库等）
2. API 设计（列出所有REST/GraphQL端点）
3. 数据流架构
4. 服务拆分与微服务方案
5. 认证与授权方案
6. 错误处理与日志策略
7. 部署与DevOps建议

使用Markdown格式，包含适当的标题层级和代码块。`,
  },
  {
    key: "database",
    title: "数据库设计",
    prompt: `你是一位数据库架构师。请根据以下项目描述和需求分析，生成一份数据库设计文档。
包含以下内容：
1. 数据库选型建议（关系型/非关系型及其理由）
2. ER图文字描述（实体及关系）
3. 核心表结构设计（表名、字段名、类型、约束、索引）
4. 数据字典
5. 查询优化与索引策略
6. 数据迁移与备份策略

使用Markdown格式，包含适当的标题层级和SQL代码块。`,
  },
];

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { description, qa } = await request.json();

    if (!description) {
      return NextResponse.json({ error: "Description required" }, { status: 400 });
    }

    const qaText = qa
      ? (qa as { question: string; answer: string }[])
          .map((item) => `Q: ${item.question}\nA: ${item.answer}`)
          .join("\n\n")
      : "";

    const userPrompt = `项目描述：\n${description}\n\n需求分析问答：\n${qaText}`;

    const openai = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.DEEPSEEK_API_KEY!,
    });

    // Generate all 5 documents in parallel
    const docPromises = DOC_TYPES.map(async (doc) => {
      try {
        const completion = await openai.chat.completions.create({
          model: "deepseek-v4-flash",
          messages: [
            {
              role: "system",
              content: doc.prompt,
            },
            {
              role: "user",
              content: userPrompt,
            },
          ],
          stream: false,
          max_tokens: 8192,
        });

        return {
          key: doc.key,
          content: completion.choices[0]?.message?.content || "",
        };
      } catch (err) {
        console.error(`Failed to generate ${doc.key}:`, err);
        return {
          key: doc.key,
          content: `# ${doc.title}\n\n生成失败，请重试。\n\n错误：${err instanceof Error ? err.message : "未知错误"}`,
        };
      }
    });

    const results = await Promise.all(docPromises);

    const documents: Record<string, string> = {};
    results.forEach(({ key, content }) => {
      documents[key] = content;
    });

    return NextResponse.json({ documents });
  } catch (error) {
    console.error("AI documents error:", error);
    return NextResponse.json(
      { error: "Failed to generate documents" },
      { status: 500 }
    );
  }
}
