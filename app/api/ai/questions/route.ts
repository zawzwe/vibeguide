import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { credits, getDb } from "@/db";
import { isAdmin } from "@/lib/admin";
import { eq } from "drizzle-orm";
import OpenAI from "openai";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isAdmin(typeof user.email === "string" ? user.email : undefined)) {
      const db = getDb();
      const [creditRecord] = await db
        .select({ balance: credits.balance })
        .from(credits)
        .where(eq(credits.userId, user.sub))
        .limit(1);

      if (!creditRecord || creditRecord.balance <= 0) {
        return NextResponse.json(
          {
            error: "No project credits remaining",
            code: "INSUFFICIENT_CREDITS",
          },
          { status: 402 },
        );
      }
    }

    const { description, locale: requestedLocale } = await request.json();
    const locale = requestedLocale === "en" ? "en" : "zh";

    if (!description || description.trim().length < 10) {
      return NextResponse.json(
        { error: "Description too short" },
        { status: 400 }
      );
    }

    const openai = new OpenAI({
      baseURL: "https://api.deepseek.com",
      apiKey: process.env.DEEPSEEK_API_KEY!,
    });

    const completion = await openai.chat.completions.create({
      model: "deepseek-v4-flash",
      messages: [
        {
          role: "system",
          content: locale === "en" ? `You are an experienced technical requirements analyst. Analyze the user's project description and ask 3-5 focused questions that clarify:
1. Target users and primary scenarios
2. Core feature scope and boundaries
3. Technology preferences or constraints
4. Data management requirements
5. Non-functional requirements such as performance and security

Return only a valid JSON array of question strings, for example:
["Question 1", "Question 2", "Question 3"]

Ask every question in English. Do not include markdown or any other text.` : `你是一个专业的技术需求分析师。你的任务是分析用户的项目描述，提出3-5个关键问题来帮助深入理解需求。这些问题应该覆盖：
1. 目标用户和用户场景
2. 核心功能边界
3. 技术栈偏好
4. 数据管理需求
5. 非功能性需求（性能、安全等）

请以JSON数组格式返回问题，格式如下：
["问题1", "问题2", "问题3"]

只返回JSON数组，不要包含其他内容。`,
        },
        {
          role: "user",
          content: locale === "en"
            ? `Analyze the following project description and ask 3-5 focused requirements questions in English:\n\n${description}`
            : `请分析以下项目描述，提出3-5个深入的需求问题：\n\n${description}`,
        },
      ],
      stream: false,
      max_tokens: 4096,
    });

    const content = completion.choices[0]?.message?.content || "[]";
    // Parse the JSON array from response
    const cleaned = content.replace(/```json\n?|\n?```/g, "").trim();
    let questions: string[] = [];
    try {
      questions = JSON.parse(cleaned);
      if (!Array.isArray(questions)) {
        // Try to extract array from markdown
        const match = cleaned.match(/\[[\s\S]*\]/);
        if (match) {
          questions = JSON.parse(match[0]);
        }
      }
    } catch {
      // Fallback: extract quoted strings
      const matches = cleaned.match(/"([^"]+)"/g);
      if (matches) {
        questions = matches.map((s: string) => s.replace(/^"|"$/g, ""));
      }
    }

    return NextResponse.json({
      questions: questions.slice(0, 5),
    });
  } catch (error) {
    console.error("AI questions error:", error);
    return NextResponse.json(
      { error: "Failed to generate questions" },
      { status: 500 }
    );
  }
}
