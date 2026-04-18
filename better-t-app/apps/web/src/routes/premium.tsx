import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/premium")({
  component: PremiumPage,
});

const FEATURES: { label: string; free: boolean; premium: boolean }[] = [
  { label: "入門コース（全8レッスン）", free: true, premium: true },
  { label: "コーヒー辞典（120+用語）", free: true, premium: true },
  { label: "産地ガイド（30産地）", free: true, premium: true },
  { label: "ブックマーク機能", free: true, premium: true },
  { label: "学習進捗管理", free: true, premium: true },
  { label: "中級コース（14レッスン）", free: false, premium: true },
  { label: "上級コース（20レッスン）", free: false, premium: true },
  { label: "全コースのクイズ", free: false, premium: true },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "プレミアムとはどんなプランですか？",
    a: "中級・上級コースへのフルアクセスが可能になります。コーヒーの深い知識を体系的に学びたい方におすすめです。",
  },
  {
    q: "無料プランでどこまで学べますか？",
    a: "入門コース（全8レッスン）、コーヒー辞典、産地ガイドは無料でご利用いただけます。",
  },
  {
    q: "プレミアム登録はいつでもキャンセルできますか？",
    a: "はい、いつでもキャンセル可能です。キャンセル後は有効期限まで引き続きご利用いただけます。",
  },
  {
    q: "支払い方法は何が使えますか？",
    a: "クレジットカード（Visa、Mastercard、JCB）がご利用いただけます。",
  },
];

function PremiumPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2", fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 text-xs font-black px-4 py-2 rounded-2xl mb-4"
            style={{
              background: "#E8C99A",
              border: "2px solid #2C1A0E",
              boxShadow: "2px 2px 0 #2C1A0E",
              color: "#2C1A0E",
            }}
          >
            ⭐ プレミアムプラン
          </div>
          <h1
            className="text-4xl font-black mb-3"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
          >
            コーヒーをもっと深く学ぼう
          </h1>
          <p className="text-sm font-bold max-w-lg mx-auto" style={{ color: "#6B3D1E" }}>
            プレミアム会員になると、中級・上級コースへのフルアクセスが可能に。プロレベルの知識を身につけましょう。
          </p>
        </div>

        {/* プラン比較テーブル */}
        <div className="grid grid-cols-2 gap-4 mb-12">
          {/* 無料プラン */}
          <div
            className="rounded-2xl px-6 py-8"
            style={{
              background: "#fff",
              border: "2.5px solid #2C1A0E",
              boxShadow: "4px 4px 0 #2C1A0E",
            }}
          >
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">��</div>
              <h2
                className="text-xl font-black mb-1"
                style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
              >
                無料プラン
              </h2>
              <div className="text-3xl font-black" style={{ color: "#2C1A0E" }}>¥0</div>
              <div className="text-xs font-bold" style={{ color: "#6B3D1E" }}>ずっと無料</div>
            </div>
            <div className="space-y-3">
              {FEATURES.map(({ label, free }) => (
                <div key={label} className="flex items-center gap-2 text-sm font-bold" style={{ color: "#2C1A0E" }}>
                  <span>{free ? "✅" : "❌"}</span>
                  <span style={{ opacity: free ? 1 : 0.4 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* プレミアムプラン */}
          <div
            className="rounded-2xl px-6 py-8 relative"
            style={{
              background: "#2C1A0E",
              border: "2.5px solid #2C1A0E",
              boxShadow: "4px 4px 0 #6B3D1E",
            }}
          >
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs font-black px-4 py-1 rounded-2xl whitespace-nowrap"
              style={{
                background: "#C49A6C",
                border: "2px solid #2C1A0E",
                boxShadow: "2px 2px 0 #2C1A0E",
                color: "#2C1A0E",
              }}
            >
              ⭐ おすすめ
            </div>
            <div className="text-center mb-6">
              <div className="text-3xl mb-2">🏆</div>
              <h2
                className="text-xl font-black mb-1 text-white"
                style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
              >
                プレミアムプラン
              </h2>
              <div className="text-3xl font-black" style={{ color: "#E8C99A" }}>¥980</div>
              <div className="text-xs font-bold" style={{ color: "#C49A6C" }}>/ 月額（税込）</div>
            </div>
            <div className="space-y-3">
              {FEATURES.map(({ label }) => (
                <div key={label} className="flex items-center gap-2 text-sm font-bold" style={{ color: "#E8C99A" }}>
                  <span>✅</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
            <div className="mt-6">
              <button
                type="button"
                className="w-full py-3 text-sm font-black rounded-2xl cursor-pointer transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
                style={{
                  background: "#C49A6C",
                  border: "2.5px solid #E8C99A",
                  boxShadow: "3px 3px 0 #6B3D1E",
                  color: "#2C1A0E",
                }}
              >
                プレミアムに登録する 🚀
              </button>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mb-10">
          <h2
            className="text-2xl font-black mb-6 text-center"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
          >
            よくある質問
          </h2>
          <div className="space-y-4">
            {FAQS.map(({ q, a }) => (
              <div
                key={q}
                className="rounded-2xl px-6 py-5"
                style={{
                  background: "#fff",
                  border: "2px solid #2C1A0E",
                  boxShadow: "3px 3px 0 #2C1A0E",
                }}
              >
                <div className="font-black mb-2" style={{ color: "#2C1A0E" }}>Q. {q}</div>
                <div className="text-sm font-bold" style={{ color: "#6B3D1E" }}>A. {a}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl no-underline text-sm font-extrabold transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
            style={{
              background: "#F5EFE0",
              border: "2px solid #2C1A0E",
              boxShadow: "3px 3px 0 #2C1A0E",
              color: "#2C1A0E",
            }}
          >
            ← トップに戻る
          </Link>
        </div>
      </div>
    </div>
  );
}
