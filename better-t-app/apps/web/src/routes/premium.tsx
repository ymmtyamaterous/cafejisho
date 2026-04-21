import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/premium")({
  component: PremiumPage,
});

function PremiumPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2", fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-2xl mx-auto px-6 py-16 text-center">
        {/* アイコン */}
        <div className="text-6xl mb-6">☕</div>

        {/* タイトル */}
        <h1
          className="text-3xl font-black mb-4"
          style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
        >
          現在、全機能を無料で提供中！
        </h1>

        <p className="text-sm font-bold mb-8 leading-relaxed" style={{ color: "#6B3D1E" }}>
          Cafe Jisho はただいまオープンβ期間中につき、<br />
          すべてのコース・機能を無料でご利用いただけます。<br />
          今後プレミアムプランを導入予定ですが、現時点では制限なくお楽しみください。
        </p>

        {/* カード */}
        <div
          className="rounded-2xl px-8 py-8 mb-10 text-left"
          style={{
            background: "#fff",
            border: "2.5px solid #2C1A0E",
            boxShadow: "5px 5px 0 #2C1A0E",
          }}
        >
          <h2
            className="text-lg font-black mb-5"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
          >
            現在、無料で使える機能
          </h2>
          <ul className="space-y-3">
            {[
              "全コース（入門・中級・上級）のレッスン",
              "コーヒー辞典（120+用語）",
              "産地ガイド（30産地）",
              "クイズ機能",
              "ブックマーク機能",
              "学習進捗管理",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-sm font-bold" style={{ color: "#2C1A0E" }}>
                <span
                  className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-black"
                  style={{ background: "#C49A6C", color: "#fff" }}
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* CTAボタン */}
        <Link
          to="/courses"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-2xl no-underline text-sm font-black transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
          style={{
            background: "#2C1A0E",
            border: "2.5px solid #2C1A0E",
            boxShadow: "4px 4px 0 #6B3D1E",
            color: "#F5EFE0",
          }}
        >
          コースを見る 🌱
        </Link>
      </div>
    </div>
  );
}
