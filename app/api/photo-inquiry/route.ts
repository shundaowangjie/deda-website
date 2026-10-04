import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { notifyPhotoInquiry } from '@/lib/notify'

export const dynamic = 'force-dynamic'

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url?.startsWith('http') || !key) {
    throw new Error('Supabase 环境变量未配置')
  }
  return createClient(url, key)
}

/**
 * 拍照询价服务端入口：
 * 前端先直传图片到 storage，再把 publicUrl POST 到这里。
 * 在此集中做：contact 必填校验 → 写库 → 企微+邮件通知（fail-soft）。
 */
export async function POST(req: NextRequest) {
  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: '请求格式错误' }, { status: 400 })
  }

  const imageUrl = typeof body.image_url === 'string' ? body.image_url.trim() : ''
  const oeText = typeof body.oe_text === 'string' ? body.oe_text.trim().slice(0, 3000) : ''
  const note = typeof body.note === 'string' ? body.note.trim().slice(0, 500) : ''
  const contact = typeof body.contact === 'string' ? body.contact.trim().slice(0, 120) : ''
  const kind = typeof body.kind === 'string' && (body.kind === 'photo' || body.kind === 'text') ? body.kind : 'photo' // 'photo' | 'text'

  // 验证：photo 模式需 image_url，text 模式需 oe_text，两者都需 contact
  if (kind === 'photo') {
    if (!imageUrl || !/^https?:\/\//.test(imageUrl)) {
      return NextResponse.json({ ok: false, error: '图片地址无效，请重新上传' }, { status: 400 })
    }
  } else {
    if (!oeText) {
      return NextResponse.json({ ok: false, error: '请输入 OE 号或型号' }, { status: 400 })
    }
  }
  if (!contact) {
    return NextResponse.json({ ok: false, error: '请留下微信或手机号，方便客服回复报价' }, { status: 400 })
  }

  try {
    const supabase = getSupabase()
    const { error: insErr } = await supabase
      .from('inquiries')
      .insert({ 
        image_url: kind === 'photo' ? imageUrl : '', 
        note: kind === 'text' ? oeText : (note || null), 
        contact, 
        status: 'new' 
      })
    if (insErr) {
      return NextResponse.json({ ok: false, error: '提交失败，请稍后重试' }, { status: 500 })
    }
  } catch {
    return NextResponse.json({ ok: false, error: '服务暂不可用' }, { status: 500 })
  }

  // 通知客服（失败不影响已提交的结果）
  await notifyPhotoInquiry({ 
    imageUrl: kind === 'photo' ? imageUrl : '', 
    note: kind === 'text' ? 'OE清单询价' : note, 
    contact,
    kind
  }).catch(() => {})

  return NextResponse.json({ ok: true })
}
