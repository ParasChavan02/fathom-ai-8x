import { NextRequest, NextResponse } from "next/server";
import { askSchema } from "@/lib/validators";
import { seedMeetings } from "@/lib/meetings";
import { answerMeetingQuestion } from "@/lib/ai";
export async function POST(req: NextRequest) { const parsed = askSchema.safeParse(await req.json()); if (!parsed.success) return NextResponse.json({ error: "A meeting and question are required." }, { status: 400 }); const meeting = seedMeetings.find(m=>m.id===parsed.data.meetingId); if (!meeting) return NextResponse.json({ error: "Meeting not found." }, { status: 404 }); return NextResponse.json(answerMeetingQuestion(meeting, parsed.data.question)); }
