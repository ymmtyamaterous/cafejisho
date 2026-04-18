import type { RouterClient } from "@orpc/server";

import { protectedProcedure, publicProcedure } from "../index";
import { bookmarksRouter } from "./bookmarks";
import { coursesRouter } from "./courses";
import { glossaryRouter } from "./glossary";
import { lessonsRouter } from "./lessons";
import { originsRouter } from "./origins";
import { progressRouter } from "./progress";
import { quizzesRouter } from "./quizzes";
import { usersRouter } from "./users";

export const appRouter = {
  healthCheck: publicProcedure.handler(() => {
    return "OK";
  }),
  privateData: protectedProcedure.handler(({ context }) => {
    return {
      message: "This is private",
      user: context.session?.user,
    };
  }),
  courses: coursesRouter,
  lessons: lessonsRouter,
  quizzes: quizzesRouter,
  glossary: glossaryRouter,
  origins: originsRouter,
  progress: progressRouter,
  bookmarks: bookmarksRouter,
  users: usersRouter,
};
export type AppRouter = typeof appRouter;
export type AppRouterClient = RouterClient<typeof appRouter>;
