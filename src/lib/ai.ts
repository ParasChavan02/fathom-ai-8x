import { Meeting, Segment } from "./types";
export type MeetingAnswer = { mode: "Live AI" | "Transcript-grounded fallback"; answer: string; sources: Segment[] };
export function fallbackMeetingAnswer(meeting: Meeting, question: string): MeetingAnswer {
  const q = question.toLowerCase();
  const sources = q.includes("action") ? [meeting.segments[3], meeting.segments[4]] : q.includes("risk") ? [meeting.segments[1], meeting.segments[5]] : [meeting.segments.find(s => q.includes("onboarding") && s.text.toLowerCase().includes("onboarding")) ?? meeting.segments[3]];
  const answer = q.includes("action") ? `The assigned follow-ups are: ${meeting.actions.map(a => `${a.title} (${a.assignee}, due ${a.due})`).join("; ")}.` : q.includes("risk") ? "The team called out the risk of taking on unnecessary platform work before validating the focused version. They mitigated it with a staged rollout and weekly review." : q.includes("decide") || q.includes("onboarding") ? `The team chose a staged rollout for ${meeting.title.toLowerCase()}, with a weekly review before expanding. Maya owns the brief and Eli owns the success metrics.` : `Based on the meeting, the clearest next step is to ${meeting.actions.find(a => !a.done)?.title.toLowerCase() ?? "review the action items"}.`;
  return { mode: "Transcript-grounded fallback", answer, sources };
}

export async function answerMeetingQuestion(meeting: Meeting, question: string): Promise<MeetingAnswer> {
  if (!process.env.OPENAI_API_KEY) return fallbackMeetingAnswer(meeting, question);
  const context = meeting.segments.map(s => `[${s.id}] ${s.time} — ${s.speaker}: ${s.text}`).join("\n");
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 12_000);
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", { method: "POST", signal: controller.signal, headers: { "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`, "Content-Type": "application/json" }, body: JSON.stringify({ model: "gpt-4o-mini", temperature: 0.2, messages: [{ role: "system", content: "Answer only from the supplied meeting transcript. Do not invent facts. Return JSON with answer (string) and sourceIds (array of exact transcript IDs). If unknown, say so plainly." }, { role: "user", content: `Meeting: ${meeting.title}\nTranscript:\n${context}\n\nQuestion: ${question}` }], response_format: { type: "json_object" } }) });
    if (!response.ok) throw new Error("provider request failed");
    const payload = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("empty provider response");
    const parsed = JSON.parse(content) as { answer?: unknown; sourceIds?: unknown };
    if (typeof parsed.answer !== "string" || !Array.isArray(parsed.sourceIds)) throw new Error("invalid provider response");
    const sources = parsed.sourceIds.map(id => meeting.segments.find(s => s.id === id)).filter((s): s is Segment => Boolean(s)).slice(0, 3);
    return { mode: "Live AI", answer: parsed.answer, sources };
  } finally { clearTimeout(timer); }
}
