import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { setRequestLocale } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import '../globals.css'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://products.dedaautoparts.com'

// 全站结构化数据:Organization + WebSite(含搜索入口,三语)
const orgLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE}/#organization`,
      name: 'Jinan DEDA Auto Parts Co., Ltd.',
      alternateName: ['济南德达汽车配件', 'DEDA Auto Parts'],
      url: 'https://dedaautoparts.com',
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE}/#website`,
      url: SITE,
      name: 'DEDA Auto Parts — Heavy Truck Parts Catalog',
      inLanguage: ['en', 'ru', 'zh-CN'],
      publisher: { '@id': `${SITE}/#organization` },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${SITE}/products?q={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

const LAYOUT_META: Record<string, { title: string; description: string; keywords: string }> = {
  zh: {
    title: 'DEDA Auto Parts — 重卡配件平台',
    description: '济南德达汽车配件有限公司产品目录与询价平台',
    keywords: '重卡配件, 重汽配件, HOWO配件, 解放配件, 陕汽配件, 汽车配件, OEM配件',
  },
  en: {
    title: 'DEDA Auto Parts — Heavy Truck Parts Supplier',
    description: 'Product catalog and inquiry platform of Jinan DEDA Auto Parts Co., Ltd. — SINOTRUK HOWO, FAW Jiefang, Shaanxi Auto and Foton heavy truck parts.',
    keywords: 'heavy truck parts, HOWO parts, SINOTRUK parts, FAW Jiefang parts, Shacman parts, Foton parts, OEM truck parts, China truck spare parts',
  },
  ru: {
    title: 'DEDA Auto Parts — запчасти для тяжёлых грузовиков',
    description: 'Каталог запчастей и запрос цен — Jinan DEDA Auto Parts Co., Ltd. Запчасти SINOTRUK HOWO, FAW Jiefang, Shaanxi Auto, Foton.',
    keywords: 'запчасти HOWO, запчасти Sinotruk, запчасти для грузовиков, запчасти Шаньси, запчасти Фотон, OEM запчасти Китай',
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const meta = LAYOUT_META[locale] || LAYOUT_META.zh
  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }
  setRequestLocale(locale)

  return (
    <html lang={locale === 'zh' ? 'zh-CN' : locale}>
      <body className="min-h-screen bg-gray-50 antialiased flex flex-col" style={{ fontFamily: '"Microsoft YaHei", "Segoe UI", Arial, sans-serif' }}>
        {/* 嵌入模式:?embed=1 时隐藏站点导航/页脚(供形象站 iframe 内嵌),置于 body 首部避免闪烁 */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(new URLSearchParams(location.search).get('embed')==='1'){document.documentElement.classList.add('embed');}}catch(e){}",
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
        <NextIntlClientProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
