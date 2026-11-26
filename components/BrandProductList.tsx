import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import InquiryButton from '@/components/InquiryButton'
import { categoryLabelFor } from '@/lib/categories'
import type { BrandListProduct } from '@/lib/brands'

interface Props {
  products: BrandListProduct[]
  total: number
  page: number
  pageSize: number
  /** 不带 locale 前缀的基础路径，如 /brands/howo；Link 会自动加 locale */
  basePath: string
  universal: boolean
  locale: string
  /** 通用入口页本身不需要“含通用件”开关 */
  showUniversalToggle?: boolean
}

export default async function BrandProductList({
  products,
  total,
  page,
  pageSize,
  basePath,
  universal,
  locale,
  showUniversalToggle = true,
}: Props) {
  const t = await getTranslations('catalog')
  const bt = await getTranslations('brands')
  const catLabel = (slug: string) => categoryLabelFor(slug, locale)
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  function hrefFor(p: number, u: boolean): string {
    const params = new URLSearchParams()
    if (p > 1) params.set('page', String(p))
    if (u) params.set('universal', '1')
    const qs = params.toString()
    return qs ? `${basePath}?${qs}` : basePath
  }

  const pageWindow: (number | string)[] = []
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pageWindow.push(i)
  } else {
    pageWindow.push(1)
    if (page > 3) pageWindow.push('…')
    for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pageWindow.push(i)
    if (page < totalPages - 2) pageWindow.push('…')
    pageWindow.push(totalPages)
  }

  const pageBtn = (active: boolean) =>
    `min-w-9 h-9 px-2 inline-flex items-center justify-center rounded-lg text-sm border transition-colors ${
      active
        ? 'bg-blue-600 text-white border-blue-600 font-medium'
        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-700'
    }`

  return (
    <div>
      {showUniversalToggle && (
        <div className="flex justify-end mb-4">
          {universal ? (
            <Link
              href={hrefFor(1, false)}
              className="text-sm bg-blue-600 text-white px-3 py-1.5 rounded-full hover:bg-blue-700"
            >
              {bt('hideUniversal')}
            </Link>
          ) : (
            <Link
              href={hrefFor(1, true)}
              className="text-sm bg-white text-gray-700 border border-gray-300 px-3 py-1.5 rounded-full hover:border-blue-400 hover:text-blue-700"
            >
              {bt('includeUniversal')}
            </Link>
          )}
        </div>
      )}

      {products.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-400">{bt('noStock')}</p>
          <Link href="/products" className="mt-4 inline-block text-sm text-blue-600 hover:text-blue-800">
            {bt('viewAll')}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {products.map((product) => (
            <div
              key={product.slug}
              className="bg-white rounded-lg border border-gray-200 p-4
                         hover:shadow-md hover:border-blue-300 transition
                         group flex flex-col"
            >
              <Link href={`/products/${product.slug}`} className="flex-1">
                {product.img_file && (
                  <img
                    src={`/products/${product.img_file}`}
                    alt={product.name_en}
                    loading="lazy"
                    className="w-full h-36 object-contain bg-white rounded-lg mb-3 border border-gray-100"
                  />
                )}
                <div className="flex justify-between items-start gap-2 mb-2">
                  <h3 className="font-medium text-gray-900 group-hover:text-blue-700 truncate">
                    {locale === 'ru'
                      ? product.name_ru || product.name_zh || product.name_en
                      : product.name_zh || product.name_en}
                  </h3>
                  <span className="shrink-0 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                    {catLabel(product.category)}
                  </span>
                </div>
                {(locale === 'ru' ? product.name_ru && product.name_en : product.name_zh && product.name_en) && (
                  <p className="text-sm text-gray-500 mb-2 truncate">{product.name_en}</p>
                )}
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  {product.brand && <span className="text-gray-500">{product.brand}</span>}
                  {product.oem_number && (
                    <>
                      <span className="text-gray-300">|</span>
                      <span className="font-mono text-blue-700 font-semibold">{product.oem_number}</span>
                    </>
                  )}
                </div>
                {product.truck_model && (
                  <div className="mt-2 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded truncate">
                    {t('fitsPrefix')}
                    {product.truck_model}
                  </div>
                )}
                <div className="mt-2 text-xs text-gray-400">SKU: {product.sku}</div>
              </Link>
              <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                {product.price != null ? (
                  <div className="flex items-baseline gap-1.5 min-w-0">
                    <span className="text-lg font-bold text-orange-600">¥{product.price}</span>
                    <span className="text-xs text-gray-400 truncate">
                      {locale === 'zh' ? '批量优惠询价' : locale === 'ru' ? 'Опт по запросу' : 'Bulk inquiry'}
                    </span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-400">
                    {locale === 'zh' ? '询价' : locale === 'ru' ? 'По запросу' : 'Inquiry'}
                  </span>
                )}
                <InquiryButton
                  compact
                  item={{
                    slug: product.slug,
                    name_en: product.name_en,
                    name_zh: product.name_zh || undefined,
                    oem_number: product.oem_number || undefined,
                    sku: product.sku,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-10 flex flex-col items-center gap-2">
          <div className="flex items-center gap-1 flex-wrap justify-center">
            {page <= 1 ? (
              <span className={`${pageBtn(false)} px-3 opacity-40 cursor-not-allowed`}>{t('prev')}</span>
            ) : (
              <Link href={hrefFor(page - 1, universal)} className={`${pageBtn(false)} px-3`}>
                {t('prev')}
              </Link>
            )}
            {pageWindow.map((n, i) =>
              n === '…' ? (
                <span key={`e${i}`} className="px-2 text-gray-400">
                  …
                </span>
              ) : (
                <Link key={n} href={hrefFor(n as number, universal)} className={pageBtn(n === page)}>
                  {n}
                </Link>
              ),
            )}
            {page >= totalPages ? (
              <span className={`${pageBtn(false)} px-3 opacity-40 cursor-not-allowed`}>{t('next')}</span>
            ) : (
              <Link href={hrefFor(page + 1, universal)} className={`${pageBtn(false)} px-3`}>
                {t('next')}
              </Link>
            )}
          </div>
          <p className="text-xs text-gray-400">
            {t('pageInfo', {
              total: total.toLocaleString(),
              page,
              pages: totalPages,
              size: pageSize,
            })}
          </p>
        </nav>
      )}
    </div>
  )
}
