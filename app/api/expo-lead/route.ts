import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { notifyPhotoInquiry } from '@/lib/notify'

export const dynamic = 'force-dynamic'

/**
 * 展会落地页留资（/expo → 10-20 济南汽配会）
 * 表单：OE号+姓名+公司+WhatsApp/Email+备注 → inquiries 表 + 销售/企微通知
 * 归因：note 前缀 [展会jn1020]，UTM 参数一并记录
 */

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url?.startsWith('http') || !key) {
    throw new Error('Supabase 环境变量未配置')
  }
  return createClient(url, key)
}

function s(v: unknown, max: number): string {
  return typeof v === 'string' ? v.trim().slice(0, max) : ''
}

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request' }, { status: 400 })
  }

  // honeypot 不适用（表单无隐藏字段），直接校验
  const oe = s(body.oe, 500)
  const name = s(body.name, 80)
  const contact = s(body.contact, 120)
  const company = s(body.company, 120)
  const notes = s(body.notes, 300)
  const lang = s(body.lang, 5) || 'en'
  const utmSrc = s((body.utm as Record<string, unknown> | undefined)?.source, 30) || 'expo2026'
  const utmCmp = s((body.utm as Record<string, unknown> | undefined)?.campaign, 30) || 'jn1020'

  if (!oe) return NextResponse.json({ ok: false, error: 'OE number required' }, { status: 400 })
  if (!name) return NextResponse.json({ ok: false, error: 'Name required' }, { status: 400 })
  if (!contact) return NextResponse.json({ ok: false, error: 'WhatsApp/Email required' }, { status: 400 })

  const note = [
    `[展会${utmCmp}]`,
    `OE: ${oe}`,
    `姓名: ${name}`,
    company ? `公司: ${company}` : '',
    notes ? `备注: ${notes}` : '',
    `lang: ${lang} · utm=${utmSrc}`,
  ]
    .filter(Boolean)
    .join(' | ')
    .slice(0, 1000)

  try {
    const supabase = getSupabase()
    const { error: insErr } = await supabase
      .from('inquiries')
      .insert({ image_url: '', note, contact, status: 'new' })
    if (insErr) {
      return NextResponse.json({ ok: false, error: 'Submit failed, try later' }, { status: 500 })
    }
  } catch (e) {
    const msg = e instanceof Error && e.message.includes('环境变量') ? 'Service unavailable' : 'Server error'
    return NextResponse.json({ ok: false, error: msg }, { status: 500 })
  }

  // 通知销售（企微+邮件，失败不影响提交结果）
  await notifyPhotoInquiry({ imageUrl: '', note, contact, kind: 'text' }).catch(() => {})

  return NextResponse.json({ ok: true })
}
