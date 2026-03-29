import { bookmark, db } from "@better-t-app/db";
import { ORPCError } from "@orpc/server";
import { and, eq } from "drizzle-orm";
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

      return rows;
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
