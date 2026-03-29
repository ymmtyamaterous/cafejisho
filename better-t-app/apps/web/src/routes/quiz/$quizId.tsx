import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/quiz/$quizId")({
  component: QuizPage,
});

type Answer = { questionId: string; choiceId: string };
type QuizResult = {
  score: number;
  total: number;
  percentage: number;
  results: { questionId: string; isCorrect: boolean; correctChoiceId: string; explanation: string | null }[];
};

function QuizPage() {
  const { quizId } = Route.useParams();
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();

  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [result, setResult] = useState<QuizResult | null>(null);

  const { data: quiz, isLoading } = useQuery(
    orpc.quizzes.getByLessonId.queryOptions({ input: { lessonId: quizId } }),
  );

  // レッスン情報（courseId取得用）
  const { data: lessonData } = useQuery(
    orpc.lessons.getById.queryOptions({ input: { lessonId: quizId } }),
  );

  // コース情報（次のレッスン取得用）
  const { data: courseData } = useQuery({
    ...orpc.courses.getById.queryOptions({ input: { courseId: lessonData?.courseId ?? "" } }),
    enabled: !!lessonData?.courseId,
  });

  const submitMutation = useMutation({
    ...orpc.quizzes.submit.mutationOptions(),
    onSuccess: (data) => {
      setResult(data as QuizResult);
      queryClient.invalidateQueries();
    },
    onError: (err) => toast.error(`エラー: ${err.message}`),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAF7F2" }}>
        <div className="text-4xl animate-bounce">🎯</div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#FAF7F2" }}>
        <p className="text-4xl">🔍</p>
        <p className="text-lg font-bold" style={{ color: "#6B3D1E" }}>クイズが見つかりません</p>
        <Link to="/courses" className="text-sm font-extrabold" style={{ color: "#2C1A0E" }}>← コース一覧へ</Link>
      </div>
    );
  }

  const questions = quiz.questions;
  const currentQ = questions[currentIdx];
  const currentAnswer = answers.find((a) => a.questionId === currentQ?.id);

  const handleSelect = (choiceId: string) => {
    setAnswers((prev) => {
      const filtered = prev.filter((a) => a.questionId !== currentQ!.id);
      return [...filtered, { questionId: currentQ!.id, choiceId }];
    });
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
    }
  };

  const handleSubmit = () => {
    if (!session) {
      toast.error("ログインが必要です");
      return;
    }
    submitMutation.mutate({ quizId: quiz.id, answers });
  };

  // 結果画面
  if (result) {
    const pct = result.total > 0 ? Math.round((result.score / result.total) * 100) : 0;

    // 次のレッスンを特定
    const currentLessonIdx = courseData?.lessons.findIndex((l) => l.id === quizId) ?? -1;
    const nextLesson = currentLessonIdx >= 0 ? courseData?.lessons[currentLessonIdx + 1] : undefined;
    const courseId = lessonData?.courseId;
    return (
      <div className="min-h-screen" style={{ background: "#FAF7F2", fontFamily: "'Nunito', sans-serif" }}>
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div
            className="rounded-2xl px-8 py-8 text-center mb-8"
            style={{
              background: "#2C1A0E",
              border: "2.5px solid #2C1A0E",
              boxShadow: "5px 5px 0 #6B3D1E",
            }}
          >
            <div className="text-6xl mb-4">{pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "💪"}</div>
            <h1
              className="text-4xl font-black text-white mb-2"
              style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
            >
              {pct}点
            </h1>
            <p className="text-base font-extrabold mb-1" style={{ color: "#C49A6C" }}>
              {result.score} / {result.total} 問正解
            </p>
            <p className="text-sm font-bold" style={{ color: "rgba(245,239,224,0.6)" }}>
              {pct >= 80 ? "素晴らしい！完璧な理解度です！" : pct >= 50 ? "よく頑張りました！" : "もう一度復習してみましょう。"}
            </p>
          </div>

          {/* 正誤リスト */}
          <div className="space-y-3 mb-8">
            {result.results.map((r, idx) => (
              <div
                key={r.questionId}
                className="flex items-start gap-3 px-5 py-4 rounded-2xl"
                style={{
                  background: "#fff",
                  border: `2px solid ${r.isCorrect ? "#2C1A0E" : "#C49A6C"}`,
                  boxShadow: `3px 3px 0 ${r.isCorrect ? "#2C1A0E" : "#C49A6C"}`,
                }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{
                    background: r.isCorrect ? "#2C1A0E" : "#E8C99A",
                    color: r.isCorrect ? "#F5EFE0" : "#6B3D1E",
                  }}
                >
                  {r.isCorrect ? "✓" : "✗"}
                </div>
                <div>
                  <div className="text-sm font-extrabold mb-1" style={{ color: "#2C1A0E" }}>
                    問{idx + 1}: {r.isCorrect ? "正解！" : "不正解"}
                  </div>
                  {r.explanation && (
                    <p className="text-xs font-bold leading-relaxed" style={{ color: "#6B3D1E" }}>
                      💡 {r.explanation}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-3 justify-center flex-wrap">
            <button
              type="button"
              onClick={() => { setResult(null); setAnswers([]); setCurrentIdx(0); }}
              className="px-6 py-3 text-sm font-black rounded-2xl cursor-pointer transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: "#F5EFE0",
                border: "2.5px solid #2C1A0E",
                boxShadow: "4px 4px 0 #2C1A0E",
                color: "#2C1A0E",
              }}
            >
              🔄 もう一度挑戦
            </button>
            {nextLesson && courseId ? (
              <Link
                to="/courses/$courseId/lessons/$lessonId"
                params={{ courseId, lessonId: nextLesson.id }}
                className="px-6 py-3 text-sm font-black rounded-2xl no-underline transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
                style={{
                  background: "#2C1A0E",
                  border: "2.5px solid #2C1A0E",
                  boxShadow: "4px 4px 0 #6B3D1E",
                  color: "#F5EFE0",
                }}
              >
                次のレッスンへ →
              </Link>
            ) : courseId ? (
              <Link
                to="/courses/$courseId"
                params={{ courseId }}
                className="px-6 py-3 text-sm font-black rounded-2xl no-underline transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
                style={{
                  background: "#2C1A0E",
                  border: "2.5px solid #2C1A0E",
                  boxShadow: "4px 4px 0 #6B3D1E",
                  color: "#F5EFE0",
                }}
              >
                📚 コースへ戻る
              </Link>
            ) : (
              <Link
                to="/courses"
                className="px-6 py-3 text-sm font-black rounded-2xl no-underline transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
                style={{
                  background: "#2C1A0E",
                  border: "2.5px solid #2C1A0E",
                  boxShadow: "4px 4px 0 #6B3D1E",
                  color: "#F5EFE0",
                }}
              >
                📚 コース一覧へ
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 問題画面
  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2", fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-2xl mx-auto px-6 py-10">
        {/* ヘッダー */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2
              className="text-xl font-black"
              style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
            >
              {quiz.title}
            </h2>
            <span className="text-sm font-extrabold" style={{ color: "#C49A6C" }}>
              {currentIdx + 1} / {questions.length}
            </span>
          </div>
          {/* プログレスバー */}
          <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#F5EFE0", border: "1.5px solid #2C1A0E" }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${((currentIdx + 1) / questions.length) * 100}%`, background: "#2C1A0E" }}
            />
          </div>
        </div>

        {/* 問題文 */}
        <div
          className="rounded-2xl px-7 py-6 mb-6"
          style={{
            background: "#2C1A0E",
            border: "2.5px solid #2C1A0E",
            boxShadow: "5px 5px 0 #6B3D1E",
          }}
        >
          <p className="text-xs font-black mb-2" style={{ color: "#C49A6C" }}>問{currentIdx + 1}</p>
          <p
            className="text-lg font-black text-white leading-relaxed"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
          >
            {currentQ?.text}
          </p>
        </div>

        {/* 選択肢 */}
        <div className="space-y-3 mb-8">
          {currentQ?.choices.map((choice) => {
            const isSelected = currentAnswer?.choiceId === choice.id;
            return (
              <button
                key={choice.id}
                type="button"
                onClick={() => handleSelect(choice.id)}
                className="w-full text-left px-5 py-4 rounded-2xl cursor-pointer transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
                style={{
                  background: isSelected ? "#2C1A0E" : "#fff",
                  border: "2px solid #2C1A0E",
                  boxShadow: isSelected ? "3px 3px 0 #6B3D1E" : "3px 3px 0 #2C1A0E",
                  color: isSelected ? "#F5EFE0" : "#2C1A0E",
                }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black"
                    style={{
                      background: isSelected ? "#C49A6C" : "#F5EFE0",
                      border: "2px solid",
                      borderColor: isSelected ? "#C49A6C" : "#2C1A0E",
                      color: isSelected ? "#2C1A0E" : "#6B3D1E",
                    }}
                  >
                    {isSelected ? "✓" : ""}
                  </div>
                  <span className="text-sm font-extrabold">{choice.text}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* ナビボタン */}
        <div className="flex gap-3 justify-end">
          {currentIdx < questions.length - 1 ? (
            <button
              type="button"
              onClick={handleNext}
              disabled={!currentAnswer}
              className="px-8 py-3 text-sm font-black rounded-2xl cursor-pointer transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "#2C1A0E",
                border: "2.5px solid #2C1A0E",
                boxShadow: "4px 4px 0 #6B3D1E",
                color: "#F5EFE0",
              }}
            >
              次へ →
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={answers.length < questions.length || submitMutation.isPending}
              className="px-8 py-3 text-sm font-black rounded-2xl cursor-pointer transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{
                background: "#C49A6C",
                border: "2.5px solid #2C1A0E",
                boxShadow: "4px 4px 0 #2C1A0E",
                color: "#2C1A0E",
              }}
            >
              {submitMutation.isPending ? "採点中..." : "結果を見る 🎯"}
            </button>
          )}
        </div>

        {!session && (
          <p className="text-center text-xs font-bold mt-4" style={{ color: "#C49A6C" }}>
            ※ クイズの結果を保存するにはログインが必要です
          </p>
        )}
      </div>
    </div>
  );
}
