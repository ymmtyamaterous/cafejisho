import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/bookmarks")({
  component: BookmarksPage,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({ to: "/login", throw: true });
    }
    return { session };
  },
});

type BookmarkType = "lesson" | "glossary" | "origin";

const TABS: { value: BookmarkType | ""; label: string }[] = [
  { value: "", label: "すべて" },
  { value: "lesson", label: "📚 レッスン" },
  { value: "glossary", label: "📖 用語" },
  { value: "origin", label: "🌍 産地" },
];

const TYPE_ICON: Record<string, string> = {
  lesson: "📚",
  glossary: "📖",
  origin: "🌍",
};

const TYPE_LABEL: Record<string, string> = {
  lesson: "レッスン",
  glossary: "用語",
  origin: "産地",
};

function BookmarksPage() {
  const [activeTab, setActiveTab] = useState<BookmarkType | "">("");
  const queryClient = useQueryClient();

  const { data: bookmarks = [], isLoading } = useQuery(
    orpc.bookmarks.list.queryOptions({
      input: { type: activeTab || undefined },
    }),
  );

  const removeMutation = useMutation({
    ...orpc.bookmarks.remove.mutationOptions(),
    onSuccess: () => {
      toast.success("ブックマークを削除しました");
      queryClient.invalidateQueries({ queryKey: ["bookmarks"] });
    },
    onError: (err) => toast.error(`エラー: ${err.message}`),
  });

  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2", fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-4xl mx-auto px-6 py-10">
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
            🔖 ブックマーク
          </div>
          <h1
            className="text-4xl font-black"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
          >
            マイブックマーク
          </h1>
        </div>

        {/* タブ */}
        <div className="flex gap-2 flex-wrap mb-8">
          {TABS.map(({ value, label }) => (
            <button
              key={value}
              type="button"
              onClick={() => setActiveTab(value)}
              className="px-4 py-2 text-sm font-extrabold rounded-2xl cursor-pointer transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: activeTab === value ? "#2C1A0E" : "#F5EFE0",
                border: "2px solid #2C1A0E",
                boxShadow: activeTab === value ? "2px 2px 0 #6B3D1E" : "2px 2px 0 #2C1A0E",
                color: activeTab === value ? "#F5EFE0" : "#2C1A0E",
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* リスト */}
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: "#E8C99A" }} />
            ))}
          </div>
        ) : bookmarks.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-4xl mb-4">🔖</p>
            <p className="text-lg font-bold mb-2" style={{ color: "#6B3D1E" }}>
              ブックマークがありません
            </p>
            <p className="text-sm font-bold mb-6" style={{ color: "#C49A6C" }}>
              レッスン・用語・産地をブックマークしよう！
            </p>
            <Link
              to="/courses"
              className="inline-block px-6 py-3 text-sm font-black rounded-2xl no-underline transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: "#2C1A0E",
                border: "2.5px solid #2C1A0E",
                boxShadow: "4px 4px 0 #6B3D1E",
                color: "#F5EFE0",
              }}
            >
              📚 コースを見る
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {bookmarks.map((bm) => (
              <div
                key={bm.id}
                className="flex items-center justify-between px-5 py-4 rounded-2xl"
                style={{
                  background: "#fff",
                  border: "2px solid #2C1A0E",
                  boxShadow: "3px 3px 0 #2C1A0E",
                }}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{TYPE_ICON[bm.type] ?? "📌"}</span>
                  <div>
                    <div className="text-xs font-black mb-0.5" style={{ color: "#C49A6C" }}>
                      {TYPE_LABEL[bm.type] ?? bm.type}
                    </div>
                    <div className="text-sm font-extrabold" style={{ color: "#2C1A0E" }}>
                      {bm.targetId}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BookmarkLink type={bm.type} targetId={bm.targetId} />
                  <button
                    type="button"
                    onClick={() => removeMutation.mutate({ bookmarkId: bm.id })}
                    disabled={removeMutation.isPending}
                    className="px-3 py-1.5 text-xs font-black rounded-xl cursor-pointer transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50"
                    style={{
                      background: "#F5EFE0",
                      border: "2px solid #2C1A0E",
                      boxShadow: "2px 2px 0 #2C1A0E",
                      color: "#2C1A0E",
                    }}
                  >
                    削除
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function BookmarkLink({ type, targetId }: { type: string; targetId: string }) {
  if (type === "glossary") {
    return (
      <Link
        to="/glossary/$termId"
        params={{ termId: targetId }}
        className="px-3 py-1.5 text-xs font-black rounded-xl no-underline transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
        style={{
          background: "#2C1A0E",
          border: "2px solid #2C1A0E",
          boxShadow: "2px 2px 0 #6B3D1E",
          color: "#F5EFE0",
        }}
      >
        見る →
      </Link>
    );
  }
  if (type === "origin") {
    return (
      <Link
        to="/origins/$originId"
        params={{ originId: targetId }}
        className="px-3 py-1.5 text-xs font-black rounded-xl no-underline transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
        style={{
          background: "#2C1A0E",
          border: "2px solid #2C1A0E",
          boxShadow: "2px 2px 0 #6B3D1E",
          color: "#F5EFE0",
        }}
      >
        見る →
      </Link>
    );
  }
  return null;
}
