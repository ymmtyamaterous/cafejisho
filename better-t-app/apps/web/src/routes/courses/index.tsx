import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/courses/")({
  component: CoursesPage,
});

const COURSE_BG: Record<string, string> = {
  beginner: "#3D2412",
  intermediate: "#2A1A08",
  advanced: "#4A2818",
};
const COURSE_EMOJI: Record<string, string> = {
  beginner: "🌱",
  intermediate: "🫘",
  advanced: "🏆",
};
const LEVEL_LABEL: Record<string, string> = {
  beginner: "入門",
  intermediate: "中級",
  advanced: "上級",
};
const LEVEL_FILTER = [
  { value: "", label: "すべて" },
  { value: "beginner", label: "🌱 入門" },
  { value: "intermediate", label: "🫘 中級" },
  { value: "advanced", label: "🏆 上級" },
] as const;

function CoursesPage() {
  const [level, setLevel] = useState<string>("");

  const { data: courses = [], isLoading } = useQuery(
    orpc.courses.list.queryOptions({
      input: level ? { level: level as "beginner" | "intermediate" | "advanced" } : {},
    }),
  );

  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2", fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* ページタイトル */}
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
            📚 学習コース
          </div>
          <h1
            className="text-4xl font-black mb-2"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
          >
            コース一覧
          </h1>
          <p className="text-sm font-bold" style={{ color: "#6B3D1E" }}>
            コーヒーの知識をステップアップしながら学ぼう！
          </p>
        </div>

        {/* レベルフィルター */}
        <div className="flex gap-2 flex-wrap mb-8">
          {LEVEL_FILTER.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setLevel(value)}
              className="px-4 py-2 text-sm font-extrabold rounded-2xl cursor-pointer transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: level === value ? "#2C1A0E" : "#F5EFE0",
                border: "2px solid #2C1A0E",
                boxShadow: level === value ? "2px 2px 0 #6B3D1E" : "2px 2px 0 #2C1A0E",
                color: level === value ? "#F5EFE0" : "#2C1A0E",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* コースグリッド */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 rounded-2xl animate-pulse" style={{ background: "#E8C99A" }} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {courses.map((c) => (
              <Link
                key={c.id}
                to="/courses/$courseId"
                params={{ courseId: c.id }}
                className="rounded-2xl overflow-hidden no-underline block transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
                style={{
                  background: COURSE_BG[c.level] ?? "#3D2412",
                  border: "2.5px solid rgba(255,255,255,0.15)",
                  boxShadow: "5px 5px 0 rgba(0,0,0,0.35)",
                }}
              >
                {/* カードヘッダー */}
                <div className="px-5 py-5" style={{ borderBottom: "1.5px solid rgba(196,154,108,0.15)" }}>
                  <span className="text-4xl block mb-2">{COURSE_EMOJI[c.level] ?? "☕"}</span>
                  <span
                    className="inline-block text-xs font-black px-2 py-0.5 rounded-lg mb-2"
                    style={{ border: "1.5px solid #C49A6C", color: "#C49A6C" }}
                  >
                    {LEVEL_LABEL[c.level] ?? c.level}
                  </span>
                  <div
                    className="text-lg font-black leading-snug"
                    style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#F5EFE0" }}
                  >
                    {c.title}
                  </div>
                </div>

                {/* カードボディ */}
                <div className="px-5 py-4">
                  <p className="text-xs font-bold leading-relaxed mb-4 opacity-70" style={{ color: "#E8C99A" }}>
                    {c.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold opacity-70 block" style={{ color: "#C49A6C" }}>
                        {c.lessonCount}レッスン · {c.durationMinutes}分
                      </span>
                    </div>
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all duration-150"
                      style={{ border: "2px solid #C49A6C", color: "#C49A6C" }}
                    >
                      ›
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {!isLoading && courses.length === 0 && (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-lg font-bold" style={{ color: "#6B3D1E" }}>
              該当するコースが見つかりませんでした
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
