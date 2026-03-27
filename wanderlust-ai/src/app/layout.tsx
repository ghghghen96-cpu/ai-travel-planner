import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { AuthButton } from "../components/AuthButton";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WanderLust AI – 여행 플래너",
  description: "AI와 대화하면서 나만의 여행 플랜을 만드는 서비스",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gradient-to-b from-black via-zinc-950 to-zinc-900 text-zinc-50`}
      >
        <Providers>
          <div className="relative min-h-screen flex flex-col">
            {/* 상단 글로우 */}
            <div className="pointer-events-none absolute inset-x-0 -top-40 h-64 bg-gradient-to-b from-emerald-500/20 via-emerald-400/5 to-transparent blur-3xl" />

            <header className="sticky top-0 z-30 border-b border-zinc-800/70 bg-black/40 backdrop-blur-xl">
              <div className="mx-auto flex max-w-6xl items-center justify-between px-5 md:px-8 py-3 md:py-4">
                <div className="flex items-center gap-2 md:gap-3">
                  <div className="relative h-9 w-9 rounded-full bg-gradient-to-br from-emerald-400 to-lime-300 flex items-center justify-center text-[11px] font-bold text-black shadow-lg shadow-emerald-500/40">
                    AI
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm md:text-[15px] font-semibold tracking-tight">
                      WanderLust AI
                    </span>
                    <span className="text-[11px] text-zinc-400">
                      여행을 설계해 주는 AI 플래너
                    </span>
                  </div>
                </div>
                <nav className="flex items-center gap-3 md:gap-6 text-[11px] md:text-sm text-zinc-300">
                  <a href="/" className="hover:text-white transition-colors">
                    홈
                  </a>
                  <a href="/wizard" className="hover:text-white transition-colors">
                    여행 설계하기
                  </a>
                  <a href="/trips" className="hover:text-white transition-colors">
                    내 여행
                  </a>
                  <span className="h-4 w-px bg-zinc-700/70" />
                  <AuthButton />
                </nav>
              </div>
            </header>

            <main className="flex-1 pb-12 md:pb-16">{children}</main>
          </div>
        </Providers>
      </body>
    </html>
  );
}
