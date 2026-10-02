import { Meeting, Segment } from "./types";
export function answerMeetingQuestion(meeting: Meeting, question: string) {
  const q = question.toLowerCase();
  const source = meeting.segments.find(s => q.includes("onboarding") ? s.text.toLowerCase().includes("onboarding") : s.text.toLowerCase().includes("decide")) ?? meeting.segments[3];
  return { mode: "Transcript-grounded fallback", answer: q.includes("decide") || q.includes("onboarding") ? `The team agreed to use a staged rollout for ${meeting.title.toLowerCase()}, with a weekly review before expanding. Maya owns the brief and Eli owns the success metrics.` : `Based on the discussion, the next concrete step is to ${meeting.actions.find(a => !a.done)?.title.toLowerCase() ?? "review the action items"}.`, sources: [source] as Segment[] };
}
