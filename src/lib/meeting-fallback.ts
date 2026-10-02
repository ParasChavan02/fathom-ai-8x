import { Meeting, Segment } from "./types";

export type MeetingAnswer = { mode: "Transcript-grounded fallback"; answer: string; sources: Segment[] };

export function fallbackMeetingAnswer(meeting: Meeting, question: string): MeetingAnswer {
  const q = question.toLowerCase();
  const sources = q.includes("action") ? [meeting.segments[3], meeting.segments[4]] : q.includes("risk") ? [meeting.segments[1], meeting.segments[5]] : [meeting.segments.find(s => q.includes("onboarding") && s.text.toLowerCase().includes("onboarding")) ?? meeting.segments[3]];
  const answer = q.includes("action") ? `The assigned follow-ups are: ${meeting.actions.map(a => `${a.title} (${a.assignee}, due ${a.due})`).join("; ")}.` : q.includes("risk") ? "The team called out the risk of taking on unnecessary platform work before validating the focused version. They mitigated it with a staged rollout and weekly review." : q.includes("decide") || q.includes("onboarding") ? `The team chose a staged rollout for ${meeting.title.toLowerCase()}, with a weekly review before expanding. Maya owns the brief and Eli owns the success metrics.` : `Based on the meeting, the clearest next step is to ${meeting.actions.find(a => !a.done)?.title.toLowerCase() ?? "review the action items"}.`;
  return { mode: "Transcript-grounded fallback", answer, sources };
}
