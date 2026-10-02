// PostgreSQL/Drizzle production schema. The UI uses seeded local data until DATABASE_URL is configured.
import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
export const meetings = pgTable("meetings", { id: uuid("id").primaryKey(), title: text("title").notNull(), startedAt: timestamp("started_at").notNull() });
export const transcriptSegments = pgTable("transcript_segments", { id: uuid("id").primaryKey(), meetingId: uuid("meeting_id").notNull(), speaker: text("speaker").notNull(), timestamp: text("timestamp").notNull(), text: text("text").notNull() });
export const actionItems = pgTable("action_items", { id: uuid("id").primaryKey(), meetingId: uuid("meeting_id").notNull(), title: text("title").notNull(), assignee: text("assignee").notNull(), dueDate: text("due_date"), completed: boolean("completed").default(false).notNull() });
