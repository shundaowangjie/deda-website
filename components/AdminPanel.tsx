'use client'

import { useCallback, useEffect, useState } from 'react'

type View = 'dashboard' | 'photo' | 'form'

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

const NAV: { view: View; icon: string; label: string }[] = [
  { view: 'dashboard', icon: '📊', label: '数据看板' },
  { view: 'photo', icon: '📷', label: '拍照询价' },
  { view: 'form', icon: '🛒', label: '表单询价' },
]

export default function AdminPanel() {
  const [key, setKey] = useState(readSavedKey)
  const [authed, setAuthed] = useState(() => readSavedKey() !== '')
  const [pwdInput, setPwdInput] = useState('')
  const [authErr, setAuthErr] = useState('')
  const [view, setView] = useState<View>('dashboard')
  const [statusFilter, setStatusFilter] = useState('')
  const [items, setItems] = useState<(PhotoItem | FormItem)[]>([])
  const [photoAll, setPhotoAll] = useState<PhotoItem[]>([])
  const [formAll, setFormAll] = useState<FormItem[]>([])
  const [limited, setLimited] = useState(false)
  const [loading, setLoading] = useState(false)

  const load = useCallback(
    async (k: string, t: 'photo' | 'form', s: string) => {
      setLoading(true)
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
          }
          setItems([])
          return
        }
        setItems(data.items || [])
        setLimited(!!data.limited)
      } catch {
        setItems([])
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  const loadDash = useCallback(async (k: string) => {
    setLoading(true)
    try {
      const h = { 'x-admin-key': k }
      const [p, f] = await Promise.all([
        fetch('/api/admin/inquiries?type=photo', { headers: h }).then((r) => r.json()),
        fetch('/api/admin/inquiries?type=form', { headers: h }).then((r) => r.json()),
      ])
      if (p && p.ok) setPhotoAll(p.items || [])
      if (f && f.ok) setFormAll(f.items || [])
    } catch {
      /* keep previous data */
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authed || !key) return
    if (view === 'dashboard') void loadDash(key)
    else void load(key, view, statusFilter)
  }, [authed, key, view, statusFilter, load, loadDash])

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

  function logout() {
    sessionStorage.removeItem('deda-admin-key')
    setAuthed(false)
    setKey('')
    setPwdInput('')
  }

  async function setStatus(id: string, status: string) {
    if (view === 'dashboard') return
    try {
      const res = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': key },
        body: JSON.stringify({ type: view, id, status }),
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

  const allItems = [...photoAll, ...formAll]
  const pendingCount = allItems.filter((i) => i.status === 'new').length
  const isList = view !== 'dashboard'

  return (
    <div className="lg:flex min-h-screen bg-slate-100">
      {/* 桌面左侧导航 */}
      <aside className="hidden lg:flex lg:flex-col w-56 bg-slate-900 shrink-0 sticky top-0 h-screen p-4">
        <div className="flex items-center gap-2.5 mb-7 px-1">
          <div className="w-9 h-9 rounded-lg bg-sky-600/20 flex items-center justify-center text-xl">🚛</div>
          <div>
            <p className="text-white font-bold text-sm leading-tight">德达汽配</p>
            <p className="text-[9px] tracking-[0.22em] text-sky-300/80 font-medium">INQUIRY CONSOLE</p>
          </div>
        </div>
        <nav className="space-y-1">
          {NAV.map((n) => (
            <button
              key={n.view}
              onClick={() => setView(n.view)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                view === n.view ? 'bg-white/10 text-white shadow-inner' : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-base">{n.icon}</span>
              {n.label}
              {n.view !== 'dashboard' && n.label === '拍照询价' && pendingCount > 0 && (
                <span className="ml-auto bg-red-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5">{pendingCount}</span>
              )}
            </button>
          ))}
        </nav>
        <div className="mt-auto space-y-2">
          <button onClick={logout} className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-300 hover:bg-white/5 transition">
            退出登录
          </button>
          <p className="text-[10px] text-slate-600 px-3">DEDA Auto Parts © 2026</p>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        {/* 移动端顶部导航 */}
        <header className="lg:hidden bg-slate-900 sticky top-0 z-10 shadow-lg shadow-slate-900/10">
          <div className="flex items-center gap-3 px-4 pt-3">
            <div className="w-8 h-8 rounded-lg bg-sky-600/20 flex items-center justify-center text-lg">🚛</div>
            <div className="leading-tight mr-auto">
              <p className="text-white font-bold text-sm">德达汽配 · 询价后台</p>
              <p className="text-[8px] tracking-[0.22em] text-sky-300/80">INQUIRY CONSOLE</p>
            </div>
            <button onClick={logout} className="text-[11px] text-slate-400 hover:text-white px-2 py-1">退出</button>
          </div>
          <div className="flex gap-1.5 p-2 px-4 pb-2.5 overflow-x-auto">
            {NAV.map((n) => (
              <button
                key={n.view}
                onClick={() => setView(n.view)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  view === n.view ? 'bg-white text-slate-900 shadow' : 'text-slate-300 hover:text-white hover:bg-white/10'
                }`}
              >
                {n.icon} {n.label}
              </button>
            ))}
          </div>
        </header>

        {/* 列表视图工具栏 */}
        {isList && (
          <div className="bg-white border-b border-slate-200 sticky top-[88px] lg:top-0 z-[9]">
            <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-800">{view === 'photo' ? '📷 拍照询价' : '🛒 表单询价'}</h2>
              <span className="text-xs text-slate-400">共 {items.length} 条</span>
              <div className="ml-auto flex items-center gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="text-sm bg-white border border-slate-200 text-slate-600 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-sky-500"
                >
                  <option value="">全部状态</option>
                  <option value="new">待处理</option>
                  <option value="contacted">已联系</option>
                  <option value="quoted">已报价</option>
                  <option value="closed">已关闭</option>
                  <option value="spam">垃圾</option>
                </select>
                <button
                  onClick={() => load(key, view, statusFilter)}
                  className="text-sm text-sky-600 hover:text-sky-800 border border-slate-200 hover:border-sky-400 rounded-lg px-3 py-1.5 transition"
                >
                  刷新
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="max-w-5xl mx-auto px-4 py-5">
          {view === 'dashboard' ? (
            <Dashboard photoAll={photoAll} formAll={formAll} loading={loading} onRefresh={() => loadDash(key)} onGoto={setView} />
          ) : (
            <>
              {limited && (
                <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 mb-3">
                  ⚠️ 未配置 SUPABASE_SERVICE_ROLE_KEY，当前为受限读取（表单询价可能看不到）。
                </p>
              )}
              {loading && <p className="text-sm text-slate-400 mb-3">加载中…</p>}
              <ul className="space-y-3">
                {items.map((item) =>
                  view === 'photo' ? (
                    <PhotoRow key={item.id} item={item as PhotoItem} onStatus={setStatus} />
                  ) : (
                    <FormRow key={item.id} item={item as FormItem} onStatus={setStatus} />
                  ),
                )}
              </ul>
              {!loading && items.length === 0 && (
                <p className="text-center text-slate-400 text-sm py-14">暂无数据</p>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, tone }: { icon: string; label: string; value: number | string; tone: string }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4 flex items-center gap-3">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg shrink-0 ${tone}`}>{icon}</div>
      <div className="min-w-0">
        <p className="text-xs text-slate-400 whitespace-nowrap">{label}</p>
        <p className="text-xl font-bold text-slate-900 leading-tight">{value}</p>
      </div>
    </div>
  )
}

function Dashboard({
  photoAll,
  formAll,
  loading,
  onRefresh,
  onGoto,
}: {
  photoAll: PhotoItem[]
  formAll: FormItem[]
  loading: boolean
  onRefresh: () => void
  onGoto: (v: View) => void
}) {
  const all = [...photoAll, ...formAll]
  const todayKey = new Date().toDateString()
  const todayCount = all.filter((i) => new Date(i.created_at).toDateString() === todayKey).length
  const pending = all.filter((i) => i.status === 'new').length
  const contacted = all.filter((i) => i.status === 'contacted').length
  const quoted = all.filter((i) => i.status === 'quoted').length

  const days = Array.from({ length: 7 }, (_, idx) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - idx))
    const key = d.toDateString()
    const count = all.filter((i) => new Date(i.created_at).toDateString() === key).length
    return { label: `${d.getMonth() + 1}/${d.getDate()}`, count }
  })
  const maxCount = Math.max(1, ...days.map((d) => d.count))

  const recent = [...all].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 5)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 flex-wrap">
        <h2 className="text-base font-bold text-slate-800">📊 数据看板</h2>
        {pending > 0 && (
          <span className="inline-flex items-center gap-1.5 bg-red-50 border border-red-100 rounded-full px-3 py-1 text-xs text-red-600 font-semibold">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {pending} 条待处理
          </span>
        )}
        <button
          onClick={onRefresh}
          disabled={loading}
          className="ml-auto text-sm text-sky-600 hover:text-sky-800 border border-slate-200 hover:border-sky-400 bg-white rounded-lg px-3 py-1.5 transition disabled:opacity-50"
        >
          {loading ? '加载中…' : '刷新'}
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard icon="🆕" label="今日新增" value={todayCount} tone="bg-sky-50 text-sky-600" />
        <StatCard icon="⏳" label="待处理" value={pending} tone="bg-red-50 text-red-500" />
        <StatCard icon="📞" label="已联系" value={contacted} tone="bg-amber-50 text-amber-500" />
        <StatCard icon="✅" label="已报价" value={quoted} tone="bg-green-50 text-green-500" />
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <p className="text-sm font-semibold text-slate-800 mb-3">近 7 日询价趋势</p>
        <div className="flex items-end gap-2 h-32">
          {days.map((d) => (
            <div key={d.label} className="flex-1 flex flex-col items-center justify-end gap-1 h-full">
              <span className="text-[10px] text-slate-400">{d.count || ''}</span>
              <div
                className="w-full max-w-9 rounded-t-md bg-gradient-to-t from-sky-600 to-sky-400 transition-all"
                style={{ height: `${Math.max(4, (d.count / maxCount) * 100)}%` }}
              />
              <span className="text-[10px] text-slate-400 whitespace-nowrap">{d.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-semibold text-slate-800">最新询价</p>
          <button onClick={() => onGoto('photo')} className="text-xs text-sky-600 hover:text-sky-800 font-medium">
            查看全部 →
          </button>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-slate-400 py-6 text-center">暂无询价数据</p>
        ) : (
          <ul className="divide-y divide-slate-100">
            {recent.map((r) => (
              <li key={r.id} className="py-2.5 flex items-center gap-2 text-sm">
                <span className="text-slate-900 font-medium truncate">
                  📞 {'contact' in r ? r.contact || '（未留联系方式）' : r.name}
                </span>
                <span className="text-slate-400 text-xs truncate hidden sm:inline">
                  {('note' in r ? r.note : r.message) || ''}
                </span>
                <span className="ml-auto shrink-0">
                  <StatusBadge status={r.status} />
                </span>
                <span className="text-[11px] text-slate-400 whitespace-nowrap shrink-0">{fmtTime(r.created_at).slice(5, 16)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
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
