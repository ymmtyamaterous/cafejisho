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
      totalQuizScore: quizResults.reduce((sum, r) => sum + r.score, 0),
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

    // 総学習時間（完了レッスンの合計 durationMinutes）
    let totalStudyMinutes = 0;
    if (completions.length > 0) {
      const completedLessonIds = completions.map((c) => c.lessonId);
      const lessonRows = await db
        .select({ id: lesson.id, durationMinutes: lesson.durationMinutes })
        .from(lesson);
      for (const l of lessonRows) {
        if (completedLessonIds.includes(l.id)) {
          totalStudyMinutes += l.durationMinutes;
        }
      }
    }

    // 継続学習日数（今日を含む連続した日数）
    let currentStreak = 0;
    if (completions.length > 0) {
      const dateSet = new Set(
        completions.map((c) => {
          const d = new Date(c.completedAt);
          return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        }),
      );
      const today = new Date();
      for (let i = 0; i < 365; i++) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        if (dateSet.has(key)) {
          currentStreak++;
        } else {
          break;
        }
      }
    }

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
      totalStudyMinutes,
      currentStreak,
      totalQuizAttempts,
      averageQuizScore,
      recentLessons,
    };
  }),
};
