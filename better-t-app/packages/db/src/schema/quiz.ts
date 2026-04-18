import { relations, sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { lesson } from "./lesson";

export const quiz = sqliteTable(
  "quiz",
  {
    id: text("id").primaryKey(),
    lessonId: text("lesson_id")
      .notNull()
      .references(() => lesson.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    createdAt: integer("created_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .notNull(),
    updatedAt: integer("updated_at", { mode: "timestamp_ms" })
      .default(sql`(cast(unixepoch('subsecond') * 1000 as integer))`)
      .$onUpdate(() => new Date())
      .notNull(),
  },
  (table) => [index("quiz_lesson_id_idx").on(table.lessonId)],
);

export const quizQuestion = sqliteTable(
  "quiz_question",
  {
    id: text("id").primaryKey(),
    quizId: text("quiz_id")
      .notNull()
      .references(() => quiz.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    explanation: text("explanation").notNull().default(""),
    orderIndex: integer("order_index").notNull().default(0),
  },
  (table) => [index("quiz_question_quiz_id_idx").on(table.quizId)],
);

export const quizChoice = sqliteTable(
  "quiz_choice",
  {
    id: text("id").primaryKey(),
    questionId: text("question_id")
      .notNull()
      .references(() => quizQuestion.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    isCorrect: integer("is_correct", { mode: "boolean" }).notNull().default(false),
    orderIndex: integer("order_index").notNull().default(0),
  },
  (table) => [index("quiz_choice_question_id_idx").on(table.questionId)],
);

export const quizRelations = relations(quiz, ({ one, many }) => ({
  lesson: one(lesson, {
    fields: [quiz.lessonId],
    references: [lesson.id],
  }),
  questions: many(quizQuestion),
}));

export const quizQuestionRelations = relations(quizQuestion, ({ one, many }) => ({
  quiz: one(quiz, {
    fields: [quizQuestion.quizId],
    references: [quiz.id],
  }),
  choices: many(quizChoice),
}));

export const quizChoiceRelations = relations(quizChoice, ({ one }) => ({
  question: one(quizQuestion, {
    fields: [quizChoice.questionId],
    references: [quizQuestion.id],
  }),
}));
