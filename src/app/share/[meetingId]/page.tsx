import { notFound } from "next/navigation";
import { Clock3, FileText, Users } from "lucide-react";
import { seedMeetings } from "@/lib/meetings";

export default async function SharedMeeting({ params, searchParams }: { params: Promise<{ meetingId: string }>; searchParams: Promise<{ clip?: string }> }) {
  const { meetingId } = await params; const { clip } = await searchParams;
  const meeting = seedMeetings.find(m => m.id === meetingId); if (!meeting) notFound();
  const segment = clip ? meeting.segments.find(s => s.id === clip) : undefined;
  return <main className="shared-page"><header className="shared-brand"><span>R</span> relay <small>Shared meeting</small></header><article className="shared-card"><p className="eyebrow">{segment ? "SHARED MOMENT" : "SHARED MEETING"}</p><h1>{meeting.title}</h1><div className="shared-meta"><span><Clock3 size={15}/>{meeting.time}</span><span><Users size={15}/>{meeting.participants.map(p => p.name).join(", ")}</span></div>{segment?<section className="shared-clip"><time>{segment.time}</time><b>{segment.speaker}</b><p>“{segment.text}”</p></section>:<><section className="shared-summary"><h2>What happened</h2><p>{meeting.summary}</p></section><section className="shared-decisions"><h2>Key decisions</h2>{meeting.decisions.map(d=><div key={d.id}><b>{d.title}</b><p>{d.detail}</p></div>)}</section><section className="shared-transcript"><h2>Transcript</h2>{meeting.segments.map(s=><div key={s.id}><time>{s.time}</time><p><b>{s.speaker}</b> {s.text}</p></div>)}</section></>}<footer><FileText size={16}/> Shared read-only from Relay</footer></article></main>;
}
