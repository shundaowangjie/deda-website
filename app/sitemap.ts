import { tryGetSupabase } from '@/lib/supabase'
import type { MetadataRoute } from 'next'

export const revalidate = 3600

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://products.dedaautoparts.com'

// Supabase 服务端单请求硬上限 1000 行(PostgREST max-rows)——分页取全量
const PAGE_SIZE = 1000

const LOCALES = ['zh', 'en', 'ru'] as const

function localeUrl(locale: string, path: string): string {
  return locale === 'zh' ? `${SITE}${path}` : `${SITE}/${locale}${path}`
}

function alternates(path: string) {
  const languages: Record<string, string> = { 'x-default': localeUrl('zh', path) }
  for (const l of LOCALES) {
    languages[l === 'zh' ? 'zh-CN' : l] = localeUrl(l, path)
  }
  return { languages }
}

async function fetchAllProductSlugs(): Promise<
  { slug: string; updated_at: string | null }[]
> {
  const supabase = tryGetSupabase()
  if (!supabase) return []

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

  // 预期总数（同时兼作完整性基准）
  let expected = 0
  for (let i = 0; i < 3; i++) {
    const { count, error } = await supabase
      .from('products')
      .select('slug', { count: 'exact', head: true })
      .in('status', ['published', 'active'])
    if (!error && count != null) {
      expected = count
      break
    }
    await sleep(1000)
  }

  // id 是 UUID 不能做数值比较（gt(id,0) 直接报错，曾致空表上线）；
  // slug 唯一——按 slug 键集分页，彻底避免非唯一排序（updated_at 大量并列）
  // 导致的跨页重复/丢行（旧 offset 写法实测丢 1713 款）；
  // 逐页与整体均带重试防构建期瞬态失败
  for (let attempt = 0; attempt < 3; attempt++) {
    const all: { slug: string; updated_at: string | null }[] = []
    let lastSlug = ''
    let failed = false
    for (;;) {
      let rows: { slug: string; updated_at: string | null }[] | null = null
      for (let i = 0; i < 3; i++) {
        const { data, error } = await supabase
          .from('products')
          .select('slug, updated_at')
          .in('status', ['published', 'active'])
          .gt('slug', lastSlug)
          .order('slug', { ascending: true })
          .limit(PAGE_SIZE)
        if (!error && data) {
          rows =
            (data as { slug: string; updated_at: string | null }[]) || []
          break
        }
        await sleep(1000)
      }
      if (rows === null) {
        failed = true
        break
      }
      for (const r of rows) all.push({ slug: r.slug, updated_at: r.updated_at })
      if (rows.length < PAGE_SIZE) break
      lastSlug = rows[rows.length - 1].slug
    }
    if (!failed && (expected === 0 || all.length >= expected)) return all
    console.warn(
      `[sitemap] 产品拉取不完整（第 ${attempt + 1} 次）：得 ${all.length} / 预期 ${expected}${failed ? '，存在失败页' : ''}，重试`,
    )
    await sleep(1500)
  }
  return []
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await fetchAllProductSlugs()

  const staticRoutes: MetadataRoute.Sitemap = [
    { path: '/', priority: 1, changeFrequency: 'daily' as const },
    { path: '/products', priority: 0.9, changeFrequency: 'daily' as const },
    { path: '/about', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/contact', priority: 0.6, changeFrequency: 'monthly' as const },
    { path: '/inquiry', priority: 0.5, changeFrequency: 'monthly' as const },
  ].map(({ path, priority, changeFrequency }) => ({
    url: localeUrl('zh', path),
    lastModified: new Date(),
    changeFrequency,
    priority,
    alternates: alternates(path),
  }))

  const productRoutes: MetadataRoute.Sitemap = (data ?? []).map((p) => {
    const path = `/products/${p.slug}`
    return {
      url: localeUrl('zh', path),
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
      alternates: alternates(path),
    }
  })

  return [...staticRoutes, ...productRoutes]
}
