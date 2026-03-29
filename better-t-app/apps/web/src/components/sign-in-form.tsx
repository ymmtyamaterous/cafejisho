import { Input } from "@better-t-app/ui/components/input";
import { Label } from "@better-t-app/ui/components/label";
import { useForm } from "@tanstack/react-form";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import z from "zod";

import { authClient } from "@/lib/auth-client";

import Loader from "./loader";

export default function SignInForm({ onSwitchToSignUp }: { onSwitchToSignUp: () => void }) {
  const navigate = useNavigate({
    from: "/",
  });
  const { isPending } = authClient.useSession();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      await authClient.signIn.email(
        {
          email: value.email,
          password: value.password,
        },
        {
          onSuccess: () => {
            navigate({
              to: "/dashboard",
            });
            toast.success("ログインしました！");
          },
          onError: (error) => {
            toast.error(error.error.message || error.error.statusText);
          },
        },
      );
    },
    validators: {
      onSubmit: z.object({
        email: z.email("有効なメールアドレスを入力してください"),
        password: z.string().min(8, "パスワードは8文字以上で入力してください"),
      }),
    },
  });

  if (isPending) {
    return <Loader />;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10"
      style={{ background: "#FAF7F2", fontFamily: "'Nunito', sans-serif" }}
    >
      <div className="w-full max-w-md">
        {/* バッジ */}
        <div className="flex justify-center mb-6">
          <span
            className="inline-flex items-center gap-2 text-xs font-black px-4 py-2 rounded-2xl"
            style={{
              background: "#E8C99A",
              border: "2px solid #2C1A0E",
              boxShadow: "2px 2px 0 #2C1A0E",
              color: "#2C1A0E",
            }}
          >
            ☕ おかえりなさい
          </span>
        </div>

        {/* カード */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: "#fff",
            border: "2.5px solid #2C1A0E",
            boxShadow: "7px 7px 0 #2C1A0E",
          }}
        >
          <h1
            className="text-3xl font-black text-center mb-2"
            style={{ fontFamily: "'Zen Maru Gothic', sans-serif", color: "#2C1A0E" }}
          >
            ログイン
          </h1>
          <p className="text-center text-sm font-bold mb-8" style={{ color: "#6B3D1E" }}>
            今日も一緒にコーヒーを学ぼう！
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
            className="space-y-5"
          >
            {/* メール */}
            <form.Field name="email">
              {(field) => (
                <div className="space-y-1.5">
                  <Label
                    htmlFor={field.name}
                    className="text-xs font-black"
                    style={{ color: "#2C1A0E" }}
                  >
                    メールアドレス
                  </Label>
                  <Input
                    id={field.name}
                    name={field.name}
                    type="email"
                    placeholder="example@email.com"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="rounded-xl border-2 h-10 px-3 text-sm"
                    style={{ borderColor: "#2C1A0E", background: "#FAF7F2" }}
                  />
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-xs font-bold" style={{ color: "#C0392B" }}>
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            {/* パスワード */}
            <form.Field name="password">
              {(field) => (
                <div className="space-y-1.5">
                  <Label
                    htmlFor={field.name}
                    className="text-xs font-black"
                    style={{ color: "#2C1A0E" }}
                  >
                    パスワード
                  </Label>
                  <div className="relative">
                    <Input
                      id={field.name}
                      name={field.name}
                      type={showPassword ? "text" : "password"}
                      placeholder="パスワードを入力"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="rounded-xl border-2 h-10 px-3 pr-10 text-sm"
                      style={{ borderColor: "#2C1A0E", background: "#FAF7F2" }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                      aria-label={showPassword ? "パスワードを隠す" : "パスワードを表示"}
                      style={{ color: "#6B3D1E" }}
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  {field.state.meta.errors.map((error) => (
                    <p key={error?.message} className="text-xs font-bold" style={{ color: "#C0392B" }}>
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </form.Field>

            {/* 送信ボタン */}
            <form.Subscribe
              selector={(state) => ({ canSubmit: state.canSubmit, isSubmitting: state.isSubmitting })}
            >
              {({ canSubmit, isSubmitting }) => (
                <button
                  type="submit"
                  disabled={!canSubmit || isSubmitting}
                  className="w-full py-3 text-sm font-black rounded-2xl transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:translate-x-0 disabled:translate-y-0 mt-2"
                  style={{
                    background: "#2C1A0E",
                    border: "2.5px solid #2C1A0E",
                    boxShadow: "4px 4px 0 #6B3D1E",
                    color: "#F5EFE0",
                  }}
                >
                  {isSubmitting ? "ログイン中..." : "ログインする →"}
                </button>
              )}
            </form.Subscribe>
          </form>
        </div>

        {/* サインアップリンク */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-sm font-bold underline-offset-2 hover:underline transition-all"
            style={{ color: "#6B3D1E" }}
          >
            アカウントをお持ちでない方はこちら →
          </button>
        </div>
      </div>
    </div>
  );
}
