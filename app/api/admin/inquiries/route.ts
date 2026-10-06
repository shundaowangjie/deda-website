import { NextRequest, NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { timingSafeEqual } from 'crypto'

export const dynamic = 'force-dynamic'

const STATUSES = ['new', 'contacted', 'quoted', 'closed', 'spam'] as const

function getSupabaseAdmin(): { client: SupabaseClient; limited: boolean } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url?.startsWith('http')) throw new Error('Supabase URL 未配置')
  if (serviceKey) return { client: createClient(url, serviceKey), limited: false }
  if (!anonKey) throw new Error('Supabase key 未配置')
  // 降级：anon key 受 RLS 限制，可能读不到数据（页面会提示配置 service key）
  return { client: createClient(url, anonKey), limited: true }
}

function checkAuth(req: NextRequest): boolean {
  const pwd = process.env.ADMIN_PASSWORD
  if (!pwd) return false
  const key = req.headers.get('x-admin-key') || ''
  const a = Buffer.from(key)
  const b = Buffer.from(pwd)
  return a.length === b.length && timingSafeEqual(a, b)
}

/** GET /api/admin/inquiries?type=photo|form&status=new — 询价列表 */
export async function GET(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: '后台未配置 ADMIN_PASSWORD' }, { status: 503 })
  }
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: '口令错误' }, { status: 401 })
  }
  const type = new URL(req.url).searchParams.get('type') === 'form' ? 'form' : 'photo'
  const status = new URL(req.url).searchParams.get('status') || ''

  try {
    const { client, limited } = getSupabaseAdmin()
    if (type === 'photo') {
      let q = client
        .from('inquiries')
        .select('id, created_at, image_url, note, contact, status')
        .order('created_at', { ascending: false })
        .limit(100)
      if (status) q = q.eq('status', status)
      const { data, error } = await q
      if (error) throw error
      return NextResponse.json({ ok: true, items: data || [], limited })
    }
    let q = client
      .from('rfq_inquiries')
      .select('id, created_at, name, email, phone, company, country, quantity, message, product_id, status')
      .order('created_at', { ascending: false })
      .limit(200)
    if (status) q = q.eq('status', status)
    const { data, error } = await q
    if (error) throw error
    return NextResponse.json({ ok: true, items: data || [], limited })
  } catch (e) {
    const msg = e instanceof Error ? e.message : '查询失败'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}

/** PATCH /api/admin/inquiries {type, id, status} — 更新处理状态 */
export async function PATCH(req: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ ok: false, error: '后台未配置 ADMIN_PASSWORD' }, { status: 503 })
  }
  if (!checkAuth(req)) {
    return NextResponse.json({ ok: false, error: '口令错误' }, { status: 401 })
  }
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: '请求格式错误' }, { status: 400 })
  }
  const type = body.type === 'form' ? 'rfq_inquiries' : 'inquiries'
  const id = typeof body.id === 'string' ? body.id : ''
  const status = typeof body.status === 'string' ? body.status : ''
  if (!id) return NextResponse.json({ ok: false, error: '缺少 id' }, { status: 400 })
  if (!(STATUSES as readonly string[]).includes(status)) {
    return NextResponse.json({ ok: false, error: '状态值无效' }, { status: 400 })
  }
  try {
    const { client } = getSupabaseAdmin()
    const { error } = await client.from(type).update({ status }).eq('id', id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e) {
    const msg = e instanceof Error ? e.message : '更新失败'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
