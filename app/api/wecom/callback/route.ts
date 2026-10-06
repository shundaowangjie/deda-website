import { NextRequest, NextResponse } from 'next/server'
import crypto from 'node:crypto'
import { tryGetSupabase } from '@/lib/supabase'
import { normalizeOem } from '@/lib/oem'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

/**
 * 企业微信自建应用回调（接收消息 API）
 * - GET  = 企业微信后台保存配置时的 URL 验证（解密 echostr 后明文返回）
 * - POST = 接收成员发给应用的消息，解密 → 查价 → 加密被动回复
 * 依赖环境变量：WECOM_TOKEN / WECOM_ENCODING_AES_KEY(43位) / WECOM_CORP_ID
 */

interface WeComConfig {
  token: string
  key: Buffer
  iv: Buffer
  corpId: string
}

function getConfig(): WeComConfig | null {
  const token = process.env.WECOM_TOKEN || ''
  const aesKey43 = (process.env.WECOM_ENCODING_AES_KEY || '').trim()
  const corpId = process.env.WECOM_CORP_ID || ''
  if (!token || aesKey43.length !== 43 || !corpId) return null
  const key = Buffer.from(aesKey43 + '=', 'base64')
  if (key.length !== 32) return null
  return { token, key, iv: key.subarray(0, 16), corpId }
}

function sha1Of(...parts: string[]): string {
  return crypto.createHash('sha1').update([...parts].sort().join('')).digest('hex')
}

/** 企业微信自定义 PKCS#7（块大小 32 字节） */
function pkcs7Pad(buf: Buffer): Buffer {
  const padLen = 32 - (buf.length % 32)
  return Buffer.concat([buf, Buffer.alloc(padLen, padLen)])
}

function pkcs7Unpad(buf: Buffer): Buffer {
  const padLen = buf[buf.length - 1]
  if (padLen < 1 || padLen > 32) throw new Error('bad pkcs7 padding')
  return buf.subarray(0, buf.length - padLen)
}

function decryptMsg(encryptB64: string, cfg: WeComConfig): { msg: string; receiveId: string } {
  const decipher = crypto.createDecipheriv('aes-256-cbc', cfg.key, cfg.iv)
  decipher.setAutoPadding(false)
  const plainRaw = Buffer.concat([decipher.update(Buffer.from(encryptB64, 'base64')), decipher.final()])
  const plain = pkcs7Unpad(plainRaw)
  if (plain.length < 20) throw new Error('plaintext too short')
  const msgLen = plain.readUInt32BE(16)
  if (20 + msgLen > plain.length) throw new Error('bad msg length')
  const msg = plain.subarray(20, 20 + msgLen).toString('utf8')
  const receiveId = plain.subarray(20 + msgLen).toString('utf8')
  return { msg, receiveId }
}

function encryptMsg(replyXml: string, cfg: WeComConfig): string {
  const random = crypto.randomBytes(16)
  const msgBuf = Buffer.from(replyXml, 'utf8')
  const lenBuf = Buffer.alloc(4)
  lenBuf.writeUInt32BE(msgBuf.length)
  const plain = pkcs7Pad(Buffer.concat([random, lenBuf, msgBuf, Buffer.from(cfg.corpId, 'utf8')]))
  const cipher = crypto.createCipheriv('aes-256-cbc', cfg.key, cfg.iv)
  cipher.setAutoPadding(false)
  return Buffer.concat([cipher.update(plain), cipher.final()]).toString('base64')
}

/** 极简 XML 取标签（企业微信报文结构固定，CDATA 与裸文本两种都兼容） */
function xmlTag(xml: string, tag: string): string {
  const m =
    xml.match(new RegExp(`<${tag}><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>`)) ||
    xml.match(new RegExp(`<${tag}>([\\s\\S]*?)</${tag}>`))
  return m ? m[1] : ''
}

// ---------------- 业务 ----------------

interface ProductRow {
  slug: string
  sku: string | null
  name_en: string
  name_zh: string | null
  brand: string | null
  truck_model: string | null
  oem_number: string | null
  category: string
}

const HELP_TEXT = [
  '【德达询价机器人】',
  '直接发送 OE 号或配件名称，立即查价格库存。',
  '',
  '示例：',
  '· 61560080276',
  '· 喷油器',
  '· HOWO 离合器片',
  '',
  '一条消息可查多个（换行或逗号分隔，最多5个）。',
  '人工服务：0531-85737222',
  '产品目录：products.dedaautoparts.com',
].join('\n')

const WELCOME_TEXT = [
  '您好，我是德达汽配询价机器人 🚛',
  '',
  '发送 OE 号或配件名称即可自动查询价格库存。',
  '回复“帮助”查看使用说明。',
].join('\n')

/** MsgId 去重（企业微信超时重试会重发同一 MsgId） */
const seenMsg = new Map<string, number>()
function pruneSeen(): void {
  const now = Date.now()
  if (seenMsg.size < 500) return
  for (const [k, t] of seenMsg) {
    if (now - t > 10 * 60 * 1000) seenMsg.delete(k)
  }
}

