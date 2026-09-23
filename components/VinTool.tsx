'use client'

import { useState } from 'react'
import { Link } from '@/i18n/navigation'

interface Vehicle {
  vin: string
  modelName: string | null
  brandName: string | null
  factory: string | null
  publicCode: string | null
  year: string | null
  type: string | null
  description: string | null
}

interface Group {
  groupName: string
  groupId: number
  hasChild: number
  groupNameEnglish?: string
}

interface Bom {
  itemId: string
  itemName: string
  standardName: string | null
  Alias?: string
  qty?: number
  brandId?: string
  standardNameEnglish?: string
  pic_address?: string
}

interface SupplierRow {
  itemname?: string
  price?: string | number
  supplier?: string
  phone?: string
  brand?: string
}

interface PriceData {
  factoryPrice?: number
  salesPrice?: number
  retailprice?: number
  data?: { ItemName: string }[]
  gys_data?: SupplierRow[]
}

async function callApi(action: string, params: Record<string, unknown>) {
  const res = await fetch('/api/macc', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, ...params }),
  })
  return res.json()
}

export default function VinTool() {
  const [vin, setVin] = useState('')
  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [groupStack, setGroupStack] = useState<Group[][]>([])
  const [selGroup, setSelGroup] = useState<string>('')
  const [boms, setBoms] = useState<Bom[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [priceMap, setPriceMap] = useState<Record<string, PriceData>>({})
  const [openPrice, setOpenPrice] = useState<string>('')
  const [frequency, setFrequency] = useState<number | null>(null)
  const [lastQuery, setLastQuery] = useState<Record<string, unknown>>({})
  const [loading, setLoading] = useState('')
  const [error, setError] = useState('')

  async function parseVin() {
    setError('')
    const v = vin.trim().toUpperCase()
    if (v.length !== 17) {
      setError('VIN 必须 17 位')
      return
    }
    setLoading('vin')
    const r = await callApi('serial', { vin: v })
    setLoading('')
    setFrequency(r.frequency ?? null)
    if (!r.ok) {
      setError(r.error || '解析失败')
      return
    }
    const result = r.data?.serial?.result
    if (!result) {
      setError('未返回车型数据')
      return
    }
    setVehicle(result)
    setGroupStack([])
    setBoms([])
    setSelGroup('')
    // 自动加载一级分组
    loadGroups(v, result.publicCode, 9999, [])
  }

  async function loadGroups(v: string, pc: string, groupId: number, stack: Group[][]) {
    setLoading('groups')
    const r = await callApi('groups', { vin: v, publicCode: pc, carId: 0, groupId })
    setLoading('')
    setFrequency(r.frequency ?? null)
    if (!r.ok) {
      setError(r.error || '分组加载失败')
      return
    }
    setError('')
    setGroupStack([...stack, r.data?.group?.result ?? []])
  }

  async function queryBom(params: Record<string, unknown>, label: string, pg = 1) {
    setLoading(label)
    const r = await callApi('bom', { vin: vin.trim().toUpperCase(), page: pg, ...params })
    setLoading('')
    setFrequency(r.frequency ?? null)
    if (!r.ok) {
      setError(r.error || '配件查询失败')
      setBoms([])
      setTotalCount(0)
      return
    }
    setError('')
    setLastQuery(params)
    setBoms(r.data?.bom?.result?.boms ?? [])
    setTotalCount(r.data?.bom?.result?.totalCount ?? 0)
    setPage(pg)
  }

  async function getPrice(itemId: string) {
    if (openPrice === itemId) {
      setOpenPrice('')
      return
    }
    if (!priceMap[itemId]) {
      setLoading('price')
      const r = await callApi('price', { itemid: itemId })
      setLoading('')
      setFrequency(r.frequency ?? null)
      if (r.ok) setPriceMap((m) => ({ ...m, [itemId]: r.data }))
    }
    setOpenPrice(itemId)
  }

  const totalPages = Math.max(1, Math.ceil(totalCount / 20))
  const curLevel = groupStack[groupStack.length - 1] ?? []
  const publicCode = vehicle?.publicCode ?? ''

  const btn = 'px-4 py-2 rounded-lg font-medium transition disabled:opacity-50'

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">VIN 查件(内部工具)</h1>
        <p className="text-sm text-gray-500 mt-1">
          输入客户车架号 → 解析车型 → 按分组/名称查配件 → OE 号回本店库存匹配报价
          {frequency !== null && (
            <span className="ml-2 px-2 py-0.5 rounded bg-amber-100 text-amber-800 text-xs">
              剩余额度:{frequency} 次
            </span>
          )}
        </p>
      </header>

      {/* 第一步:VIN */}
      <section className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex gap-2">
          <input
            value={vin}
            onChange={(e) => setVin(e.target.value)}
            placeholder="输入 17 位车架号,如 LFWSRXSJ8HAB00616"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg font-mono uppercase focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={parseVin}
            disabled={loading === 'vin'}
            className={`${btn} bg-blue-600 text-white hover:bg-blue-700`}
          >
            {loading === 'vin' ? '解析中...' : '解析车型'}
          </button>
        </div>
        {error && <p className="mt-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</p>}

        {vehicle && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div><span className="text-gray-500">车型:</span> <b>{vehicle.modelName}</b></div>
            <div><span className="text-gray-500">品牌:</span> {vehicle.brandName}({vehicle.type})</div>
            <div><span className="text-gray-500">厂家:</span> {vehicle.factory}</div>
            <div><span className="text-gray-500">年份/公告号:</span> {vehicle.year} / {vehicle.publicCode}</div>
            {vehicle.description && (
              <div className="sm:col-span-2 text-gray-600 text-xs leading-relaxed">{vehicle.description}</div>
            )}
          </div>
        )}
      </section>

      {/* 第二步:分组浏览 / 名称搜索 */}
      {vehicle && (
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center mb-4">
            <h2 className="font-semibold text-gray-800">配件分组</h2>
            <div className="flex-1" />
            <input
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && keyword.trim() && queryBom({ itemName: keyword.trim() }, 'bom')}
              placeholder="或直接搜件名,如:刹车片 / 离合器"
              className="sm:w-72 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={() => keyword.trim() && queryBom({ itemName: keyword.trim() }, 'bom')}
              disabled={loading === 'bom'}
              className={`${btn} bg-gray-100 text-gray-800 hover:bg-gray-200 text-sm`}
            >
              搜配件
            </button>
          </div>

          {/* 面包屑 */}
          {groupStack.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap text-sm mb-3">
              <button onClick={() => { setGroupStack([groupStack[0]]); setSelGroup(''); setBoms([]) }} className="text-blue-600 hover:underline">全部</button>
              {selGroup && <span className="text-gray-400">/ {selGroup}</span>}
              {groupStack.length > 1 && (
                <button onClick={() => { setGroupStack(groupStack.slice(0, -1)); setSelGroup('') }} className="ml-2 text-xs text-gray-400 hover:text-blue-600">← 返回上级</button>
              )}
            </div>
          )}

          {loading === 'groups' ? (
            <p className="text-sm text-gray-400 py-4 text-center">分组加载中...</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {curLevel.map((g) => (
                <button
                  key={g.groupId}
                  onClick={() => {
                    if (g.hasChild === 1) {
                      setSelGroup(g.groupName)
                      loadGroups(vin.trim().toUpperCase(), publicCode, g.groupId, groupStack)
                    } else {
                      setSelGroup(g.groupName)
                      queryBom({ groupId: g.groupId }, 'bom')
                    }
                  }}
                  className="px-3 py-1.5 rounded-full border border-gray-300 text-sm text-gray-700 hover:border-blue-400 hover:text-blue-700"
                  title={g.groupNameEnglish}
                >
                  {g.groupName} {g.hasChild === 1 && <span className="text-gray-400">▸</span>}
                </button>
              ))}
              {groupStack.length === 0 && !curLevel.length && (
                <p className="text-sm text-gray-400">点上方"解析车型"后加载分组</p>
              )}
            </div>
          )}
        </section>
      )}

      {/* 第三步:配件清单 */}
      {(boms.length > 0 || loading === 'bom') && (
        <section className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-3">
            配件清单 {selGroup && <span className="text-sm text-gray-500">({selGroup})</span>}
            <span className="text-sm text-gray-500 ml-2">共 {totalCount} 项</span>
          </h2>
          {loading === 'bom' ? (
            <p className="text-sm text-gray-400 py-4 text-center">查询中...</p>
          ) : (
            <div className="space-y-2">
              {boms.map((b) => (
                <div key={b.itemId} className="border border-gray-100 rounded-lg p-3">
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-blue-700 font-semibold">{b.itemId}</span>
                        <span className="font-medium text-gray-900">{b.standardName || b.itemName}</span>
                        {b.qty ? <span className="text-xs text-gray-400">用量×{b.qty}</span> : null}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        原厂名:{b.itemName}
                        {b.Alias && <span className="ml-2">别名:{b.Alias}</span>}
                        {b.brandId && <span className="ml-2">品牌:{b.brandId}</span>}
                      </div>
                      {b.standardNameEnglish && (
                        <div className="text-xs text-gray-400 mt-0.5">{b.standardNameEnglish}</div>
                      )}
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <Link
                        href={`/products?q=${encodeURIComponent(b.itemId)}`}
                        target="_blank"
                        className="px-3 py-1.5 rounded-lg bg-green-50 text-green-700 border border-green-200 text-sm hover:bg-green-100"
                      >
                        查本店库存
                      </Link>
                      <button
                        onClick={() => getPrice(b.itemId)}
                        className="px-3 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-sm hover:bg-amber-100"
                      >
                        {loading === 'price' && openPrice !== b.itemId ? '...' : '市场价'}
                      </button>
                    </div>
                  </div>
                  {openPrice === b.itemId && priceMap[b.itemId] && (
                    <div className="mt-3 pt-3 border-t border-gray-100 bg-amber-50/50 rounded-lg p-3 text-sm">
                      <div className="mb-2">
                        厂价:<b className="text-amber-800">¥{priceMap[b.itemId].factoryPrice ?? '-'}</b>
                        {priceMap[b.itemId].retailprice ? <span className="ml-3 text-gray-500">零售 ¥{priceMap[b.itemId].retailprice}</span> : null}
                      </div>
                      {(priceMap[b.itemId].gys_data ?? []).length > 0 ? (
                        <ul className="space-y-1">
                          {(priceMap[b.itemId].gys_data ?? []).map((s, i) => (
                            <li key={i} className="text-xs text-gray-600 flex flex-wrap gap-x-3">
                              <span className="text-red-600 font-semibold">¥{s.price}</span>
                              <span>{s.supplier}</span>
                              <span className="font-mono">{s.phone}</span>
                              {s.brand && <span className="text-gray-400">{s.brand}</span>}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-gray-400">无供应商报价</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          {totalPages > 1 && (
            <div className="mt-4 flex items-center justify-center gap-2 text-sm">
              <button
                disabled={page <= 1}
                onClick={() => queryBom(lastQuery, 'bom', page - 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-40"
              >
                上一页
              </button>
              <span className="text-gray-500">{page}/{totalPages}</span>
              <button
                disabled={page >= totalPages}
                onClick={() => queryBom(lastQuery, 'bom', page + 1)}
                className="px-3 py-1.5 rounded-lg border border-gray-300 disabled:opacity-40"
              >
                下一页
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  )
}
