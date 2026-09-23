'use client'

import { useState, useEffect, useRef, FormEvent } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'

interface Props {
  onSubmit?: (oem: string) => void
  initialOem?: string
  placeholder?: string
}

interface Suggestion {
  slug: string
  label: string
  oem: string
  kind: string
}

export default function OemSearchBox({ onSubmit, initialOem = '', placeholder }: Props) {
  const router = useRouter()
  const t = useTranslations('searchbox')
  const [value, setValue] = useState(initialOem)
  const [loading, setLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [open, setOpen] = useState(false)
  const [highlight, setHighlight] = useState(-1)
  const boxRef = useRef<HTMLDivElement>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // URL 参数预填
  useEffect(() => {
    if (initialOem) setValue(initialOem)
  }, [initialOem])

  // 点击外部关闭下拉
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  // 防抖自动补全
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    const q = value.trim()
    if (q.length < 2) {
      setSuggestions([])
      setOpen(false)
      return
    }
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search/suggest?q=${encodeURIComponent(q)}`)
        const data = await res.json()
        const list: Suggestion[] = Array.isArray(data.suggestions) ? data.suggestions : []
        setSuggestions(list)
        setOpen(list.length > 0)
        setHighlight(-1)
      } catch {
        /* 静默失败 */
      }
    }, 250)
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [value])

  function goFullSearch(oem: string) {
    setOpen(false)
    if (onSubmit) {
      onSubmit(oem)
    } else {
      const encoded = encodeURIComponent(oem)
      router.push(`/products?q=${encoded}`)
    }
  }

  function goProduct(slug: string) {
    setOpen(false)
    router.push(`/products/${slug}`)
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const oem = value.trim()
    if (!oem) return
    if (highlight >= 0 && suggestions[highlight]) {
      goProduct(suggestions[highlight].slug)
      return
    }
    goFullSearch(oem)
  }

  function onKeyDown(e: React.KeyboardEvent) {
    if (!open || suggestions.length === 0) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlight((h) => (h + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlight((h) => (h <= 0 ? suggestions.length - 1 : h - 1))
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div ref={boxRef} className="relative w-full max-w-xl mx-auto">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder || t('placeholder')}
          autoComplete="off"
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
          {loading ? t('searching') : t('search')}
        </button>
      </form>

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden">
          {suggestions.map((s, i) => (
            <li key={s.slug}>
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  goProduct(s.slug)
                }}
                onMouseEnter={() => setHighlight(i)}
                className={`w-full text-left px-4 py-2.5 flex items-center justify-between gap-3 transition ${
                  i === highlight ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <span className="text-sm text-gray-900 truncate">{s.label}</span>
                {s.oem && (
                  <span className="shrink-0 font-mono text-xs text-blue-700">{s.oem}</span>
                )}
              </button>
            </li>
          ))}
          <li className="px-4 py-1.5 bg-gray-50 border-t border-gray-100">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                goFullSearch(value.trim())
              }}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              {t('fullResults', { q: value.trim() })}
            </button>
          </li>
        </ul>
      )}
    </div>
  )
}
