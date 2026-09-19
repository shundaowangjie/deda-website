import { tryGetSupabase } from '@/lib/supabase'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import ProductsBrowser, { type CatalogProduct } from '@/components/ProductsBrowser'

export const metadata: Metadata = {
  title: '产品目录 | DEDA Auto Parts',
  description: '济南德达汽车配件有限公司重卡配件目录，支持按分类、机型筛选和关键词搜索。',
}

export const revalidate = 300

// Supabase 服务端单请求硬上限 1000 行（PostgREST max-rows），
// 客户端显式 .limit(5000) 也会被削到 1000 —— 必须分页取全量
const PAGE_SIZE = 1000

async function fetchCatalog(): Promise<CatalogProduct[]> {
  const supabase = tryGetSupabase()
  if (!supabase) return []
  const all: CatalogProduct[] = []
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data } = await supabase
      .from('products')
      .select(
        'slug, sku, name_en, name_zh, brand, category, oem_number, truck_model, status',
      )
      .in('status', ['published', 'active'])
      .order('category', { ascending: true })
      .order('name_en', { ascending: true })
      .range(from, from + PAGE_SIZE - 1)
    const rows = (data as CatalogProduct[]) || []
    all.push(...rows)
    if (rows.length < PAGE_SIZE) break
  }
  return all
}

export default async function ProductsPage() {
  const products = await fetchCatalog()

  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="p-12 text-center text-gray-400">加载产品目录...</div>
        }
      >
        <ProductsBrowser products={products} />
      </Suspense>
    </main>
  )
}
