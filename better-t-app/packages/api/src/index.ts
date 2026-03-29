import { ORPCError, os } from "@orpc/server";

import type { Context } from "./context";

export const o = os.$context<Context>();

export const publicProcedure = o;

const requireAuth = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  return next({
    context: {
      session: context.session,
    },
  });
});

export const protectedProcedure = publicProcedure.use(requireAuth);

// プレミアム会員確認ミドルウェア
import { db, userPremium } from "@better-t-app/db";
import { eq } from "drizzle-orm";

const requirePremium = o.middleware(async ({ context, next }) => {
  if (!context.session?.user) {
    throw new ORPCError("UNAUTHORIZED");
  }
  const userId = context.session.user.id;
  const [premium] = await db
    .select({ expiresAt: userPremium.expiresAt })
    .from(userPremium)
    .where(eq(userPremium.userId, userId))
    .limit(1);

  const now = new Date();
  const isPremium = !!premium && (premium.expiresAt === null || premium.expiresAt > now);

  if (!isPremium) {
    throw new ORPCError("FORBIDDEN", { message: "プレミアム会員限定のコンテンツです" });
  }

  return next({
    context: {
      session: context.session,
    },
  });
});

export const premiumProcedure = publicProcedure.use(requirePremium);
