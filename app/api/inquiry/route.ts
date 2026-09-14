import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'

export const dynamic = 'force-dynamic'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url?.startsWith('http') || !key) {
    throw new Error('Supabase 环境变量未配置')
  }
  return createClient(url, key)
}

function hashIp(ip: string): string {
  return createHash('sha256')
    .update(ip + '|deda-rfq-salt-v1')
    .digest('hex')
    .slice(0, 16)
}

function getClientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for')
  if (fwd) return fwd.split(',')[0].trim()
  return req.headers.get('x-real-ip') || 'unknown'
}

interface IncomingItem {
  slug?: string
  name_en?: string
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: '请求格式错误' }, { status: 400 })
  }

  // honeypot：机器人填了隐藏字段 → 假装成功直接丢弃
  if (typeof body.hp === 'string' && body.hp.length > 0) {
    return NextResponse.json({ ok: true, count: 0 })
  }

  const name = typeof body.name === 'string' ? body.name.trim() : ''
  const email = typeof body.email === 'string' ? body.email.trim() : ''
  const phone = typeof body.phone === 'string' ? body.phone.trim() : undefined
  const company = typeof body.company === 'string' ? body.company.trim() : undefined
  const country = typeof body.country === 'string' ? body.country.trim() : undefined
  const message = typeof body.message === 'string' ? body.message.trim().slice(0, 1000) : undefined
  const quantity =
    typeof body.quantity === 'number' && Number.isFinite(body.quantity) && body.quantity > 0
      ? Math.min(Math.floor(body.quantity), 1_000_000)
      : undefined

  if (!name || name.length > 80) {
    return NextResponse.json({ ok: false, error: '姓名必填' }, { status: 400 })
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 120) {
    return NextResponse.json({ ok: false, error: '邮箱格式不正确' }, { status: 400 })
  }

  const items = Array.isArray(body.items) ? (body.items as IncomingItem[]) : []
  const slugs = [
    ...new Set(
      items
        .map((i) => (typeof i?.slug === 'string' ? i.slug.trim().slice(0, 120) : ''))
        .filter(Boolean),
    ),
  ].slice(0, 50)

  if (slugs.length === 0) {
    return NextResponse.json({ ok: false, error: '请至少选择一个产品' }, { status: 400 })
  }

  try {
    const supabase = getSupabase()

    // slug → product id 映射
    const { data: products } = await supabase
      .from('products')
      .select('id, slug')
      .in('slug', slugs)
    const idBySlug = new Map<string, string>()
    for (const p of products || []) {
      idBySlug.set((p as { slug: string }).slug, (p as { id: string }).id)
    }

    const rows = slugs.map((slug) => ({
      product_id: idBySlug.get(slug) || null,
      name,
      email,
      phone: phone || null,
      company: company || null,
      country: country || null,
      quantity: quantity || null,
      message: message || null,
      source: 'form',
      ip_hash: hashIp(getClientIp(req)),
      spam_score: 0,
      status: 'new',
    }))

    const { error: insertError } = await supabase.from('rfq_inquiries').insert(rows)
    if (insertError) {
      return NextResponse.json(
        { ok: false, error: '保存失败，请稍后重试' },
        { status: 500 },
      )
    }

    return NextResponse.json({ ok: true, count: rows.length })
  } catch (e) {
    const msg = e instanceof Error && e.message.includes('环境变量') ? '服务暂不可用' : '服务器错误'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }
}
