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
  for (let from = 0; ; from += PAGE_SIZE) {
    const { data } = await supabase
      .from('products')
      .select('slug, updated_at')
      .in('status', ['published', 'active'])
      .order('updated_at', { ascending: false })
      .range(from, from + PAGE_SIZE - 1)
    const rows = (data as { slug: string; updated_at: string | null }[]) || []
    all.push(...rows)
    if (rows.length < PAGE_SIZE) break
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
