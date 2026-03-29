import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import ReactMarkdown from "react-markdown";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/glossary/$termId")({
  component: TermDetailPage,
});

const CATEGORY_LABEL: Record<string, string> = {
  bean: "🫘 豆・品種",
  roast: "🔥 焙煎",
  brew: "💧 抽出",
  origin: "🌍 産地",
  taste: "👅 テイスティング",
  equipment: "⚙️ 器具",
  certification: "📜 認証",
};

function TermDetailPage() {
  const { termId } = Route.useParams();
  const { data: session } = authClient.useSession();
  const queryClient = useQueryClient();

  const { data: term, isLoading } = useQuery(
    orpc.glossary.getById.queryOptions({ input: { termId } }),
  );

  const { data: myBookmarks = [] } = useQuery({
    ...orpc.bookmarks.list.queryOptions({ input: { type: "glossary" } }),
    enabled: !!session,
  });

  const addBookmarkMutation = useMutation({
    ...orpc.bookmarks.add.mutationOptions(),
    onSuccess: () => {
      toast.success("ブックマークに追加しました 🔖");
      queryClient.invalidateQueries();
    },
    onError: () => toast.error("ブックマークの追加に失敗しました"),
  });

  const removeBookmarkMutation = useMutation({
    ...orpc.bookmarks.remove.mutationOptions(),
    onSuccess: () => {
      toast.success("ブックマークを削除しました");
      queryClient.invalidateQueries();
    },
    onError: () => toast.error("ブックマークの削除に失敗しました"),
  });

  const isBookmarked = myBookmarks.some((b) => b.targetId === termId);
  const bookmarkId = myBookmarks.find((b) => b.targetId === termId)?.id;

  const handleBookmark = () => {
    if (isBookmarked && bookmarkId) {
      removeBookmarkMutation.mutate({ bookmarkId });
    } else {
      addBookmarkMutation.mutate({ type: "glossary", targetId: termId });
    }
  };

  // 関連用語の取得
  const relatedTermIds = term?.relatedTermIds ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#FAF7F2" }}>
        <div className="text-4xl animate-bounce">☕</div>
      </div>
    );
  }

  if (!term) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ background: "#FAF7F2" }}>
        <p className="text-4xl">🔍</p>
        <p className="text-lg font-bold" style={{ color: "#6B3D1E" }}>
          用語が見つかりませんでした
        </p>
        <Link to="/glossary" className="text-sm font-extrabold" style={{ color: "#2C1A0E" }}>
          ← 辞典トップへ
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2", fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* パンくず */}
        <nav className="flex items-center gap-2 text-xs font-bold mb-6" style={{ color: "#C49A6C" }}>
          <Link to="/glossary" className="no-underline hover:underline" style={{ color: "#C49A6C" }}>
            辞典
          </Link>
          <span>›</span>
          <span style={{ color: "#2C1A0E" }}>{term.term}</span>
        </nav>

        {/* 用語ヘッダー */}
        <div
          className="rounded-2xl px-7 py-6 mb-6"
          style={{
            background: "#2C1A0E",
            border: "2.5px solid #2C1A0E",
            boxShadow: "5px 5px 0 #6B3D1E",
          }}
        >
          <div className="mb-3">
            <span
              className="inline-block text-xs font-black px-3 py-1 rounded-xl mb-3"
              style={{ background: "#C49A6C", color: "#2C1A0E" }}
            >
              {CATEGORY_LABEL[term.category] ?? term.category}
            </span>
          </div>
          <h1
            className="text-4xl font-black text-white mb-1"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
          >
            {term.term}
          </h1>
          {term.reading && (
            <p className="text-sm font-bold mb-1" style={{ color: "rgba(245,239,224,0.5)" }}>
              {term.reading}
            </p>
          )}
          {term.termEn && (
            <p className="text-base font-extrabold" style={{ color: "#C49A6C" }}>
              {term.termEn}
            </p>
          )}
        </div>

        {/* 短い説明 */}
        <div
          className="rounded-2xl px-6 py-4 mb-6"
          style={{
            background: "#E8C99A",
            border: "2px solid #2C1A0E",
            boxShadow: "3px 3px 0 #2C1A0E",
          }}
        >
          <p className="text-sm font-extrabold" style={{ color: "#2C1A0E" }}>
            💡 {term.shortDescription}
          </p>
        </div>

        {/* 詳細説明 */}
        {term.description && (
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
                    className="text-xl font-black mb-3 mt-5"
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
                ul: ({ children }) => <ul className="list-none space-y-2 mb-3">{children}</ul>,
                li: ({ children }) => (
                  <li className="flex items-start gap-2 text-sm font-bold" style={{ color: "#2C1A0E" }}>
                    <span style={{ color: "#C49A6C" }}>☕</span>
                    <span>{children}</span>
                  </li>
                ),
              }}
            >
              {term.description}
            </ReactMarkdown>
          </div>
        )}

        {/* 関連用語 */}
        {relatedTermIds.length > 0 && (
          <div className="mb-6">
            <h2
              className="text-lg font-black mb-3"
              style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
            >
              関連用語
            </h2>
            <RelatedTerms termIds={relatedTermIds} />
          </div>
        )}

        <div className="flex items-center gap-3 mt-8">
          <Link
            to="/glossary"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl no-underline text-sm font-extrabold transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
            style={{
              background: "#F5EFE0",
              border: "2px solid #2C1A0E",
              boxShadow: "3px 3px 0 #2C1A0E",
              color: "#2C1A0E",
            }}
          >
            ← 辞典一覧に戻る
          </Link>
          {session && (
            <button
              type="button"
              onClick={handleBookmark}
              disabled={addBookmarkMutation.isPending || removeBookmarkMutation.isPending}
              className="px-5 py-3 text-sm font-black rounded-2xl cursor-pointer transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50"
              style={{
                background: isBookmarked ? "#E8C99A" : "#F5EFE0",
                border: "2px solid #2C1A0E",
                boxShadow: "3px 3px 0 #2C1A0E",
                color: "#2C1A0E",
              }}
            >
              {isBookmarked ? "🔖 ブックマーク済み" : "🔖 ブックマーク"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function RelatedTerms({ termIds }: { termIds: string[] }) {
  const queries = termIds.slice(0, 5).map((id) =>
    orpc.glossary.getById.queryOptions({ input: { termId: id } }),
  );
  // 個別にクエリを発行
  const results = queries.map((q) => useQuery(q));

  const terms = results
    .filter((r) => r.data)
    .map((r) => r.data!);

  if (terms.length === 0) return null;

  return (
    <div className="flex gap-3 flex-wrap">
      {terms.map((term) => (
        <Link
          key={term.id}
          to="/glossary/$termId"
          params={{ termId: term.id }}
          className="px-4 py-2 rounded-2xl no-underline text-sm font-extrabold transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
          style={{
            background: "#F5EFE0",
            border: "2px solid #2C1A0E",
            boxShadow: "2px 2px 0 #2C1A0E",
            color: "#2C1A0E",
          }}
        >
          {term.term}
        </Link>
      ))}
    </div>
  );
}
