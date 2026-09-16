'use client'

import { useEffect, useState } from 'react'
import type { User } from '@supabase/supabase-js'
import { getSupabaseBrowser } from '@/lib/supabaseBrowser'

/** 导航栏 Google 登录按钮：未登录显示"登录"，登录后显示邮箱和"退出" */
export default function AuthButton() {
  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const supabase = getSupabaseBrowser()
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user ?? null)
      setReady(true)
    })
  }, [])

  async function handleLogin() {
    setBusy(true)
    setError('')
    const supabase = getSupabaseBrowser()
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
    if (error) {
      setError(
        /not enabled|unsupported provider/i.test(error.message)
          ? 'Google 登录尚未启用（需在 Supabase 后台配置 Google Client ID/Secret）'
          : `登录失败：${error.message}`
      )
      setBusy(false)
    }
    // 成功时浏览器已跳转至 Google 授权页，无需后续处理
  }

  async function handleLogout() {
    setBusy(true)
    const supabase = getSupabaseBrowser()
    await supabase.auth.signOut()
    setUser(null)
    setBusy(false)
  }

  if (!ready) return null

  if (user) {
    const name =
      (user.user_metadata?.full_name as string | undefined) ||
      user.email?.split('@')[0] ||
      '已登录'
    return (
      <span className="flex items-center gap-1">
        <span
          className="hidden md:inline text-gray-500 text-xs max-w-[120px] truncate"
          title={user.email ?? ''}
        >
          {name}
        </span>
        <button
          onClick={handleLogout}
          disabled={busy}
          className="text-gray-600 hover:text-blue-700 px-2 py-1.5 rounded-lg hover:bg-gray-50 transition disabled:opacity-50"
        >
          退出
        </button>
      </span>
    )
  }

  return (
    <span className="relative inline-flex">
      <button
        onClick={handleLogin}
        disabled={busy}
        className="flex items-center gap-1.5 border border-gray-300 hover:border-blue-500 hover:text-blue-700 text-gray-700 px-2.5 py-1.5 rounded-lg transition disabled:opacity-50"
      >
        <svg className="w-4 h-4" viewBox="0 0 48 48" aria-hidden="true">
          <path
            fill="#FFC107"
            d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"
          />
          <path
            fill="#FF3D00"
            d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
          />
          <path
            fill="#4CAF50"
            d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
          />
          <path
            fill="#1976D2"
            d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"
          />
        </svg>
        {busy ? '跳转中…' : '登录'}
      </button>
      {error && (
        <span className="absolute right-0 top-full mt-1 text-xs text-red-600 bg-white border border-red-200 rounded px-2 py-1 shadow-sm whitespace-nowrap z-50">
          {error}
        </span>
      )}
    </span>
  )
}
