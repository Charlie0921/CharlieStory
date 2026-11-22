import { NextRequest, NextResponse } from "next/server";
import { assertPublicPage, publicContent } from "@/lib/notion/content";
import { fileUrl, type ContentKind } from "@/lib/notion/model";
import { NotionError } from "@/lib/notion/client";
export const dynamic = "force-dynamic";
export async function GET(
  request: NextRequest,
  { params }: { params: { kind: string; id: string } },
) {
  if (!["projects", "notes"].includes(params.kind))
    return NextResponse.json({ error: "Content not found." }, { status: 404 });
  const kind = params.kind as ContentKind;
  try {
    if (request.nextUrl.searchParams.get("asset") === "cover") {
      const page = await assertPublicPage(kind, params.id);
      const url = fileUrl(page.cover);
      if (!url) return new NextResponse(null, { status: 404 });
      return new NextResponse(null, {
        status: 307,
        headers: { Location: url, "Cache-Control": "no-store" },
      });
    }
    const blocks = await publicContent(kind, params.id);
    return NextResponse.json(
      { blocks },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof NotionError && error.status === 404
            ? "Content not found."
            : "Content is temporarily unavailable.",
      },
      {
        status: error instanceof NotionError ? error.status : 502,
        headers: { "Cache-Control": "no-store" },
      },
    );
  }
}
