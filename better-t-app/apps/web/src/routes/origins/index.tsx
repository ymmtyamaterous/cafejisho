import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/origins/")({
  component: OriginsPage,
});

const CONTINENTS = [
  { value: "", label: "すべて" },
  { value: "Africa", label: "🌍 アフリカ" },
  { value: "Asia", label: "🌏 アジア" },
  { value: "Central America", label: "🌎 中米" },
  { value: "South America", label: "🌎 南米" },
  { value: "Other", label: "🌐 その他" },
];

function OriginsPage() {
  const [continent, setContinent] = useState("");

  const { data: origins = [], isLoading } = useQuery(
    orpc.origins.list.queryOptions({
      input: { continent: continent || undefined },
    }),
  );

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
            🗺️ 産地辞典
          </div>
          <h1
            className="text-4xl font-black mb-2"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
          >
            コーヒー産地マップ
          </h1>
          <p className="text-sm font-bold" style={{ color: "#6B3D1E" }}>
            世界各地のコーヒー産地の特徴を探ろう
          </p>
        </div>

        {/* 大陸フィルター */}
        <div className="flex gap-2 flex-wrap mb-8">
          {CONTINENTS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setContinent(value)}
              className="px-4 py-2 text-sm font-extrabold rounded-2xl cursor-pointer transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: continent === value ? "#2C1A0E" : "#F5EFE0",
                border: "2px solid #2C1A0E",
                boxShadow: continent === value ? "2px 2px 0 #6B3D1E" : "2px 2px 0 #2C1A0E",
                color: continent === value ? "#F5EFE0" : "#2C1A0E",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* 産地グリッド */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-44 rounded-2xl animate-pulse" style={{ background: "#E8C99A" }} />
            ))}
          </div>
        ) : origins.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🌍</p>
            <p className="text-lg font-bold" style={{ color: "#6B3D1E" }}>
              該当する産地が見つかりません
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {origins.map((o) => (
              <Link
                key={o.id}
                to="/origins/$originId"
                params={{ originId: o.id }}
                className="block rounded-2xl overflow-hidden no-underline transition-all duration-150 hover:-translate-x-0.5 hover:-translate-y-0.5"
                style={{
                  background: "#fff",
                  border: "2px solid #2C1A0E",
                  boxShadow: "3px 3px 0 #2C1A0E",
                }}
              >
                {/* 絵文字バナー */}
                <div
                  className="flex items-center justify-center py-6 text-5xl"
                  style={{ background: "#F5EFE0", borderBottom: "2px solid #2C1A0E" }}
                >
                  {o.thumbnailEmoji}
                </div>

                <div className="px-4 py-3">
                  <div className="text-base font-black mb-0.5" style={{ color: "#2C1A0E" }}>
                    {o.name}
                  </div>
                  <div className="text-xs font-bold mb-2" style={{ color: "#C49A6C" }}>
                    {o.nameEn} · {o.continent}
                  </div>

                  {/* 高度 */}
                  {o.altitude && (
                    <div className="text-xs font-bold mb-2" style={{ color: "#6B3D1E" }}>
                      ⛰ {o.altitude}m
                    </div>
                  )}

                  {/* フレーバータグ */}
                  <div className="flex gap-1 flex-wrap">
                    {o.flavorTags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-bold px-1.5 py-0.5 rounded-lg"
                        style={{ background: "#E8C99A", color: "#6B3D1E" }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
