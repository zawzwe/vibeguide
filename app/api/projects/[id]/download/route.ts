import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDb, projects } from "@/db";
import { eq, and } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const docKey = searchParams.get("doc");

    const supabase = await createClient();
    const { data } = await supabase.auth.getClaims();
    const user = data?.claims;

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = getDb();
    const [project] = await db
      .select({ documents: projects.documents })
      .from(projects)
      .where(and(eq(projects.id, id), eq(projects.userId, user.sub)))
      .limit(1);

    if (!project) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const documents = project.documents as Record<string, string>;
    const content = docKey ? documents[docKey] : Object.values(documents)[0];

    if (!content) {
      return NextResponse.json(
        { error: "Document not found" },
        { status: 404 }
      );
    }

    const fileName = `${docKey || "document"}.md`;

    return new NextResponse(content, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Content-Disposition": `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error("Download error:", error);
    return NextResponse.json(
      { error: "Failed to download" },
      { status: 500 }
    );
  }
}
