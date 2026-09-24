import { NextRequest, NextResponse } from 'next/server'
import { tryGetSupabase } from '@/lib/supabase'

/**
 * 51macc 商用车数据接口代理(内部 VIN 查件工具专用)。
 * 密钥只在服务端读取(MACC_USERID);双层缓存省额度:
 *   L1 内存 30 分钟;L2 Supabase macc_cache 永久(表未建/写失败静默降级)。
 * serial/groups/bom 缓存 90 天,price 缓存 14 天。见 docs/macc-api.md
 */
const BASE = 'https://www.51macc.com/api/Mattrio/CvApi'
const TTL_MEM = 30 * 60 * 1000
const TTL_DB: Record<string, number> = {
  serial: 90 * 24 * 3600 * 1000,
  groups: 90 * 24 * 3600 * 1000,
  bom: 90 * 24 * 3600 * 1000,
  price: 14 * 24 * 3600 * 1000,
}
const mem = new Map<string, { at: number; data: unknown }>()

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

  const cacheKey = `${method}?${new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && String(v) !== ''),
  )
    .entries()
    .toArray()
    .map(([k, v]) => `${k}=${String(v)}`)
    .sort()
    .join('&')}`

  // L1 内存缓存
  const hit = mem.get(cacheKey)
  if (hit && Date.now() - hit.at < TTL_MEM) {
    return NextResponse.json({ ok: true, cached: true, data: hit.data })
  }

  // L2 永久缓存(macc_cache 表;未建表/查询失败静默跳过)
  const supabase = tryGetSupabase()
  const ttlDb = TTL_DB[action as string] ?? TTL_DB.bom
  if (supabase) {
    try {
      const { data: row } = await supabase
        .from('macc_cache')
        .select('payload')
        .eq('cache_key', cacheKey)
        .gt('updated_at', new Date(Date.now() - ttlDb).toISOString())
        .maybeSingle()
      if (row?.payload) {
        mem.set(cacheKey, { at: Date.now(), data: row.payload })
        return NextResponse.json({ ok: true, cached: true, data: row.payload })
      }
    } catch {
      /* 表未建等情况,降级直查 */
    }
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
    mem.set(cacheKey, { at: Date.now(), data })
    // 写回永久缓存(失败不影响返回)
    if (supabase) {
      try {
        await supabase.from('macc_cache').upsert({
          cache_key: cacheKey,
          action: String(action),
          payload: data,
          frequency: frequency ?? null,
          updated_at: new Date().toISOString(),
        })
      } catch {
        /* 静默 */
      }
    }
    return NextResponse.json({ ok: true, frequency, data })
  } catch (e) {
    const hint = process.env.VERCEL
      ? '公网版暂无法直连国内数据源(51macc 仅境内可达)。请在办公室电脑上使用内网版:http://localhost:3000/vin'
      : '上游请求失败: ' + (e as Error).message
    return NextResponse.json({ ok: false, error: hint }, { status: 502 })
  }
}
