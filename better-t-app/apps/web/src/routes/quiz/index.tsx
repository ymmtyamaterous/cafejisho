import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/quiz/")({
  component: QuizIndexPage,
});

function QuizIndexPage() {
  const { data: courses = [], isLoading } = useQuery(
    orpc.courses.list.queryOptions({ input: {} }),
  );

  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2", fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* ヘッダー */}
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
            🎯 クイズ
          </div>
          <h1
            className="text-4xl font-black mb-2"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
          >
            クイズで腕試し！
          </h1>
          <p className="text-sm font-bold" style={{ color: "#6B3D1E" }}>
            各コースのレッスンを受講してクイズに挑戦しよう。理解度を確認しながら学べます。
          </p>
        </div>

        {/* ステップ説明 */}
        <div
          className="rounded-2xl px-7 py-6 mb-8"
          style={{
            background: "#2C1A0E",
            border: "2.5px solid #2C1A0E",
            boxShadow: "5px 5px 0 #6B3D1E",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            {[
              { icon: "📚", step: "STEP 1", label: "コースを選ぶ" },
              { icon: "📖", step: "STEP 2", label: "レッスンを読む" },
              { icon: "🎯", step: "STEP 3", label: "クイズに挑戦" },
            ].map(({ icon, step, label }) => (
              <div key={step} className="flex flex-col items-center gap-2">
                <span className="text-4xl">{icon}</span>
                <span className="text-xs font-black px-3 py-0.5 rounded-xl" style={{ background: "#3D2412", color: "#C49A6C" }}>{step}</span>
                <span className="text-sm font-extrabold" style={{ color: "#E8C99A" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* コース一覧 */}
        <h2
          className="text-2xl font-black mb-4"
          style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
        >
          コースからクイズを探す
        </h2>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: "#E8C99A" }} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {courses.map((course) => (
              <Link
                key={course.id}
                to="/courses/$courseId"
                params={{ courseId: course.id }}
                className="flex items-center gap-4 px-6 py-5 rounded-2xl no-underline transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
                style={{
                  background: "#fff",
                  border: "2px solid #2C1A0E",
                  boxShadow: "4px 4px 0 #2C1A0E",
                }}
              >
                <span className="text-4xl">{course.thumbnailEmoji}</span>
                <div className="flex-1">
                  <div className="text-sm font-black" style={{ color: "#2C1A0E" }}>{course.title}</div>
                  <div className="text-xs font-bold mt-1" style={{ color: "#6B3D1E" }}>
                    {course.lessonCount} レッスン・各レッスンにクイズ収録
                  </div>
                </div>
                <span
                  className="text-xs font-black px-3 py-1 rounded-xl"
                  style={{
                    background: course.isPremium ? "#C49A6C" : "#E8C99A",
                    color: "#2C1A0E",
                    border: "1.5px solid #2C1A0E",
                  }}
                >
                  {course.isPremium ? "⭐ プレミアム" : "🎉 無料"}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
