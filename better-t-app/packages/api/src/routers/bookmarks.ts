import { bookmark, db, glossaryTerm, lesson, origin } from "@better-t-app/db";
import { ORPCError } from "@orpc/server";
import { and, eq, inArray } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "../index";
import { generateId } from "../utils";

export const bookmarksRouter = {
  list: protectedProcedure
    .input(
      z.object({
        type: z.enum(["lesson", "glossary", "origin"]).optional(),
      }),
    )
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      const conditions = [eq(bookmark.userId, userId)];
      if (input.type) {
        conditions.push(eq(bookmark.type, input.type));
      }

      const rows = await db
        .select()
        .from(bookmark)
        .where(and(...conditions))
        .orderBy(bookmark.createdAt);

      if (rows.length === 0) return [];

      // 各タイプのIDを収集してタイトルを取得
      const lessonIds = rows.filter((r) => r.type === "lesson").map((r) => r.targetId);
      const glossaryIds = rows.filter((r) => r.type === "glossary").map((r) => r.targetId);
      const originIds = rows.filter((r) => r.type === "origin").map((r) => r.targetId);

      const [lessons, glossaryTerms, origins] = await Promise.all([
        lessonIds.length > 0
          ? db.select({ id: lesson.id, title: lesson.title, courseId: lesson.courseId }).from(lesson).where(inArray(lesson.id, lessonIds))
          : [],
        glossaryIds.length > 0
          ? db.select({ id: glossaryTerm.id, title: glossaryTerm.term }).from(glossaryTerm).where(inArray(glossaryTerm.id, glossaryIds))
          : [],
        originIds.length > 0
          ? db.select({ id: origin.id, title: origin.name }).from(origin).where(inArray(origin.id, originIds))
          : [],
      ]);

      const titleMap = new Map<string, string>();
      const courseIdMap = new Map<string, string>();
      for (const l of lessons) {
        titleMap.set(l.id, l.title);
        courseIdMap.set(l.id, l.courseId);
      }
      for (const g of glossaryTerms) titleMap.set(g.id, g.title);
      for (const o of origins) titleMap.set(o.id, o.title);

      return rows.map((row) => ({
        ...row,
        title: titleMap.get(row.targetId) ?? row.targetId,
        courseId: row.type === "lesson" ? (courseIdMap.get(row.targetId) ?? null) : null,
      }));
    }),

  add: protectedProcedure
    .input(
      z.object({
        type: z.enum(["lesson", "glossary", "origin"]),
        targetId: z.string(),
      }),
    )
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;
      const now = new Date();

      const id = generateId();
      await db
        .insert(bookmark)
        .values({
          id,
          userId,
          type: input.type,
          targetId: input.targetId,
          createdAt: now,
        })
        .onConflictDoNothing();

      return { id, createdAt: now };
    }),

  remove: protectedProcedure
    .input(z.object({ bookmarkId: z.string() }))
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      const [row] = await db
        .select({ id: bookmark.id })
        .from(bookmark)
        .where(and(eq(bookmark.id, input.bookmarkId), eq(bookmark.userId, userId)))
        .limit(1);

      if (!row) {
        throw new ORPCError("NOT_FOUND", { message: "ブックマークが見つかりません" });
      }

      await db
        .delete(bookmark)
        .where(and(eq(bookmark.id, input.bookmarkId), eq(bookmark.userId, userId)));

      return { success: true };
    }),
};
