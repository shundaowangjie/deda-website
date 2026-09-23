'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import InquiryButton from '@/components/InquiryButton'
import OemSearchBox from '@/components/OemSearchBox'
import FilterBar from '@/components/FilterBar'
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

interface FacetOption {
  name: string
  count: number
}

interface Props {
  products: CatalogProduct[]
  total: number
  page: number
  pageSize: number
  facets: { categories: FacetOption[]; models: FacetOption[] }
  q: string
  category: string
  model: string
}

export default function ProductsBrowser({
  products,
  total,
  page,
  pageSize,
  facets,
  q,
  category,
  model,
}: Props) {
  const router = useRouter()
  const sp = useSearchParams() // 保留 embed=1 等未知参数

  function setParams(updates: Record<string, string | null>) {
    const params = new URLSearchParams(sp.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (v === null || v === '') params.delete(k)
      else params.set(k, v)
    }
    const qs = params.toString()
    router.push(qs ? `/products?${qs}` : '/products')
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  const grouped = useMemo(() => {
    const acc = new Map<string, CatalogProduct[]>()
    for (const p of products) {
      const cat = p.category || 'other'
      if (!acc.has(cat)) acc.set(cat, [])
      acc.get(cat)!.push(p)
    }
    return Array.from(acc.entries()).sort(
      (a, b) => categorySortIndex(a[0]) - categorySortIndex(b[0]),
    )
  }, [products])

  const pageWindow = useMemo(() => {
    const pages: (number | string)[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (page > 3) pages.push('…')
      for (let i = Math.max(2, page - 1); i <= Math.min(totalPages - 1, page + 1); i++) pages.push(i)
      if (page < totalPages - 2) pages.push('…')
      pages.push(totalPages)
    }
    return pages
  }, [page, totalPages])

  const hasFilter = Boolean(q || category || model)

  const pageBtn = (active: boolean) =>
    `min-w-9 h-9 px-2 inline-flex items-center justify-center rounded-lg text-sm border transition-colors ${
      active
        ? 'bg-blue-600 text-white border-blue-600 font-medium'
        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-700'
    }`

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
                共 {total.toLocaleString()} 款产品
                {q && ` - 搜索: “${q}”`}
                {category && ` - 分类: ${categoryLabel(category)}`}
                {model && ` - 机型: ${model}`}
              </p>
            </div>
            <div className="w-full lg:w-[28rem]">
              <OemSearchBox
                initialOem={q}
                placeholder="搜索产品名称 / OEM 号 / 品牌 / 机型..."
                onSubmit={(query) =>
                  setParams(
                    query.trim()
                      ? { q: query.trim(), category: null, model: null, page: null }
                      : { q: null, page: null },
                  )
                }
              />
            </div>
          </div>
        </div>
      </header>

      {/* 筛选条(分类标签 + 机型下拉) */}
      <FilterBar
        categories={facets.categories}
        models={facets.models}
        total={total}
        selectedCategory={category}
        selectedModel={model}
        q={q}
        onCategoryChange={(c) => setParams(c ? { category: c, page: null } : { category: null, page: null })}
        onModelChange={(m) => setParams(m ? { model: m, page: null } : { model: null, page: null })}
        onReset={() => setParams({ category: null, model: null, q: null, page: null })}
      />

      {/* 产品列表(服务端筛选+分页) */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-400">
              {hasFilter ? '没有找到匹配的产品' : '产品目录整理中...'}
            </p>
            {hasFilter && (
              <button
                onClick={() => setParams({ q: null, category: null, model: null, page: null })}
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
                          {product.name_zh || product.name_en}
                        </h3>
                        <span className="shrink-0 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded">
                          {categoryLabel(product.category)}
                        </span>
                      </div>
                      {product.name_zh && product.name_en && (
                        <p className="text-sm text-gray-500 mb-2 truncate">{product.name_en}</p>
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

        {/* 分页 */}
        {totalPages > 1 && (
          <nav className="mt-10 flex flex-col items-center gap-2">
            <div className="flex items-center gap-1 flex-wrap justify-center">
              <button
                disabled={page <= 1}
                onClick={() => setParams({ page: String(page - 1) })}
                className={`${pageBtn(false)} px-3 ${page <= 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                上一页
              </button>
              {pageWindow.map((n, i) =>
                n === '…' ? (
                  <span key={`e${i}`} className="px-2 text-gray-400">
                    …
                  </span>
                ) : (
                  <button
                    key={n}
                    onClick={() => setParams({ page: String(n) })}
                    className={pageBtn(n === page)}
                  >
                    {n}
                  </button>
                ),
              )}
              <button
                disabled={page >= totalPages}
                onClick={() => setParams({ page: String(page + 1) })}
                className={`${pageBtn(false)} px-3 ${page >= totalPages ? 'opacity-40 cursor-not-allowed' : ''}`}
              >
                下一页
              </button>
            </div>
            <p className="text-xs text-gray-400">
              共 {total.toLocaleString()} 款 · 第 {page}/{totalPages} 页 · 每页 {pageSize} 款
            </p>
          </nav>
        )}
      </div>
    </>
  )
}
