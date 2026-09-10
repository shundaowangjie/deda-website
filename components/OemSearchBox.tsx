'use client'

import { useState, useEffect, FormEvent } from 'react'

interface Props {
  onSubmit?: (oem: string) => void
  initialOem?: string
}

export default function OemSearchBox({ onSubmit, initialOem = '' }: Props) {
  const [value, setValue] = useState(initialOem)
  const [loading, setLoading] = useState(false)

  // URL 参数预填
  useEffect(() => {
    if (initialOem) setValue(initialOem)
  }, [initialOem])

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const oem = value.trim()
    if (!oem) return
    setLoading(true)
    try {
      if (onSubmit) {
        onSubmit(oem)
      } else {
        // 无外部处理器时跳转 /search-test
        const encoded = encodeURIComponent(oem)
        window.location.href = `/search-test?oem=${encoded}`
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full max-w-xl mx-auto">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="输入 OEM 号，如 VG1560118229"
        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg
                   focus:outline-none focus:ring-2 focus:ring-blue-500
                   font-mono text-sm text-gray-900 placeholder:text-gray-500"
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg
                   hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed
                   font-medium transition"
      >
        {loading ? '查询中...' : '查询'}
      </button>
    </form>
  )
}
