import { tryGetSupabase } from '@/lib/supabase'
import { unstable_cache } from 'next/cache'
import { getTranslations, setRequestLocale } from 'next-intl/server'
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
    title: 'U Joints & Drivetrain | DEDA Auto Parts',
    description:
      'Universal joint cross joints, yokes, bearings, and cross-reference catalog. ZHANWANG brand with Caterpillar/Komatsu OE mapping. Jinan DEDA Auto Parts.',
  })
}

/** 拉取 U 型接头相关产品 (drivetrain 分类中 U-joint 关键词 + 万向节叉 + 万向节轴承) */
const getUJoints = unstable_cache(
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

    // 关键词: 传动轴十字轴 / 万向节叉 / 万向节轴承 / U-joint cross / universal joint
    const { count, data } = await supabase
      .from('products')
      .select('slug, name_en, name_zh, brand, category, truck_model')
      .in('status', ['published', 'active'])
      .or('name_zh.ilike.%万向节%,name_zh.ilike.%十字轴%,name_zh.ilike.%万向节叉%,slug.ilike.*ujoint*,slug.ilike.*universal-joint*,slug.ilike.*wan-xiang%')
      .order('category', { ascending: true })
      .order('name_en', { ascending: true })
      .order('id', { ascending: true })
      .limit(200)

    return { products: data || [], total: count || 0 }
  },
  ['ujoints-v1'],
  { revalidate: 300 },
)

export default async function UJointsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('ujoints')
  const { products, total } = await getUJoints()

  const catLabel = (c: string) => {
    if (c === 'drivetrain') return locale === 'zh' ? '传动系统' : locale === 'ru' ? 'Трансмиссия' : 'Drivetrain'
    if (c === 'bearing') return locale === 'zh' ? '轴承' : locale === 'ru' ? 'Подшипник' : 'Bearing'
    return c
  }

  // 三语文案
  const localeKey = (['zh', 'en', 'ru'] as const).find((k) => k === locale) ?? 'zh'
  const content = CONTENT[localeKey]

  return (
    <PageView content={content} products={products} locale={localeKey} catLabel={catLabel} />
  )
}

type UJointsItem = { title: string; note: string; desc: string }
type UJointsBrand = { name: string; note: string }

