import { NextRequest, NextResponse } from "next/server";
import { askSchema } from "@/lib/validators";
import { seedMeetings } from "@/lib/meetings";
import { answerMeetingQuestion, fallbackMeetingAnswer } from "@/lib/ai";
export async function POST(req: NextRequest) {
  try { const parsed = askSchema.safeParse(await req.json()); if (!parsed.success) return NextResponse.json({ error: "Ask a question between 3 and 500 characters." }, { status: 400 }); const meeting = seedMeetings.find(m=>m.id===parsed.data.meetingId); if (!meeting) return NextResponse.json({ error: "Meeting not found." }, { status: 404 });
    try { return NextResponse.json(await answerMeetingQuestion(meeting, parsed.data.question)); } catch { return NextResponse.json({ ...fallbackMeetingAnswer(meeting, parsed.data.question), notice: "Live AI is temporarily unavailable; this answer uses the transcript-grounded fallback." }); }
  } catch { return NextResponse.json({ error: "We couldn't process that question. Please try again." }, { status: 500 }); }
}
