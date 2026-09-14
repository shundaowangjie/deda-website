import { tryGetSupabase } from '@/lib/supabase'
import Link from 'next/link'
import type { Metadata } from 'next'
import InquiryButton from '@/components/InquiryButton'

export const metadata: Metadata = {
  title: '产品目录 | DEDA Auto Parts',
  description: '济南德达汽车配件有限公司重卡配件目录，支持按分类筛选和搜索。',
}

interface Product {
  slug: string
  sku: string
  name_en: string
  name_zh: string
  brand: string
  category: string
  oem_number: string
  status: string
}

export const revalidate = 300

export default async function ProductsPage() {
  const supabase = tryGetSupabase()
  const { data: products } = supabase
    ? await supabase
        .from('products')
        .select('slug, sku, name_en, name_zh, brand, category, oem_number, status')
        .in('status', ['published', 'active'])
        .order('category', { ascending: true })
        .order('name_en', { ascending: true })
    : { data: null }

  const grouped = products?.reduce((acc, product) => {
    const cat = product.category || '未分类'
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(product)
    return acc
  }, {} as Record<string, Product[]>)

  const categories = Object.entries(grouped || {}).sort((a, b) => {
    const order = ['engine-parts', 'chassis-suspension', 'drivetrain', 'electrical', 'filters', 'other']
    const aIdx = order.indexOf(a[0])
    const bIdx = order.indexOf(b[0])
    return (aIdx === -1 ? 999 : aIdx) - (bIdx === -1 ? 999 : bIdx)
  })

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
            ← 返回首页
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">产品目录</h1>
          <p className="text-gray-600 mt-2">
            共 {products?.length || 0} 款产品，{categories.length} 个分类
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {categories.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-400">产品目录整理中...</p>
          </div>
        ) : (
          categories.map(([category, items]) => (
            <section key={category} className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 capitalize">
                {category.replace(/-/g, ' ')}
              </h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((product) => (
                  <div
                    key={product.slug}
                    className="bg-white rounded-lg border border-gray-200 p-4
                               hover:shadow-md hover:border-blue-300 transition
                               group flex flex-col"
                  >
                    <Link href={`/products/${product.slug}`} className="flex-1">
                      <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-medium text-gray-900 group-hover:text-blue-700 truncate">
                          {product.name_en}
                        </h3>
                        {product.category && (
                          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                            {product.category}
                          </span>
                        )}
                      </div>
                      {product.name_zh && (
                        <p className="text-sm text-gray-500 mb-2 truncate">
                          {product.name_zh}
                        </p>
                      )}
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-gray-500">{product.brand}</span>
                        {product.oem_number && (
                          <>
                            <span className="text-gray-300">|</span>
                            <span className="font-mono text-blue-700 font-semibold">
                              {product.oem_number}
                            </span>
                          </>
                        )}
                      </div>
                      <div className="mt-2 text-xs text-gray-400">
                        SKU: {product.sku}
                      </div>
                    </Link>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-end">
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
            </section>
          ))
        )}
      </div>
    </main>
  )
}