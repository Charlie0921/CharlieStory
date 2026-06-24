import { NextResponse } from "next/server";
import { getPublishedNotes } from "@/lib/notion/notes";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const notes = await getPublishedNotes();

    return NextResponse.json({ notes });
  } catch (error) {
    console.error("Failed to fetch Notion notes:", error);

    return NextResponse.json(
      { error: "Failed to load notes." },
      { status: 500 },
    );
  }
}
