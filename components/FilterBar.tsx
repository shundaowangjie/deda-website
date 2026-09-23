'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { categoryLabelFor } from '@/lib/categories'

interface FacetOption {
  name: string
  count: number
}

interface Props {
  categories: FacetOption[]
  models: FacetOption[]
  total: number
  selectedCategory: string
  selectedModel: string
  q: string
  locale: string
  onCategoryChange: (category: string) => void
  onModelChange: (model: string) => void
  onReset: () => void
}

export default function FilterBar({
  categories,
  models,
  total,
  selectedCategory,
  selectedModel,
  q,
  locale,
  onCategoryChange,
  onModelChange,
  onReset,
}: Props) {
  const t = useTranslations('filter')
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const panelRef = useRef<HTMLDivElement>(null)
  const catLabel = (slug: string) => categoryLabelFor(slug, locale)

  useEffect(() => {
    if (!open) return
    const onDoc = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onDoc)
    return () => document.removeEventListener('mousedown', onDoc)
  }, [open])

  const kw = search.trim().toLowerCase()
  const filteredModels = kw ? models.filter((m) => m.name.toLowerCase().includes(kw)) : models
  const totalAll = categories.reduce((s, c) => s + c.count, 0)
  const hasFilter = Boolean(selectedCategory || selectedModel || q)
  const quickModels = models.slice(0, 10)
  const quickActive = quickModels.some((m) => m.name === selectedModel)

  const chipCls = (active: boolean) =>
    `shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border transition-colors whitespace-nowrap ${
      active
        ? 'bg-blue-600 text-white border-blue-600 font-medium'
        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-400 hover:text-blue-700'
    }`

  return (
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 space-y-2.5">
        {/* 分类:横向滚动标签条 */}
        <div className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button onClick={() => onCategoryChange('')} className={chipCls(!selectedCategory)}>
            {t('all')}
            <span className={`text-xs ${selectedCategory ? 'text-gray-400' : 'text-blue-200'}`}>
              {totalAll}
            </span>
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => onCategoryChange(c.name)}
              className={chipCls(selectedCategory === c.name)}
            >
              {catLabel(c.name)}
              <span className={`text-xs ${selectedCategory === c.name ? 'text-blue-200' : 'text-gray-400'}`}>
                {c.count}
              </span>
            </button>
          ))}
        </div>

        {/* 机型:高频快捷 + 可搜索下拉 */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-gray-400 shrink-0 w-8">{t('model')}</span>
          {quickModels.map((m) => (
            <button
              key={m.name}
              onClick={() => onModelChange(selectedModel === m.name ? '' : m.name)}
              className={chipCls(selectedModel === m.name)}
              title={`${m.name} · ${t('modelCount', { count: m.count })}`}
            >
              {m.name.length > 10 ? m.name.slice(0, 10) + '…' : m.name}
              <span className={`text-xs ${selectedModel === m.name ? 'text-blue-200' : 'text-gray-400'}`}>
                {m.count}
              </span>
            </button>
          ))}
          <div className="relative" ref={panelRef}>
            <button
              onClick={() => setOpen((v) => !v)}
              className={`shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm border ${
                selectedModel && !quickActive
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-gray-50 text-gray-700 border-gray-300 hover:border-blue-400'
              }`}
            >
              {selectedModel && !quickActive
                ? t('modelSelected', {
                    model: selectedModel.length > 8 ? selectedModel.slice(0, 8) + '…' : selectedModel,
                  })
                : t('moreModels')}
              <span className="text-xs">▾</span>
            </button>
            {open && (
              <div className="absolute left-0 mt-2 w-80 max-w-[90vw] bg-white border border-gray-200 rounded-xl shadow-xl z-30 overflow-hidden">
                <div className="p-2 border-b border-gray-100">
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t('searchPlaceholder')}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-400"
                    autoFocus
                  />
                </div>
                <div className="max-h-72 overflow-y-auto">
                  <button
                    onClick={() => {
                      onModelChange('')
                      setOpen(false)
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 ${
                      !selectedModel ? 'text-blue-700 font-medium' : 'text-gray-700'
                    }`}
                  >
                    {t('allModels')}
                    <span className="float-right text-xs text-gray-400">{total}</span>
                  </button>
                  {filteredModels.slice(0, 150).map((m) => (
                    <button
                      key={m.name}
                      onClick={() => {
                        onModelChange(m.name)
                        setOpen(false)
                      }}
                      className={`w-full text-left px-3 py-2 text-sm hover:bg-blue-50 truncate ${
                        selectedModel === m.name ? 'text-blue-700 font-medium' : 'text-gray-700'
                      }`}
                      title={m.name}
                    >
                      {m.name}
                      <span className="float-right text-xs text-gray-400">{m.count}</span>
                    </button>
                  ))}
                  {filteredModels.length === 0 && (
                    <p className="px-3 py-6 text-center text-sm text-gray-400">{t('noModelMatch')}</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 已选条件 */}
        {hasFilter && (
          <div className="flex items-center gap-2 flex-wrap text-sm">
            <span className="text-xs text-gray-400">{t('selected')}</span>
            {q && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {t('searchChip', { q: q.length > 12 ? q.slice(0, 12) + '…' : q })}
                <button onClick={() => onReset()} className="text-blue-400 hover:text-blue-700">
                  ×
                </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {t('categoryChip', { cat: catLabel(selectedCategory) })}
                <button
                  onClick={() => onCategoryChange('')}
                  className="text-blue-400 hover:text-blue-700"
                >
                  ×
                </button>
              </span>
            )}
            {selectedModel && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                {t('modelChip', {
                  model: selectedModel.length > 12 ? selectedModel.slice(0, 12) + '…' : selectedModel,
                })}
                <button onClick={() => onModelChange('')} className="text-blue-400 hover:text-blue-700">
                  ×
                </button>
              </span>
            )}
            <button onClick={onReset} className="text-xs text-gray-400 hover:text-blue-600 underline">
              {t('resetAll')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