type UJointsContent = {
  title: string
  subtitle: string
  desc: string
  section1Title: string
  section1Desc: string
  items: UJointsItem[]
  section2Title: string
  section2Desc: string
  trucks: string[]
  section3Title: string
  section3Desc: string
  brands: UJointsBrand[]
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

const CONTENT: Record<'zh' | 'en' | 'ru', UJointsContent> = {
  zh: {
      title: 'U型接头产品线',
      subtitle: '万向节 · 十字轴 · 万向节叉 · 轴承 — 全系列覆盖',
      desc: '济南德达汽车配件有限公司提供 U 型接头全系列产品，涵盖万向节十字轴、万向节叉、万向节轴承三大品类。数据源自山东济宁瞻程传动（ZHANWANG）专业图册，包含 CATERPILLAR / KOMATSU 等品牌 OE 号交叉对照。',
      section1Title: '产品线组成',
      section1Desc: 'U 型接头产品线由四大板块组成，覆盖从十字轴本体到万向节叉的完整供应链。',
      items: [
        { title: '传动轴十字轴', note: 'Universal Joint Cross', desc: 'Φ27~Φ66 全尺寸覆盖，外卡式/内卡式/锁片式三种安装方式' },
        { title: '万向节叉', note: 'Universal Joint Yoke', desc: '587.10 / 587.30 / 687.55 / YC64152 等 11 大系列，89 款规格' },
        { title: '万向节十字轴承', note: 'Cross Bearing', desc: '6204-2RS 等标准型号，适用于 CA151 等车型' },
        { title: '万向节滚针轴承', note: 'Needle Bearing', desc: '7304 等规格，适用于 BJ130 等车型' },
      ],
      section2Title: '适配车型',
      section2Desc: 'U 型接头适用于主流重卡及工程车型。',
      trucks: [
        '豪沃 / HOWO', '豪瀚 / Haohan', '重汽 STR', '重汽 T7H',
        '解放 J6 / JH6', '陕汽德龙 / Delong', '东风天龙 / Tianlong',
        '红岩 / Hongyan', '五十铃 / Isuzu', '金龙客车 / King Long',
      ],
      section3Title: '供应商品牌',
      section3Desc: '原厂品质，专业制造。',
      brands: [
        { name: 'ZHANWANG / 瞻程', note: '山东济宁瞻程传动科技有限公司 — 图册数据来源' },
        { name: '德达 / DEDA', note: '济南德达汽车配件 — 销售代理' },
        { name: 'DP Driveshaft Parts', note: '万向节叉专业制造商' },
      ],
      section4Title: 'OE 交叉对照',
      section4Desc: '图册收录 CATERPILLAR / KOMATSU 等品牌 OE 号对照表，便于快速选型。',
      oeHint: '共 200+ 条 OE 号映射，详见供应商图册 P2-P10。',
      catalogTitle: '在售产品',
      catalogCount: '共 {count} 款产品',
      noCatalog: '暂无在售产品',
      viewAll: '查看全部 U 型接头 →',
      ctaTitle: '需要报价？',
      ctaDesc: '提交询价单，24 小时内回复。',
      ctaBtn: '提交询价',
    },
    en: {
      title: 'U Joint & Drivetrain Line',
      subtitle: 'Cross Joints · Yokes · Bearings — Full Coverage',
      desc: 'Jinan DEDA Auto Parts provides a complete U joint product line covering cross joints, yokes, and bearings. Data sourced from ZHANWANG (Shandong Jining) professional catalog with Caterpillar / Komatsu OE cross-reference.',
      section1Title: 'Product Lineup',
      section1Desc: 'The U joint line consists of four major categories covering the complete supply chain.',
      items: [
        { title: 'Cross Joints', note: 'Universal Joint Cross', desc: 'Φ27~Φ66 full range, external/ internal/pin lock installation' },
        { title: 'Yokes', note: 'Universal Joint Yoke', desc: '587.10 / 587.30 / 687.55 / YC64152 etc., 89 specifications' },
        { title: 'Cross Bearings', note: 'Cross Bearing', desc: '6204-2RS standard, for CA151 and more' },
        { title: 'Needle Bearings', note: 'Needle Bearing', desc: '7304 spec, for BJ130 and more' },
      ],
      section2Title: 'Fitting Vehicles',
      section2Desc: 'U joints for mainstream heavy trucks and construction vehicles.',
      trucks: [
        'SINOTRUK HOWO', 'Haohan', 'STR', 'T7H',
        'FAW J6 / JH6', 'Shacman Delong', 'Dongfeng Tianlong',
        'Hongyan', 'Isuzu', 'King Long Bus',
      ],
      section3Title: 'Supplier Brands',
      section3Desc: 'OEM quality, professional manufacturing.',
      brands: [
        { name: 'ZHANWANG', note: 'Shandong Jining Zhanwang Transmission — catalog source' },
        { name: 'DEDA', note: 'Jinan DEDA Auto Parts — sales agent' },
        { name: 'DP Driveshaft Parts', note: 'Professional yoke manufacturer' },
      ],
      section4Title: 'OE Cross-Reference',
      section4Desc: 'Catalog includes Caterpillar / Komatsu OE mapping for quick selection.',
      oeHint: '200+ OE mappings, see catalog pages P2-P10.',
      catalogTitle: 'In Stock',
      catalogCount: '{count} products',
      noCatalog: 'No products in stock',
      viewAll: 'View all U joints →',
      ctaTitle: 'Need a quote?',
      ctaDesc: 'Submit an inquiry, we reply within 24 hours.',
      ctaBtn: 'Submit Inquiry',
    },
    ru: {
      title: 'Линия ШРУС и карданных втулок',
      subtitle: 'Крестовины · Вилки · Подшипники — Полный ассортимент',
      desc: 'Jinan DEDA Auto Parts предлагает полную линию ШРУС и карданных деталей, включая крестовины, вилки и подшипники. Данные из каталога ZHANWANG (Шаньдун Цзинань) с перекрёстной связью OE Caterpillar / Komatsu.',
      section1Title: 'Ассортимент',
      section1Desc: 'Линия ШРУС включает четыре основных категории, покрывающих всю цепочку поставок.',
      items: [
        { title: 'Крестовины', note: 'Универсальный шарнир', desc: 'Полный диапазон Φ27~Φ66, внешний/внутренний/застёжки' },
        { title: 'Вилки', note: 'Вилка кардана', desc: 'Серии 587.10 / 587.30 / 687.55 / YC64152 и др., 89 спецификаций' },
        { title: 'Подшипники крестовин', note: 'Cross Bearing', desc: 'Стандарт 6204-2RS, для CA151 и др.' },
        { title: 'Игольчатые подшипники', note: 'Needle Bearing', desc: '7304, для BJ130 и др.' },
      ],
      section2Title: 'Машины',
      section2Desc: 'ШРУС для основных тяжёлых грузовиков и строительных машин.',
      trucks: [
        'SINOTRUK HOWO', 'Haohan', 'STR', 'T7H',
        'FAW J6 / JH6', 'Shacman Delong', 'Dongfeng Tianlong',
        'Hongyan', 'Isuzu', 'King Long Bus',
      ],
      section3Title: 'Бренды',
      section3Desc: 'Оригинальное качество, профессиональное производство.',
      brands: [
        { name: 'ZHANWANG', note: 'Shandong Jining Zhanwang — источник каталога' },
        { name: 'DEDA', note: 'Jinan DEDA Auto Parts — дистрибьютор' },
        { name: 'DP Driveshaft Parts', note: 'Профессиональный производитель вилок' },
      ],
      section4Title: 'Перекрёстная связь OE',
      section4Desc: 'Каталог включает связи OE Caterpillar / Komatsu для быстрого выбора.',
      oeHint: '200+ связей OE, см. страницы P2-P10.',
      catalogTitle: 'В наличии',
      catalogCount: '{count} товаров',
      noCatalog: 'Нет товаров в наличии',
      viewAll: 'Все ШРУС →',
      ctaTitle: 'Нужна цена?',
      ctaDesc: 'Отправьте запрос, ответим в течение 24 часов.',
      ctaBtn: 'Отправить запрос',
  },
}

function PageView({
  content,
  products,
  locale,
  catLabel,
}: {
  content: UJointsContent
  products: {
    slug: string
    name_en: string
    name_zh: string | null
    brand: string | null
    category: string
    truck_model: string | null
  }[]
  locale: 'zh' | 'en' | 'ru'
  catLabel: (c: string) => string
}) {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-16">
          <div className="text-xs font-semibold text-blue-300 uppercase tracking-wider mb-3">
            Drivetrain · Universal Joint
          </div>
          <h1 className="text-4xl font-bold mb-4">{content.title}</h1>
          <p className="text-lg text-slate-300 mb-3">{content.subtitle}</p>
          <p className="text-slate-400 leading-relaxed max-w-3xl">{content.desc}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/inquiry"
              className="inline-flex items-center px-5 py-2.5 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition"
            >
              {content.ctaBtn}
            </Link>
            {products.length > 0 && (
              <Link
                href={`/products?category=drivetrain`}
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
              <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-lg flex items-center justify-center mb-3 text-lg font-bold">
                {String(i + 1).padStart(2, '0')}
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{item.title}</h3>
              <p className="text-xs text-gray-400 mb-2">{item.note}</p>
              <p className="text-sm text-gray-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 适配车型 */}
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
        <div className="grid gap-4 sm:grid-cols-3">
          {content.brands.map((b, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 p-5">
              <div className="font-bold text-blue-700 mb-1">{b.name}</div>
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
          <div className="inline-block px-4 py-2 bg-blue-600/20 border border-blue-500/40 rounded-lg text-blue-200 text-sm">
            {content.oeHint}
          </div>
        </div>
      </section>

      {/* 在售产品 */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <div className="flex items-baseline justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{content.catalogTitle}</h2>
          {products.length > 0 && (
            <span className="text-sm text-gray-500">
              {content.catalogCount.replace('{count}', String(products.length))}
            </span>
          )}
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
                className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition group"
              >
                <div className="text-xs text-gray-400 mb-1">{catLabel(p.category)}</div>
                <h3 className="font-medium text-gray-900 group-hover:text-blue-700 transition text-sm leading-snug line-clamp-2 mb-1">
                  {p.name_en}
                </h3>
                {p.name_zh && (
                  <p className="text-xs text-gray-500 line-clamp-1">{p.name_zh}</p>
                )}
                {p.truck_model && (
                  <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                    {locale === 'zh' ? '适用: ' : locale === 'ru' ? 'Подходит: ' : 'Fits: '}
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
