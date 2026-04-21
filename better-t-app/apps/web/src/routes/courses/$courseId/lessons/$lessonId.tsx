import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/courses/$courseId/lessons/$lessonId")({
  component: LessonDetailPage,
});

function LessonDetailPage() {
  const { courseId, lessonId } = Route.useParams();
  const { data: session } = authClient.useSession();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: lesson, isLoading } = useQuery(
    orpc.lessons.getById.queryOptions({ input: { lessonId } }),
  );

  const { data: course } = useQuery(
    orpc.courses.getById.queryOptions({ input: { courseId } }),
  );

  const { data: completedIds = [] } = useQuery({
    ...orpc.lessons.getCompletedIds.queryOptions({ input: { courseId } }),
    enabled: !!session,
  });

  const { data: myBookmarks = [] } = useQuery({
    ...orpc.bookmarks.list.queryOptions({ input: { type: "lesson" } }),
    enabled: !!session,
  });

  const completeMutation = useMutation({
    ...orpc.lessons.complete.mutationOptions(),
    onMutate: () => {
      const queryKey = orpc.lessons.getCompletedIds.queryOptions({ input: { courseId } }).queryKey;
      const prev = queryClient.getQueryData<string[]>(queryKey);
      queryClient.setQueryData<string[]>(queryKey, (old = []) =>
        old.includes(lessonId) ? old : [...old, lessonId],
      );
      return { prev };
    },
    onSuccess: () => {
      toast.success("レッスン完了！🎉");
      queryClient.invalidateQueries({ queryKey: orpc.lessons.getCompletedIds.queryOptions({ input: { courseId } }).queryKey });

      // クイズがある場合はクイズへ遷移（lessonId をクイズルートのパラメータとして使用）
      if (lesson?.hasQuiz) {
        navigate({ to: "/quiz/$quizId", params: { quizId: lessonId } });
      }
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev !== undefined) {
        queryClient.setQueryData(orpc.lessons.getCompletedIds.queryOptions({ input: { courseId } }).queryKey, ctx.prev);
      }
      toast.error(`エラー: ${err.message}`);
    },
  });

  const uncompleteMutation = useMutation({
    ...orpc.lessons.uncomplete.mutationOptions(),
    onMutate: () => {
      const queryKey = orpc.lessons.getCompletedIds.queryOptions({ input: { courseId } }).queryKey;
      const prev = queryClient.getQueryData<string[]>(queryKey);
      queryClient.setQueryData<string[]>(queryKey, (old = []) =>
        old.filter((id) => id !== lessonId),
      );
      return { prev };
    },
    onSuccess: () => {
      toast.success("レッスンを未完了に戻しました");
      queryClient.invalidateQueries({ queryKey: orpc.lessons.getCompletedIds.queryOptions({ input: { courseId } }).queryKey });
    },
    onError: (err, _vars, ctx) => {
      if (ctx?.prev !== undefined) {
        queryClient.setQueryData(orpc.lessons.getCompletedIds.queryOptions({ input: { courseId } }).queryKey, ctx.prev);
      }
      toast.error(`エラー: ${err.message}`);
    },
  });

  const addBookmarkMutation = useMutation({
    ...orpc.bookmarks.add.mutationOptions(),
    onSuccess: () => {
      toast.success("ブックマークに追加しました 🔖");
      queryClient.invalidateQueries();
    },
    onError: () => toast.error("ブックマークの追加に失敗しました"),
  });

  const removeBookmarkMutation = useMutation({
    ...orpc.bookmarks.remove.mutationOptions(),
    onSuccess: () => {
      toast.success("ブックマークを削除しました");
      queryClient.invalidateQueries();
    },
    onError: () => toast.error("ブックマークの削除に失敗しました"),
  });

  const isBookmarked = myBookmarks.some((b) => b.targetId === lessonId);
  const bookmarkId = myBookmarks.find((b) => b.targetId === lessonId)?.id;

  const handleBookmark = () => {
    if (isBookmarked && bookmarkId) {
      removeBookmarkMutation.mutate({ bookmarkId });
    } else {
      addBookmarkMutation.mutate({ type: "lesson", targetId: lessonId });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAF7F2" }}>
        <div className="text-4xl animate-bounce">☕</div>
      </div>
    );
  }

  if (!lesson) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#FAF7F2" }}>
        <p className="text-4xl">🔍</p>
        <p className="text-lg font-bold" style={{ color: "#6B3D1E" }}>レッスンが見つかりません</p>
        <Link to="/courses/$courseId" params={{ courseId }} className="text-sm font-extrabold" style={{ color: "#2C1A0E" }}>
          ← コースへ戻る
        </Link>
      </div>
    );
  }

  const isDone = completedIds.includes(lessonId);
  // 前後レッスン
  const lessons = course?.lessons ?? [];
  const currentIdx = lessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentIdx > 0 ? lessons[currentIdx - 1] : null;
  const nextLesson = currentIdx < lessons.length - 1 ? lessons[currentIdx + 1] : null;

  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2", fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-4 py-8 lg:grid lg:grid-cols-[280px_1fr] lg:gap-8 lg:items-start">

        {/* PC サイドバー */}
        <aside className="hidden lg:block sticky top-8">
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: "2px solid #2C1A0E",
              boxShadow: "4px 4px 0 #2C1A0E",
            }}
          >
            {/* サイドバーヘッダー */}
            <div className="px-4 py-3" style={{ background: "#2C1A0E" }}>
              <div className="text-xs font-black mb-0.5" style={{ color: "#C49A6C" }}>
                {course?.title ?? "コース"}
              </div>
              <div className="text-xs font-bold" style={{ color: "rgba(245,239,224,0.6)" }}>
                {completedIds.filter((id) => lessons.some((l) => l.id === id)).length} / {lessons.length} 完了
              </div>
              {/* 進捗バー */}
              <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.2)" }}>
                <div
                  className="h-full rounded-full"
                  style={{
                    width: lessons.length > 0
                      ? `${Math.round((completedIds.filter((id) => lessons.some((l) => l.id === id)).length / lessons.length) * 100)}%`
                      : "0%",
                    background: "#C49A6C",
                  }}
                />
              </div>
            </div>
            {/* レッスン一覧 */}
            <div className="max-h-[70vh] overflow-y-auto" style={{ background: "#FAF7F2" }}>
              {lessons.map((l, idx) => {
                const isDoneSide = completedIds.includes(l.id);
                const isCurrent = l.id === lessonId;
                return (
                  <Link
                    key={l.id}
                    to="/courses/$courseId/lessons/$lessonId"
                    params={{ courseId, lessonId: l.id }}
                    className="flex items-center gap-3 px-4 py-3 no-underline transition-colors duration-100"
                    style={{
                      background: isCurrent ? "#E8C99A" : "transparent",
                      borderBottom: "1px solid rgba(44,26,14,0.08)",
                    }}
                  >
                    <div
                      className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black"
                      style={{
                        background: isDoneSide ? "#2C1A0E" : isCurrent ? "#C49A6C" : "#E8C99A",
                        color: isDoneSide ? "#F5EFE0" : "#2C1A0E",
                      }}
                    >
                      {isDoneSide ? "✓" : idx + 1}
                    </div>
                    <span
                      className="text-xs font-extrabold leading-tight line-clamp-2"
                      style={{ color: isCurrent ? "#2C1A0E" : isDoneSide ? "#6B3D1E" : "#2C1A0E" }}
                    >
                      {l.title}
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </aside>

        {/* メインコンテンツ */}
        <div className="min-w-0">
          <div className="max-w-3xl">
        {/* パンくず */}
        <nav className="flex items-center gap-2 text-xs font-bold mb-6" style={{ color: "#C49A6C" }}>
          <Link to="/courses" className="no-underline hover:underline" style={{ color: "#C49A6C" }}>
            コース
          </Link>
          <span>›</span>
          <Link to="/courses/$courseId" params={{ courseId }} className="no-underline hover:underline" style={{ color: "#C49A6C" }}>
            {course?.title ?? "コース詳細"}
          </Link>
          <span>›</span>
          <span style={{ color: "#2C1A0E" }}>{lesson.title}</span>
        </nav>

        {/* レッスンヘッダー */}
        <div
          className="rounded-2xl px-6 py-5 mb-6"
          style={{
            background: "#2C1A0E",
            border: "2.5px solid #2C1A0E",
            boxShadow: "5px 5px 0 #6B3D1E",
          }}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              {lesson.tags && lesson.tags.length > 0 && (
                <div className="flex gap-1 flex-wrap mb-3">
                  {lesson.tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="text-xs font-black px-2 py-0.5 rounded-lg"
                      style={{ background: "#E8C99A", color: "#6B3D1E" }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <h1
                className="text-2xl font-black text-white mb-2"
                style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
              >
                {lesson.title}
              </h1>
              <div className="flex items-center gap-3 text-xs font-bold" style={{ color: "#C49A6C" }}>
                <span>⏱ {lesson.durationMinutes}分</span>
                {isDone && (
                  <span
                    className="px-2 py-0.5 rounded-lg font-black"
                    style={{ background: "#C49A6C", color: "#2C1A0E" }}
                  >
                    ✓ 完了済み
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* レッスン本文 (Markdown) */}
        <div
          className="rounded-2xl px-8 py-7 mb-6"
          style={{
            background: "#fff",
            border: "2px solid #2C1A0E",
            boxShadow: "4px 4px 0 #2C1A0E",
          }}
        >
          <div className="prose prose-sm max-w-none" style={{ color: "#2C1A0E" }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ children }) => (
                  <h1
                    className="text-2xl font-black mb-4 mt-6"
                    style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
                  >
                    {children}
                  </h1>
                ),
                h2: ({ children }) => (
                  <h2
                    className="text-xl font-black mb-3 mt-5"
                    style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
                  >
                    {children}
                  </h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-extrabold mb-2 mt-4" style={{ color: "#2C1A0E" }}>
                    {children}
                  </h3>
                ),
                p: ({ children }) => (
                  <p className="text-sm font-bold leading-relaxed mb-4" style={{ color: "#2C1A0E" }}>
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-black" style={{ color: "#6B3D1E" }}>{children}</strong>
                ),
                ul: ({ children }) => (
                  <ul className="list-none space-y-2 mb-4 pl-0">{children}</ul>
                ),
                li: ({ children }) => (
                  <li className="flex items-start gap-2 text-sm font-bold" style={{ color: "#2C1A0E" }}>
                    <span style={{ color: "#C49A6C" }}>☕</span>
                    <span>{children}</span>
                  </li>
                ),
                blockquote: ({ children }) => (
                  <blockquote
                    className="pl-4 py-2 my-4 rounded-r-xl"
                    style={{
                      borderLeft: "4px solid #C49A6C",
                      background: "#F5EFE0",
                      color: "#6B3D1E",
                    }}
                  >
                    {children}
                  </blockquote>
                ),
                code: ({ children }) => (
                  <code
                    className="px-1.5 py-0.5 rounded text-xs font-mono"
                    style={{ background: "#F5EFE0", color: "#6B3D1E", border: "1px solid #E8C99A" }}
                  >
                    {children}
                  </code>
                ),
                table: ({ children }) => (
                  <div className="overflow-x-auto my-4">
                    <table
                      className="w-full text-sm border-collapse"
                      style={{ border: "2px solid #2C1A0E", borderRadius: "8px", overflow: "hidden" }}
                    >
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead style={{ background: "#2C1A0E" }}>{children}</thead>
                ),
                tbody: ({ children }) => (
                  <tbody>{children}</tbody>
                ),
                tr: ({ children }) => (
                  <tr style={{ borderBottom: "1px solid #E8C99A" }}>{children}</tr>
                ),
                th: ({ children }) => (
                  <th
                    className="px-4 py-2 text-left text-xs font-black"
                    style={{ color: "#F5EFE0" }}
                  >
                    {children}
                  </th>
                ),
                td: ({ children }) => (
                  <td
                    className="px-4 py-2 text-xs font-bold"
                    style={{ color: "#2C1A0E", background: "#FAF7F2", borderRight: "1px solid #E8C99A" }}
                  >
                    {children}
                  </td>
                ),
              }}
            >
              {lesson.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {session && !isDone && (
            <button
              type="button"
              onClick={() => completeMutation.mutate({ lessonId })}
              disabled={completeMutation.isPending}
              className="flex-1 py-3 text-sm font-black rounded-2xl cursor-pointer transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "#2C1A0E",
                border: "2.5px solid #2C1A0E",
                boxShadow: "4px 4px 0 #6B3D1E",
                color: "#F5EFE0",
              }}
            >
              {completeMutation.isPending ? "完了中..." : "✓ このレッスンを完了する"}
            </button>
          )}
          {session && isDone && (
            <>
              <button
                type="button"
                disabled
                className="flex-1 py-3 text-sm font-black rounded-2xl cursor-not-allowed"
                style={{
                  background: "#C49A6C",
                  border: "2.5px solid #2C1A0E",
                  boxShadow: "4px 4px 0 #2C1A0E",
                  color: "#2C1A0E",
                  opacity: 1,
                }}
              >
                ✓ 完了済み
              </button>
              <button
                type="button"
                onClick={() => uncompleteMutation.mutate({ lessonId })}
                disabled={uncompleteMutation.isPending}
                className="px-5 py-3 text-sm font-black rounded-2xl cursor-pointer transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  background: "#F5EFE0",
                  border: "2px solid #2C1A0E",
                  boxShadow: "3px 3px 0 #2C1A0E",
                  color: "#2C1A0E",
                }}
              >
                {uncompleteMutation.isPending ? "処理中..." : "↩ 未完了に戻す"}
              </button>
            </>
          )}
          {session && isDone && lesson.hasQuiz && (
            <Link
              to="/quiz/$quizId"
              params={{ quizId: lessonId }}
              className="flex-1 py-3 text-sm font-black text-center rounded-2xl no-underline transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: "#C49A6C",
                border: "2.5px solid #2C1A0E",
                boxShadow: "4px 4px 0 #2C1A0E",
                color: "#2C1A0E",
              }}
            >
              🎯 クイズに挑戦
            </Link>
          )}
          {!session && (
            <Link
              to="/login"
              className="flex-1 py-3 text-sm font-black text-center rounded-2xl no-underline transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: "#2C1A0E",
                border: "2.5px solid #2C1A0E",
                boxShadow: "4px 4px 0 #6B3D1E",
                color: "#F5EFE0",
              }}
            >
              ログインして進捗を記録する ✨
            </Link>
          )}
          {session && (
            <button
              type="button"
              onClick={handleBookmark}
              disabled={addBookmarkMutation.isPending || removeBookmarkMutation.isPending}
              className="px-6 py-3 text-sm font-black rounded-2xl cursor-pointer transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50"
              style={{
                background: isBookmarked ? "#E8C99A" : "#F5EFE0",
                border: "2px solid #2C1A0E",
                boxShadow: "3px 3px 0 #2C1A0E",
                color: "#2C1A0E",
              }}
            >
              {isBookmarked ? "🔖 ブックマーク済み" : "🔖 ブックマーク"}
            </button>
          )}
        </div>

        {/* 前後ナビ */}
        <div className="flex items-center justify-between gap-4">
          {prevLesson ? (
            <Link
              to="/courses/$courseId/lessons/$lessonId"
              params={{ courseId, lessonId: prevLesson.id }}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl no-underline text-sm font-extrabold transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: "#F5EFE0",
                border: "2px solid #2C1A0E",
                boxShadow: "3px 3px 0 #2C1A0E",
                color: "#2C1A0E",
              }}
            >
              ‹ {prevLesson.title}
            </Link>
          ) : <div />}

          {nextLesson ? (
            <Link
              to="/courses/$courseId/lessons/$lessonId"
              params={{ courseId, lessonId: nextLesson.id }}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl no-underline text-sm font-extrabold transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: "#F5EFE0",
                border: "2px solid #2C1A0E",
                boxShadow: "3px 3px 0 #2C1A0E",
                color: "#2C1A0E",
              }}
            >
              {nextLesson.title} ›
            </Link>
          ) : (
            <Link
              to="/courses/$courseId"
              params={{ courseId }}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl no-underline text-sm font-extrabold transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: "#C49A6C",
                border: "2px solid #2C1A0E",
                boxShadow: "3px 3px 0 #2C1A0E",
                color: "#2C1A0E",
              }}
            >
              コース完了 🎉
            </Link>
          )}
        </div>
          </div>
        </div>
      </div>
    </div>
  );
}
