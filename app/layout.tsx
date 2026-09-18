import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://products.dedaautoparts.com";

// 全站结构化数据：Organization（公司主体，主站在根域名）+ WebSite（本产品站，含搜索入口）
const orgLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: "Jinan DEDA Auto Parts Co., Ltd.",
      alternateName: ["济南德达汽车配件", "DEDA Auto Parts"],
      url: "https://dedaautoparts.com",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE}/#website`,
      url: SITE,
      name: "DEDA Auto Parts — Heavy Truck Parts Catalog",
      inLanguage: ["en", "zh-CN"],
      publisher: { "@id": `${SITE}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE}/products?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}