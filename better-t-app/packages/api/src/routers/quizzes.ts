import { db, quiz, quizChoice, quizQuestion, quizResult } from "@better-t-app/db";
import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";
import { generateId } from "../utils";

export const quizzesRouter = {
  getByLessonId: publicProcedure
    .input(z.object({ lessonId: z.string() }))
    .handler(async ({ input }) => {
      const [quizRow] = await db
        .select()
        .from(quiz)
        .where(eq(quiz.lessonId, input.lessonId))
        .limit(1);

      if (!quizRow) {
        throw new ORPCError("NOT_FOUND", { message: "クイズが見つかりません" });
      }

      const questions = await db
        .select()
        .from(quizQuestion)
        .where(eq(quizQuestion.quizId, quizRow.id))
        .orderBy(quizQuestion.orderIndex);

      const questionsWithChoices = await Promise.all(
        questions.map(async (q) => {
          const choices = await db
            .select({
              id: quizChoice.id,
              text: quizChoice.text,
              orderIndex: quizChoice.orderIndex,
            })
            .from(quizChoice)
            .where(eq(quizChoice.questionId, q.id))
            .orderBy(quizChoice.orderIndex);

          return {
            id: q.id,
            text: q.text,
            choices,
          };
        }),
      );

      return {
        id: quizRow.id,
        lessonId: quizRow.lessonId,
        title: quizRow.title,
        questions: questionsWithChoices,
      };
    }),

  submit: protectedProcedure
    .input(
      z.object({
        quizId: z.string(),
        answers: z.array(
          z.object({
            questionId: z.string(),
            choiceId: z.string(),
          }),
        ),
      }),
    )
    .handler(async ({ input, context }) => {
      const userId = context.session.user.id;

      // クイズ存在確認
      const [quizRow] = await db
        .select({ id: quiz.id })
        .from(quiz)
        .where(eq(quiz.id, input.quizId))
        .limit(1);

      if (!quizRow) {
        throw new ORPCError("NOT_FOUND", { message: "クイズが見つかりません" });
      }

      // 全問題・全選択肢を取得
      const questions = await db
        .select()
        .from(quizQuestion)
        .where(eq(quizQuestion.quizId, input.quizId));

      const allChoices = await db
        .select()
        .from(quizChoice)
        .where(
          eq(
            quizChoice.questionId,
            // IN句のために全questionIdを渡す
            questions[0]?.id ?? "",
          ),
        );

      // 正解判定
      const choicesMap = new Map<string, typeof allChoices>();
      for (const q of questions) {
        const choices = await db
          .select()
          .from(quizChoice)
          .where(eq(quizChoice.questionId, q.id));
        choicesMap.set(q.id, choices);
      }

      const results = questions.map((q) => {
        const choices = choicesMap.get(q.id) ?? [];
        const correctChoice = choices.find((c) => c.isCorrect);
        const userAnswer = input.answers.find((a) => a.questionId === q.id);
        const isCorrect = userAnswer?.choiceId === correctChoice?.id;

        return {
          questionId: q.id,
          isCorrect,
          correctChoiceId: correctChoice?.id ?? "",
          explanation: q.explanation,
        };
      });

      const score = results.filter((r) => r.isCorrect).length;
      const total = questions.length;

      // 結果を保存
      await db.insert(quizResult).values({
        id: generateId(),
        userId,
        quizId: input.quizId,
        score,
        total,
        attemptedAt: new Date(),
      });

      return {
        score,
        total,
        percentage: total > 0 ? Math.round((score / total) * 100) : 0,
        results,
      };
    }),
};
