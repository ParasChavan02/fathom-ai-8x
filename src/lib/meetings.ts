import { Meeting } from "./types";

const people = [
  { name: "Maya Chen", initials: "MC", role: "Product", tone: "violet" }, { name: "Eli Turner", initials: "ET", role: "Engineering", tone: "blue" }, { name: "Noah Williams", initials: "NW", role: "Design", tone: "orange" }, { name: "Sofia Patel", initials: "SP", role: "Customer success", tone: "green" }
];
const make = (id: string, title: string, category: string, date: string, status: Meeting["status"], summary: string, topic: string): Meeting => ({
  id, title, category, date, time: status === "upcoming" ? "Tomorrow, 10:00 AM" : "Oct 1, 2026 · 10:30 AM", duration: status === "upcoming" ? "30 min scheduled" : "42 min", status, participants: people.slice(0, id === "customer" ? 4 : 3), summary,
  decisions: [{ id: `${id}-d1`, title: `Move forward with the ${topic} plan`, detail: "The group aligned on scope, ownership, and the next review point." }, { id: `${id}-d2`, title: "Use a staged rollout", detail: "Validate with a small cohort before broad release." }],
  actions: [{ id: `${id}-a1`, title: "Write the implementation brief", assignee: "Maya Chen", due: "Oct 4", done: false }, { id: `${id}-a2`, title: "Confirm success metrics", assignee: "Eli Turner", due: "Oct 6", done: false }, { id: `${id}-a3`, title: "Share the decision recap", assignee: "Noah Williams", due: "Today", done: true }],
  segments: [
    { id: `${id}-s1`, speaker: "Maya Chen", time: "00:00", text: `Thanks for joining. Today I want us to leave with a clear decision on ${topic}.` },
    { id: `${id}-s2`, speaker: "Eli Turner", time: "02:14", text: `The data supports starting with a focused version. We can learn quickly without taking on unnecessary platform work.` },
    { id: `${id}-s3`, speaker: "Noah Williams", time: "08:42", text: `For onboarding, the essential moment is helping new users reach their first meaningful outcome in under ten minutes.` },
    { id: `${id}-s4`, speaker: "Maya Chen", time: "16:20", text: `Let's decide: staged rollout, weekly review, and Maya owns the brief while Eli confirms measurement.` },
    { id: `${id}-s5`, speaker: "Sofia Patel", time: "24:08", text: `I can recruit six customers for the pilot and capture their feedback in the same workspace.` },
    { id: `${id}-s6`, speaker: "Eli Turner", time: "34:51", text: `That gives us enough signal to decide whether to expand. I am comfortable with this timeline.` }
  ], highlights: id === "product" ? [{ id: "h1", meetingId: "product", segmentId: "product-s4", timestamp: "16:20", speaker: "Maya Chen", text: "Let's decide: staged rollout, weekly review, and Maya owns the brief while Eli confirms measurement.", note: "Final rollout decision", createdAt: "2026-10-01T11:18:00.000Z" }] : []
});

export const seedMeetings: Meeting[] = [
  make("product", "Product strategy: onboarding", "Product", "Today", "completed", "The team chose a staged onboarding rollout centered on helping users reach value in their first ten minutes.", "the new onboarding experience"),
  make("sprint", "Engineering sprint planning", "Engineering", "Yesterday", "completed", "Engineering committed to the reliability work and a narrow pilot surface for the next sprint.", "sprint scope and reliability work"),
  make("customer", "Customer discovery · Northstar", "Customer", "Sep 29", "completed", "Northstar needs clearer handoffs and faster insight after their recurring customer calls.", "customer feedback priorities"),
  make("design", "Design review: workspace", "Design", "Sep 28", "completed", "The group aligned on a calmer, transcript-first workspace with decisions above the fold.", "the meeting workspace design"),
  make("marketing", "Marketing narrative sync", "Marketing", "Sep 27", "completed", "Marketing selected an evidence-led story focused on turning conversation into momentum.", "the launch narrative"),
  make("hiring", "Candidate interview · Priya Shah", "Hiring", "Sep 25", "completed", "The panel saw strong product judgment and agreed to move Priya to the final conversation.", "the candidate evaluation"),
  make("investor", "Investor update preparation", "Leadership", "Tomorrow", "upcoming", "Prepare a concise update on customer momentum, pilot outcomes, and the next milestone.", "the investor update"),
  make("weekly", "Weekly engineering sync", "Engineering", "Friday", "upcoming", "Review delivery risks, platform health, and decisions needed for the upcoming release.", "weekly engineering priorities")
];
