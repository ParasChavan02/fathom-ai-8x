export type Participant = { name: string; initials: string; role: string; tone: string };
export type Segment = { id: string; speaker: string; time: string; text: string };
export type Action = { id: string; title: string; assignee: string; due: string; done: boolean };
export type Decision = { id: string; title: string; detail: string };
export type Highlight = { id: string; meetingId: string; segmentId: string; timestamp: string; speaker: string; text: string; note?: string; createdAt: string };
export type Meeting = { id: string; title: string; date: string; time: string; duration: string; category: string; status: "completed" | "upcoming"; participants: Participant[]; summary: string; decisions: Decision[]; actions: Action[]; segments: Segment[]; highlights: Highlight[] };
