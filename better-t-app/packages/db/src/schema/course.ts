import { relations, sql } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { lesson } from "./lesson";

export const course = sqliteTable("course", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  level: text("level", {
    enum: ["beginner", "intermediate", "advanced"],
  }).notNull(),
  durationMinutes: integer("duration_minutes").notNull().default(0),
  thumbnailEmoji: text("thumbnail_emoji").notNull().default("☕"),
  isPremium: integer("is_premium", { mode: "boolean" }).notNull().default(false),
  orderIndex: integer("order_index").notNull().default(0),
  createdAt: integer("created_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .$onUpdate(() => new Date())
    .notNull(),
});

export const courseRelations = relations(course, ({ many }) => ({
  lessons: many(lesson),
}));
