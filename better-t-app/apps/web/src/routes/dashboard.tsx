import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/dashboard")({
  component: RouteComponent,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({
        to: "/login",
        throw: true,
      });
    }
    return { session };
  },
});

function RouteComponent() {
  const { session } = Route.useRouteContext();

  const { data: stats } = useQuery(orpc.progress.getStats.queryOptions());
  const { data: progress } = useQuery(orpc.progress.getMine.queryOptions());
  const { data: courses = [] } = useQuery(orpc.courses.list.queryOptions({ input: {} }));

  const user = session.data?.user;

  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2", fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* ウェルカム */}
        <div className="mb-8">
          <div
            className="inline-flex items-center gap-2 text-xs font-black px-4 py-2 rounded-2xl mb-4"
            style={{
              background: "#E8C99A",
              border: "2px solid #2C1A0E",
              boxShadow: "2px 2px 0 #2C1A0E",
              color: "#2C1A0E",
            }}
          >
            📊 マイダッシュボード
          </div>
          <h1
            className="text-4xl font-black mb-2"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
          >
            おかえり、{user?.name} さん ☕
          </h1>
          <p className="text-sm font-bold" style={{ color: "#6B3D1E" }}>
            今日もコーヒーについて学ぼう！
          </p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
          <StatCard
            icon="✅"
            value={stats?.totalCompletedLessons ?? 0}
            label="完了レッスン数"
            bg="#E8C99A"
          />
          <StatCard
            icon="🎯"
            value={`${stats?.averageQuizScore ?? 0}%`}
            label="平均クイズスコア"
            bg="#F5EFE0"
          />
          <StatCard
            icon="📚"
            value={courses.reduce((s, c) => s + c.lessonCount, 0)}
            label="総レッスン数"
            bg="#C49A6C"
          />
        </div>

        {/* コース進捗 */}
        <div className="mb-10">
          <h2
            className="text-2xl font-black mb-4"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
          >
            コース進捗
          </h2>
          <div className="space-y-4">
            {courses.map((course) => {
              const cp = progress?.courseProgress?.find((p) => p.courseId === course.id);
              const pct = cp?.percentage ?? 0;
              return (
                <div
                  key={course.id}
                  className="rounded-2xl px-6 py-5"
                  style={{
                    background: "#fff",
                    border: "2px solid #2C1A0E",
                    boxShadow: "3px 3px 0 #2C1A0E",
                  }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-base font-extrabold" style={{ color: "#2C1A0E" }}>
                        {course.title}
                      </div>
                      <div className="text-xs font-bold" style={{ color: "#C49A6C" }}>
                        {cp?.completedCount ?? 0} / {cp?.totalCount ?? course.lessonCount} レッスン
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-black" style={{ color: "#2C1A0E" }}>
                        {pct}%
                      </span>
                      <Link
                        to="/courses/$courseId"
                        params={{ courseId: course.id }}
                        className="px-4 py-2 text-xs font-black rounded-xl no-underline transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
                        style={{
                          background: "#2C1A0E",
                          border: "2px solid #2C1A0E",
                          boxShadow: "2px 2px 0 #6B3D1E",
                          color: "#F5EFE0",
                        }}
                      >
                        {pct > 0 ? "続ける →" : "始める →"}
                      </Link>
                    </div>
                  </div>
                  {/* 進捗バー */}
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: "#F5EFE0", border: "1.5px solid #2C1A0E" }}>
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct}%`, background: pct === 100 ? "#C49A6C" : "#2C1A0E" }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* クイズ結果 */}
        {progress?.quizResults && progress.quizResults.length > 0 && (
          <div>
            <h2
              className="text-2xl font-black mb-4"
              style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
            >
              最近のクイズ結果
            </h2>
            <div className="space-y-3">
              {progress.quizResults.slice(0, 5).map((qr, idx) => {
                const score = qr.total > 0 ? Math.round((qr.score / qr.total) * 100) : 0;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-5 py-4 rounded-2xl"
                    style={{
                      background: "#fff",
                      border: "2px solid #2C1A0E",
                      boxShadow: "2px 2px 0 #2C1A0E",
                    }}
                  >
                    <div>
                      <div className="text-sm font-extrabold" style={{ color: "#2C1A0E" }}>
                        クイズ #{idx + 1}
                      </div>
                      <div className="text-xs font-bold" style={{ color: "#C49A6C" }}>
                        {qr.score} / {qr.total} 問正解
                      </div>
                    </div>
                    <div
                      className="text-2xl font-black"
                      style={{ color: score >= 80 ? "#2C1A0E" : score >= 50 ? "#C49A6C" : "#6B3D1E" }}
                    >
                      {score}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, value, label, bg }: { icon: string; value: string | number; label: string; bg: string }) {
  return (
    <div
      className="rounded-2xl px-6 py-5 text-center transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
      style={{
        background: bg,
        border: "2.5px solid #2C1A0E",
        boxShadow: "4px 4px 0 #2C1A0E",
      }}
    >
      <div className="text-2xl mb-1">{icon}</div>
      <div
        className="text-4xl font-black leading-none mb-1"
        style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
      >
        {value}
      </div>
      <div className="text-xs font-extrabold opacity-70" style={{ color: "#2C1A0E" }}>
        {label}
      </div>
    </div>
  );
}

