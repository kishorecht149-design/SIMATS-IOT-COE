import { NextRequest, NextResponse } from "next/server";
import { getCurrentSession } from "@/lib/services/auth-service";
import { getPage, savePage, getPageRevisions } from "@/lib/services/page-service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const session = await getCurrentSession();
  if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "EDITOR")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const { slug } = await params;
  const page = await getPage(slug);
  const revisions = await getPageRevisions(slug);

  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  return NextResponse.json({ page, revisions });
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const session = await getCurrentSession();
    if (!session || (session.role !== "SUPER_ADMIN" && session.role !== "EDITOR")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { slug } = await params;
    const body = await request.json();

    const saved = await savePage(
      slug,
      {
        title: body.title,
        metaDescription: body.metaDescription,
        sections: body.sections,
        status: body.status || "published",
      },
      session.userId,
      session.email
    );

    return NextResponse.json({ success: true, page: saved });
  } catch (error: any) {
    console.error("Error saving CMS page:", error);
    return NextResponse.json({ error: error.message || "Failed to save page" }, { status: 400 });
  }
}
