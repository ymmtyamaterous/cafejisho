import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";

import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/origins/$originId")({
  component: OriginDetailPage,
});

function OriginDetailPage() {
  const { originId } = Route.useParams();

  const { data: origin, isLoading } = useQuery(
    orpc.origins.getById.queryOptions({ input: { originId } }),
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAF7F2" }}>
        <div className="text-4xl animate-bounce">🌍</div>
      </div>
    );
  }

  if (!origin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#FAF7F2" }}>
        <p className="text-4xl">🔍</p>
        <p className="text-lg font-bold" style={{ color: "#6B3D1E" }}>
          産地が見つかりませんでした
        </p>
        <Link to="/origins" className="text-sm font-extrabold" style={{ color: "#2C1A0E" }}>
          ← 産地一覧へ
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2", fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* パンくず */}
        <nav className="flex items-center gap-2 text-xs font-bold mb-6" style={{ color: "#C49A6C" }}>
          <Link to="/origins" className="no-underline hover:underline" style={{ color: "#C49A6C" }}>
            産地
          </Link>
          <span>›</span>
          <span style={{ color: "#2C1A0E" }}>{origin.name}</span>
        </nav>

        {/* ヒーロー */}
        <div
          className="rounded-2xl px-7 py-8 mb-6 text-center"
          style={{
            background: "#2C1A0E",
            border: "2.5px solid #2C1A0E",
            boxShadow: "5px 5px 0 #6B3D1E",
          }}
        >
          <div className="text-7xl mb-4">{origin.thumbnailEmoji}</div>
          <h1
            className="text-4xl font-black text-white mb-1"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
          >
            {origin.name}
          </h1>
          <p className="text-base font-extrabold mb-4" style={{ color: "#C49A6C" }}>
            {origin.nameEn}
          </p>
          <div className="flex items-center justify-center gap-4 text-xs font-bold flex-wrap">
            <span style={{ color: "#E8C99A" }}>🌍 {origin.continent}</span>
            {origin.countryCode && <span style={{ color: "#E8C99A" }}>🏳️ {origin.countryCode}</span>}
          </div>
        </div>

        {/* フレーバータグ */}
        {origin.flavorTags.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-lg font-black mb-3"
              style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
            >
              フレーバーノート
            </h2>
            <div className="flex gap-2 flex-wrap">
              {origin.flavorTags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-2xl text-sm font-extrabold"
                  style={{
                    background: "#E8C99A",
                    border: "2px solid #2C1A0E",
                    boxShadow: "2px 2px 0 #2C1A0E",
                    color: "#2C1A0E",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 詳細情報グリッド */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {origin.altitude && (
            <InfoCard icon="⛰" label="標高" value={`${origin.altitude}m`} />
          )}
          {origin.annualProduction && (
            <InfoCard icon="📦" label="年間生産量" value={origin.annualProduction} />
          )}
          {origin.varieties.length > 0 && (
            <div
              className="col-span-2 rounded-2xl px-5 py-4"
              style={{
                background: "#fff",
                border: "2px solid #2C1A0E",
                boxShadow: "3px 3px 0 #2C1A0E",
              }}
            >
              <div className="text-xs font-black mb-2" style={{ color: "#C49A6C" }}>
                🌱 主要品種
              </div>
              <div className="flex gap-2 flex-wrap">
                {origin.varieties.map((v) => (
                  <span
                    key={v}
                    className="text-sm font-extrabold px-3 py-1 rounded-xl"
                    style={{ background: "#F5EFE0", color: "#2C1A0E" }}
                  >
                    {v}
                  </span>
                ))}
              </div>
            </div>
          )}
          {origin.processingMethods.length > 0 && (
            <div
              className="col-span-2 rounded-2xl px-5 py-4"
              style={{
                background: "#fff",
                border: "2px solid #2C1A0E",
                boxShadow: "3px 3px 0 #2C1A0E",
              }}
            >
              <div className="text-xs font-black mb-2" style={{ color: "#C49A6C" }}>
                ⚙️ 精製方法
              </div>
              <div className="flex gap-2 flex-wrap">
                {origin.processingMethods.map((m) => (
                  <span
                    key={m}
                    className="text-sm font-extrabold px-3 py-1 rounded-xl"
                    style={{ background: "#F5EFE0", color: "#2C1A0E" }}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 説明 */}
        {origin.description && (
          <div
            className="rounded-2xl px-7 py-6 mb-6"
            style={{
              background: "#fff",
              border: "2px solid #2C1A0E",
              boxShadow: "4px 4px 0 #2C1A0E",
            }}
          >
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <h2
                    className="text-xl font-black mb-3 mt-4"
                    style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
                  >
                    {children}
                  </h2>
                ),
                p: ({ children }) => (
                  <p className="text-sm font-bold leading-relaxed mb-3" style={{ color: "#2C1A0E" }}>
                    {children}
                  </p>
                ),
                strong: ({ children }) => (
                  <strong className="font-black" style={{ color: "#6B3D1E" }}>{children}</strong>
                ),
              }}
            >
              {origin.description}
            </ReactMarkdown>
          </div>
        )}

        <div className="mt-8">
          <Link
            to="/origins"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl no-underline text-sm font-extrabold transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
            style={{
              background: "#F5EFE0",
              border: "2px solid #2C1A0E",
              boxShadow: "3px 3px 0 #2C1A0E",
              color: "#2C1A0E",
            }}
          >
            ← 産地一覧に戻る
          </Link>
        </div>
      </div>
    </div>
  );
}

function InfoCard({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div
      className="rounded-2xl px-5 py-4"
      style={{
        background: "#fff",
        border: "2px solid #2C1A0E",
        boxShadow: "3px 3px 0 #2C1A0E",
      }}
    >
      <div className="text-xs font-black mb-1" style={{ color: "#C49A6C" }}>
        {icon} {label}
      </div>
      <div className="text-base font-extrabold" style={{ color: "#2C1A0E" }}>
        {value}
      </div>
    </div>
  );
}
