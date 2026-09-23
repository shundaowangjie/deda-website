import { tryGetSupabase } from '@/lib/supabase'
import OemSearchBox from '@/components/OemSearchBox'
import { Link } from '@/i18n/navigation'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

interface FeaturedProduct {
  slug: string
  name_en: string
  name_zh: string
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
        .select('slug, name_en, name_zh, oem_number, brand, category')
        .in('status', ['published', 'active'])
        .order('created_at', { ascending: false })
        .limit(5)
    : { data: null, error: null }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* 品牌区 */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">DEDA Auto Parts</h1>
          <p className="text-lg text-gray-600 mb-8">{t('heroSubtitle')}</p>
          <OemSearchBox />
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
            {products.map((p: FeaturedProduct) => (
              <Link
                key={p.slug}
                href={`/products/${p.slug}`}
                className="block bg-white rounded-xl border border-gray-200 p-5
                           hover:shadow-lg hover:border-blue-300 transition
                           group"
              >
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
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