async function handleText(content: string, fromUser: string): Promise<string> {
  const c = content.trim()
  if (!c) return HELP_TEXT
  if (/^(帮助|help|\?|？|菜单)/i.test(c)) return HELP_TEXT

  const supabase = tryGetSupabase()
  if (!supabase) {
    return '查询服务暂时不可用，请稍后再试。\n人工服务：0531-85737222'
  }

  // 拆分多关键词（换行/逗号/分号/空白），最多 5 个
  const queries = Array.from(new Set(c.split(/[\n\r,，;；、|\s]+/).map((s) => s.trim()).filter(Boolean))).slice(0, 5)
  const lines: string[] = []
  let hitCount = 0

  for (const q of queries) {
    try {
      const { data } = await supabase.rpc('search_products', { q: normalizeOem(q), max_rows: 3 })
      const rows = (data || []) as ProductRow[]
      if (!rows.length) {
        lines.push(`❌ ${q}：暂无匹配`)
      } else {
        hitCount += rows.length
        for (const r of rows.slice(0, 3)) {
          const name = r.name_zh || r.name_en
          const meta = [r.oem_number ? `OE:${r.oem_number}` : '', r.brand || '', r.truck_model || '']
            .filter(Boolean)
            .join('  ')
          lines.push(`✅ ${name}\n    ${meta}`.trimEnd())
        }
      }
    } catch {
      lines.push(`❌ ${q}：查询出错`)
    }
  }

  // 询价留痕进 /admin 后台（失败不影响回复）
  supabase
    .from('inquiries')
    .insert({ image_url: '', note: `[企微机器人] ${c}`, contact: `wecom:${fromUser}`, status: 'new' })
    .then(() => {}, () => {})

  // 企微文本上限 2048 字节，超出截断
  let reply = lines.join('\n\n')
  reply += hitCount
    ? `\n\n——\n德达汽配 0531-85737222\n如需下单或批量报价请联系人工客服`
    : `\n\n——\n没找到的件已记录，人工客服会尽快跟进。\n德达汽配 0531-85737222`
  if (Buffer.byteLength(reply, 'utf8') > 2000) {
    reply = reply.slice(0, 1800) + '\n……\n（结果过多，请逐个发送 OE 号查询）'
  }
  return reply
}

function buildEncryptedReply(fromUser: string, toUser: string, timestamp: string, nonce: string, text: string, cfg: WeComConfig): string {
  const inner = `<xml><ToUserName><![CDATA[${fromUser}]]></ToUserName><FromUserName><![CDATA[${toUser}]]></FromUserName><CreateTime>${Math.floor(Date.now() / 1000)}</CreateTime><MsgType><![CDATA[text]]></MsgType><Content><![CDATA[${text}]]></Content></xml>`
  const enc = encryptMsg(inner, cfg)
  const sig = sha1Of(cfg.token, timestamp, nonce, enc)
  return `<xml><Encrypt><![CDATA[${enc}]]></Encrypt><MsgSignature><![CDATA[${sig}]]></MsgSignature><TimeStamp>${timestamp}</TimeStamp><Nonce><![CDATA[${nonce}]]></Nonce></xml>`
}

// ---------------- 路由 ----------------

export async function GET(req: NextRequest) {
  const cfg = getConfig()
  if (!cfg) return new Response('wecom callback not configured', { status: 500 })
  const sp = req.nextUrl.searchParams
  const msgSignature = sp.get('msg_signature') || ''
  const timestamp = sp.get('timestamp') || ''
  const nonce = sp.get('nonce') || ''
  const echostr = sp.get('echostr') || ''
  if (!msgSignature || !timestamp || !nonce || !echostr) {
    return new Response('bad params', { status: 400 })
  }
  if (sha1Of(cfg.token, timestamp, nonce, echostr) !== msgSignature) {
    return new Response('signature mismatch', { status: 403 })
  }
  try {
    const { msg, receiveId } = decryptMsg(echostr, cfg)
    if (receiveId && receiveId !== cfg.corpId) {
      return new Response('corpid mismatch', { status: 403 })
    }
    // 必须明文返回解密结果
    return new Response(msg, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
  } catch {
    return new Response('decrypt failed', { status: 400 })
  }
}

export async function POST(req: NextRequest) {
  const cfg = getConfig()
  if (!cfg) return new Response('wecom callback not configured', { status: 500 })
  const sp = req.nextUrl.searchParams
  const msgSignature = sp.get('msg_signature') || ''
  const timestamp = sp.get('timestamp') || ''
  const nonce = sp.get('nonce') || ''
  const body = await req.text()
  const encrypt = xmlTag(body, 'Encrypt')
  if (!encrypt) return new Response('success', { status: 200 })
  if (sha1Of(cfg.token, timestamp, nonce, encrypt) !== msgSignature) {
    return new Response('signature mismatch', { status: 403 })
  }

  let inner: string
  try {
    inner = decryptMsg(encrypt, cfg).msg
  } catch {
    return new Response('decrypt failed', { status: 400 })
  }

  const msgType = xmlTag(inner, 'MsgType')
  const fromUser = xmlTag(inner, 'FromUserName')
  const toUser = xmlTag(inner, 'ToUserName')
  const msgId = xmlTag(inner, 'MsgId')

  // 超时重试去重：同 MsgId 只处理一次，直接回空（企微把空响应当成功）
  if (msgId) {
    pruneSeen()
    if (seenMsg.has(msgId)) return new Response('success', { status: 200 })
    seenMsg.set(msgId, Date.now())
  }

  let replyText: string
  if (msgType === 'event' && /subscribe/i.test(xmlTag(inner, 'Event'))) {
    replyText = WELCOME_TEXT
  } else if (msgType === 'text') {
    replyText = await handleText(xmlTag(inner, 'Content'), fromUser)
  } else if (msgType === 'image') {
    replyText = '已收到图片。暂不支持图片识别，请直接发送 OE 号或配件名称文字询价。\n人工服务：0531-85737222'
  } else {
    replyText = HELP_TEXT
  }

  const out = buildEncryptedReply(fromUser, toUser, timestamp, nonce, replyText, cfg)
  return new Response(out, { headers: { 'Content-Type': 'application/xml' } })
}
