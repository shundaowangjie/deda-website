import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { tryGetSupabase } from '@/lib/supabase'
import { Link } from '@/i18n/navigation'
import InquiryButton from '@/components/InquiryButton'
import { categoryLabelFor } from '@/lib/categories'
import { existsSync } from 'node:fs'
import { join } from 'node:path'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const [supabase, t] = await Promise.all([
    Promise.resolve(tryGetSupabase()),
    getTranslations({ locale, namespace: 'product' }),
  ])
  const { data } = supabase
    ? await supabase
        .from('products')
        .select('name_en, name_zh, brand, oem_number')
        .eq('slug', slug)
        .in('status', ['published', 'active'])
        .maybeSingle()
    : { data: null }

  if (!data) return { title: `${t('notFound')} - DEDA Auto Parts` }

  const { name_en, name_zh, brand, oem_number } = data
  const title = `${name_en} | OEM ${oem_number ?? '-'} - DEDA`
  const description =
    locale === 'zh'
      ? `${brand} ${name_en}（${name_zh ?? ''}），OEM号 ${oem_number ?? '-'}，济南德达汽车配件`
      : `${brand ?? ''} ${name_en}${name_zh ? ` (${name_zh})` : ''} — heavy truck spare part, OEM ${oem_number ?? 'N/A'} | Jinan DEDA Auto Parts`
  return { title, description, alternates: { canonical: `/${locale === 'zh' ? '' : locale + '/'}products/${slug}` } }
}

export default async function ProductPage({ params }: Props) {
  const { locale, slug } = await params
  setRequestLocale(locale)
  const t = await getTranslations('product')
  const catLabel = (s: string) => categoryLabelFor(s, locale)

  const supabase = tryGetSupabase()
  const { data, error } = supabase
    ? await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .in('status', ['published', 'active'])
        .maybeSingle()
    : { data: null, error: null }

  if (error || !data) {
    notFound()
  }

  const {
    name_en,
    name_zh,
    name_ru,
    price,
    brand,
    truck_model,
    oem_number,
    category,
    sku,
    description_en,
    description_zh,
    specs,
  } = data

  const specRows =
    specs && typeof specs === 'object'
      ? Object.entries(specs).map(([k, v]) => [k, String(v)])
      : []

  // 产品图(静态文件 public/products/{slug}.{webp,jpg,png},存在才展示)
  const imgExt = ['.webp', '.jpg', '.png'].find((e) =>
    existsSync(join(process.cwd(), 'public', 'products', `${slug}${e}`)),
  )

  // schema.org/Product 结构化数据(Google 富结果;有参考价时声明 offers,无价不声明)
  const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://products.dedaautoparts.com'
  const productLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: name_en,
    ...(name_zh ? { alternateName: name_zh } : {}),
    ...(sku ? { sku } : {}),
    ...(oem_number ? { mpn: oem_number } : {}),
    ...(brand ? { brand: { '@type': 'Brand', name: brand } } : {}),
    ...(category ? { category } : {}),
    description:
      description_en ||
      description_zh ||
      `${brand ? brand + ' ' : ''}${name_en}${truck_model ? ` for ${truck_model}` : ''} — heavy truck spare parts, OEM ${oem_number ?? 'N/A'}`,
    url: `${SITE}/products/${slug}`,
    ...(price != null
      ? {
          offers: {
            '@type': 'Offer',
            price: String(price),
            priceCurrency: 'CNY',
            availability: 'https://schema.org/InStock',
            url: `${SITE}/products/${slug}`,
          },
        }
      : {}),
    ...(truck_model
      ? {
          additionalProperty: [
            { '@type': 'PropertyValue', name: 'Fits truck model', value: truck_model },
          ],
        }
      : {}),
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <div className="max-w-3xl mx-auto">
        {/* 标题区 */}
        {imgExt && (
          <div className="mb-6 rounded-xl overflow-hidden bg-white border border-gray-200">
            <img
              src={`/products/${slug}${imgExt}`}
              alt={name_en}
              className="w-full max-h-96 object-contain"
            />
          </div>
        )}
        <header className="mb-8 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-3xl font-bold text-gray-900">{name_en}</h1>
            {(locale === 'ru' ? name_ru || name_zh : name_zh) && (
              <p className="mt-1 text-lg text-gray-500">
                {locale === 'ru' ? name_ru || name_zh : name_zh}
              </p>
            )}
            {price != null && (
              <div className="mt-3 flex items-baseline gap-2 flex-wrap">
                <span className="text-3xl font-bold text-orange-600">¥{price}</span>
                <span className="text-sm text-gray-400">
                  {locale === 'zh'
                    ? '参考价(不含税运),批量优惠询价'
                    : locale === 'ru'
                      ? 'Ориентировочная цена, опт по запросу'
                      : 'Reference price, bulk inquiry'}
                </span>
              </div>
            )}
          </div>
          <div className="shrink-0 mt-2">
            <InquiryButton
              item={{
                slug,
                name_en,
                name_zh: name_zh || undefined,
                oem_number: oem_number || undefined,
                sku,
              }}
            />
          </div>
        </header>

        {/* 核心信息卡片 */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-400 mb-1">SKU</dt>
              <dd className="font-mono text-sm text-gray-900">{sku}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-400 mb-1">{t('brand')}</dt>
              <dd className="text-sm text-gray-900">{brand}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-gray-400 mb-1">{t('oem')}</dt>
              <dd className="font-mono text-lg text-blue-700 font-semibold">{oem_number}</dd>
            </div>
            {category && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-400 mb-1">{t('category')}</dt>
                <dd className="text-sm text-gray-900">{catLabel(category)}</dd>
              </div>
            )}
            {truck_model && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-400 mb-1">{t('fits')}</dt>
                <dd className="text-sm text-gray-900">{truck_model}</dd>
              </div>
            )}
          </dl>
        </section>

        {/* 描述区:当前语言优先,另一种折叠在后 */}
        {(description_en || description_zh) && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            {(locale !== 'zh' ? description_en : description_zh || description_en) && (
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">{t(locale !== 'zh' ? 'descEn' : 'descZh')}</h2>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {locale !== 'zh' ? description_en || description_zh : description_zh || description_en}
                </p>
              </div>
            )}
            {(locale !== 'zh' ? description_zh : description_en) && (
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-2">{t(locale !== 'zh' ? 'descZh' : 'descEn')}</h2>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                  {locale !== 'zh' ? description_zh : description_en}
                </p>
              </div>
            )}
          </section>
        )}

        {/* 规格参数区(照录原文,数字/OEM 通用) */}
        {specRows.length > 0 && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">{t('specs')}</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {specRows.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-xs uppercase tracking-wide text-gray-400 mb-1">{k}</dt>
                  <dd className="font-mono text-sm text-gray-900">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        {/* 底部返回 */}
        <div className="text-center">
          <Link href="/" className="text-sm text-blue-600 hover:text-blue-800">
            {t('back')}
          </Link>
        </div>
      </div>
    </main>
  )
}
