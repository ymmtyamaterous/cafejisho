import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { authClient } from "@/lib/auth-client";
import { orpc } from "@/utils/orpc";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
  beforeLoad: async () => {
    const session = await authClient.getSession();
    if (!session.data) {
      redirect({ to: "/login", throw: true });
    }
    return { session };
  },
});

function ProfilePage() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const { data: stats } = useQuery(orpc.progress.getStats.queryOptions());

  const [name, setName] = useState(session?.user?.name ?? "");
  const [isEditing, setIsEditing] = useState(false);

  const updateMutation = useMutation({
    ...orpc.users.updateMe.mutationOptions(),
    onSuccess: () => {
      toast.success("プロフィールを更新しました ✨");
      setIsEditing(false);
      queryClient.invalidateQueries();
    },
    onError: (err) => toast.error(`エラー: ${err.message}`),
  });

  const user = session?.user;

  return (
    <div className="min-h-screen" style={{ background: "#FAF7F2", fontFamily: "'Nunito', sans-serif" }}>
      <div className="max-w-2xl mx-auto px-6 py-10">
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
            👤 プロフィール
          </div>
          <h1
            className="text-4xl font-black"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
          >
            マイプロフィール
          </h1>
        </div>

        {/* ユーザーカード */}
        <div
          className="rounded-2xl px-7 py-6 mb-6"
          style={{
            background: "#2C1A0E",
            border: "2.5px solid #2C1A0E",
            boxShadow: "5px 5px 0 #6B3D1E",
          }}
        >
          <div className="flex items-center gap-5">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-3xl font-black flex-shrink-0"
              style={{ background: "#C49A6C", border: "3px solid #E8C99A" }}
            >
              ☕
            </div>
            <div className="flex-1">
              {isEditing ? (
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-xl font-black px-3 py-1.5 rounded-xl w-full outline-none"
                  style={{
                    background: "#3D2412",
                    border: "2px solid #C49A6C",
                    color: "#F5EFE0",
                  }}
                />
              ) : (
                <div className="text-2xl font-black text-white" style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}>
                  {user?.name}
                </div>
              )}
              <div className="text-sm font-bold mt-1" style={{ color: "#C49A6C" }}>
                {user?.email}
              </div>
              <div className="text-xs font-bold mt-1" style={{ color: "rgba(196,154,108,0.6)" }}>
                {user?.createdAt
                  ? `入会: ${new Date(user.createdAt).toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" })}`
                  : ""}
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (isEditing) {
                  updateMutation.mutate({ name });
                } else {
                  setName(user?.name ?? "");
                  setIsEditing(true);
                }
              }}
              className="px-4 py-2 text-xs font-black rounded-xl cursor-pointer transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: isEditing ? "#C49A6C" : "#F5EFE0",
                border: "2px solid #E8C99A",
                boxShadow: "2px 2px 0 #E8C99A",
                color: "#2C1A0E",
              }}
            >
              {isEditing ? "保存" : "編集"}
            </button>
          </div>
        </div>

        {/* 統計サマリー */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { icon: "✅", value: stats?.totalCompletedLessons ?? 0, label: "完了レッスン" },
            { icon: "🔥", value: stats?.currentStreak ?? 0, label: "継続日数" },
            { icon: "🎯", value: `${stats?.averageQuizScore ?? 0}%`, label: "平均スコア" },
          ].map(({ icon, value, label }) => (
            <div
              key={label}
              className="rounded-2xl px-4 py-5 text-center"
              style={{
                background: "#fff",
                border: "2px solid #2C1A0E",
                boxShadow: "3px 3px 0 #2C1A0E",
              }}
            >
              <div className="text-2xl mb-1">{icon}</div>
              <div
                className="text-3xl font-black mb-1"
                style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
              >
                {value}
              </div>
              <div className="text-xs font-extrabold opacity-70" style={{ color: "#6B3D1E" }}>
                {label}
              </div>
            </div>
          ))}
        </div>

        {/* バッジセクション */}
        <div
          className="rounded-2xl px-7 py-6"
          style={{
            background: "#fff",
            border: "2px solid #2C1A0E",
            boxShadow: "3px 3px 0 #2C1A0E",
          }}
        >
          <h2
            className="text-lg font-black mb-4"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
          >
            🏅 獲得バッジ
          </h2>
          <div className="flex flex-wrap gap-3">
            {[
              { emoji: "🌱", name: "入門者", condition: (stats?.totalCompletedLessons ?? 0) >= 1, desc: "初めてレッスン完了" },
              { emoji: "📖", name: "学習者", condition: (stats?.totalCompletedLessons ?? 0) >= 5, desc: "5レッスン完了" },
              { emoji: "🔥", name: "継続者", condition: (stats?.currentStreak ?? 0) >= 3, desc: "3日連続学習" },
              { emoji: "🎯", name: "クイズ王", condition: (stats?.averageQuizScore ?? 0) >= 80, desc: "平均80%以上" },
              { emoji: "🏆", name: "エキスパート", condition: (stats?.totalCompletedLessons ?? 0) >= 20, desc: "20レッスン完了" },
              { emoji: "⭐", name: "プレミアム", condition: false, desc: "プレミアム会員" },
            ].map(({ emoji, name, condition, desc }) => (
              <div
                key={name}
                className="flex flex-col items-center gap-1 px-4 py-3 rounded-2xl transition-all duration-150"
                style={{
                  background: condition ? "#E8C99A" : "#F5EFE0",
                  border: `2px solid ${condition ? "#2C1A0E" : "#C49A6C"}`,
                  boxShadow: condition ? "2px 2px 0 #2C1A0E" : "none",
                  opacity: condition ? 1 : 0.4,
                  minWidth: "72px",
                }}
              >
                <span className="text-2xl">{emoji}</span>
                <span className="text-xs font-black" style={{ color: "#2C1A0E" }}>{name}</span>
                <span className="text-xs font-bold text-center leading-tight" style={{ color: "#6B3D1E", fontSize: "10px" }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
