import { db, user, userPremium } from "@better-t-app/db";
import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure } from "../index";

export const usersRouter = {
  getMe: protectedProcedure.handler(async ({ context }) => {
    const userId = context.session.user.id;

    const [userRow] = await db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, userId))
      .limit(1);

    if (!userRow) {
      throw new ORPCError("NOT_FOUND", { message: "ユーザーが見つかりません" });
    }

    // プレミアム確認
    const [premium] = await db
      .select({ expiresAt: userPremium.expiresAt })
      .from(userPremium)
      .where(eq(userPremium.userId, userId))
      .limit(1);

    const now = new Date();
    const isPremium =
      !!premium && (premium.expiresAt === null || premium.expiresAt > now);

    return {
      ...userRow,
      isPremium,
    };
  }),

  updateMe: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(100).optional(),
        image: z.string().url().optional(),
      }),
    )
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      if (!input.name && !input.image) {
        return { success: true };
      }

      await db
        .update(user)
        .set({
          ...(input.name !== undefined && { name: input.name }),
          ...(input.image !== undefined && { image: input.image }),
          updatedAt: new Date(),
        })
        .where(eq(user.id, userId));

      return { success: true };
    }),
};
