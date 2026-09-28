import { tryGetSupabase } from '@/lib/supabase'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import OemSearchBox from '@/components/OemSearchBox'
import PhotoInquiryButton from '@/components/PhotoInquiryButton'
import { Link } from '@/i18n/navigation'
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

  const supabase = tryGetSupabase()
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
          <h1 className="text-4xl font-bold text-gray-900 mb-3">DEDA Auto Parts</h1>
          <p className="text-lg text-gray-600 mb-8">{t('heroSubtitle')}</p>
          <OemSearchBox />
          <div className="mt-3 flex justify-center">
            <PhotoInquiryButton />
          </div>
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
