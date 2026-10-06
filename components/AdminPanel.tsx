'use client'

import { useCallback, useEffect, useState } from 'react'

type ItemType = 'photo' | 'form'

interface PhotoItem {
  id: string
  created_at: string
  image_url: string
  note: string | null
  contact: string | null
  status: string
}

interface FormItem {
  id: string
  created_at: string
  name: string
  email: string
  phone: string | null
  company: string | null
  country: string | null
  quantity: number | null
  message: string | null
  product_id: string | null
  status: string
}

const STATUS_LABEL: Record<string, string> = {
  new: '待处理',
  contacted: '已联系',
  quoted: '已报价',
  closed: '已关闭',
  spam: '垃圾',
}

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-red-100 text-red-700',
  contacted: 'bg-yellow-100 text-yellow-800',
  quoted: 'bg-green-100 text-green-700',
  closed: 'bg-gray-200 text-gray-700',
  spam: 'bg-gray-300 text-gray-700',
}

function fmtTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString('zh-CN', { timeZone: 'Asia/Shanghai' })
  } catch {
    return iso
  }
}

function readSavedKey(): string {
  if (typeof window === 'undefined') return ''
  return sessionStorage.getItem('deda-admin-key') ?? ''
}

export default function AdminPanel() {
  const [key, setKey] = useState(readSavedKey)
  const [authed, setAuthed] = useState(() => readSavedKey() !== '')
  const [pwdInput, setPwdInput] = useState('')
  const [authErr, setAuthErr] = useState('')
  const [type, setType] = useState<ItemType>('photo')
  const [statusFilter, setStatusFilter] = useState('')
  const [items, setItems] = useState<(PhotoItem | FormItem)[]>([])
  const [limited, setLimited] = useState(false)
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  const load = useCallback(
    async (k: string, t: ItemType, s: string) => {
      setLoading(true)
      setErr('')
      try {
        const res = await fetch(
          `/api/admin/inquiries?type=${t}${s ? `&status=${s}` : ''}`,
          { headers: { 'x-admin-key': k } },
        )
        const data = await res.json()
        if (!res.ok || !data.ok) {
          if (res.status === 401) {
            setAuthed(false)
            sessionStorage.removeItem('deda-admin-key')
            setAuthErr('口令错误，请重新输入')
          } else {
            setErr(data.error || '加载失败')
          }
          setItems([])
          return
        }
        setItems(data.items || [])
        setLimited(!!data.limited)
      } catch {
        setErr('网络错误')
        setItems([])
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  // 已登录时拉取列表：tab/筛选变化由下面的处理器显式触发，这里只处理挂载与登录态变化
  useEffect(() => {
    if (authed && key) {
      void Promise.resolve().then(() => load(key, type, statusFilter))
    }
  }, [authed, key, type, statusFilter, load])

  function login() {
    setAuthErr('')
    if (!pwdInput.trim()) {
      setAuthErr('请输入管理口令')
      return
    }
    sessionStorage.setItem('deda-admin-key', pwdInput.trim())
    setKey(pwdInput.trim())
    setAuthed(true)
  }

  async function setStatus(id: string, status: string) {
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
        body: JSON.stringify({ type, id, status }),
      })
      const data = await res.json()
      if (!res.ok || !data.ok) {
        alert('更新失败：' + (data.error || res.status))
        return
      }
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, status } : i)))
    } catch {
      alert('网络错误')
    }
  }

  if (!authed) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-11 h-11 rounded-xl bg-sky-600/10 flex items-center justify-center text-2xl">🚛</div>
            <div>
              <p className="font-bold text-slate-900 leading-tight">德达汽配</p>
              <p className="text-[10px] tracking-[0.28em] text-slate-400 font-medium">INQUIRY CONSOLE</p>
            </div>
          </div>
          <h1 className="text-lg font-bold text-slate-900 mb-1">询价后台</h1>
          <p className="text-sm text-slate-400 mb-5">请输入管理口令（ADMIN_PASSWORD）</p>
          <input
            type="password"
            value={pwdInput}
            onChange={(e) => setPwdInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && login()}
            placeholder="管理口令"
            className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm mb-3 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100 transition"
          />
          {authErr && <p className="text-xs text-red-600 mb-2">{authErr}</p>}
          <button
            onClick={login}
            className="w-full py-2.5 rounded-lg bg-slate-900 text-white font-medium hover:bg-slate-800 transition active:scale-[0.99]"
          >
            进入
          </button>
        </div>
      </main>
    )
  }

  const pendingCount = items.filter((i) => i.status === 'new').length

  return (
    <main className="min-h-screen bg-slate-100">
      <header className="bg-slate-900 sticky top-0 z-10 shadow-lg shadow-slate-900/10">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3 flex-wrap">
          <div className="mr-2 leading-tight">
            <p className="text-white font-bold text-base">询价后台</p>
            <p className="text-[9px] tracking-[0.28em] text-sky-300/80 font-medium">INQUIRY CONSOLE</p>
          </div>
          <div className="flex gap-1.5 p-1 bg-white/5 rounded-full">
            <button
              onClick={() => setType('photo')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${type === 'photo' ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}
            >
              📷 拍照询价
            </button>
            <button
              onClick={() => setType('form')}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${type === 'form' ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:text-white hover:bg-white/10'}`}
            >
              🛒 表单询价
            </button>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm bg-slate-800 border border-slate-700 text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
            >
              <option value="">全部状态</option>
              <option value="new">待处理</option>
              <option value="contacted">已联系</option>
              <option value="quoted">已报价</option>
              <option value="closed">已关闭</option>
              <option value="spam">垃圾</option>
            </select>
            <button
              onClick={() => load(key, type, statusFilter)}
              className="text-sm text-sky-300 hover:text-white border border-slate-700 hover:border-sky-500 rounded-lg px-3 py-1.5 transition"
            >
              刷新
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-5">
        <div className="flex items-center gap-2.5 mb-4 flex-wrap">
          <span className="inline-flex items-center gap-1.5 bg-white border border-slate-200 shadow-sm rounded-full px-3.5 py-1.5 text-sm text-slate-600 font-medium">
            共 {items.length} 条
          </span>
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-100 shadow-sm rounded-full px-3.5 py-1.5 text-sm text-red-600 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              {pendingCount} 条待处理
            </span>
          )}
          {loading && <span className="text-sm text-slate-400">加载中…</span>}
        </div>

        {limited && (
          <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
            ⚠️ 未配置 SUPABASE_SERVICE_ROLE_KEY，当前为受限读取（表单询价可能看不到）。请在 Vercel 环境变量中配置后重新部署。
          </p>
        )}
        {err && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 mb-3">{err}</p>}
        <ul className="space-y-3">
          {items.map((item) =>
            type === 'photo' ? (
              <PhotoRow key={item.id} item={item as PhotoItem} onStatus={setStatus} />
            ) : (
              <FormRow key={item.id} item={item as FormItem} onStatus={setStatus} />
            ),
          )}
        </ul>
        {!loading && items.length === 0 && !err && (
          <p className="text-center text-slate-400 text-sm py-14">暂无数据</p>
        )}
      </div>
    </main>
  )
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-sm font-medium px-2.5 py-1 rounded-full ${STATUS_COLOR[status] || 'bg-gray-100 text-gray-600'}`}>
      {STATUS_LABEL[status] || status}
    </span>
  )
}

function StatusButtons({ id, status, onStatus }: { id: string; status: string; onStatus: (id: string, s: string) => void }) {
  const next = status === 'new' ? ['contacted', 'quoted', 'spam'] : status === 'contacted' ? ['quoted', 'closed', 'spam'] : status === 'quoted' ? ['closed'] : ['new']
  const BTN_STYLE: Record<string, string> = {
    new: 'bg-red-500 text-white',
    contacted: 'bg-amber-400 text-amber-950',
    quoted: 'bg-green-500 text-white',
    closed: 'bg-gray-500 text-white',
    spam: 'bg-gray-200 text-gray-600',
  }
  return (
    <span className="flex gap-2 flex-wrap">
      {next.map((s) => (
        <button
          key={s}
          onClick={() => onStatus(id, s)}
          className={`text-sm font-medium rounded-lg px-3.5 py-2 transition active:scale-95 shadow-sm hover:shadow ${BTN_STYLE[s] || 'bg-gray-100 text-gray-700'}`}
        >
          标为{STATUS_LABEL[s]}
        </button>
      ))}
    </span>
  )
}

function PhotoRow({ item, onStatus }: { item: PhotoItem; onStatus: (id: string, s: string) => void }) {
  return (
    <li className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-4 flex gap-4">
      {item.image_url ? (
        <a href={item.image_url} target="_blank" rel="noopener noreferrer" className="shrink-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={item.image_url} alt="询价照片" className="w-24 h-24 object-cover rounded-lg border border-slate-200 bg-slate-50" />
        </a>
      ) : (
        <div className="shrink-0 w-24 h-24 rounded-lg border border-sky-100 bg-sky-50 flex flex-col items-center justify-center gap-1">
          <span className="text-3xl">📝</span>
          <span className="text-[11px] text-sky-500 font-medium">文字询价</span>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1 flex-wrap">
          <span className="font-semibold text-slate-900">📞 {item.contact || '（未留联系方式）'}</span>
          <StatusBadge status={item.status} />
        </div>
        {item.note && <p className="text-sm text-slate-600 mb-1 break-words">备注：{item.note}</p>}
        <p className="text-xs text-slate-400 mb-2.5">{fmtTime(item.created_at)}</p>
        <StatusButtons id={item.id} status={item.status} onStatus={onStatus} />
      </div>
    </li>
  )
}

function FormRow({ item, onStatus }: { item: FormItem; onStatus: (id: string, s: string) => void }) {
  return (
    <li className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-4">
      <div className="flex items-center gap-2 mb-1 flex-wrap">
        <span className="font-semibold text-slate-900">{item.name}</span>
        <span className="text-sm text-slate-500">{item.email}</span>
        <StatusBadge status={item.status} />
      </div>
      <p className="text-xs text-slate-500 mb-1">
        {[item.phone && `电话:${item.phone}`, item.company && `公司:${item.company}`, item.country && `国家:${item.country}`, item.quantity ? `数量:${item.quantity}` : ''].filter(Boolean).join(' ｜ ')}
      </p>
      {item.message && <p className="text-sm text-slate-600 mb-1 break-words">留言：{item.message}</p>}
      <p className="text-xs text-slate-400 mb-2.5">{fmtTime(item.created_at)}{item.product_id ? ` · 产品:${item.product_id.slice(0, 8)}…` : ''}</p>
      <StatusButtons id={item.id} status={item.status} onStatus={onStatus} />
    </li>
  )
}
