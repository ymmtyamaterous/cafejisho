import { db, origin } from "@better-t-app/db";
import { ORPCError } from "@orpc/server";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { publicProcedure } from "../index";

export const originsRouter = {
  list: publicProcedure
    .input(
      z.object({
        continent: z.string().optional(),
        search: z.string().optional(),
      }),
    )
    .handler(async ({ input }) => {
      const conditions = [];
      if (input.continent) {
        conditions.push(eq(origin.continent, input.continent));
      }
      if (input.search) {
        conditions.push(
          sql`(${origin.name} LIKE ${"%" + input.search + "%"} OR ${origin.nameEn} LIKE ${"%" + input.search + "%"})`,
        );
      }

      const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

      const rows = await db
        .select({
          id: origin.id,
          name: origin.name,
          nameEn: origin.nameEn,
          continent: origin.continent,
          countryCode: origin.countryCode,
          flavorTags: origin.flavorTags,
          altitude: origin.altitude,
          thumbnailEmoji: origin.thumbnailEmoji,
        })
        .from(origin)
        .where(whereClause)
        .orderBy(origin.name);

      return rows.map((r) => ({
        ...r,
        flavorTags: JSON.parse(r.flavorTags) as string[],
      }));
    }),

  getById: publicProcedure
    .input(z.object({ originId: z.string() }))
    .handler(async ({ input }) => {
      const [row] = await db
        .select()
        .from(origin)
        .where(eq(origin.id, input.originId))
        .limit(1);

      if (!row) {
        throw new ORPCError("NOT_FOUND", { message: "産地が見つかりません" });
      }

      return {
        ...row,
        flavorTags: JSON.parse(row.flavorTags) as string[],
        varieties: JSON.parse(row.varieties) as string[],
        processingMethods: JSON.parse(row.processingMethods) as string[],
      };
    }),
};
