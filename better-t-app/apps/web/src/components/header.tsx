import { Link, useRouterState } from "@tanstack/react-router";

import { authClient } from "@/lib/auth-client";

export default function Header() {
  const { data: session, isPending } = authClient.useSession();
  const { location } = useRouterState();

  const navLinks = [
    { to: "/courses", label: "🌱 コース" },
    { to: "/glossary", label: "📖 辞典" },
    { to: "/origins", label: "🗺️ 産地" },
    { to: "/quiz", label: "🎯 クイズ" },
  ] as const;

  return (
    <div className="relative z-50 px-4 pt-3 pb-0 md:px-6">
      <nav
        className="flex items-center justify-between px-5 py-3 rounded-3xl"
        style={{
          background: "#fff",
          border: "2.5px solid #2C1A0E",
          boxShadow: "5px 5px 0 #2C1A0E",
        }}
      >
        {/* ロゴ */}
        <Link
          to="/"
          className="flex items-center gap-2 no-underline"
          style={{ fontFamily: "'Zen Maru Gothic', sans-serif" }}
        >
          <span className="text-2xl font-black text-espresso">☕ cafejisho</span>
          <span
            className="text-xs font-black text-white px-2 py-0.5 rounded-lg"
            style={{
              background: "#C49A6C",
              border: "2px solid #2C1A0E",
              boxShadow: "2px 2px 0 #2C1A0E",
            }}
          >
            β
          </span>
        </Link>

        {/* ナビリンク */}
        <ul className="hidden md:flex items-center gap-2 list-none">
          {navLinks.map(({ to, label }) => {
            const isActive = location.pathname.startsWith(to);
            return (
              <li key={to}>
                <Link
                  to={to}
                  className="block px-3 py-1.5 text-xs font-extrabold rounded-2xl no-underline transition-all duration-100 hover:-translate-x-px hover:-translate-y-px"
                  style={{
                    background: isActive ? "#2C1A0E" : "#F5EFE0",
                    border: "2px solid #2C1A0E",
                    boxShadow: isActive ? "2px 2px 0 #6B3D1E" : "2px 2px 0 #2C1A0E",
                    color: isActive ? "#F5EFE0" : "#2C1A0E",
                  }}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* 右側: CTAまたはユーザーメニュー */}
        <div className="flex items-center gap-2">
          {isPending ? null : session ? (
            <CoffeeUserMenu userName={session.user.name} />
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-black text-cream rounded-2xl no-underline transition-all duration-100 hover:-translate-x-0.5 hover:-translate-y-0.5"
              style={{
                background: "#2C1A0E",
                border: "2.5px solid #2C1A0E",
                boxShadow: "3px 3px 0 #6B3D1E",
              }}
            >
              はじめる ✨
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
}

function CoffeeUserMenu({ userName }: { userName: string }) {
  const handleSignOut = async () => {
    await authClient.signOut();
    window.location.href = "/";
  };

  return (
    <div className="flex items-center gap-2">
      <Link
        to="/dashboard"
        className="px-3 py-1.5 text-xs font-extrabold rounded-2xl no-underline transition-all duration-100 hover:-translate-x-px hover:-translate-y-px"
        style={{
          background: "#F5EFE0",
          border: "2px solid #2C1A0E",
          boxShadow: "2px 2px 0 #2C1A0E",
          color: "#2C1A0E",
        }}
      >
        📊 {userName}
      </Link>
      <button
        type="button"
        onClick={handleSignOut}
        className="px-3 py-1.5 text-xs font-extrabold rounded-2xl transition-all duration-100 hover:-translate-x-px hover:-translate-y-px cursor-pointer"
        style={{
          background: "#2C1A0E",
          border: "2px solid #2C1A0E",
          boxShadow: "2px 2px 0 #6B3D1E",
          color: "#F5EFE0",
        }}
      >
        ログアウト
      </button>
    </div>
  );
}
