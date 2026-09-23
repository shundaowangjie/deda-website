import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'about' })
  return { title: t('title'), description: t('profile.0') }
}

export default async function AboutPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('about')

  const profile = t.raw('profile') as string[]
  const profileAlt = t('profileEn')
  const stats = t.raw('stats') as { num: string; label: string; note: string }[]
  const brands = t.raw('brands') as { name: string; note: string }[]
  const milestones = t.raw('milestones') as { year: string; zh: string; en: string }[]
  const certs = t.raw('certs') as { name: string; note: string }[]
  const values = t.raw('values') as { name: string; note: string }[]

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('h1')}</h1>
          <p className="text-xl text-gray-700 mt-2">{t('tagline')}</p>
          <p className="text-sm text-gray-500 mt-1">{t('taglineEn')}</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 企业简介 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('profileTitle')}</h2>
          {profile.map((para, i) => (
            <p key={i} className="text-gray-700 mb-4">
              {para}
            </p>
          ))}
          <p className="text-gray-500 text-sm">{profileAlt}</p>
        </section>

        {/* 核心数据 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('advTitle')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s) => (
              <div key={s.num} className="bg-white rounded-xl border border-gray-200 p-6">
                <div className="text-3xl font-bold text-blue-700 mb-2">{s.num}</div>
                <div className="text-gray-700">{s.label}</div>
                <div className="text-sm text-gray-500 mt-2">{s.note}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 主营品牌 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t('brandsTitle')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {brands.map((b) => (
              <div key={b.name} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-900">{b.name}</div>
                <div className="text-sm text-gray-500">{b.note}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 发展历程 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('milestonesTitle')}</h2>
          <div className="space-y-0">
            {milestones.map((m, i) => (
              <div key={m.year} className={`flex gap-6 ${i < milestones.length - 1 ? 'pb-6' : ''}`}>
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-blue-700 rounded-full flex-shrink-0"></div>
                  {i < milestones.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 mt-1"></div>}
                </div>
                <div className="pb-0">
                  <div className="font-bold text-blue-700">{m.year}</div>
                  <div className="text-gray-900">{m.zh}</div>
                  <div className="text-sm text-gray-500">{m.en}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 资质荣誉 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t('certTitle')}</h2>
          <p className="text-sm text-gray-500 mb-6">{t('certNote')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {certs.map((c) => (
              <div key={c.name} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-blue-700 rounded-full mt-2"></div>
                <div>
                  <div className="font-semibold text-gray-900">{c.name}</div>
                  <div className="text-sm text-gray-500">{c.note}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 核心价值 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t('valuesTitle')}</h2>
          <p className="text-sm text-gray-500 mb-6">{t('valuesNote')}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.name} className="p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-900 mb-1">{v.name}</div>
                <div className="text-sm text-gray-500">{v.note}</div>
              </div>
            ))}
          </div>
        </section>

        {/* 销售团队 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t('teamTitle')}</h2>
          <p className="text-sm text-gray-500 mb-6">{t('teamNote')}</p>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-700 text-white rounded-full flex items-center justify-center text-2xl font-bold">
              苏
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">{t('teamName')}</div>
              <div className="text-sm text-gray-500">{t('teamRole')}</div>
              <div className="text-gray-700 mt-2">
                <span className="mr-4">📱 15169121111</span>
                <span>📞 0531-85737222</span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
