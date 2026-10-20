import { tryGetSupabase } from '@/lib/supabase'
import { unstable_cache } from 'next/cache'
import { setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'

export const revalidate = 300

const PAGE_SIZE = 20

export function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  return Promise.resolve({
    title: 'Engine Bearings & Bushings | DEDA Auto Parts',
    description:
      'Main bearings, connecting rod bearings, camshaft bearings and bushings. DAFENG brand for Weichai WP10/WP12, Sinotruk MC11/MC13 and marine engines. 570+ SKUs with OE numbers. Jinan DEDA Auto Parts.',
  })
}

/** 拉取大丰轴瓦产品（brand=大丰，df-* slug） */
const getBearings = unstable_cache(
  async (): Promise<{
    products: {
      slug: string
      name_en: string
      name_zh: string | null
      brand: string | null
      category: string
      truck_model: string | null
    }[]
    total: number
  }> => {
    const supabase = tryGetSupabase()
    if (!supabase) return { products: [], total: 0 }

    const { count, data } = await supabase
      .from('products')
      .select('slug, name_en, name_zh, brand, category, truck_model')
      .in('status', ['published', 'active'])
      .eq('brand', '大丰')
      .order('category', { ascending: true })
      .order('name_en', { ascending: true })
      .order('id', { ascending: true })
      .limit(200)

    return { products: data || [], total: count || 0 }
  },
  ['bearings-dafeng-v1'],
  { revalidate: 300 },
)

type BearingItem = { title: string; note: string; desc: string }
type BearingBrand = { name: string; note: string }

type BearingContent = {
  title: string
  subtitle: string
  desc: string
  section1Title: string
  section1Desc: string
  items: BearingItem[]
  section2Title: string
  section2Desc: string
  trucks: string[]
  section3Title: string
  section3Desc: string
  brands: BearingBrand[]
  section4Title: string
  section4Desc: string
  oeHint: string
  catalogTitle: string
  catalogCount: string
  noCatalog: string
  viewAll: string
  ctaTitle: string
  ctaDesc: string
  ctaBtn: string
}

