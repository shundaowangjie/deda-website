import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { supabase } from '@/lib/supabase'

interface Props {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { data } = await supabase
    .from('products')
    .select('name_en, name_zh, brand, oem_number')
    .eq('slug', slug)
    .in('status', ['published', 'active'])
    .maybeSingle()

  if (!data) return { title: '产品不存在 - DEDA Auto Parts' }

  const { name_en, name_zh, brand, oem_number } = data
  return {
    title: `${name_en} | OEM${oem_number ?? '-'} - DEDA`,
    description: `${brand} ${name_en}（${name_zh}），OEM号 ${oem_number ?? '-'}，济南德达汽车配件`,
  }
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params

  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .in('status', ['published', 'active'])
    .maybeSingle()

  if (error || !data) {
    notFound()
  }

  const {
    name_en,
    name_zh,
    brand,
    truck_model,
    oem_number,
    category,
    sku,
    description_en,
    description_zh,
    specs,
  } = data

  const specRows = specs && typeof specs === 'object'
    ? Object.entries(specs).map(([k, v]) => [k, String(v)])
    : []

  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* 标题区 */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">{name_en}</h1>
          {name_zh && (
            <p className="mt-1 text-lg text-gray-500">{name_zh}</p>
          )}
        </header>

        {/* 核心信息卡片 */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-400 mb-1">SKU</dt>
              <dd className="font-mono text-sm text-gray-900">{sku}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-wide text-gray-400 mb-1">品牌</dt>
              <dd className="text-sm text-gray-900">{brand}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs uppercase tracking-wide text-gray-400 mb-1">OEM 号</dt>
              <dd className="font-mono text-lg text-blue-700 font-semibold">{oem_number}</dd>
            </div>
            {category && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-400 mb-1">品类</dt>
                <dd className="text-sm text-gray-900">{category}</dd>
              </div>
            )}
            {truck_model && (
              <div>
                <dt className="text-xs uppercase tracking-wide text-gray-400 mb-1">适用车型</dt>
                <dd className="text-sm text-gray-900">{truck_model}</dd>
              </div>
            )}
          </dl>
        </section>

        {/* 描述区 */}
        {(description_en || description_zh) && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            {description_en && (
              <div className="mb-4">
                <h2 className="text-sm font-semibold text-gray-700 mb-2">产品描述（英文）</h2>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{description_en}</p>
              </div>
            )}
            {description_zh && (
              <div>
                <h2 className="text-sm font-semibold text-gray-700 mb-2">产品描述（中文）</h2>
                <p className="text-sm text-gray-600 whitespace-pre-wrap">{description_zh}</p>
              </div>
            )}
          </section>
        )}

        {/* 规格参数区 */}
        {specRows.length > 0 && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
            <h2 className="text-sm font-semibold text-gray-700 mb-4">规格参数</h2>
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
          <a href="/" className="text-sm text-blue-600 hover:text-blue-800">
            ← 返回首页
          </a>
        </div>
      </div>
    </main>
  )
}
