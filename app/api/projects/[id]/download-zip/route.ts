import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getDb, projects } from "@/db";
import { eq, and } from "drizzle-orm";
import JSZip from "jszip";

const DOC_TYPES = [
  { key: "journey-map", label: "用户旅程地图" },
  { key: "prd", label: "产品需求PRD" },
  { key: "frontend", label: "前端设计文档" },
  { key: "backend", label: "后端设计文档" },
  { key: "database", label: "数据库设计" },
];

export const dynamic = "force-dynamic";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    const zip = new JSZip();
    DOC_TYPES.forEach((doc) => {
      if (documents[doc.key]) {
        zip.file(`${doc.label}.md`, documents[doc.key]);
      }
    });

    const zipBuffer: Buffer = await zip.generateAsync({ type: "nodebuffer" });

    return new NextResponse(new Uint8Array(zipBuffer), {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="project-documents.zip"`,
      },
    });
  } catch (error) {
    console.error("ZIP download error:", error);
    return NextResponse.json(
      { error: "Failed to create ZIP" },
      { status: 500 }
    );
  }
}