const CONTENT: Record<'zh' | 'en' | 'ru', BearingContent> = {
  zh: {
    title: '轴瓦与衬套产品线',
    subtitle: '主轴瓦 · 连杆轴瓦 · 凸轮轴套 · 衬套 — 大丰全系列',
    desc: '济南德达汽车配件有限公司提供大丰（DAFENG）轴瓦全系列产品，涵盖主轴瓦、连杆轴瓦、凸轮轴套、止推片及各类衬套，适配潍柴 WP10/WP12、重汽 MC11/MC13 等主流机型，另覆盖船机与轻卡方向，500+ 品类含 OE 号对照。',
    section1Title: '产品线组成',
    section1Desc: '轴瓦产品线覆盖发动机曲柄连杆机构与配气机构的全部滑动轴承需求。',
    items: [
      { title: '主轴瓦', note: 'Main Bearing', desc: '各机型主轴颈轴瓦，标准瓦与加大级瓦（0.25/0.5 等）齐备' },
      { title: '连杆轴瓦', note: 'Connecting Rod Bearing', desc: '连杆大头瓦，含带衬套变体与多表面处理（MoS2 等）选项' },
      { title: '凸轮轴套/轴瓦', note: 'Camshaft Bearing', desc: '凸轮轴衬套与轴瓦，适配 G5/G615/TBD234 等机型' },
      { title: '衬套/止推片', note: 'Bushing & Thrust Washer', desc: '连杆衬套、各类铜套与止推片，含留镗规格' },
    ],
    section2Title: '适配机型',
    section2Desc: '覆盖中重卡、轻卡、船机与轿车四大方向的主流机型。',
    trucks: [
      '潍柴 WP10 / WP12', '重汽 MC11 / MC13', '潍柴 G615 / G5',
      '豪沃 / HOWO', '斯太尔 / Steyr', 'TBD234 船机',
      '轻卡系列', '解放 / FAW', '陕汽德龙 / Delong',
    ],
    section3Title: '供应商品牌',
    section3Desc: '原厂品质，专业制造。',
    brands: [
      { name: '大丰 / DAFENG', note: '专业轴瓦制造商 — 611 项产品数据来源' },
      { name: '德达 / DEDA', note: '济南德达汽车配件 — 销售代理' },
    ],
    section4Title: 'OE 号对照',
    section4Desc: '500+ 品类含 OE 号，支持互换号检索，便于快速选型。',
    oeHint: '528 行含 OE 号（如 612600030020 / VG1500010046 等），支持 OE 直查报价。',
    catalogTitle: '在售产品',
    catalogCount: '共 {count} 款产品',
    noCatalog: '暂无在售产品',
    viewAll: '查看全部轴瓦 →',
    ctaTitle: '需要报价？',
    ctaDesc: '发送 OE 号，10 分钟内回复报价。',
    ctaBtn: '提交询价',
  },
  en: {
    title: 'Engine Bearings & Bushings Line',
    subtitle: 'Main · Rod · Camshaft Bearings & Bushings — Full DAFENG Range',
    desc: 'Jinan DEDA Auto Parts supplies the complete DAFENG bearing line: main bearings, connecting rod bearings, camshaft bearings, thrust washers and bushings. Fits Weichai WP10/WP12, Sinotruk MC11/MC13 and marine engines. 500+ SKUs with OE cross-reference.',
    section1Title: 'Product Lineup',
    section1Desc: 'The bearing line covers all sliding bearing needs of the cranktrain and valvetrain.',
    items: [
      { title: 'Main Bearings', note: 'Main Bearing', desc: 'Standard and oversize grades (0.25/0.5 etc.) for all major engines' },
      { title: 'Rod Bearings', note: 'Connecting Rod Bearing', desc: 'Rod bearings incl. bushed variants and multiple coatings (MoS2 etc.)' },
      { title: 'Camshaft Bearings', note: 'Camshaft Bearing', desc: 'Camshaft bushings and bearings for G5/G615/TBD234 etc.' },
      { title: 'Bushings & Thrust', note: 'Bushing & Thrust Washer', desc: 'Rod bushings, bronze sleeves and thrust washers, rebore specs available' },
    ],
    section2Title: 'Fitting Engines',
    section2Desc: 'Covering medium/heavy truck, light truck, marine and passenger car engines.',
    trucks: [
      'Weichai WP10 / WP12', 'Sinotruk MC11 / MC13', 'Weichai G615 / G5',
      'HOWO', 'Steyr', 'TBD234 Marine',
      'Light Truck Series', 'FAW', 'Shacman Delong',
    ],
    section3Title: 'Supplier Brands',
    section3Desc: 'OEM quality, professional manufacturing.',
    brands: [
      { name: 'DAFENG', note: 'Professional bearing manufacturer — source of 611-item catalog' },
      { name: 'DEDA', note: 'Jinan DEDA Auto Parts — sales agent' },
    ],
    section4Title: 'OE Cross-Reference',
    section4Desc: '500+ SKUs with OE numbers and interchange lookup for quick selection.',
    oeHint: '528 SKUs carry OE numbers (e.g. 612600030020 / VG1500010046), OE direct query supported.',
    catalogTitle: 'In Stock',
    catalogCount: '{count} products',
    noCatalog: 'No products in stock',
    viewAll: 'View all bearings →',
    ctaTitle: 'Need a quote?',
    ctaDesc: 'Send your OE number, quote within 10 minutes.',
    ctaBtn: 'Submit Inquiry',
  },
  ru: {
    title: 'Линия вкладышей и втулок',
    subtitle: 'Коренные · Шатунные · Распредвал — Полная линейка DAFENG',
    desc: 'Jinan DEDA Auto Parts предлагает полную линейку вкладышей DAFENG: коренные, шатунные, распределительного вала, упорные шайбы и втулки. Для Weichai WP10/WP12, Sinotruk MC11/MC13 и судовых двигателей. 500+ позиций с OE-номерами.',
    section1Title: 'Ассортимент',
    section1Desc: 'Линия покрывает все потребности скользящих подшипников КШМ и ГРМ.',
    items: [
      { title: 'Коренные вкладыши', note: 'Main Bearing', desc: 'Стандартные и ремонтные размеры (0.25/0.5 и др.)' },
      { title: 'Шатунные вкладыши', note: 'Rod Bearing', desc: 'Включая варианты с втулками и покрытиями (MoS2 и др.)' },
      { title: 'Втулки распредвала', note: 'Camshaft Bearing', desc: 'Для G5/G615/TBD234 и других двигателей' },
      { title: 'Втулки и упорные', note: 'Bushing & Thrust Washer', desc: 'Втулки, бронзовые гильзы, упорные шайбы, расточные размеры' },
    ],
    section2Title: 'Двигатели',
    section2Desc: 'Средне-/тяжелонагруженные, лёгкие грузовики, судовые и легковые.',
    trucks: [
      'Weichai WP10 / WP12', 'Sinotruk MC11 / MC13', 'Weichai G615 / G5',
      'HOWO', 'Steyr', 'TBD234 (судовой)',
      'Серия лёгких грузовиков', 'FAW', 'Shacman Delong',
    ],
    section3Title: 'Бренды',
    section3Desc: 'Оригинальное качество, профессиональное производство.',
    brands: [
      { name: 'DAFENG', note: 'Профессиональный производитель вкладышей — источник каталога (611 позиций)' },
      { name: 'DEDA', note: 'Jinan DEDA Auto Parts — дистрибьютор' },
    ],
    section4Title: 'OE-справочник',
    section4Desc: '500+ позиций с OE-номерами и таблицами взаимозаменяемости.',
    oeHint: '528 позиций с OE-номерами (напр. 612600030020 / VG1500010046), поиск по OE поддерживается.',
    catalogTitle: 'В наличии',
    catalogCount: '{count} товаров',
    noCatalog: 'Нет товаров в наличии',
    viewAll: 'Все вкладыши →',
    ctaTitle: 'Нужна цена?',
    ctaDesc: 'Отправьте OE-номер, ответим за 10 минут.',
    ctaBtn: 'Отправить запрос',
  },
}

