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
  const all: { slug: string; updated_at: string | null }[] = []
  // id 是唯一主键——按 id 键集分页，彻底避免非唯一排序（updated_at 大量并列）
  // 导致的跨页重复/丢行（2026-10-05 实测旧写法丢 1713 款）
  let lastId = 0
  for (;;) {
    const { data } = await supabase
      .from('products')
      .select('id, slug, updated_at')
      .in('status', ['published', 'active'])
      .gt('id', lastId)
      .order('id', { ascending: true })
      .limit(PAGE_SIZE)
    const rows =
      (data as { id: number; slug: string; updated_at: string | null }[]) || []
    for (const r of rows) all.push({ slug: r.slug, updated_at: r.updated_at })
    if (rows.length < PAGE_SIZE) break
    lastId = rows[rows.length - 1].id
  }
  return all
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
