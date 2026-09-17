'use client'

import { categoryLabel } from '@/lib/categories'

interface FilterOption {
  name: string
  count: number
}

interface Props {
  categories: FilterOption[]
  models: FilterOption[]
  selectedCategory: string
  selectedModel: string
  onCategoryChange: (category: string) => void
  onModelChange: (model: string) => void
  onReset: () => void
}

export default function ModelFilterSidebar({
  categories,
  models,
  selectedCategory,
  selectedModel,
  onCategoryChange,
  onModelChange,
  onReset,
}: Props) {
  const hasFilter = Boolean(selectedCategory || selectedModel)

  const rowClass = (active: boolean) =>
    `w-full text-left px-3 py-2 rounded-md text-sm transition-colors border ${
      active
        ? 'bg-blue-100 text-blue-700 border-blue-300 font-medium'
        : 'text-gray-700 border-transparent hover:bg-gray-50'
    }`

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 lg:sticky lg:top-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-semibold text-gray-900">筛选</h3>
        {hasFilter && (
          <button
            onClick={onReset}
            className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
          >
            重置
          </button>
        )}
      </div>

      {/* 分类 */}
      <div className="mb-5">
        <h4 className="text-sm font-medium text-gray-700 mb-2">分类</h4>
        <div className="space-y-1">
          <button onClick={() => onCategoryChange('')} className={rowClass(!selectedCategory)}>
            全部分类
            <span className="float-right text-xs text-gray-400">
              {categories.reduce((s, c) => s + c.count, 0)}
            </span>
          </button>
          {categories.map((c) => (
            <button
              key={c.name}
              onClick={() => onCategoryChange(c.name)}
              className={rowClass(selectedCategory === c.name)}
            >
              {categoryLabel(c.name)}
              <span className="float-right text-xs text-gray-400">{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 机型 */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">适用机型</h4>
        <div className="space-y-1">
          <button onClick={() => onModelChange('')} className={rowClass(!selectedModel)}>
            全部机型
          </button>
          <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
            {models.map((m) => (
              <button
                key={m.name}
                onClick={() => onModelChange(m.name)}
                className={rowClass(selectedModel === m.name)}
                title={m.name}
              >
                <span className="block truncate">{m.name}</span>
                <span className="float-right text-xs text-gray-400">{m.count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 当前筛选状态 */}
      {hasFilter && (
        <div className="mt-5 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <h4 className="text-sm font-medium text-blue-900 mb-1">当前筛选</h4>
          {selectedCategory && (
            <div className="text-sm text-blue-700">分类: {categoryLabel(selectedCategory)}</div>
          )}
          {selectedModel && <div className="text-sm text-blue-700">机型: {selectedModel}</div>}
        </div>
      )}
    </div>
  )
}
