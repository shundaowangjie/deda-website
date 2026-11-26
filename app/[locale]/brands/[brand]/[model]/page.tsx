import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import {
  BRAND_PAGE_SIZE,
  UNIVERSAL_VALUE,
  fetchBrandProducts,
  getBrand,
  getModel,
  modelVehicleValues,
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
  params: Promise<{ locale: string; brand: string; model: string }>
}): Promise<Metadata> {
  const { locale, brand: brandId, model: modelId } = await params
  const brand = getBrand(brandId)
  const model = brand ? getModel(brand, modelId) : undefined
  if (!brand || !model) return { title: 'DEDA Auto Parts' }
  const bName = locale === 'zh' ? brand.name : brand.nameEn
  const mName = locale === 'zh' ? model.name : model.nameEn
  return { title: `${bName} ${mName} | DEDA Auto Parts` }
}

export default async function ModelPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; brand: string; model: string }>
  searchParams: Promise<SP>
}) {
  const { locale, brand: brandId, model: modelId } = await params
  setRequestLocale(locale)
  const bt = await getTranslations('brands')
  const resolved = await searchParams
  const pageNum = Math.max(1, parseInt(sp(resolved, 'page') || '1', 10) || 1)
  const universal = sp(resolved, 'universal') === '1'

  const brand = getBrand(brandId)
  const model = brand ? getModel(brand, modelId) : undefined
  if (!brand || !model) notFound()
  const bName = locale === 'zh' ? brand.name : brand.nameEn
  const mName = locale === 'zh' ? model.name : model.nameEn

  const values = modelVehicleValues(brandId, modelId)
  const listValues = universal ? [...values, UNIVERSAL_VALUE] : values
  const { products, total } = await fetchBrandProducts(listValues, pageNum)

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href={`/brands/${brandId}`} className="text-sm text-gray-500 hover:text-gray-700">
            ← {bName}
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-2">{mName}</h1>
          <p className="text-gray-600 mt-1">
            {bt('total', { total: total.toLocaleString() })}
            {model.engines.length > 0 && ` · ${bt('engines')}: ${model.engines.join(' · ')}`}
            {universal && ` · ${bt('includeUniversal')}`}
          </p>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <BrandProductList
          products={products}
          total={total}
          page={pageNum}
          pageSize={BRAND_PAGE_SIZE}
          basePath={`/brands/${brandId}/${modelId}`}
          universal={universal}
          locale={locale}
        />
      </div>
    </main>
  )
}
