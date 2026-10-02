import { Suspense } from "react";
import { notFound } from "next/navigation";
import { seedMeetings } from "@/lib/meetings";
import { SharedMeetingContent } from "./shared-meeting-content";

export const dynamicParams = false;
export function generateStaticParams() { return seedMeetings.map(({ id }) => ({ meetingId: id })); }

export default async function SharedMeeting({ params }: { params: Promise<{ meetingId: string }> }) {
  const { meetingId } = await params;
  const meeting = seedMeetings.find(m => m.id === meetingId);
  if (!meeting) notFound();
  return <Suspense fallback={<main className="shared-page"/>}><SharedMeetingContent meeting={meeting} clipId={null}/></Suspense>;
}
