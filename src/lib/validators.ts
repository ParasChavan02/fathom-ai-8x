import { z } from "zod";
export const actionUpdateSchema = z.object({ meetingId: z.string().min(1), actionId: z.string().min(1), done: z.boolean() });
export const askSchema = z.object({ meetingId: z.string().min(1), question: z.string().min(3).max(500) });
