'use client'

import { useState, useEffect, useCallback } from 'react'
import { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import OemSearchBox from '@/components/OemSearchBox'
import ProductResults from '@/components/ProductResults'

interface Product {
  slug: string
  name_en: string
  brand: string
  oem_number: string
  category: string
}

function SearchParamsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialOem = searchParams.get('oem') || ''

  const [oemInput, setOemInput] = useState(initialOem)
  const [results, setResults] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (initialOem) setOemInput(initialOem)
  }, [initialOem])

  const performSearch = useCallback(async (oem: string) => {
    if (!oem.trim()) return

    setLoading(true)
    setError(null)
    setResults([])

    try {
      const res = await fetch(`/api/products?oem=${encodeURIComponent(oem.trim())}`)
      const data = await res.json()

      if (res.ok && Array.isArray(data)) {
        setResults(data)
      } else {
        setError(typeof data?.error === 'string' ? data.error : '查询失败')
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : '网络错误')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (initialOem) performSearch(initialOem)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function handleSearchSubmit(oem: string) {
    performSearch(oem)
  }

  function handleProductSelect(slug: string) {
    router.push(`/products/${slug}`)
  }

  return (
    <div>
      <OemSearchBox initialOem={oemInput} onSubmit={handleSearchSubmit} />

      <div className="mt-6">
        <ProductResults
          products={results}
          loading={loading}
          error={error}
          onSelect={handleProductSelect}
        />
      </div>
    </div>
  )
}

export default function SearchTestPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">OEM 搜索</h1>

        <Suspense fallback={
          <div className="p-12 text-center text-gray-400">加载中...</div>
        }>
          <SearchParamsContent />
        </Suspense>

        <div className="mt-6 text-center">
          <a href="/" className="text-sm text-blue-600 hover:text-blue-800">
            ← 返回首页
          </a>
        </div>
      </div>
    </main>
  )
}
