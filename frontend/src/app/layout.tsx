import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "金铲铲 S17 阵容推荐助手",
  description:
    "根据你的开局英雄和局内情况，智能推荐金铲铲之战 S17 阵容、装备、强化和站位方案。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}

