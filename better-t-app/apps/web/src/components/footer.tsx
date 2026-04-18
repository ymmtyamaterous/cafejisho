import { Link } from "@tanstack/react-router";

export default function Footer() {
  return (
    <footer
      className="mt-auto"
      style={{ background: "#2C1A0E", borderTop: "3px solid #C49A6C", fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* 4カラムグリッド */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {/* ロゴ・キャッチコピー */}
          <div>
            <div
              className="inline-flex items-center gap-2 mb-3"
              style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
            >
              <span className="text-2xl font-black text-white">☕ cafejisho</span>
              <span
                className="text-xs font-black text-white px-2 py-0.5 rounded-lg"
                style={{ background: "#C49A6C", border: "2px solid #E8C99A" }}
              >
                β
              </span>
            </div>
            <p className="text-xs font-bold mb-4" style={{ color: "#C49A6C" }}>
              コーヒーをゲーム感覚で楽しく学べる学習プラットフォーム
            </p>
            <div className="flex gap-3">
              {["𝕏", "📸", "▶"].map((icon, i) => (
                <button
                  key={i}
                  type="button"
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-100 hover:-translate-y-0.5"
                  style={{
                    background: "#3D2412",
                    border: "1.5px solid #C49A6C",
                    color: "#C49A6C",
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>

          {/* 学ぶ */}
          <div>
            <h3 className="text-xs font-black mb-4" style={{ color: "#E8C99A" }}>学ぶ</h3>
            <ul className="space-y-2 list-none">
              {[
                { label: "入門コース", to: "/courses" },
                { label: "産地辞典", to: "/origins" },
                { label: "クイズ", to: "/quiz" },
                { label: "プレミアム ⭐", to: "/premium" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to as "/"}
                    className="text-xs font-bold no-underline transition-colors hover:opacity-80"
                    style={{ color: "#C49A6C" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 辞典 */}
          <div>
            <h3 className="text-xs font-black mb-4" style={{ color: "#E8C99A" }}>辞典</h3>
            <ul className="space-y-2 list-none">
              {[
                { label: "コーヒー用語集", to: "/glossary" },
                { label: "産地マップ", to: "/origins" },
                { label: "コース一覧", to: "/courses" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to as "/"}
                    className="text-xs font-bold no-underline transition-colors hover:opacity-80"
                    style={{ color: "#C49A6C" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* その他 */}
          <div>
            <h3 className="text-xs font-black mb-4" style={{ color: "#E8C99A" }}>その他</h3>
            <ul className="space-y-2 list-none">
              {[
                { label: "プレミアム ⭐", to: "/premium" },
                { label: "ブックマーク", to: "/bookmarks" },
                { label: "プロフィール", to: "/profile" },
              ].map(({ label, to }) => (
                <li key={label}>
                  <Link
                    to={to as "/"}
                    className="text-xs font-bold no-underline transition-colors hover:opacity-80"
                    style={{ color: "#C49A6C" }}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* 区切り線 */}
        <div className="mb-6" style={{ borderTop: "1px solid #3D2412" }} />

        {/* AIコンテンツ注記 */}
        <p className="text-xs font-bold mb-4 text-center" style={{ color: "rgba(196,154,108,0.6)" }}>
          🤖 本サイトのコンテンツは生成AIによって作成されたものです。重要な判断の際は必ず一次情報をご確認ください。
        </p>

        {/* コピーライト */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs font-bold" style={{ color: "rgba(196,154,108,0.5)" }}>
          <span>© 2026 Cafe Jisho. All rights reserved.</span>
          <div className="flex gap-4">
            <button type="button" className="hover:opacity-80 transition-opacity" style={{ color: "rgba(196,154,108,0.5)" }}>プライバシーポリシー</button>
            <button type="button" className="hover:opacity-80 transition-opacity" style={{ color: "rgba(196,154,108,0.5)" }}>利用規約</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
