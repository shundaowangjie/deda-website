'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getInquiryList, removeInquiryItem, clearInquiryList, type InquiryItem } from '@/lib/inquiryStore'

interface FormState {
  name: string
  email: string
  phone: string
  company: string
  country: string
  quantity: string
  message: string
}

const EMPTY_FORM: FormState = {
  name: '',
  email: '',
  phone: '',
  company: '',
  country: '',
  quantity: '',
  message: '',
}

export default function InquiryPage() {
  const [items, setItems] = useState<InquiryItem[]>([])
  const [loaded, setLoaded] = useState(false)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [hp, setHp] = useState('') // honeypot
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState<{ count: number } | null>(null)

  useEffect(() => {
    setItems(getInquiryList())
    setLoaded(true)
  }, [])

  function update(field: keyof FormState, value: string) {
    setForm((f) => ({ ...f, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (items.length === 0) {
      setError('请先添加至少一个产品')
      return
    }
    if (!form.name.trim() || !form.email.trim()) {
      setError('请填写姓名和邮箱（必填）')
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError('邮箱格式不正确')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim() || undefined,
          company: form.company.trim() || undefined,
          country: form.country.trim() || undefined,
          quantity: form.quantity ? parseInt(form.quantity, 10) : undefined,
          message: form.message.trim() || undefined,
          hp,
          items: items.map((i) => ({ slug: i.slug, name_en: i.name_en })),
        }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        setError(data.error || '提交失败，请稍后重试')
        setSubmitting(false)
        return
      }
      clearInquiryList()
      setItems([])
      setDone({ count: data.count })
    } catch {
      setError('网络异常，请稍后重试')
    }
    setSubmitting(false)
  }

  if (done) {
    return (
      <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">询价提交成功</h1>
          <p className="text-gray-600 mb-1">
            已收到 <span className="font-semibold text-blue-700">{done.count}</span> 个产品的询价
          </p>
          <p className="text-gray-500 text-sm mb-8">我们将在 24 小时内通过邮箱或电话与您联系</p>
          <div className="flex flex-col gap-3">
            <Link
              href="/products"
              className="block w-full bg-blue-600 text-white rounded-lg py-2.5 font-medium hover:bg-blue-700 transition"
            >
              继续浏览产品
            </Link>
            <button
              onClick={() => setDone(null)}
              className="block w-full bg-gray-100 text-gray-700 rounded-lg py-2.5 font-medium hover:bg-gray-200 transition"
            >
              再提交一单
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Link href="/products" className="text-sm text-gray-500 hover:text-gray-700">
            ← 返回产品目录
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mt-4">询价单</h1>
          <p className="text-gray-600 mt-2 text-sm">
            填写联系方式，我们尽快为您报价（支持微信 / 电话 / 邮件回复）
          </p>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* 已选产品 */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 mb-6">
          <h2 className="font-semibold text-gray-800 mb-3">
            已选产品 <span className="text-blue-600">({items.length})</span>
          </h2>
          {!loaded ? (
            <p className="text-gray-400 text-sm">加载中...</p>
          ) : items.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-400 mb-3">还没有添加产品</p>
              <Link href="/products" className="text-sm text-blue-600 hover:text-blue-800">
                去产品目录挑选 →
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.slug} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <Link
                      href={`/products/${item.slug}`}
                      className="font-medium text-gray-900 hover:text-blue-700 truncate block"
                    >
                      {item.name_en}
                    </Link>
                    <div className="text-xs text-gray-400 mt-0.5">
                      {item.oem_number ? `OEM: ${item.oem_number}` : ''}
                      {item.oem_number && item.sku ? ' · ' : ''}
                      {item.sku ? `SKU: ${item.sku}` : ''}
                    </div>
                  </div>
                  <button
                    onClick={() => setItems(removeInquiryItem(item.slug))}
                    className="shrink-0 text-sm text-red-500 hover:text-red-700 px-2 py-1"
                  >
                    移除
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* 联系表单 */}
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="font-semibold text-gray-800 mb-4">联系方式</h2>

          {/* honeypot */}
          <input
            type="text"
            name="website"
            value={hp}
            onChange={(e) => setHp(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            className="hidden"
            aria-hidden="true"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <label className="block">
              <span className="text-sm text-gray-700">
                姓名 <span className="text-red-500">*</span>
              </span>
              <input
                type="text"
                value={form.name}
                onChange={(e) => update('name', e.target.value)}
                maxLength={80}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="您的称呼"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">
                邮箱 <span className="text-red-500">*</span>
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                maxLength={120}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">电话 / 微信</span>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => update('phone', e.target.value)}
                maxLength={40}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="手机号或微信号"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">公司名称</span>
              <input
                type="text"
                value={form.company}
                onChange={(e) => update('company', e.target.value)}
                maxLength={120}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="选填"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">国家 / 地区</span>
              <input
                type="text"
                value={form.country}
                onChange={(e) => update('country', e.target.value)}
                maxLength={60}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="如：中国 / 俄罗斯"
              />
            </label>
            <label className="block">
              <span className="text-sm text-gray-700">大致数量</span>
              <input
                type="number"
                min={1}
                value={form.quantity}
                onChange={(e) => update('quantity', e.target.value)}
                className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="选填，如 10"
              />
            </label>
          </div>

          <label className="block mt-4">
            <span className="text-sm text-gray-700">留言备注</span>
            <textarea
              value={form.message}
              onChange={(e) => update('message', e.target.value)}
              maxLength={1000}
              rows={3}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="车型、特殊要求等（选填）"
            />
          </label>

          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={submitting || items.length === 0}
            className="mt-6 w-full bg-blue-600 text-white rounded-lg py-3 font-medium hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition"
          >
            {submitting ? '提交中...' : `提交询价（${items.length} 个产品）`}
          </button>
          <p className="mt-3 text-xs text-gray-400 text-center">
            提交即表示同意我们通过邮箱 / 电话与您联系报价
          </p>
        </form>
      </div>
    </main>
  )
}
