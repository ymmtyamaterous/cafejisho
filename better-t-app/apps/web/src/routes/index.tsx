import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";

import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/")({
  component: HomeComponent,
});

// ── カルーセルデータ ──────────────────────────────────────
const SLIDES = [
  {
    tag: "🌱 今日のレッスン",
    emoji: "☕",
    title: "エスプレッソの\n抽出圧力とは？",
    desc: "9気圧・25秒——たったこれだけで極上の一杯が生まれる。圧力が生む『クレマ』の秘密を学ぼう。",
    meta: "入門コース · レッスン3",
    bg: "#FFFDF8",
  },
  {
    tag: "🌍 産地ピックアップ",
    emoji: "🫘",
    title: "エチオピア・\nイルガチェフェ",
    desc: "ブルーベリーとジャスミンのような香り。コーヒー発祥の地が生む、世界屈指のフローラル豆。",
    meta: "産地辞典 · エチオピア",
    bg: "#FDF8F0",
  },
  {
    tag: "🔬 焙煎の科学",
    emoji: "🔥",
    title: "浅煎り vs 深煎り\nどっちがいい？",
    desc: "温度と時間が決める味のすべて。メイラード反応からカラメル化まで、焙煎の化学を解説。",
    meta: "中級コース · レッスン2",
    bg: "#F8F3EA",
  },
  {
    tag: "🎯 今日のクイズ",
    emoji: "🏆",
    title: "カッピングスコア\n80点以上って何？",
    desc: "SCAが定めるスペシャルティコーヒーの基準。10項目の評価で決まる『品質の証明』とは。",
    meta: "上級コース · レッスン1",
    bg: "#F5EFE0",
  },
];

