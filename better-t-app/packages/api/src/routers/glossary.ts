import { db, glossaryTerm } from "@better-t-app/db";
import { ORPCError } from "@orpc/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure } from "../index";

export const glossaryRouter = {
  list: publicProcedure
    .input(
      z.object({
        category: z
          .enum(["bean", "roast", "brew", "origin", "taste", "equipment", "certification"])
          .optional(),
        search: z.string().optional(),
        page: z.number().int().min(1).default(1),
        limit: z.number().int().min(1).max(100).default(20),
      }),
    )
    .handler(async ({ input }) => {
      const offset = (input.page - 1) * input.limit;

      const conditions = [];
      if (input.category) {
        conditions.push(eq(glossaryTerm.category, input.category));
      }
      if (input.search) {
        conditions.push(
          sql`(${glossaryTerm.term} LIKE ${"%" + input.search + "%"} OR ${glossaryTerm.termEn} LIKE ${"%" + input.search + "%"} OR ${glossaryTerm.reading} LIKE ${"%" + input.search + "%"})`,
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const [terms, totalResult] = await Promise.all([
        db
          .select({
            id: glossaryTerm.id,
            term: glossaryTerm.term,
            reading: glossaryTerm.reading,
            termEn: glossaryTerm.termEn,
            category: glossaryTerm.category,
            shortDescription: glossaryTerm.shortDescription,
          })
          .from(glossaryTerm)
          .where(whereClause)
          .orderBy(glossaryTerm.reading)
          .limit(input.limit)
          .offset(offset),
        db
          .select({ count: sql<number>`count(*)` })
          .from(glossaryTerm)
          .where(whereClause),
      ]);

      return {
        terms,
        total: totalResult[0]?.count ?? 0,
        page: input.page,
        limit: input.limit,
      };
    }),

  getById: publicProcedure
    .input(z.object({ termId: z.string() }))
    .handler(async ({ input }) => {
      const [row] = await db
        .select()
        .from(glossaryTerm)
        .where(eq(glossaryTerm.id, input.termId))
        .limit(1);

      if (!row) {
        throw new ORPCError("NOT_FOUND", { message: "用語が見つかりません" });
      }

      return {
        ...row,
        relatedTermIds: JSON.parse(row.relatedTermIds) as string[],
      };
    }),
};
