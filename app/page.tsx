import { tryGetSupabase } from '@/lib/supabase'
import OemSearchBox from '@/components/OemSearchBox'
import ProductResults from '@/components/ProductResults'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'DEDA Auto Parts | 重卡配件 OEM 查询',
  description: '济南德达汽车配件有限公司 — SINOTRUK HOWO、解放、陕汽、福田重卡全车配件 OEM 查询平台。提供玉柴马石油润滑油、喷油器、发动机配件等重卡配件目录。',
}

interface FeaturedProduct {
  slug: string
  name_en: string
  name_zh: string
  oem_number: string
  brand: string
  category: string
}

export const revalidate = 300

export default async function HomePage() {
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
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            DEDA Auto Parts
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            济南德达汽车配件有限公司 — 重卡配件目录平台
          </p>
          <OemSearchBox />
        </div>
      </section>

      {/* 精选商品区 */}
      <section className="max-w-4xl mx-auto px-4 py-12">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">精选商品</h2>

        {error ? (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            加载失败，请稍后重试
          </div>
        ) : !products || products.length === 0 ? (
          <div className="p-12 text-center text-gray-400 bg-white rounded-xl border border-gray-200">
            商品目录整理中，敬请期待...
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
                    {p.name_zh && (
                      <p className="text-sm text-gray-500 mt-0.5">{p.name_zh}</p>
                    )}
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
                  <span className="font-mono text-blue-700 font-semibold">
                    {p.oem_number}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
