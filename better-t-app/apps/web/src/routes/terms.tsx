import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
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
          利用規約
        </h1>
        <p className="text-xs font-bold mb-10" style={{ color: "#C49A6C" }}>最終更新日: 2026年4月21日</p>

        <div className="space-y-8">
          {[
            {
              title: "第1条（適用）",
              body: "本規約は、Cafe Jisho（以下「本サービス」）の利用に関して、ユーザーと本サービス運営者との間に適用されます。ユーザーは本規約に同意したうえで本サービスをご利用ください。",
            },
            {
              title: "第2条（アカウント）",
              body: "ユーザーはアカウント登録時に正確な情報を提供し、最新の状態に保つ責任があります。アカウントの管理はユーザー自身の責任で行ってください。第三者へのアカウント譲渡・貸与は禁止します。",
            },
            {
              title: "第3条（禁止事項）",
              body: "以下の行為を禁止します。\n\n・法令または公序良俗に違反する行為\n・本サービスの運営を妨害する行為\n・不正アクセスやリバースエンジニアリング\n・他のユーザーへの迷惑行為\n・本サービスのコンテンツの無断転載・複製",
            },
            {
              title: "第4条（コンテンツ）",
              body: "本サービスで提供されるコンテンツの著作権は運営者または正当な権利者に帰属します。個人的な学習目的での閲覧・利用は許可しますが、商業目的での利用は禁止します。\n\nなお、本サービスのコンテンツの一部は生成AIによって作成されています。内容の正確性については最善の注意を払いますが、重要な判断の際は一次情報をご確認ください。",
            },
            {
              title: "第5条（サービスの変更・停止）",
              body: "運営者は予告なくサービスの内容を変更・停止・終了する場合があります。これによりユーザーに生じた損害について、運営者は責任を負いません。",
            },
            {
              title: "第6条（免責事項）",
              body: "本サービスの利用によって生じた損害について、運営者は故意または重大な過失がある場合を除き責任を負いません。本サービスは現状有姿で提供され、特定目的への適合性を保証するものではありません。",
            },
            {
              title: "第7条（規約の変更）",
              body: "運営者は必要に応じて本規約を変更することができます。変更後の規約は本ページに掲載した時点から有効となります。",
            },
            {
              title: "第8条（準拠法・管轄）",
              body: "本規約は日本法に準拠します。本サービスに関する紛争については、運営者所在地を管轄する裁判所を専属的合意管轄裁判所とします。",
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
