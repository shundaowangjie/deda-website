import { NextRequest, NextResponse } from 'next/server'
import { tryGetSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

interface SuggestRow {
  slug: string
  label: string
  oem: string
  kind: string
}

export async function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get('q') || '').replace(/\+/g, ' ').trim()
  if (q.length < 1) {
    return NextResponse.json({ ok: true, suggestions: [] })
  }

  const supabase = tryGetSupabase()
  if (!supabase) {
    return NextResponse.json({ ok: true, suggestions: [] })
  }

  const { data, error } = await supabase.rpc('suggest_products', {
    q,
    max_rows: 8,
  })

  if (error) {
    // 函数未创建等 → 兜底 ilike
    const pattern = `%${q.replace(/%/g, '\\%').replace(/_/g, '\\_')}%`
    const { data: fb } = await supabase
      .from('products')
      .select('slug, name_en, name_zh, name_ru, oem_number')
      .or(
        `name_en.ilike.${pattern},name_zh.ilike.${pattern},name_ru.ilike.${pattern},oem_number.ilike.${pattern},sku.ilike.${pattern}`,
      )
      .in('status', ['published', 'active'])
      .limit(8)
    const suggestions = (fb || []).map((p: Record<string, string>) => ({
      slug: p.slug,
      label: `${p.name_ru || p.name_zh || p.name_en} ${p.name_en}`.trim(),
      oem: p.oem_number || '',
      kind: 'product',
    }))
    return NextResponse.json({ ok: true, suggestions })
  }

  return NextResponse.json({
    ok: true,
    suggestions: (data || []) as SuggestRow[],
  })
}
