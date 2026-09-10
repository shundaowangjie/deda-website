import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "DEDA Auto Parts — 重卡配件平台",
  description: "济南德达汽车配件有限公司产品目录与询价平台",
  keywords: "重卡配件, 重汽配件, HOWO配件, 解放配件, 陕汽配件, 汽车配件, OEM配件",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-gray-50 antialiased flex flex-col" style={{ fontFamily: '"Microsoft YaHei", "Segoe UI", Arial, sans-serif' }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}