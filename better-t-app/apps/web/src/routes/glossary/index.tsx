import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/glossary/")({
  component: GlossaryPage,
});

type Category = "bean" | "roast" | "brew" | "origin" | "taste" | "equipment" | "certification";

const CATEGORIES: { value: Category | ""; label: string }[] = [
  { value: "", label: "すべて" },
  { value: "bean", label: "🫘 豆・品種" },
  { value: "roast", label: "🔥 焙煎" },
  { value: "brew", label: "💧 抽出" },
  { value: "origin", label: "🌍 産地" },
  { value: "taste", label: "👅 テイスティング" },
  { value: "equipment", label: "⚙️ 器具" },
  { value: "certification", label: "📜 認証" },
];

const CATEGORY_LABEL: Record<string, string> = {
  bean: "豆・品種",
  roast: "焙煎",
  brew: "抽出",
  origin: "産地",
  taste: "テイスティング",
  equipment: "器具",
  certification: "認証",
};

function GlossaryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category | "">("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // デバウンス検索
  const handleSearchChange = (value: string) => {
    setSearch(value);
    clearTimeout((handleSearchChange as { _timer?: ReturnType<typeof setTimeout> })._timer);
    (handleSearchChange as { _timer?: ReturnType<typeof setTimeout> })._timer = setTimeout(() => {
      setDebouncedSearch(value);
    }, 300);
  };

  const { data, isLoading } = useQuery(
    orpc.glossary.list.queryOptions({
      input: {
        category: category || undefined,
        search: debouncedSearch || undefined,
        limit: 50,
      },
    }),
  );

  const terms = data?.terms ?? [];

  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2", fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-6xl mx-auto px-6 py-10">
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
            📖 辞典
          </div>
          <h1
            className="text-4xl font-black mb-2"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
          >
            コーヒー用語辞典
          </h1>
          <p className="text-sm font-bold" style={{ color: "#6B3D1E" }}>
            コーヒーの世界を深く理解するための用語集
          </p>
        </div>

        {/* 検索バー */}
        <div className="mb-6">
          <div
            className="flex items-center gap-3 px-4 py-3 rounded-2xl"
            style={{
              background: "#fff",
              border: "2px solid #2C1A0E",
              boxShadow: "3px 3px 0 #2C1A0E",
            }}
          >
            <span className="text-lg">🔍</span>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="用語を検索..."
              className="flex-1 bg-transparent outline-none text-sm font-bold"
              style={{ color: "#2C1A0E" }}
            />
            {search && (
              <button
                type="button"
                onClick={() => { setSearch(""); setDebouncedSearch(""); }}
                className="text-sm font-black cursor-pointer"
                style={{ color: "#C49A6C" }}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* カテゴリタブ */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CATEGORIES.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setCategory(value)}
              className="px-3 py-1.5 text-xs font-extrabold rounded-2xl cursor-pointer transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: category === value ? "#2C1A0E" : "#F5EFE0",
                border: "2px solid #2C1A0E",
                boxShadow: category === value ? "2px 2px 0 #6B3D1E" : "2px 2px 0 #2C1A0E",
                color: category === value ? "#F5EFE0" : "#2C1A0E",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 件数 */}
        {!isLoading && (
          <p className="text-xs font-bold mb-4" style={{ color: "#C49A6C" }}>
            {terms.length}件の用語
          </p>
        )}

        {/* 用語グリッド */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ background: "#E8C99A" }} />
            ))}
          </div>
        ) : terms.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔍</p>
            <p className="text-lg font-bold" style={{ color: "#6B3D1E" }}>
              該当する用語が見つかりませんでした
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {terms.map((term) => (
              <Link
                key={term.id}
                to="/glossary/$termId"
                params={{ termId: term.id }}
                className="block rounded-2xl px-5 py-4 no-underline transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
                style={{
                  background: "#fff",
                  border: "2px solid #2C1A0E",
                  boxShadow: "3px 3px 0 #2C1A0E",
                }}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <div className="text-base font-black" style={{ color: "#2C1A0E" }}>
                      {term.term}
                    </div>
                    {term.reading && (
                      <div className="text-xs font-bold opacity-50" style={{ color: "#6B3D1E" }}>
                        {term.reading}
                      </div>
                    )}
                  </div>
                  <span
                    className="text-xs font-black px-2 py-0.5 rounded-lg flex-shrink-0"
                    style={{
                      background: "#E8C99A",
                      border: "1.5px solid #2C1A0E",
                      color: "#2C1A0E",
                    }}
                  >
                    {CATEGORY_LABEL[term.category] ?? term.category}
                  </span>
                </div>
                {term.termEn && (
                  <div className="text-xs font-bold mb-2" style={{ color: "#C49A6C" }}>
                    {term.termEn}
                  </div>
                )}
                <p className="text-xs font-bold leading-relaxed line-clamp-2" style={{ color: "#6B3D1E" }}>
                  {term.shortDescription}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
