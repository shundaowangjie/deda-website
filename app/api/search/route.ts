import { NextRequest, NextResponse } from 'next/server'
import { tryGetSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface SearchRow {
  slug: string
  sku: string | null
  name_en: string
  name_zh: string | null
  brand: string | null
  truck_model: string | null
  oem_number: string | null
  category: string
  score?: number
}

/** GET /api/search?q=关键词&limit=24（兼容 ?oem=）
 *  优先走 search_products RPC（加权 + 同义词扩展），未安装时 ilike 兜底 */
export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const q = (sp.get('q') || sp.get('oem') || '').trim()
  if (!q) {
    return NextResponse.json({ ok: false, error: '缺少搜索词 ?q=' }, { status: 400 })
  }
  const maxRows = Math.min(Math.max(parseInt(sp.get('limit') || '24', 10) || 24, 1), 50)

  const supabase = tryGetSupabase()
  if (!supabase) {
    return NextResponse.json({ ok: false, error: '数据库未配置' }, { status: 500 })
  }

  const [{ data: results, error }, { data: syn }] = await Promise.all([
    supabase.rpc('search_products', { q, max_rows: maxRows }),
    supabase.from('search_synonyms').select('term, synonym').limit(300),
  ])

  // 同义词扩展提示（表未安装时静默为空）
  const lowered = q.toLowerCase()
  const expanded = Array.from(
    new Set(
      (syn || []).flatMap((r: { term: string; synonym: string }) =>
        r.term.toLowerCase() === lowered
          ? [r.synonym]
          : r.synonym.toLowerCase() === lowered
            ? [r.term]
            : [],
      ),
    ),
  )

  if (error) {
    // RPC 未安装 → ilike 兜底，功能不中断
    const pattern = `%${q.replace(/[%_\\]/g, (m) => '\\' + m)}%`
    const { data: fb } = await supabase
      .from('products')
      .select('slug, sku, name_en, name_zh, brand, truck_model, oem_number, category')
      .or(
        `name_en.ilike.${pattern},name_zh.ilike.${pattern},oem_number.ilike.${pattern},sku.ilike.${pattern},brand.ilike.${pattern},truck_model.ilike.${pattern}`,
      )
      .in('status', ['published', 'active'])
      .limit(maxRows)
    return NextResponse.json({ ok: true, results: (fb || []) as SearchRow[], expanded })
  }

  return NextResponse.json({ ok: true, results: (results || []) as SearchRow[], expanded })
}
