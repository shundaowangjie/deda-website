import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let browserClient: SupabaseClient | null = null

/**
 * 浏览器端 Supabase 客户端（Google OAuth 登录专用，PKCE 流程）。
 * 与 lib/supabase.ts 的通用客户端分开，避免影响数据查询路径。
 */
export function getSupabaseBrowser(): SupabaseClient {
  if (browserClient) return browserClient
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      '缺少 Supabase 环境变量，请检查 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }
  browserClient = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      flowType: 'pkce',
      persistSession: true,
      autoRefreshToken: true,
    },
  })
  return browserClient
}
