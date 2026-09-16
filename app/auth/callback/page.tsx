'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabaseBrowser'

/**
 * Google OAuth 回调页：Supabase 授权完成后跳回这里携带 ?code=，
 * 用 PKCE code 换取会话，然后返回首页。
 */
export default function AuthCallbackPage() {
  const router = useRouter()
  const [status, setStatus] = useState<'working' | 'ok' | 'fail'>('working')

  useEffect(() => {
    const supabase = getSupabaseBrowser()
    const run = async () => {
      try {
        await supabase.auth.exchangeCodeForSession(window.location.href)
      } catch {
        // detectSessionInUrl 可能已自动完成交换，忽略重复交换错误
      }
      const { data } = await supabase.auth.getUser()
      if (data.user) {
        setStatus('ok')
        setTimeout(() => router.replace('/'), 800)
      } else {
        setStatus('fail')
        setTimeout(() => router.replace('/'), 2500)
      }
    }
    run()
  }, [router])

  return (
    <div className="flex flex-col items-center justify-center py-24 text-center px-4">
      {status === 'working' && <p className="text-gray-500">正在完成登录…</p>}
      {status === 'ok' && <p className="text-green-600 font-medium">✓ 登录成功，正在返回首页…</p>}
      {status === 'fail' && (
        <p className="text-red-600">
          登录未完成，正在返回首页…（若持续失败，请检查 Supabase Google Provider 是否已启用）
        </p>
      )}
    </div>
  )
}
