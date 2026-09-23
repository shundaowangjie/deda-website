import { defineRouting } from 'next-intl/routing'

// zh 无前缀(默认),en/ru 带路径前缀:/en/products、/ru/products
export const routing = defineRouting({
  locales: ['zh', 'en', 'ru'],
  defaultLocale: 'zh',
  localePrefix: 'as-needed',
})

export type AppLocale = (typeof routing.locales)[number]
