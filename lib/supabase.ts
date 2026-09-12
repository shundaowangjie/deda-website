import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

/** 惰性初始化：首次调用时才读取环境变量并创建客户端，避免构建期模块加载即 throw */
export function getSupabase(): SupabaseClient {
  if (client) return client
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
      '缺少 Supabase 环境变量，请检查 NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }
  client = createClient(supabaseUrl, supabaseAnonKey)
  return client
}

/** 容错版：环境变量缺失时返回 null 而不是 throw（构建期页面用它兜底，不让 build 失败） */
export function tryGetSupabase(): SupabaseClient | null {
  try {
    return getSupabase()
  } catch {
    return null
  }
}
