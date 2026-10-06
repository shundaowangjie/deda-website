import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import AdminPanel from '@/components/AdminPanel'

interface Props {
  params: Promise<{ locale: string }>
}

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: '询价后台',
  robots: { index: false, follow: false },
}

export default async function AdminPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  return <AdminPanel />
}
