import { tryGetSupabase } from '@/lib/supabase'
import type { MetadataRoute } from 'next'

export const revalidate = 3600

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://products.dedaautoparts.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = tryGetSupabase()
  const { data } = supabase
    ? await supabase
        .from('products')
        .select('slug, updated_at')
        .in('status', ['published', 'active'])
        .order('updated_at', { ascending: false })
        .limit(5000) // 同 /products：避免默认 1000 行截断
    : { data: null }

  return [
    {
      url: SITE,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    ...(data?.map(p => ({
      url: `${SITE}/products/${p.slug}`,
      lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })) ?? []),
  ]
}