export default async function BearingsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const { products, total } = await getBearings()

  const catLabel = (c: string) => {
    if (c === 'bearing') return locale === 'zh' ? '轴瓦' : locale === 'ru' ? 'Вкладыши' : 'Bearing'
    if (c === 'engine-parts') return locale === 'zh' ? '发动机件' : locale === 'ru' ? 'Детали двигателя' : 'Engine Parts'
    return c
  }

  const localeKey = (['zh', 'en', 'ru'] as const).find((k) => k === locale) ?? 'zh'
  const content = CONTENT[localeKey]

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-xs font-semibold text-amber-300 uppercase tracking-wider mb-3">
            Engine · Bearing &amp; Bushing
          </div>
          <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
          <p className="text-lg text-slate-300 mb-3">{content.subtitle}</p>
          <p className="text-slate-400 leading-relaxed max-w-3xl">{content.desc}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/inquiry"
              className="inline-flex items-center px-5 py-2.5 bg-amber-600 hover:bg-amber-700 rounded-lg font-medium transition"
            >
              {content.ctaBtn}
            </Link>
            {products.length > 0 && (
              <Link
                href={`/products?category=bearing`}
                className="inline-flex items-center px-5 py-2.5 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition"
              >
                {content.viewAll}
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* 产品线组成 */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{content.section1Title}</h2>
        <p className="text-gray-600 mb-6">{content.section1Desc}</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {content.items.map((item, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
              <div className="w-10 h-10 bg-amber-50 text-amber-700 rounded-lg flex items-center justify-center mb-3 text-lg font-bold">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-xs text-gray-400 mb-2">{item.note}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 适配机型 */}
      <section className="bg-white border-y border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{content.section2Title}</h2>
          <p className="text-gray-600 mb-6">{content.section2Desc}</p>
          <div className="flex flex-wrap gap-2">
            {content.trucks.map((tr, i) => (
              <span key={i} className="px-3 py-1.5 bg-slate-100 text-slate-700 rounded-full text-sm font-medium">
                {tr}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 供应商品牌 */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{content.section3Title}</h2>
        <p className="text-gray-600 mb-6">{content.section3Desc}</p>
        <div className="grid gap-4 sm:grid-cols-2">
          {content.brands.map((b, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="font-bold text-amber-700 mb-1">{b.name}</div>
              <div className="text-sm text-gray-600 leading-relaxed">{b.note}</div>
            </div>
          ))}
        </div>
      </section>

      {/* OE 交叉对照 */}
      <section className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-2xl font-bold mb-2">{content.section4Title}</h2>
          <p className="text-slate-300 mb-4">{content.section4Desc}</p>
          <div className="inline-block px-4 py-2 bg-amber-600/20 border border-amber-500/40 rounded-lg text-amber-200 text-sm">
            {content.oeHint}
          </div>
        </div>
      </section>

      {/* 在售产品 */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{content.catalogTitle}</h2>
          <span className="text-sm text-gray-500">
            {content.catalogCount.replace('{count}', String(total))}
          </span>
        </div>

        {products.length === 0 ? (
          <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
            {content.noCatalog}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {products.slice(0, PAGE_SIZE).map((p) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-amber-300 transition group"
              >
                <div className="text-xs text-gray-400 mb-1">{catLabel(p.category)}</div>
                <h3 className="font-medium text-gray-900 group-hover:text-amber-700 transition text-sm leading-snug line-clamp-2 mb-1">
                  {p.name_en}
                </h3>
                {p.name_zh && (
                  <p className="text-xs text-gray-500 line-clamp-1">{p.name_zh}</p>
                )}
                {p.truck_model && (
                  <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                    {locale === 'zh' ? '适配: ' : locale === 'ru' ? 'Двигатель: ' : 'Fits: '}
                    <span className="text-gray-700 font-medium">{p.truck_model}</span>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
