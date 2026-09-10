export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { normalizeOem } from '@/lib/oem'

// Supabase 客户端
function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url?.startsWith('http') || !key) {
    throw new Error('Supabase 环境变量未配置，请检查 .env.local')
  }
  return createClient(url, key)
}

// 结构化错误响应
function errRes(message: string, code: string, status = 500) {
  return NextResponse.json({ error: message, code }, { status })
}

// 带重试的查询执行
async function queryWithRetry<T>(fn: () => Promise<T>, retries = 1): Promise<{ data?: T; error?: string; code?: string }> {
  for (let i = 0; i <= retries; i++) {
    try {
      const data = await fn()
      return { data }
    } catch (e: any) {
      const lastTry = i === retries
      // 瞬断错误重试一次，最终返回结构化错误而非 TypeError
      if (lastTry) {
        const isTransient = e?.message?.includes('fetch') || e?.message?.includes('network') || e?.code === 'ECONNRESET'
        return {
          error: isTransient ? '服务暂时不可用，请稍后重试' : e.message,
          code: isTransient ? 'SERVICE_UNAVAILABLE' : 'INTERNAL_ERROR'
        }
      }
    }
  }
  return { error: '未知错误', code: 'INTERNAL_ERROR' }
}

export async function GET(request: NextRequest) {
  const oemParam = request.nextUrl.searchParams.get('oem')
  const slugParam = request.nextUrl.searchParams.get('slug')

  // 同传优先 oem，双空返回 400
  if (!oemParam && !slugParam) {
    return NextResponse.json(
      { error: 'oem 或 slug 参数必填' },
      { status: 400 }
    )
  }

  if (oemParam) {
    const normalizedOem = normalizeOem(oemParam)
    const supabase = getSupabase()
    // 先查 products.oem_number 精确匹配
    const directResult = await queryWithRetry(async () => {
      const { data } = await supabase
        .from('products')
        .select('slug, name_en, brand, oem_number, category')
        .eq('oem_number', normalizedOem)
        .in('status', ['published', 'active'])
      return data
    })

    if (directResult.error) {
      return errRes(directResult.error, 'QUERY_FAILED')
    }

    const directResults = directResult.data
    if (directResults && directResults.length > 0) {
      return NextResponse.json(directResults)
    }

    // 未命中则查 product_cross_references.ref_oem
    const crossResult = await queryWithRetry(async () => {
      const { data } = await supabase
        .from('product_cross_references')
        .select('products:product_id (slug, name_en, brand, oem_number, category)')
        .eq('ref_oem', normalizedOem)
      return data
    })

    if (crossResult.error) {
      return errRes(crossResult.error, 'CROSS_REF_QUERY_FAILED')
    }

    // 展平嵌套结构
    const products = crossResult.data
      ? crossResult.data.map(ref => (ref as any).products).filter(Boolean)
      : []

    return NextResponse.json(products)
  }

  // === slug 分支（顶层）===
  if (slugParam) {
    const supabase = getSupabase()
    const slugResult = await queryWithRetry(async () => {
      const { data } = await supabase
        .from('products')
        .select('slug, name_en, brand, oem_number, category, sku, name_zh')
        .eq('slug', slugParam)
        .in('status', ['published', 'active'])
        .maybeSingle()
      return data
    })

    if (slugResult.error) {
      return errRes(slugResult.error, 'SLUG_QUERY_FAILED')
    }

    return NextResponse.json(slugResult.data ? [slugResult.data] : [])
  }
}
