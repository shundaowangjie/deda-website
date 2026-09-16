'use client'

interface Product {
  slug: string
  name_en: string
  brand: string
  oem_number: string
  category: string
}

interface Props {
  products: Product[]
  loading: boolean
  error: string | null
  onSelect?: (slug: string) => void
}

export default function ProductResults({ products, loading, error, onSelect }: Props) {
  if (loading) {
    return (
      <div className="text-center py-12 text-gray-400">
        <p>查询中...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
        {error}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="p-8 bg-gray-50 rounded-lg text-center">
        <p className="text-gray-500 mb-2">未找到匹配的 OEM 号</p>
        <p className="text-sm text-gray-400">
          建议：只输入号码中连续的一段试试（如 0360601）；
          或拨打 <span className="font-mono">186-7839-0736</span> 由客服代查
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-3">
      {products.map((p, i) => (
        <div
          key={i}
          onClick={() => onSelect?.(p.slug)}
          className={`bg-white rounded-lg border border-gray-200 p-4
                     hover:shadow-md hover:border-blue-300 transition cursor-pointer`}
        >
          <div className="font-medium text-gray-900">{p.name_en}</div>
          <div className="text-sm text-gray-500 mt-1">
            OEM:{' '}
            <span className="font-mono text-blue-700">{p.oem_number}</span>
            {' | '}
            Brand: {p.brand}
            {p.category && ` | ${p.category}`}
          </div>
        </div>
      ))}
    </div>
  )
}
