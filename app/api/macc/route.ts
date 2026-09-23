import { NextRequest, NextResponse } from 'next/server'

/**
 * 51macc 商用车数据接口代理(内部 VIN 查件工具专用)。
 * 密钥只在服务端读取(MACC_USERID);30 分钟内存缓存省额度;见 docs/macc-api.md
 */
const BASE = 'https://www.51macc.com/api/Mattrio/CvApi'
const TTL = 30 * 60 * 1000
const cache = new Map<string, { at: number; data: unknown }>()

const METHOD_MAP: Record<string, string> = {
  serial: 'GetSerial',
  groups: 'GetGroupss',
  bom: 'GetBom',
  price: 'getItemPrice',
}

export async function POST(req: NextRequest) {
  const userid = process.env.MACC_USERID
  if (!userid) {
    return NextResponse.json(
      { ok: false, error: '服务端未配置 MACC_USERID(Vercel 后台 Environment Variables 需手动添加后重部署)' },
      { status: 500 },
    )
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ ok: false, error: '请求体不是合法 JSON' }, { status: 400 })
  }
  const { action, ...params } = body
  const method = METHOD_MAP[action as string]
  if (!method) {
    return NextResponse.json({ ok: false, error: '未知操作' }, { status: 400 })
  }

  const form = new URLSearchParams({ userid })
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && String(v) !== '') form.set(k, String(v))
  }

  const cacheKey = `${method}?${form.toString()}`
  const hit = cache.get(cacheKey)
  if (hit && Date.now() - hit.at < TTL) {
    return NextResponse.json({ ok: true, cached: true, data: hit.data })
  }

  try {
    const res = await fetch(`${BASE}/${method}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded', Accept: '*/*' },
      body: form.toString(),
    })
    const data = (await res.json()) as Record<string, unknown>
    // GetGroupss 包一层 group 且 recode=200;其余顶层 recode=0
    const payload = ((data.group as Record<string, unknown>) ?? data) as Record<string, unknown>
    const recode = Number(payload.recode ?? data.recode)
    const frequency = (payload.frequency as number) ?? (data.frequency as number) ?? null
    const msg = (payload.msg as string) ?? (data.msg as string) ?? ''
    if (recode !== 0 && recode !== 200) {
      const hint: Record<number, string> = {
        [-1]: '暂无数据(可能未收录或非重卡)',
        [-2]: '密钥错误',
        [-3]: '当天次数已用完',
        [-4]: '请求太频繁(按天次限制),一小时后再试',
        [-5]: '接口报错',
        [-10]: '请求过于频繁,稍后再试',
        [-11]: 'VIN 不符合校验规则或非国标码',
        [-12]: '解析 VIN 失败',
        [-13]: '暂不支持该品牌',
        [-999]: '账号已被封禁',
      }
      return NextResponse.json({
        ok: false,
        recode,
        frequency,
        error: hint[recode] || msg || `上游错误(${recode})`,
      })
    }
    cache.set(cacheKey, { at: Date.now(), data })
    return NextResponse.json({ ok: true, frequency, data })
  } catch (e) {
    const hint = process.env.VERCEL
      ? '公网版暂无法直连国内数据源(51macc 仅境内可达)。请在办公室电脑上使用内网版:http://localhost:3000/vin'
      : '上游请求失败: ' + (e as Error).message
    return NextResponse.json({ ok: false, error: hint }, { status: 502 })
  }
}
