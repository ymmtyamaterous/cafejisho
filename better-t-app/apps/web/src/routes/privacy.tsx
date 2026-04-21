import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/privacy")({
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2", fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-6 py-12">
        <Link
          to="/"
          className="inline-flex items-center gap-1 text-xs font-bold no-underline mb-8 hover:opacity-70 transition-opacity"
          style={{ color: "#C49A6C" }}
        >
          ← トップに戻る
        </Link>

        <h1
          className="text-3xl font-black mb-2"
          style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
        >
          プライバシーポリシー
        </h1>
        <p className="text-xs font-bold mb-10" style={{ color: "#C49A6C" }}>最終更新日: 2026年4月21日</p>

        <div className="space-y-8">
          {[
            {
              title: "1. 収集する情報",
              body: "Cafe Jisho（以下「本サービス」）では、サービスの提供・改善のために以下の情報を収集することがあります。\n\n・アカウント登録時に提供いただいた氏名・メールアドレス\n・学習進捗・ブックマークなど、本サービス利用時に生成される情報\n・アクセスログ（IPアドレス、ブラウザ種別、参照元URLなど）",
            },
            {
              title: "2. 情報の利用目的",
              body: "収集した情報は以下の目的で利用します。\n\n・本サービスの提供・維持・改善\n・ユーザーサポートへの対応\n・利用状況の統計分析（個人を特定しない形で行います）",
            },
            {
              title: "3. 第三者への提供",
              body: "法令に基づく開示が必要な場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。",
            },
            {
              title: "4. セキュリティ",
              body: "個人情報の漏洩・紛失・不正アクセスを防ぐため、適切な安全管理措置を講じています。ただし、インターネット上の通信は完全な安全性を保証できないことをご了承ください。",
            },
            {
              title: "5. Cookie の利用",
              body: "本サービスでは、ログイン状態の維持などのためにCookieを使用しています。ブラウザの設定によりCookieを無効にすることもできますが、一部機能が利用できなくなる場合があります。",
            },
            {
              title: "6. ポリシーの変更",
              body: "本ポリシーの内容は、必要に応じて予告なく変更することがあります。変更後のポリシーは本ページに掲載した時点から有効になります。",
            },
            {
              title: "7. お問い合わせ",
              body: "本ポリシーに関するご質問は、本サービスのお問い合わせ窓口までご連絡ください。",
            },
          ].map(({ title, body }) => (
            <div
              key={title}
              className="rounded-2xl px-7 py-6"
              style={{
                background: "#fff",
                border: "2px solid #2C1A0E",
                boxShadow: "3px 3px 0 #2C1A0E",
              }}
            >
              <h2
                className="text-base font-black mb-3"
                style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
              >
                {title}
              </h2>
              <p className="text-sm font-bold whitespace-pre-line leading-relaxed" style={{ color: "#6B3D1E" }}>
                {body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
