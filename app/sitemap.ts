import { tryGetSupabase } from '@/lib/supabase'
import type { MetadataRoute } from 'next'

export const revalidate = 3600

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://products.dedaautoparts.com'

// Supabase 服务端单请求硬上限 1000 行（PostgREST max-rows）——分页取全量
const PAGE_SIZE = 1000

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

  return [
    {
      url: SITE,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...(data?.map((p) => ({
      url: `${SITE}/products/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })) ?? []),
  ]
}
