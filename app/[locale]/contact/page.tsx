import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'contact' })
  return { title: t('title'), description: t('subtitle') }
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations('contact')
  const promises = t.raw('promises') as string[]

  return (
    <main className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">{t('h1')}</h1>
          <p className="text-gray-500 mt-2">{t('subtitle')}</p>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 联系信息 */}
          <section className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('directTitle')}</h2>

            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">{t('mobile')}</div>
                <a
                  href="tel:15169121111"
                  className="text-lg font-semibold text-blue-700 hover:text-blue-800"
                >
                  15169121111
                </a>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">{t('office')}</div>
                <a
                  href="tel:053185737222"
                  className="text-lg font-semibold text-gray-900 hover:text-blue-700"
                >
                  0531-85737222
                </a>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">{t('address')}</div>
                <div className="text-gray-900">{t('addressZh')}</div>
                <div className="text-gray-500 text-sm mt-1">{t('addressEn')}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">{t('sales')}</div>
                <div className="text-gray-900 font-semibold">{t('salesName')}</div>
                <div className="text-sm text-gray-500">{t('salesRole')}</div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">{t('hoursTitle')}</div>
                <div className="space-y-1 text-gray-900">
                  <div className="flex justify-between max-w-xs">
                    <span>{t('hoursWeekday')}</span>
                    <span>08:30 – 18:00</span>
                  </div>
                  <div className="flex justify-between max-w-xs">
                    <span>{t('hoursSaturday')}</span>
                    <span>09:00 – 17:00</span>
                  </div>
                  <div className="flex justify-between max-w-xs">
                    <span>{t('hoursSunday')}</span>
                    <span className="text-gray-500">{t('hoursClosed')}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 服务承诺 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">{t('promiseTitle')}</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                {promises.map((p) => (
                  <li key={p} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* 快速联系 */}
          <section className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">{t('quickTitle')}</h2>

            <div className="space-y-4">
              <a
                href="tel:15169121111"
                className="block w-full bg-blue-700 text-white text-center py-3 px-6 rounded-lg hover:bg-blue-800 transition"
              >
                {t('callMobile')}
              </a>

              <a
                href="tel:053185737222"
                className="block w-full bg-gray-100 text-gray-900 text-center py-3 px-6 rounded-lg hover:bg-gray-200 transition"
              >
                {t('callOffice')}
              </a>

              <a
                href="https://wa.me/8615169121111"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 text-white text-center py-3 px-6 rounded-lg hover:bg-green-700 transition"
              >
                {t('whatsapp')}
              </a>

              <a
                href="https://www.facebook.com/dedaautoparts"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-50 text-blue-800 text-center py-3 px-6 rounded-lg hover:bg-blue-100 transition"
              >
                {t('facebook')}
              </a>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">{t('needParts')}</div>
                <div className="text-lg font-semibold text-gray-900 mb-3">{t('ctaTitle')}</div>
                <Link
                  href="/inquiry"
                  className="inline-block bg-white border border-blue-700 text-blue-700 text-center py-2 px-6 rounded-lg hover:bg-blue-50 transition"
                >
                  {t('ctaBtn')}
                </Link>
              </div>

              {/* 微信联系 */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">{t('wechatTitle')}</div>
                    <div className="text-lg font-semibold text-gray-900">15169121111</div>
                  </div>
                  <div className="text-4xl">💬</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}
