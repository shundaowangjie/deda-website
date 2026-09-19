import { tryGetSupabase } from '@/lib/supabase'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import ProductsBrowser, { type CatalogProduct } from '@/components/ProductsBrowser'

export const metadata: Metadata = {
  title: '产品目录 | DEDA Auto Parts',
  description: '济南德达汽车配件有限公司重卡配件目录，支持按分类、机型筛选和关键词搜索。',
}

export const revalidate = 300

export default async function ProductsPage() {
  const supabase = tryGetSupabase()
  const { data: products } = supabase
    ? await supabase
        .from('products')
        .select(
          'slug, sku, name_en, name_zh, brand, category, oem_number, truck_model, status',
        )
        .in('status', ['published', 'active'])
        .order('category', { ascending: true })
        .order('name_en', { ascending: true })
        .limit(5000) // 库内 1700+，必须显式 limit，否则默认截断 1000 行
    : { data: null }

  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense
        fallback={
          <div className="p-12 text-center text-gray-400">加载产品目录...</div>
        }
      >
        <ProductsBrowser products={(products as CatalogProduct[]) || []} />
      </Suspense>
    </main>
  )
}
