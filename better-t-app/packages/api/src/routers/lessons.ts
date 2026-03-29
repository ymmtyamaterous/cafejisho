import { course, db, lesson, lessonCompletion, quiz, userPremium } from "@better-t-app/db";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";
import { generateId } from "../utils";

export const lessonsRouter = {
  getById: publicProcedure
    .input(z.object({ lessonId: z.string() }))
    .handler(async ({ input, context }) => {
      const [row] = await db
        .select({
          id: lesson.id,
          courseId: lesson.courseId,
          title: lesson.title,
          content: lesson.content,
          orderIndex: lesson.orderIndex,
          durationMinutes: lesson.durationMinutes,
          tags: lesson.tags,
          createdAt: lesson.createdAt,
        })
        .from(lesson)
        .where(eq(lesson.id, input.lessonId))
        .limit(1);

      if (!row) {
        throw new ORPCError("NOT_FOUND", { message: "レッスンが見つかりません" });
      }

      // コースのプレミアムフラグ確認
      const [courseRow] = await db
        .select({ isPremium: course.isPremium })
        .from(course)
        .where(eq(course.id, row.courseId))
        .limit(1);

      if (courseRow?.isPremium) {
        const userId = context.session?.user?.id;
        if (!userId) {
          throw new ORPCError("UNAUTHORIZED", { message: "このレッスンを閲覧するにはログインが必要です" });
        }
        const [premium] = await db
          .select({ expiresAt: userPremium.expiresAt })
          .from(userPremium)
          .where(eq(userPremium.userId, userId))
          .limit(1);
        const now = new Date();
        const isPremiumUser = !!premium && (premium.expiresAt === null || premium.expiresAt > now);
        if (!isPremiumUser) {
          throw new ORPCError("FORBIDDEN", { message: "このレッスンはプレミアム会員限定です" });
        }
      }

      // クイズの存在確認
      const [quizRow] = await db
        .select({ id: quiz.id })
        .from(quiz)
        .where(eq(quiz.lessonId, input.lessonId))
        .limit(1);

      return {
        ...row,
        tags: JSON.parse(row.tags) as string[],
        hasQuiz: !!quizRow,
      };
    }),

  complete: protectedProcedure
    .input(z.object({ lessonId: z.string() }))
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // レッスン存在確認
      const [lessonRow] = await db
        .select({ id: lesson.id })
        .from(lesson)
        .where(eq(lesson.id, input.lessonId))
        .limit(1);

      if (!lessonRow) {
        throw new ORPCError("NOT_FOUND", { message: "レッスンが見つかりません" });
      }

      // 既に完了済みか確認
      const [existing] = await db
        .select({ id: lessonCompletion.id })
        .from(lessonCompletion)
        .where(
          and(
            eq(lessonCompletion.userId, userId),
            eq(lessonCompletion.lessonId, input.lessonId),
          ),
        )
        .limit(1);

      if (existing) {
        return { success: true, completedAt: new Date() };
      }

      const now = new Date();
      await db.insert(lessonCompletion).values({
        id: generateId(),
        userId,
        lessonId: input.lessonId,
        completedAt: now,
      });

      return { success: true, completedAt: now };
    }),

  getCompletedIds: protectedProcedure
    .input(z.object({ courseId: z.string() }))
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      const lessons = await db
        .select({ id: lesson.id })
        .from(lesson)
        .where(eq(lesson.courseId, input.courseId));

      const lessonIds = lessons.map((l) => l.id);
      if (lessonIds.length === 0) return [];

      const completions = await db
        .select({ lessonId: lessonCompletion.lessonId })
        .from(lessonCompletion)
        .where(eq(lessonCompletion.userId, userId));

      const completedSet = new Set(completions.map((c) => c.lessonId));
      return lessonIds.filter((id) => completedSet.has(id));
    }),
};
