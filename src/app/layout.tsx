import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FunFUnGames",
  description:
    "Tetris, 2048, Snake, Memory Match를 한곳에서 즐기는 밝고 캐주얼한 미니게임 포털.",
  metadataBase: new URL("https://funfungames.vercel.app"),
  openGraph: {
    title: "FunFUnGames",
    description:
      "밝고 캐주얼한 무드로 즐기는 미니게임 포털 · Tetris · 2048 · Snake · Memory Match",
    url: "https://funfungames.vercel.app",
    siteName: "FunFUnGames",
    locale: "ko_KR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FunFUnGames",
    description:
      "밝고 캐주얼한 무드로 즐기는 미니게임 포털 · Tetris · 2048 · Snake · Memory Match",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
