import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

// 首访按 Accept-Language 自动跳转(en/ru),cookie 记忆;api/静态资源不拦
export default createMiddleware(routing)

export const config = {
  matcher: '/((?!api|_next|_vercel|robots\\.txt|sitemap\\.xml|.*\\..*).*)',
}
