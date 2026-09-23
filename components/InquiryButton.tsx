'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { addInquiryItem, type InquiryItem } from '@/lib/inquiryStore'

interface Props {
  item: InquiryItem
  compact?: boolean
}

export default function InquiryButton({ item, compact = false }: Props) {
  const t = useTranslations('product')
  const [state, setState] = useState<'idle' | 'added'>('idle')

  function handleAdd() {
    const result = addInquiryItem(item)
    if (result.ok) {
      setState('added')
      setTimeout(() => setState('idle'), 2500)
    }
  }

  if (state === 'added') {
    return (
      <Link
        href="/inquiry"
        className={`${compact ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'} inline-flex items-center gap-1 rounded-lg bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 transition`}
      >
        {t('added')}
      </Link>
    )
  }

  return (
    <button
      type="button"
      onClick={handleAdd}
      className={`${compact ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5'} inline-flex items-center gap-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 active:scale-95 transition`}
    >
      {t('addInquiry')}
    </button>
  )
}
