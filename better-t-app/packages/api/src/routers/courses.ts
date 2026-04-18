import { course, db, lesson } from "@better-t-app/db";
import { ORPCError } from "@orpc/server";
import { count, eq } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure } from "../index";

export const coursesRouter = {
  list: publicProcedure
    .input(
      z.object({
        level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
      }),
    )
    .handler(async ({ input }) => {
      const rows = await db
        .select({
          id: course.id,
          title: course.title,
          description: course.description,
          level: course.level,
          durationMinutes: course.durationMinutes,
          thumbnailEmoji: course.thumbnailEmoji,
          isPremium: course.isPremium,
          orderIndex: course.orderIndex,
          createdAt: course.createdAt,
        })
        .from(course)
        .orderBy(course.orderIndex);

      const filtered = input.level
        ? rows.filter((r) => r.level === input.level)
        : rows;

      // レッスン数を集計
      const lessonCounts = await db
        .select({
          courseId: lesson.courseId,
          count: count(lesson.id),
        })
        .from(lesson)
        .groupBy(lesson.courseId);

      const countMap = new Map(lessonCounts.map((l) => [l.courseId, l.count]));

      return filtered.map((c) => ({
        ...c,
        lessonCount: countMap.get(c.id) ?? 0,
      }));
    }),

  getById: publicProcedure
    .input(z.object({ courseId: z.string() }))
    .handler(async ({ input }) => {
      const [courseRow] = await db
        .select()
        .from(course)
        .where(eq(course.id, input.courseId))
        .limit(1);

      if (!courseRow) {
        throw new ORPCError("NOT_FOUND", { message: "コースが見つかりません" });
      }

      const lessons = await db
        .select({
          id: lesson.id,
          title: lesson.title,
          orderIndex: lesson.orderIndex,
          durationMinutes: lesson.durationMinutes,
          tags: lesson.tags,
        })
        .from(lesson)
        .where(eq(lesson.courseId, input.courseId))
        .orderBy(lesson.orderIndex);

      return {
        ...courseRow,
        lessonCount: lessons.length,
        lessons: lessons.map((l) => ({
          ...l,
          tags: JSON.parse(l.tags) as string[],
        })),
      };
    }),
};