// ── ヒーローカルーセル ────────────────────────────────────
function HeroCarousel() {
  const [cur, setCur] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const go = (n: number) => setCur((prev) => (n + SLIDES.length) % SLIDES.length);

  useEffect(() => {
    timerRef.current = setInterval(() => setCur((c) => (c + 1) % SLIDES.length), 4000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const slide = SLIDES[cur];

  return (
    <div className="relative w-full">
      {/* カード */}
      <div
        className="rounded-3xl overflow-hidden"
        style={{
          border: "2.5px solid #2C1A0E",
          boxShadow: "7px 7px 0 #2C1A0E",
          background: slide.bg,
          minHeight: 260,
        }}
      >
        <div className="p-7 flex flex-col gap-3">
          <span
            className="inline-flex items-center gap-1.5 text-xs font-black rounded-xl px-3 py-1 w-fit"
            style={{
              background: "#E8C99A",
              border: "1.5px solid #2C1A0E",
              color: "#2C1A0E",
            }}
          >
            {slide.tag}
          </span>
          <span className="text-5xl leading-none">{slide.emoji}</span>
          <div
            className="text-lg font-black leading-snug"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
          >
            {slide.title.split("\n").map((line, i) => (
              <span key={i}>
                {line}
                {i < slide.title.split("\n").length - 1 && <br />}
              </span>
            ))}
          </div>
          <p className="text-xs font-bold leading-relaxed opacity-75" style={{ color: "#6B3D1E" }}>
            {slide.desc}
          </p>
          <div
            className="flex items-center justify-between pt-3 mt-1"
            style={{ borderTop: "1.5px solid rgba(107,61,30,0.12)" }}
          >
            <span className="text-xs font-extrabold" style={{ color: "#C49A6C" }}>
              {slide.meta}
            </span>
            <Link
              to="/courses"
              className="px-3 py-1.5 text-xs font-black text-cream rounded-xl no-underline transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: "#2C1A0E",
                border: "2px solid #2C1A0E",
                boxShadow: "2px 2px 0 #6B3D1E",
              }}
            >
              学ぶ →
            </Link>
          </div>
        </div>
      </div>

      {/* 矢印 */}
      <button
        type="button"
        onClick={() => go(cur - 1)}
        className="absolute top-1/2 -left-5 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-base cursor-pointer transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-px z-10"
        style={{
          background: "#fff",
          border: "2px solid #2C1A0E",
          boxShadow: "2px 2px 0 #2C1A0E",
          color: "#2C1A0E",
        }}
        aria-label="前のスライド"
      >
        ‹
      </button>
      <button
        type="button"
        onClick={() => go(cur + 1)}
        className="absolute top-1/2 -right-5 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center text-base cursor-pointer transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-px z-10"
        style={{
          background: "#fff",
          border: "2px solid #2C1A0E",
          boxShadow: "2px 2px 0 #2C1A0E",
          color: "#2C1A0E",
        }}
        aria-label="次のスライド"
      >
        ›
      </button>

      {/* ドット */}
      <div className="flex justify-center gap-1.5 mt-4">
        {SLIDES.map((_, i) => (
          <button
            type="button"
            key={i}
            onClick={() => go(i)}
            className="w-2 h-2 rounded-full transition-all duration-200 cursor-pointer"
            style={{
              background: i === cur ? "#2C1A0E" : "rgba(107,61,30,0.2)",
              border: "1.5px solid #2C1A0E",
              transform: i === cur ? "scale(1.2)" : "scale(1)",
            }}
            aria-label={`スライド${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

// ── コースカード ──────────────────────────────────────────
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
  beginner: "入門 · BEGINNER",
  intermediate: "中級 · INTERMEDIATE",
  advanced: "上級 · ADVANCED",
};

// ── メインページ ──────────────────────────────────────────
function HomeComponent() {
  const coursesQuery = useQuery(orpc.courses.list.queryOptions({ input: {} }));
  const courses = coursesQuery.data ?? [];

  return (
    <div
      className="relative"
      style={{
        background: "#FAF7F2",
        fontFamily: "'Nunito', sans-serif",
      }}
    >
      {/* ── ヒーローセクション ── */}
      <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center px-6 md:px-10 py-10 max-w-6xl mx-auto">
        {/* 左カラム */}
        <div>
          <div
            className="inline-flex items-center gap-1.5 text-xs font-black rounded-2xl px-4 py-2 mb-5"
            style={{
              background: "#E8C99A",
              border: "2px solid #2C1A0E",
              boxShadow: "2px 2px 0 #2C1A0E",
              color: "#2C1A0E",
            }}
          >
            ☕ コーヒーを楽しく学ぼう！
          </div>

          <h1
            className="text-4xl md:text-5xl font-black leading-tight mb-4"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
          >
            コーヒーって
            <br />
            <span
              className="px-2 rounded"
              style={{ background: "#C49A6C" }}
            >
              こんなに
            </span>
            <br />
            <span
              className="px-2 rounded"
              style={{ background: "#6B3D1E", color: "#F5EFE0" }}
            >
              おもしろい！
            </span>
          </h1>

          <p className="text-sm font-bold leading-relaxed mb-8 max-w-sm" style={{ color: "#6B3D1E" }}>
            豆・産地・焙煎・抽出法まで——
            <br />
            ゲーム感覚でコーヒーの知識をGETしよう！
          </p>

          <div className="flex gap-3 flex-wrap">
            <Link
              to="/courses"
              className="px-6 py-3 text-sm font-black text-cream rounded-2xl no-underline transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: "#2C1A0E",
                border: "2.5px solid #2C1A0E",
                boxShadow: "4px 4px 0 #6B3D1E",
              }}
            >
              無料で学ぶ 🚀
            </Link>
            <Link
              to="/quiz"
              className="px-6 py-3 text-sm font-black rounded-2xl no-underline transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: "#F5EFE0",
                border: "2.5px solid #2C1A0E",
                boxShadow: "4px 4px 0 #2C1A0E",
                color: "#2C1A0E",
              }}
            >
              クイズに挑戦 🎯
            </Link>
          </div>
        </div>

        {/* 右カラム: カルーセル */}
        <div className="px-6">
          <HeroCarousel />
        </div>
      </section>

      {/* ── 統計セクション ── */}
      <section className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4 px-6 md:px-10 pb-10 max-w-6xl mx-auto">
        {[
          { num: "120+", label: "☕ コーヒー用語", bg: "#E8C99A" },
          { num: "30", label: "🌍 産地・農園", bg: "#F5EFE0" },
          { num: "42", label: "📚 レッスン", bg: "#C49A6C" },
          { num: "無料", label: "🎉 基礎コース全部", bg: "#2C1A0E", dark: true },
        ].map(({ num, label, bg, dark }) => (
          <div
            key={label}
            className="rounded-2xl p-5 text-center cursor-default transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
            style={{
              background: bg,
              border: "2.5px solid #2C1A0E",
              boxShadow: "4px 4px 0 #2C1A0E",
            }}
          >
            <div
              className="text-4xl font-black leading-none mb-1"
              style={{
                fontFamily: "'Zen Maru Gothic', sans-serif",
                color: dark ? "#E8C99A" : "#2C1A0E",
              }}
            >
              {num}
            </div>
            <div
              className="text-xs font-extrabold opacity-70"
              style={{ color: dark ? "#F5EFE0" : "#2C1A0E" }}
            >
              {label}
            </div>
          </div>
        ))}
      </section>

      {/* ── ウェーブ区切り ── */}
      <div className="relative z-10 leading-none">
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0 0 Q150 60 300 30 Q450 0 600 30 Q750 60 900 30 Q1050 0 1200 30 L1200 60 L0 60Z" fill="#2C1A0E" />
        </svg>
      </div>

      {/* ── コースセクション ── */}
      <section className="relative z-10 px-6 md:px-10 py-12" style={{ background: "#2C1A0E" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <span
              className="text-xs font-black px-3 py-1 rounded-xl"
              style={{ background: "#C49A6C", border: "2px solid #C49A6C", color: "#2C1A0E" }}
            >
              📚 学習コース
            </span>
            <h2
              className="text-3xl font-black text-white"
              style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
            >
              どこから始める？
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {courses.length > 0
              ? courses.map((c) => (
                  <Link
                    key={c.id}
                    to="/courses/$courseId"
                    params={{ courseId: c.id }}
                    className="rounded-2xl overflow-hidden cursor-pointer no-underline transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5 block"
                    style={{
                      background: COURSE_BG[c.level] ?? "#3D2412",
                      border: "2.5px solid rgba(255,255,255,0.2)",
                      boxShadow: "5px 5px 0 rgba(0,0,0,0.25)",
                    }}
                  >
                    <div
                      className="px-5 py-5"
                      style={{ borderBottom: "1.5px solid rgba(196,154,108,0.15)" }}
                    >
                      <span className="text-4xl block mb-2">{COURSE_EMOJI[c.level] ?? "☕"}</span>
                      <span
                        className="inline-block text-xs font-black px-2 py-0.5 rounded-lg mb-2"
                        style={{ border: "1.5px solid #C49A6C", color: "#C49A6C" }}
                      >
                        {LEVEL_LABEL[c.level] ?? c.level}
                      </span>
                      <div
                        className="text-base font-black leading-snug"
                        style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#F5EFE0" }}
                      >
                        {c.title}
                      </div>
                    </div>
                    <div className="px-5 py-4">
                      <p
                        className="text-xs font-bold leading-relaxed mb-4 opacity-70"
                        style={{ color: "#E8C99A" }}
                      >
                        {c.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold opacity-70" style={{ color: "#C49A6C" }}>
                          {c.lessonCount}レッスン · {c.durationMinutes}分
                        </span>
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-base transition-all duration-150"
                          style={{ border: "2px solid #C49A6C", color: "#C49A6C" }}
                        >
                          ›
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              : /* スケルトン */
                [1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl h-56 animate-pulse"
                    style={{ background: "#3D2412" }}
                  />
                ))}
          </div>
        </div>
      </section>

      {/* ── ウェーブ区切り（反転）── */}
      <div className="relative z-10 leading-none" style={{ background: "#2C1A0E" }}>
        <svg viewBox="0 0 1200 60" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" className="w-full block">
          <path d="M0 30 Q150 0 300 30 Q450 60 600 30 Q750 0 900 30 Q1050 60 1200 30 L1200 60 L0 60Z" fill="#FAF7F2" />
        </svg>
      </div>

    </div>
  );
}

