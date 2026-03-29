import { course, db, lesson, lessonCompletion, quiz, quizResult } from "@better-t-app/db";
import { eq, sql } from "drizzle-orm";
import { protectedProcedure } from "../index";

export const progressRouter = {
  getMine: protectedProcedure.handler(async ({ context }) => {
    const userId = context.session.user.id;

    const completions = await db
      .select({ lessonId: lessonCompletion.lessonId })
      .from(lessonCompletion)
      .where(eq(lessonCompletion.userId, userId));

    const completedLessonIds = completions.map((c) => c.lessonId);

    // コースごとの進捗
    const courses = await db.select({ id: course.id }).from(course);

    const courseProgress = await Promise.all(
      courses.map(async (c) => {
        const lessons = await db
          .select({ id: lesson.id })
          .from(lesson)
          .where(eq(lesson.courseId, c.id));

        const totalCount = lessons.length;
        const completedCount = lessons.filter((l) =>
          completedLessonIds.includes(l.id),
        ).length;

        const lastCompletion = completedLessonIds.length > 0
          ? await db
              .select({ completedAt: lessonCompletion.completedAt })
              .from(lessonCompletion)
              .where(eq(lessonCompletion.userId, userId))
              .orderBy(sql`${lessonCompletion.completedAt} DESC`)
              .limit(1)
          : [];

        return {
          courseId: c.id,
          completedCount,
          totalCount,
          percentage:
            totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0,
          lastAccessedAt: lastCompletion[0]?.completedAt ?? null,
        };
      }),
    );

    const quizResults = await db
      .select({
        quizId: quizResult.quizId,
        lessonId: quiz.lessonId,
        score: quizResult.score,
        total: quizResult.total,
        attemptedAt: quizResult.attemptedAt,
      })
      .from(quizResult)
      .innerJoin(quiz, eq(quizResult.quizId, quiz.id))
      .where(eq(quizResult.userId, userId))
      .orderBy(sql`${quizResult.attemptedAt} DESC`);

    return {
      completedLessonIds,
      courseProgress,
      quizResults,
    };
  }),

  getStats: protectedProcedure.handler(async ({ context }) => {
    const userId = context.session.user.id;

    const completions = await db
      .select({
        lessonId: lessonCompletion.lessonId,
        completedAt: lessonCompletion.completedAt,
      })
      .from(lessonCompletion)
      .where(eq(lessonCompletion.userId, userId))
      .orderBy(sql`${lessonCompletion.completedAt} DESC`);

    const quizResults = await db
      .select({ score: quizResult.score, total: quizResult.total })
      .from(quizResult)
      .where(eq(quizResult.userId, userId));

    const totalQuizAttempts = quizResults.length;
    const averageQuizScore =
      totalQuizAttempts > 0
        ? Math.round(
            (quizResults.reduce(
              (sum, r) => sum + (r.total > 0 ? (r.score / r.total) * 100 : 0),
              0,
            ) /
              totalQuizAttempts) *
              10,
          ) / 10
        : 0;

    // 直近5件のレッスン
    const recentLessons = await Promise.all(
      completions.slice(0, 5).map(async (c) => {
        const [l] = await db
          .select({ id: lesson.id, title: lesson.title })
          .from(lesson)
          .where(eq(lesson.id, c.lessonId))
          .limit(1);
        return {
          lessonId: c.lessonId,
          title: l?.title ?? "",
          completedAt: c.completedAt,
        };
      }),
    );

    return {
      totalCompletedLessons: completions.length,
      totalQuizAttempts,
      averageQuizScore,
      recentLessons,
    };
  }),
};
