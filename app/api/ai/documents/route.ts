import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";

const DOC_TYPES = [
  {
    key: "journey-map",
    title: "用户旅程地图",
    prompt: `你是一位用户体验设计专家。请根据以下项目描述和需求分析，生成一份结构清晰、排版整洁的用户旅程地图文档。

输出要求：
- 必须使用 Markdown
- 严格使用标题层级：#、##、###
- 每个二级标题下面最多 3-5 个要点，避免长段落堆叠
- 尽量使用表格呈现旅程阶段，但不要让表格过宽
- 不要输出 HTML 标签，不要使用 <br>
- 不要把多个小节写成连续大段文字

固定结构：
1. 文档概述
2. 用户角色画像（Persona）
3. 核心使用场景
4. 用户旅程阶段（按 Awareness → Consideration → Onboarding → Usage → Advocacy）
5. 痛点与机会点
6. 服务蓝图要点
7. 结论与建议`,
  },
  {
    key: "prd",
    title: "产品需求PRD",
    prompt: `你是一位资深产品经理。请根据以下项目描述和需求分析，生成一份结构清晰、可直接阅读的产品需求文档(PRD)。

输出要求：
- 必须使用 Markdown
- 严格使用标题层级：#、##、###
- 每个小节使用简洁短句和项目符号，避免长篇大论
- 需求列表用表格或有序列表，但保持版面整齐
- 不要输出 HTML 标签，不要使用 <br>
- 不要让内容挤成连续长段落

固定结构：
1. 产品概述与愿景
2. 目标用户与使用场景
3. 核心问题与解决方案
4. 功能需求（按 P0 / P1 / P2 分类）
5. 非功能性需求
6. 验收标准
7. 风险与假设
8. 里程碑与交付建议`,
  },
  {
    key: "frontend",
    title: "前端设计文档",
    prompt: `你是一位前端架构师。请根据以下项目描述和需求分析，生成一份结构清晰、排版整洁的前端设计文档。

输出要求：
- 必须使用 Markdown
- 严格使用标题层级：#、##、###
- 章节内容尽量采用列表和短段落
- 如果需要展示架构，优先用列表和表格，不要输出过长的连写文本
- 不要输出 HTML 标签，不要使用 <br>

固定结构：
1. 技术栈推荐
2. 页面与路由设计
3. 组件拆分与目录结构
4. 状态管理方案
5. 响应式与交互设计
6. 性能优化方案
7. 开发建议`,
  },
  {
    key: "backend",
    title: "后端设计文档",
    prompt: `你是一位后端架构师。请根据以下项目描述和需求分析，生成一份结构清晰、可阅读性高的后端设计文档。

输出要求：
- 必须使用 Markdown
- 严格使用标题层级：#、##、###
- 每个小节控制在 3-5 个要点，避免大段连续文字
- API 设计尽量用表格呈现，字段对齐清晰
- 不要输出 HTML 标签，不要使用 <br>

固定结构：
1. 技术栈推荐
2. 系统架构概览
3. API 设计
4. 数据流与业务流程
5. 认证与权限方案
6. 错误处理与日志策略
7. 部署与运维建议`,
  },
  {
    key: "database",
    title: "数据库设计",
    prompt: `你是一位数据库架构师。请根据以下项目描述和需求分析，生成一份结构清晰、排版整洁的数据库设计文档。

输出要求：
- 必须使用 Markdown
- 严格使用标题层级：#、##、###
- 核心表结构使用表格展示，字段对齐清晰
- 每个章节简洁明了，避免长段落堆积
- 不要输出 HTML 标签，不要使用 <br>

固定结构：
1. 数据库选型建议
2. ER 关系概览
3. 核心表结构设计
4. 数据字典
5. 索引与查询优化
6. 数据迁移与备份策略`,
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

    const docPromises = DOC_TYPES.map(async (doc) => {
      try {
        const completion = await openai.chat.completions.create({
          model: "deepseek-v4-flash",
          messages: [
            { role: "system", content: doc.prompt },
            { role: "user", content: userPrompt },
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
    return NextResponse.json({ error: "Failed to generate documents" }, { status: 500 });
  }
}
