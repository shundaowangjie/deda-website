import { tryGetSupabase } from '@/lib/supabase'
import type { Metadata } from 'next'
import { Suspense } from 'react'
import { unstable_cache } from 'next/cache'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import ProductsBrowser, { type CatalogProduct } from '@/components/ProductsBrowser'

const PAGE_SIZE = 24

type SP = Record<string, string | string[] | undefined>

function sp(params: SP, key: string): string {
  const v = params[key]
  return (Array.isArray(v) ? v[0] : v) || ''
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'catalog' })
  return { title: `${t('title')} | DEDA Auto Parts`, description: t('description') }
}

/** 分类/机型选项与计数:300 秒缓存,避免每次渲染 24 个分页请求 */
const getFacets = unstable_cache(
  async (): Promise<{
    categories: { name: string; count: number }[]
    models: { name: string; count: number }[]
  }> => {
    const supabase = tryGetSupabase()
    const catCounts = new Map<string, number>()
    const modelCounts = new Map<string, number>()
    if (supabase) {
      // 12 个分页并行拉取(总行约 1.2 万,冷启动从串行~14s 降到 ~2s)
      const offsets = Array.from({ length: 12 }, (_, i) => i * 1000)
      const pages = await Promise.all(
        offsets.map((from) =>
          supabase
            .from('products')
            .select('category,truck_model')
            .in('status', ['published', 'active'])
            .order('id', { ascending: true })
            .range(from, from + 999)
            .then(({ data }) => (data as { category: string; truck_model: string | null }[]) || []),
        ),
      )
      for (const rows of pages) {
        for (const r of rows) {
          catCounts.set(r.category, (catCounts.get(r.category) || 0) + 1)
          const m = r.truck_model?.trim()
          if (m) modelCounts.set(m, (modelCounts.get(m) || 0) + 1)
        }
      }
    }
    const categories = Array.from(catCounts.entries()).map(([name, count]) => ({ name, count }))
    const models = Array.from(modelCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 400)
      .map(([name, count]) => ({ name, count }))
    return { categories, models }
  },
  ['catalog-facets-v1'],
  { revalidate: 300 },
)

export default async function ProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<SP>
}) {
  const { locale } = await params
  setRequestLocale(locale)
  const resolved = await searchParams
  const q = sp(resolved, 'q')
  const category = sp(resolved, 'category')
  const model = sp(resolved, 'model')
  const pageNum = Math.max(1, parseInt(sp(resolved, 'page') || '1', 10) || 1)

  const supabase = tryGetSupabase()
  let products: CatalogProduct[] = []
  let total = 0

  if (supabase) {
    // 关键词清洗:去掉会破坏 PostgREST or= 语法的字符
    const needle = q.replace(/[%,()]/g, ' ').trim()

    // 同义词扩展:精确词条双向查一次(search_synonyms 小表,RLS 可读)
    let expanded: string[] = []
    if (supabase && needle) {
      const { data: synRows } = await supabase!
        .from('search_synonyms')
        .select('term,synonym')
        .or(`term.eq.${needle},synonym.eq.${needle}`)
        .limit(8)
      expanded = Array.from(
        new Set((synRows || []).flatMap((r: { term: string; synonym: string }) => [r.term, r.synonym])),
      )
        .map((t) => t.replace(/[%,()]/g, ' ').trim())
        .filter((t) => t && t !== needle)
        .slice(0, 7)
    }
    const allTerms = [needle, ...expanded].filter(Boolean)

    const orExpr = allTerms.length
      ? allTerms
          .map(
            (t) =>
              `name_en.ilike.%${t}%,name_zh.ilike.%${t}%,name_ru.ilike.%${t}%,oem_number.ilike.%${t}%,brand.ilike.%${t}%,truck_model.ilike.%${t}%,sku.ilike.%${t}%`,
          )
          .join(',')
      : ''

    const { count } = await (() => {
      let query = supabase!
        .from('products')
        .select('slug', { count: 'exact', head: true })
        .in('status', ['published', 'active'])
      if (category) query = query.eq('category', category)
      if (model) query = query.eq('truck_model', model)
      if (orExpr) query = query.or(orExpr)
      return query
    })()
    total = count || 0

    const { data } = await (() => {
      let query = supabase!
        .from('products')
        .select('slug, sku, name_en, name_zh, name_ru, brand, category, oem_number, truck_model, status')
        .in('status', ['published', 'active'])
      if (category) query = query.eq('category', category)
      if (model) query = query.eq('truck_model', model)
      if (orExpr) query = query.or(orExpr)
      return query
    })()
      .order('category', { ascending: true })
      .order('name_en', { ascending: true })
      .range((pageNum - 1) * PAGE_SIZE, pageNum * PAGE_SIZE - 1)
    products = (data as CatalogProduct[]) || []
  }

  const facets = await getFacets()

  return (
    <main className="min-h-screen bg-gray-50">
      <Suspense
        fallback={<div className="p-12 text-center text-gray-400">加载产品目录...</div>}
      >
        <ProductsBrowser
          products={products}
          total={total}
          page={pageNum}
          pageSize={PAGE_SIZE}
          facets={facets}
          q={q}
          category={category}
          model={model}
          locale={locale}
        />
      </Suspense>
    </main>
  )
}
