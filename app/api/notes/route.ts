import { NextResponse } from "next/server";
import { getPublishedNotes } from "@/lib/notion/notes";
export const dynamic = "force-dynamic";
export async function GET() {
  try {
    return NextResponse.json(
      { notes: await getPublishedNotes() },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json(
      { error: "Notes are temporarily unavailable." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
