import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  BRAND_PAGE_SIZE,
  UNIVERSAL_ID,
  UNIVERSAL_VALUE,
  brandVehicleValues,
  fetchBrandProducts,
  getBrand,
  getPricedVehicleModelCounts,
  modelCount,
  universalVehicleValues,
} from '@/lib/brands'
import BrandProductList from '@/components/BrandProductList'

type SP = Record<string, string | string[] | undefined>

function sp(params: SP, key: string): string {
  const v = params[key]
  return (Array.isArray(v) ? v[0] : v) || ''
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; brand: string }>
}): Promise<Metadata> {
  const { locale, brand: brandId } = await params
  const t = await getTranslations({ locale, namespace: 'brands' })
  if (brandId === UNIVERSAL_ID) {
    return { title: `${t('universal')} | DEDA Auto Parts`, description: t('universalNote') }
  }
  const brand = getBrand(brandId)
  if (!brand) return { title: 'DEDA Auto Parts' }
  const name = locale === 'zh' ? brand.name : brand.nameEn
  return { title: `${name} | DEDA Auto Parts`, description: `${name} — ${t('subtitle')}` }
}

export default async function BrandPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; brand: string }>
  searchParams: Promise<SP>
}) {
  const { locale, brand: brandId } = await params
  setRequestLocale(locale)
  const bt = await getTranslations('brands')
  const resolved = await searchParams
  const pageNum = Math.max(1, parseInt(sp(resolved, 'page') || '1', 10) || 1)
  const universal = sp(resolved, 'universal') === '1'

  const counts = await getPricedVehicleModelCounts()

  // 通用入口：vehicle_model='通用'＋待归类（未映射）件
  if (brandId === UNIVERSAL_ID) {
    const values = universalVehicleValues(counts)
    const { products, total } = await fetchBrandProducts(values, pageNum)
    return (
      <main className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
              {bt('backHome')}
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{bt('universal')}</h1>
            <p className="text-gray-600 mt-1">
              {bt('total', { total: total.toLocaleString() })} · {bt('universalNote')}
            </p>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <BrandProductList
            products={products}
            total={total}
            page={pageNum}
            pageSize={BRAND_PAGE_SIZE}
            basePath={`/brands/${UNIVERSAL_ID}`}
            universal={false}
            locale={locale}
            showUniversalToggle={false}
          />
        </div>
      </main>
    )
  }

  const brand = getBrand(brandId)
  if (!brand) notFound()
  const display = locale === 'zh' ? brand.name : brand.nameEn
  const values = brandVehicleValues(brandId)
  const listValues = universal ? [...values, UNIVERSAL_VALUE] : values
  const { products, total } = await fetchBrandProducts(listValues, pageNum)

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            {bt('backHome')}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{display}</h1>
          <p className="text-gray-600 mt-1">
            {bt('total', { total: total.toLocaleString() })}
            {universal && ` · ${bt('includeUniversal')}`}
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 车型列表 */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {brand.models.map((m) => {
            const n = modelCount(counts, brandId, m.id)
            const mName = locale === 'zh' ? m.name : m.nameEn
            return (
              <Link
                key={m.id}
                href={`/brands/${brandId}/${m.id}`}
                className="block bg-white rounded-xl border border-gray-200 p-4 hover:shadow-md hover:border-blue-300 transition"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold text-gray-900">{mName}</span>
                  <span className="text-sm font-bold text-blue-700">{bt('items', { count: n })}</span>
                </div>
                <div className="mt-1 text-xs text-gray-400">
                  {n === 0 ? (
                    bt('noStock')
                  ) : (
                    <>
                      {bt('engines')}: {m.engines.length > 0 ? m.engines.join(' · ') : '—'}
                    </>
                  )}
                </div>
              </Link>
            )
          })}
        </div>

        {/* 本品牌件清单（车型＋品牌级） */}
        <BrandProductList
          products={products}
          total={total}
          page={pageNum}
          pageSize={BRAND_PAGE_SIZE}
          basePath={`/brands/${brandId}`}
          universal={universal}
          locale={locale}
        />
      </div>
    </main>
  )
}
