/**
 * 服务端通知公共库（fail-soft：通知失败只打日志，绝不抛错影响主流程）
 *
 * A. 国外邮件 — Resend API
 *    env: RESEND_API_KEY, INQUIRY_NOTIFY_EMAIL（收件销售邮箱）, RESEND_FROM（可选）
 * B. 国内企微 — 企业微信群机器人 webhook
 *    env: QYWX_WEBHOOK_URL
 */

type NotifyResult = { ok: boolean; skipped?: boolean; error?: string }

function cfg() {
  return {
    resendKey: process.env.RESEND_API_KEY || '',
    notifyEmail: process.env.INQUIRY_NOTIFY_EMAIL || '',
    resendFrom: process.env.RESEND_FROM || 'DEDA询价 <noreply@dedaautoparts.com>',
    qywxWebhook: process.env.QYWX_WEBHOOK_URL || '',
  }
}

function esc(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/** A. 发邮件（Resend）。未配置 key/收件人时跳过。 */
export async function notifyEmail(
  subject: string,
  htmlBody: string,
): Promise<NotifyResult> {
  const { resendKey, notifyEmail: to, resendFrom } = cfg()
  if (!resendKey || !to) return { ok: false, skipped: true }
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${resendKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ from: resendFrom, to: [to], subject, html: htmlBody }),
    })
    if (!res.ok) {
      const t = await res.text().catch(() => '')
      console.error('[notify] email failed:', res.status, t.slice(0, 200))
      return { ok: false, error: `resend ${res.status}` }
    }
    return { ok: true }
  } catch (e) {
    console.error('[notify] email exception:', e instanceof Error ? e.message : e)
    return { ok: false, error: 'exception' }
  }
}

/** B. 企业微信群机器人 markdown 推送。未配置 webhook 时跳过。 */
export async function notifyQywx(markdown: string): Promise<NotifyResult> {
  const { qywxWebhook } = cfg()
  if (!qywxWebhook) return { ok: false, skipped: true }
  try {
    const res = await fetch(qywxWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ msgtype: 'markdown', markdown: { content: markdown } }),
    })
    if (!res.ok) {
      const t = await res.text().catch(() => '')
      console.error('[notify] qywx failed:', res.status, t.slice(0, 200))
      return { ok: false, error: `qywx ${res.status}` }
    }
    const data = (await res.json().catch(() => null)) as { errcode?: number; errmsg?: string } | null
    if (data && data.errcode !== 0) {
      console.error('[notify] qywx errcode:', data.errcode, data.errmsg)
      return { ok: false, error: `errcode ${data.errcode}` }
    }
    return { ok: true }
  } catch (e) {
    console.error('[notify] qywx exception:', e instanceof Error ? e.message : e)
    return { ok: false, error: 'exception' }
  }
}

export interface FormInquiryNotice {
  name: string
  email: string
  phone?: string
  company?: string
  country?: string
  quantity?: number
  message?: string
  count: number
  slugs: string[]
}

/** 表单询价（多为国外客户）：邮件为主 + 企微同步推 */
export async function notifyFormInquiry(n: FormInquiryNotice): Promise<void> {
  const lines = n.slugs.map((s) => `<li>${esc(s)}</li>`).join('')
  const html = [
    `<h2>🛒 新表单询价（${n.count} 个产品）</h2>`,
    `<p><b>姓名:</b> ${esc(n.name)}<br/>`,
    `<b>邮箱:</b> ${esc(n.email)}<br/>`,
    n.phone ? `<b>电话/微信:</b> ${esc(n.phone)}<br/>` : '',
    n.company ? `<b>公司:</b> ${esc(n.company)}<br/>` : '',
    n.country ? `<b>国家:</b> ${esc(n.country)}<br/>` : '',
    n.quantity ? `<b>数量:</b> ${n.quantity}<br/>` : '',
    `</p>`,
    n.message ? `<p><b>留言:</b><br/>${esc(n.message).replace(/\n/g, '<br/>')}</p>` : '',
    `<p><b>产品:</b></p><ul>${lines}</ul>`,
    `<p style="color:#888">后台: https://products.dedaautoparts.com/admin</p>`,
  ].join('')
  const md = [
    `### 🛒 新表单询价（${n.count}个产品）`,
    `> 姓名: ${n.name}`,
    `> 邮箱: ${n.email}`,
    n.phone ? `> 电话: ${n.phone}` : '',
    n.company ? `> 公司: ${n.company}` : '',
    n.country ? `> 国家: ${n.country}` : '',
    n.message ? `> 留言: ${n.message.slice(0, 200)}` : '',
    `> 产品: ${n.slugs.slice(0, 10).join(', ')}${n.slugs.length > 10 ? '…' : ''}`,
  ]
    .filter(Boolean)
    .join('\n')
  await Promise.all([
    notifyEmail(`🛒 新询价 ${n.name}（${n.count}产品${n.country ? '/' + n.country : ''}）`, html),
    notifyQywx(md),
  ])
}

export interface PhotoInquiryNotice {
  imageUrl: string
  note?: string
  contact: string
}

/** 拍照询价（多为国内客户）：企微为主 + 邮件同步 */
export async function notifyPhotoInquiry(n: PhotoInquiryNotice): Promise<void> {
  const md = [
    `### 📷 新拍照询价`,
    `> 联系: **${n.contact}**`,
    n.note ? `> 备注: ${n.note.slice(0, 300)}` : '',
    `> [查看照片](${n.imageUrl})`,
  ]
    .filter(Boolean)
    .join('\n')
  const html = [
    `<h2>📷 新拍照询价</h2>`,
    `<p><b>联系:</b> ${esc(n.contact)}<br/>`,
    n.note ? `<b>备注:</b> ${esc(n.note).replace(/\n/g, '<br/>')}<br/>` : '',
    `</p><p><a href="${esc(n.imageUrl)}">查看照片</a></p>`,
    n.imageUrl.startsWith('http')
      ? `<p><img src="${esc(n.imageUrl)}" style="max-width:480px"/></p>`
      : '',
    `<p style="color:#888">后台: https://products.dedaautoparts.com/admin</p>`,
  ].join('')
  await Promise.all([
    notifyQywx(md),
    notifyEmail(`📷 新拍照询价 ${n.contact}`, html),
  ])
}
