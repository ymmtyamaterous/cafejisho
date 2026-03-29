import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/courses/$courseId/")({
  component: CourseDetailPage,
});

const LEVEL_LABEL: Record<string, string> = {
  beginner: "入門 · BEGINNER",
  intermediate: "中級 · INTERMEDIATE",
  advanced: "上級 · ADVANCED",
};

function CourseDetailPage() {
  const { courseId } = Route.useParams();
  const { data: session } = authClient.useSession();

  const { data: course, isLoading } = useQuery(
    orpc.courses.getById.queryOptions({ input: { courseId } }),
  );

  const { data: completedIds = [] } = useQuery({
    ...orpc.lessons.getCompletedIds.queryOptions({ input: { courseId } }),
    enabled: !!session,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAF7F2" }}>
        <div className="text-4xl animate-bounce">☕</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#FAF7F2" }}>
        <p className="text-4xl">🔍</p>
        <p className="text-lg font-bold" style={{ color: "#6B3D1E" }}>
          コースが見つかりませんでした
        </p>
        <Link to="/courses" className="text-sm font-extrabold" style={{ color: "#2C1A0E" }}>
          ← コース一覧へ戻る
        </Link>
      </div>
    );
  }

  const completedCount = completedIds.length;
  const progressPct = course.lessonCount > 0 ? Math.round((completedCount / course.lessonCount) * 100) : 0;

  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2", fontFamily: "'Nunito', sans-serif" }}>
      {/* ヒーローバナー */}
      <div className="px-6 py-10" style={{ background: "#2C1A0E" }}>
        <div className="max-w-4xl mx-auto">
          <Link
            to="/courses"
            className="inline-flex items-center gap-1 text-xs font-bold mb-6 no-underline transition-opacity hover:opacity-75"
            style={{ color: "#C49A6C" }}
          >
            ← コース一覧
          </Link>
          <div className="flex items-start gap-6">
            <span className="text-6xl">
              {course.level === "beginner" ? "🌱" : course.level === "intermediate" ? "🫘" : "🏆"}
            </span>
            <div>
              <span
                className="inline-block text-xs font-black px-2 py-0.5 rounded-lg mb-3"
                style={{ border: "1.5px solid #C49A6C", color: "#C49A6C" }}
              >
                {LEVEL_LABEL[course.level] ?? course.level}
              </span>
              <h1
                className="text-3xl font-black text-white mb-2"
                style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
              >
                {course.title}
              </h1>
              <p className="text-sm font-bold opacity-70 mb-4" style={{ color: "#E8C99A" }}>
                {course.description}
              </p>
              <div className="flex items-center gap-4 text-xs font-extrabold" style={{ color: "#C49A6C" }}>
                <span>📚 {course.lessonCount}レッスン</span>
                <span>⏱ {course.durationMinutes}分</span>
                {!course.isPremium && <span className="px-2 py-0.5 rounded" style={{ background: "#C49A6C", color: "#2C1A0E" }}>無料</span>}
                {course.isPremium && <span className="px-2 py-0.5 rounded" style={{ background: "#6B3D1E", color: "#E8C99A", border: "1px solid #C49A6C" }}>⭐ プレミアム</span>}
              </div>
            </div>
          </div>

          {/* 進捗バー（ログイン時） */}
          {session && course.lessonCount > 0 && (
            <div className="mt-6">
              <div className="flex items-center justify-between text-xs font-extrabold mb-2" style={{ color: "#C49A6C" }}>
                <span>進捗: {completedCount} / {course.lessonCount} レッスン完了</span>
                <span>{progressPct}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(196,154,108,0.2)" }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${progressPct}%`, background: "#C49A6C" }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* レッスン一覧 */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2
          className="text-2xl font-black mb-6"
          style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
        >
          レッスン一覧
        </h2>

        <div className="space-y-3">
          {course.lessons.map((lesson, idx) => {
            const isDone = completedIds.includes(lesson.id);
            return (
              <Link
                key={lesson.id}
                to="/courses/$courseId/lessons/$lessonId"
                params={{ courseId, lessonId: lesson.id }}
                className="flex items-center gap-4 px-5 py-4 rounded-2xl no-underline transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 block"
                style={{
                  background: isDone ? "#F5EFE0" : "#fff",
                  border: "2px solid #2C1A0E",
                  boxShadow: "3px 3px 0 #2C1A0E",
                }}
              >
                {/* 番号 or チェック */}
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{
                    background: isDone ? "#2C1A0E" : "#F5EFE0",
                    border: "2px solid #2C1A0E",
                    color: isDone ? "#F5EFE0" : "#2C1A0E",
                  }}
                >
                  {isDone ? "✓" : idx + 1}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-sm font-extrabold truncate" style={{ color: "#2C1A0E" }}>
                    {lesson.title}
                  </div>
                  {lesson.tags && lesson.tags.length > 0 && (
                    <div className="flex gap-1 mt-1 flex-wrap">
                      {lesson.tags.slice(0, 3).map((tag: string) => (
                        <span
                          key={tag}
                          className="text-xs font-bold px-2 py-0.5 rounded-lg"
                          style={{ background: "#E8C99A", color: "#6B3D1E" }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <span className="text-xs font-bold" style={{ color: "#C49A6C" }}>
                    {lesson.durationMinutes}分
                  </span>
                  <span style={{ color: "#2C1A0E" }}>›</span>
                </div>
              </Link>
            );
          })}
        </div>

        {/* CTAボタン */}
        {course.lessons.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Link
              to="/courses/$courseId/lessons/$lessonId"
              params={{ courseId, lessonId: course.lessons[0].id }}
              className="px-8 py-3 text-base font-black rounded-2xl no-underline transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: "#2C1A0E",
                border: "2.5px solid #2C1A0E",
                boxShadow: "4px 4px 0 #6B3D1E",
                color: "#F5EFE0",
              }}
            >
              {completedCount > 0 ? "続きから学ぶ →" : "コースを始める 🚀"}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
