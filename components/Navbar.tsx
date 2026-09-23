'use client'

import { useLocale, useTranslations } from 'next-intl'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import AuthButton from './AuthButton'

const MAIN_SITE = 'https://dedaautoparts.com'

const LOCALE_OPTIONS = [
  { code: 'zh', label: '中文' },
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
]

export default function Navbar() {
  const t = useTranslations('nav')
  const locale = useLocale()
  const pathname = usePathname()
  const router = useRouter()

  function switchTo(next: string) {
    if (next === locale) return
    const search = typeof window !== 'undefined' ? window.location.search : ''
    router.replace(pathname + search, { locale: next })
  }

  return (
    <nav data-chrome className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
        <Link href="/" className="text-lg font-bold text-gray-900 hover:text-blue-700 transition shrink-0">
          DEDA Auto Parts
        </Link>
        <div className="flex items-center gap-1 text-sm">
          <a
            href={MAIN_SITE}
            title={t('mainSite')}
            className="hidden sm:inline text-gray-600 hover:text-blue-700 transition px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            {t('home')}
          </a>
          <Link
            href="/products"
            className="text-gray-600 hover:text-blue-700 transition px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            {t('catalog')}
          </Link>
          <Link
            href="/inquiry"
            className="text-blue-700 font-medium hover:text-blue-800 transition px-3 py-1.5 rounded-lg hover:bg-blue-50"
          >
            {t('inquiry')}
          </Link>
          <AuthButton />
          {/* 语言切换 */}
          <div className="flex items-center rounded-lg border border-gray-200 overflow-hidden ml-1">
            {LOCALE_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                onClick={() => switchTo(opt.code)}
                className={`px-2 py-1 text-xs transition ${
                  locale === opt.code
                    ? 'bg-blue-600 text-white font-medium'
                    : 'text-gray-500 hover:text-blue-700 hover:bg-gray-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </nav>
  )
}
