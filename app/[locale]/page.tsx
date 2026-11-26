import { tryGetSupabase } from '@/lib/supabase'
import {
  BRANDS,
  UNIVERSAL_ID,
  brandCount,
  universalCount,
  getPricedVehicleModelCounts,
} from '@/lib/brands'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import OemSearchBox from '@/components/OemSearchBox'
import PhotoInquiryButton from '@/components/PhotoInquiryButton'
import { Link } from '@/i18n/navigation'
const LOGO_SRC = '/deda-logo.png'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

interface FeaturedProduct {
  slug: string
  name_en: string
  name_zh: string
  price: number | null
  img_file: string | null
  oem_number: string
  brand: string
  category: string
}

export const revalidate = 300

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'home' })
  return { title: t('title'), description: t('description') }
}

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('home')
  const bt = await getTranslations('brands')

  const supabase = tryGetSupabase()
  const counts = await getPricedVehicleModelCounts()
  const { data: products, error } = supabase
    ? await supabase
        .from('products')
        .select('slug, name_en, name_zh, price, oem_number, brand, category')
        .in('status', ['published', 'active'])
        .not('price', 'is', null)
        .order('created_at', { ascending: false })
        .limit(5)
    : { data: null, error: null }

  const featured = ((products as FeaturedProduct[]) || []).map((p: FeaturedProduct) => {
    const ext = ['.webp', '.jpg', '.png'].find((e) =>
      existsSync(join(process.cwd(), 'public', 'products', `${p.slug}${e}`)),
    )
    return { ...p, img_file: ext ? `${p.slug}${ext}` : null }
  })

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 品牌区 */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={LOGO_SRC} alt="DEDA Auto Parts logo" className="h-12 w-auto rounded-md shadow-sm" />
            <h1 className="text-4xl font-bold text-gray-900">DEDA Auto Parts</h1>
          </div>
          <p className="text-lg text-gray-600 mb-8">{t('heroSubtitle')}</p>
          <OemSearchBox />
          <div className="mt-3 flex justify-center">
            <PhotoInquiryButton locale={locale} />
          </div>
        </div>
      </section>

      {/* 品牌墙：按车型找配件（第二阶段 2.1） */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{bt('title')}</h2>
        <p className="text-sm text-gray-500 mb-6">{bt('subtitle')}</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {BRANDS.map((b) => {
            const n = brandCount(counts, b.id)
            const display = locale === 'zh' ? b.name : b.nameEn
            return (
              <Link
                key={b.id}
                href={`/brands/${b.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-gray-900">{display}</span>
                  <span className="text-sm font-bold text-blue-700">{bt('items', { count: n })}</span>
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  {n === 0 ? bt('noStock') : bt('models', { count: b.models.length })}
                </div>
              </Link>
            )
          })}
        </div>
        <Link
          href={`/brands/${UNIVERSAL_ID}`}
          className="mt-3 block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition"
        >
          <div className="flex items-baseline justify-between gap-2">
            <span className="font-semibold text-gray-900">{bt('universal')}</span>
            <span className="text-sm font-bold text-blue-700">
              {bt('items', { count: universalCount(counts) })}
            </span>
          </div>
          <div className="mt-1 text-xs text-gray-400">{bt('universalNote')}</div>
        </Link>
        <div className="mt-4 text-right">
          <Link href="/products" className="text-sm text-blue-600 hover:text-blue-800">
            {bt('viewAll')}
          </Link>
        </div>
      </section>

      {/* 精选商品区 */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">{t('featured')}</h2>

        {error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {t('loadFail')}
          </div>
        ) : !products || products.length === 0 ? (
          <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
            {t('preparing')}
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {featured.map((p: FeaturedProduct) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="block bg-white rounded-xl border border-gray-200 p-5
                           hover:shadow-lg hover:border-blue-300 transition
                           group"
              >
                {p.img_file && (
                  <img
                    src={`/products/${p.img_file}`}
                    alt={p.name_en}
                    loading="lazy"
                    className="w-full h-40 object-contain rounded-lg mb-3 bg-gray-50"
                  />
                )}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition truncate">
                      {p.name_en}
                    </h3>
                    {p.name_zh && <p className="text-sm text-gray-500 mt-0.5">{p.name_zh}</p>}
                  </div>
                  {p.category && (
                    <span className="shrink-0 text-xs bg-gray-100 text-gray-500 px-2 py-1 rounded">
                      {p.category}
                    </span>
                  )}
                </div>
                <div className="mt-3 flex items-center gap-3 text-sm">
                  <span className="text-gray-500">{p.brand}</span>
                  <span className="text-gray-300">|</span>
                  <span className="font-mono text-blue-700 font-semibold">{p.oem_number}</span>
                </div>
                {p.price != null && (
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-baseline gap-2">
                    <span className="text-xl font-bold text-orange-600">¥{p.price}</span>
                    <span className="text-xs text-gray-400">
                      {locale === 'zh' ? '批量优惠询价' : locale === 'ru' ? 'Опт по запросу' : 'Bulk inquiry'}
                    </span>
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
