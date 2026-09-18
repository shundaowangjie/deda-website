'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import InquiryButton from '@/components/InquiryButton'
import OemSearchBox from '@/components/OemSearchBox'
import ModelFilterSidebar from '@/components/ModelFilterSidebar'
import { categoryLabel, categorySortIndex } from '@/lib/categories'

export interface CatalogProduct {
  slug: string
  sku: string
  name_en: string
  name_zh: string | null
  brand: string | null
  category: string
  oem_number: string | null
  truck_model: string | null
  status: string
}

export default function ProductsBrowser({ products }: { products: CatalogProduct[] }) {
  const router = useRouter()
  const sp = useSearchParams()

  // 兼容旧 ?oem= 参数 → 视为关键词搜索；+ 归一为空格（URL 加号陷阱）
  const q = (sp.get('q') || sp.get('oem') || '').replace(/\+/g, ' ')
  const category = sp.get('category') || ''
  const model = sp.get('model') || ''

  function setParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(sp.toString())
    if (sp.get('oem')) params.delete('oem') // 旧参数不再保留
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === '') params.delete(k)
      else params.set(k, v)
    }
    const qs = params.toString()
    router.push(qs ? `/products?${qs}` : '/products')
  }

  // 分类与机型选项直接从已取数据计算（355 款规模，零额外请求）
  const categories = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of products) counts.set(p.category, (counts.get(p.category) || 0) + 1)
    return Array.from(counts.entries())
      .sort((a, b) => categorySortIndex(a[0]) - categorySortIndex(b[0]))
      .map(([name, count]) => ({ name, count }))
  }, [products])

  const models = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of products) {
      const m = p.truck_model?.trim()
      if (m) counts.set(m, (counts.get(m) || 0) + 1)
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }))
  }, [products])

  // 关键词（本地即时过滤）+ 分类 + 机型
  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return products.filter((p) => {
      if (category && p.category !== category) return false
      if (model && p.truck_model !== model) return false
      if (needle) {
        const hay = [p.name_en, p.name_zh, p.oem_number, p.sku, p.brand, p.truck_model]
          .filter(Boolean)
          .join(' ')
          .toLowerCase()
        if (!hay.includes(needle)) return false
      }
      return true
    })
  }, [products, category, model, q])

  const grouped = useMemo(() => {
    const acc = new Map<string, CatalogProduct[]>()
    for (const p of filtered) {
      const cat = p.category || 'other'
      if (!acc.has(cat)) acc.set(cat, [])
      acc.get(cat)!.push(p)
    }
    return Array.from(acc.entries()).sort(
      (a, b) => categorySortIndex(a[0]) - categorySortIndex(b[0]),
    )
  }, [filtered])

  const hasFilter = Boolean(q || category || model)

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <Link href="/" className="text-sm text-gray-500 hover:text-gray-700">
                ← 返回首页
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mt-2">产品目录</h1>
              <p className="text-gray-600 mt-1">
                共 {filtered.length} 款产品{grouped.length > 0 && `，${grouped.length} 个分类`}
                {q && ` - 搜索: “${q}”`}
                {category && ` - 分类: ${categoryLabel(category)}`}
                {model && ` - 机型: ${model}`}
              </p>
            </div>

            {/* 搜索框（带自动补全） */}
            <div className="w-full lg:w-[28rem]">
              <OemSearchBox
                initialOem={q}
                placeholder="搜索产品名称 / OEM 号 / 品牌 / 机型..."
                onSubmit={(query) =>
                  setParams(query.trim() ? { q: query.trim(), category: null, model: null } : { q: null })
                }
              />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* 筛选侧栏 */}
          <aside className="lg:w-64 shrink-0">
            <ModelFilterSidebar
              categories={categories}
              models={models}
              selectedCategory={category}
              selectedModel={model}
              onCategoryChange={(c) =>
                setParams(c ? { category: c, q: null } : { category: null })
              }
              onModelChange={(m) => setParams(m ? { model: m, q: null } : { model: null })}
              onReset={() => setParams({ category: null, model: null, q: null })}
            />
          </aside>

          {/* 产品列表 */}
          <div className="flex-1 min-w-0">
            {grouped.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                <p className="text-gray-400">
                  {hasFilter ? '没有找到匹配的产品' : '产品目录整理中...'}
                </p>
                {hasFilter && (
                  <button
                    onClick={() => setParams({ q: null, category: null, model: null })}
                    className="mt-4 text-blue-600 hover:text-blue-700"
                  >
                    清除全部筛选条件
                  </button>
                )}
              </div>
            ) : (
              grouped.map(([cat, items]) => (
                <section key={cat} className="mb-8">
                  <h2 className="text-xl font-semibold text-gray-800 mb-4">
                    {categoryLabel(cat)}
                    <span className="text-sm text-gray-500 ml-2">({items.length} 款)</span>
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
                            <span className="shrink-0 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                              {categoryLabel(product.category)}
                            </span>
                          </div>
                          {product.name_zh && (
                            <p className="text-sm text-gray-500 mb-2 truncate">
                              {product.name_zh}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-sm flex-wrap">
                            {product.brand && <span className="text-gray-500">{product.brand}</span>}
                            {product.oem_number && (
                              <>
                                <span className="text-gray-300">|</span>
                                <span className="font-mono text-blue-700 font-semibold">
                                  {product.oem_number}
                                </span>
                              </>
                            )}
                          </div>
                          {product.truck_model && (
                            <div className="mt-2 text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded truncate">
                              适用: {product.truck_model}
                            </div>
                          )}
                          <div className="mt-2 text-xs text-gray-400">SKU: {product.sku}</div>
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
        </div>
      </div>
    </>
  )
}
