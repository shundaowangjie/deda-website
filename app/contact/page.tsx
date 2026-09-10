import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '联系我们 | DEDA Auto Parts',
  description: '济南德达汽车配件有限公司联系方式：186-7839-0736，0531-67603628',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">联系我们</h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 联系信息 */}
          <section className="bg-white rounded-xl border border-gray-200 p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">联系信息</h2>

            <div className="space-y-6">
              <div>
                <div className="text-sm text-gray-500 mb-1">公司名称</div>
                <div className="text-lg font-semibold text-gray-900">
                  济南德达汽车配件有限公司
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">公司地址</div>
                <div className="text-gray-900">
                  山东省济南市槐荫区经七路669号5号楼2单元601室
                </div>
                <div className="text-gray-500 text-sm mt-1">
                  Bldg 20, Zone 1, Times HQ Base, No.15 Lanxiang Rd, Tianqiao, Jinan, Shandong
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">联系电话</div>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="font-mono text-lg font-semibold text-blue-700">
                      186-7839-0736
                    </div>
                    <div className="text-sm text-gray-500">（贺经理）</div>
                  </div>
                  <div className="text-gray-900">0531-67603628</div>
                  <div className="text-gray-900">0531-85895366</div>
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">销售顾问</div>
                <div className="text-gray-900">苏萌</div>
              </div>

              <div>
                <div className="text-sm text-gray-500 mb-1">工作时间</div>
                <div className="text-gray-900">
                  周一至周六 09:00 - 18:00
                </div>
                <div className="text-sm text-gray-500">周日休息</div>
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
                  支持一件代发，长期合作优惠
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  当天发货，全国物流覆盖
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
                href="tel:18678390736"
                className="block w-full bg-blue-700 text-white text-center py-3 px-6 rounded-lg hover:bg-blue-800 transition"
              >
                拨打电话: 186-7839-0736
              </a>

              <a
                href="tel:053167603628"
                className="block w-full bg-gray-100 text-gray-900 text-center py-3 px-6 rounded-lg hover:bg-gray-200 transition"
              >
                座机: 0531-67603628
              </a>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-2">
                  有配件采购需求？
                </div>
                <div className="text-lg font-semibold text-gray-900">
                  欢迎随时联系我们！
                </div>
              </div>

              {/* 微信联系 */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-600 mb-1">
                      微信咨询
                    </div>
                    <div className="text-lg font-semibold text-gray-900">
                      186-7839-0736
                    </div>
                  </div>
                  <div className="text-4xl">
                    💬
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  )
}