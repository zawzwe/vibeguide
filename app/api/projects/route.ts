import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDb, projects } from "@/db";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { description, qa, documents, title } = body;
    const locale = body.locale === "en" ? "en" : "zh";

    if (!description) {
      return NextResponse.json(
        { error: "Description required" },
        { status: 400 }
      );
    }

    // Generate title from description if not provided
    const projectTitle =
      title || description.slice(0, 50).replace(/\n/g, " ").trim();

    const db = getDb();
    const [project] = await db
      .insert(projects)
      .values({
        userId: user.sub,
        title: projectTitle,
        description,
        locale,
        qa: qa || [],
        documents: documents || {},
        status: "completed",
      })
      .returning({ id: projects.id });

    return NextResponse.json({ id: project.id }, { status: 201 });
  } catch (error) {
    console.error("Project create error:", error);
    return NextResponse.json(
      { error: "Failed to create project" },
      { status: 500 }
    );
  }
}
