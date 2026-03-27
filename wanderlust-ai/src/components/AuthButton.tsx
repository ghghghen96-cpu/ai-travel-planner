"use client";

import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";

export function AuthButton() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <span className="text-xs text-zinc-400">로그인 확인 중...</span>;
  }

  if (!session) {
    return (
      <button
        type="button"
        onClick={() => signIn("google")}
        className="text-xs md:text-sm text-zinc-300 hover:text-white transition-colors"
      >
        구글로 로그인
      </button>
    );
  }

  const name = session.user?.name ?? "사용자";

  return (
    <button
      type="button"
      onClick={() => signOut()}
      className="text-xs md:text-sm text-zinc-300 hover:text-white transition-colors"
    >
      {name} 로그아웃
    </button>
  );
}

