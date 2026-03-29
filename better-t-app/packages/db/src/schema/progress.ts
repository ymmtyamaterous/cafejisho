import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, unique } from "drizzle-orm/sqlite-core";
import { user } from "./auth";
import { lesson } from "./lesson";
import { quiz } from "./quiz";

export const lessonCompletion = sqliteTable(
  "lesson_completion",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lesson.id, { onDelete: "cascade" }),
    completedAt: integer("completed_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
  },
  (table) => [
    index("lesson_completion_user_id_idx").on(table.userId),
    unique("lesson_completion_user_lesson_unique").on(table.userId, table.lessonId),
  ],
);

export const quizResult = sqliteTable(
  "quiz_result",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    quizId: text("quiz_id")
      .notNull()
      .references(() => quiz.id, { onDelete: "cascade" }),
    score: integer("score").notNull(),
    total: integer("total").notNull(),
    attemptedAt: integer("attempted_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
  },
  (table) => [index("quiz_result_user_id_idx").on(table.userId)],
);

export const bookmark = sqliteTable(
  "bookmark",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    type: text("type", { enum: ["lesson", "glossary", "origin"] }).notNull(),
    targetId: text("target_id").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
  },
  (table) => [
    index("bookmark_user_id_idx").on(table.userId),
    unique("bookmark_user_type_target_unique").on(table.userId, table.type, table.targetId),
  ],
);

export const userPremium = sqliteTable("user_premium", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: "cascade" }),
  startedAt: integer("started_at", { mode: "timestamp_ms" })
    .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
    .notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }),
});

export const lessonCompletionRelations = relations(lessonCompletion, ({ one }) => ({
  user: one(user, {
    fields: [lessonCompletion.userId],
    references: [user.id],
  }),
  lesson: one(lesson, {
    fields: [lessonCompletion.lessonId],
    references: [lesson.id],
  }),
}));

export const quizResultRelations = relations(quizResult, ({ one }) => ({
  user: one(user, {
    fields: [quizResult.userId],
    references: [user.id],
  }),
  quiz: one(quiz, {
    fields: [quizResult.quizId],
    references: [quiz.id],
  }),
}));

export const bookmarkRelations = relations(bookmark, ({ one }) => ({
  user: one(user, {
    fields: [bookmark.userId],
    references: [user.id],
  }),
}));

export const userPremiumRelations = relations(userPremium, ({ one }) => ({
  user: one(user, {
    fields: [userPremium.userId],
    references: [user.id],
  }),
}));
