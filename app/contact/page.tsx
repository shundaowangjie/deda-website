import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '联系我们 | DEDA Auto Parts',
  description:
    '济南德达汽车配件有限公司联系方式：手机 15169121111，座机 0531-85737222，地址 山东省济南市天桥区蓝翔路15号时代总部基地一区20栋。销售顾问苏萌，随时为您提供配件咨询与报价。',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">联系我们</h1>
          <p className="text-gray-500 mt-2">专业团队随时为您提供配件咨询与报价服务</p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 联系信息 */}
          <section className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">直接联系 / Direct Contact</h2>

            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">手机 Mobile</div>
                <a
                  href="tel:15169121111"
                  className="text-lg font-semibold text-blue-700 hover:text-blue-800"
                >
                  15169121111
                </a>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">座机 Office</div>
                <a
                  href="tel:053185737222"
                  className="text-lg font-semibold text-gray-900 hover:text-blue-700"
                >
                  0531-85737222
                </a>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">公司地址 Address</div>
                <div className="text-gray-900">山东省济南市天桥区蓝翔路15号时代总部基地一区20栋</div>
                <div className="text-gray-500 text-sm mt-1">
                  Bldg 20, Zone 1, Times HQ Base, No.15 Lanxiang Rd, Tianqiao District, Jinan, Shandong
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">销售顾问 Sales</div>
                <div className="text-gray-900 font-semibold">苏萌 · Su Meng</div>
                <div className="text-sm text-gray-500">Sales Consultant</div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">营业时间 Business Hours</div>
                <div className="space-y-1 text-gray-900">
                  <div className="flex justify-between max-w-xs">
                    <span>周一至周五</span>
                    <span>08:30 – 18:00</span>
                  </div>
                  <div className="flex justify-between max-w-xs">
                    <span>周六</span>
                    <span>09:00 – 17:00</span>
                  </div>
                  <div className="flex justify-between max-w-xs">
                    <span>周日</span>
                    <span className="text-gray-500">休息</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 服务承诺 */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4">服务承诺</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  1小时内回复您的咨询
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  提供详细的产品报价
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  国内当天发货，国外七天发货
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  支持一件代发，长期合作优惠
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  假一赔十，正品保证
                </li>
              </ul>
            </div>
          </section>

          {/* 快速联系 */}
          <section className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">快速联系</h2>

            <div className="space-y-4">
              <a
                href="tel:15169121111"
                className="block w-full bg-blue-700 text-white text-center py-3 px-6 rounded-lg hover:bg-blue-800 transition"
              >
                拨打手机: 15169121111
              </a>

              <a
                href="tel:053185737222"
                className="block w-full bg-gray-100 text-gray-900 text-center py-3 px-6 rounded-lg hover:bg-gray-200 transition"
              >
                座机: 0531-85737222
              </a>

              <a
                href="https://wa.me/8615169121111"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-green-600 text-white text-center py-3 px-6 rounded-lg hover:bg-green-700 transition"
              >
                WhatsApp 在线咨询
              </a>

              <a
                href="https://www.facebook.com/dedaautoparts"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-blue-50 text-blue-800 text-center py-3 px-6 rounded-lg hover:bg-blue-100 transition"
              >
                关注 Facebook 主页
              </a>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">有配件采购需求？</div>
                <div className="text-lg font-semibold text-gray-900 mb-3">提交在线询价单，我们尽快回复</div>
                <Link
                  href="/inquiry"
                  className="inline-block bg-white border border-blue-700 text-blue-700 text-center py-2 px-6 rounded-lg hover:bg-blue-50 transition"
                >
                  前往询价单
                </Link>
              </div>

              {/* 微信联系 */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">微信咨询</div>
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
