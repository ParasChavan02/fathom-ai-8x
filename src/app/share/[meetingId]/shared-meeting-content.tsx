"use client";
import { useSearchParams } from "next/navigation";
import { Clock3, FileText, Users } from "lucide-react";
import { Meeting } from "@/lib/types";

export function SharedMeetingContent({ meeting, clipId }: { meeting: Meeting; clipId: string | null }) {
  const params = useSearchParams();
  const requestedClip = params.get("clip") ?? clipId;
  const segment = requestedClip ? meeting.segments.find(s => s.id === requestedClip) : undefined;
  return <main className="shared-page"><header className="shared-brand"><span>R</span> relay <small>Shared meeting</small></header><article className="shared-card"><p className="eyebrow">{segment ? "SHARED MOMENT" : "SHARED MEETING"}</p><h1>{meeting.title}</h1><div className="shared-meta"><span><Clock3 size={15}/>{meeting.time}</span><span><Users size={15}/>{meeting.participants.map(p => p.name).join(", ")}</span></div>{segment?<section className="shared-clip"><time>{segment.time}</time><b>{segment.speaker}</b><p>“{segment.text}”</p></section>:<><section className="shared-summary"><h2>What happened</h2><p>{meeting.summary}</p></section><section className="shared-decisions"><h2>Key decisions</h2>{meeting.decisions.map(d=><div key={d.id}><b>{d.title}</b><p>{d.detail}</p></div>)}</section><section className="shared-transcript"><h2>Transcript</h2>{meeting.segments.map(s=><div key={s.id}><time>{s.time}</time><p><b>{s.speaker}</b> {s.text}</p></div>)}</section></>}<footer><FileText size={16}/> Shared read-only from Relay</footer></article></main>;
}
