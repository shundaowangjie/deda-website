import { createNavigation } from 'next-intl/navigation'
import { routing } from './routing'

// 组件里统一从这里引 Link/useRouter/usePathname,自动带语言前缀
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing)
