import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '关于我们 | DEDA Auto Parts',
  description:
    '济南德达汽车配件有限公司成立于2001年，专注重卡配件，主营中国重汽、解放、陕汽、福田四大品牌全车配件，库存30000余种，守合同重信用企业，重汽亲人配件连锁店。',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">济南德达汽车配件有限公司</h1>
          <p className="text-xl text-gray-700 mt-2">四十余年专注，只为重卡配件</p>
          <p className="text-sm text-gray-500 mt-1">
            Over 40 years of dedication, focused solely on heavy-duty truck parts.
          </p>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 公司介绍 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">企业简介 / Company Profile</h2>
          <p className="text-gray-700 mb-4">
            济南德达汽车配件有限公司成立于2001年，坐落于山东省济南市天桥区蓝翔路15号时代总部基地一区20栋。自创立之初，公司便专注于重型卡车配件的专业供应，已发展成为济南地区重卡配件行业的知名企业。
          </p>
          <p className="text-gray-700 mb-4">
            公司主营中国重汽、一汽解放、陕汽、福田四大品牌重卡全车配件，库存品种超过30,000种，涵盖发动机、制动、传动、底盘、电气、滤清器等全系统配件，能够满足客户快速、准确的配件需求。
          </p>
          <p className="text-gray-700 mb-4">
            公司拥有员工83人，仓库面积6000平方米，配备ERP信息化管理系统，实现配件的精准库存管理和快速配送，支持全国范围内当天发货。
          </p>
          <p className="text-gray-700 mb-4">
            多年来，德达始终坚持诚信经营、质量第一的经营理念，先后荣获济南市守合同重信用企业称号，并成为重汽亲人配件连锁店成员单位。
          </p>
          <p className="text-gray-500 text-sm">
            Founded in 2001 in Jinan, Shandong, Jinan Deda Auto Parts Co., Ltd. has grown from a
            local parts shop into a trusted regional supplier of heavy truck components. With over
            30,000 SKUs covering Sinotruk, FAW Jiefang, Shaanxi Auto and Foton brands, we serve
            fleet operators, repair workshops, and logistics companies across China and overseas.
          </p>
        </section>

        {/* 核心数据 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">核心优势</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-3xl font-bold text-blue-700 mb-2">30000+</div>
              <div className="text-gray-700">产品库存</div>
              <div className="text-sm text-gray-500 mt-2">覆盖全系统配件</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-3xl font-bold text-blue-700 mb-2">6000㎡</div>
              <div className="text-gray-700">现代化仓库</div>
              <div className="text-sm text-gray-500 mt-2">ERP信息化管理</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-3xl font-bold text-blue-700 mb-2">83人</div>
              <div className="text-gray-700">专业团队</div>
              <div className="text-sm text-gray-500 mt-2">销售·仓储·售后一体</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-3xl font-bold text-blue-700 mb-2">当天</div>
              <div className="text-gray-700">快速发货</div>
              <div className="text-sm text-gray-500 mt-2">国内当日 / 海外七天</div>
            </div>
          </div>
        </section>

        {/* 主营品牌 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">主营品牌</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900">中国重汽</div>
              <div className="text-sm text-gray-500">HOWO / 豪瀚 / 豪沃</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900">一汽解放</div>
              <div className="text-sm text-gray-500">奥威 / 悍威 / 新大威</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900">陕汽德龙</div>
              <div className="text-sm text-gray-500">德龙全系列</div>
            </div>

            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900">福田欧曼</div>
              <div className="text-sm text-gray-500">欧曼全系列</div>
            </div>
          </div>
        </section>

        {/* 发展历程 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">发展历程 / Milestones</h2>
          <div className="space-y-0">
            {[
              ['2001', '公司成立', 'Company Founded'],
              ['2005', '库存突破 10,000 种', '10,000+ SKUs in Stock'],
              ['2010', '荣获守合同重信用企业', 'Awarded Contract-Honoring Enterprise'],
              ['2015', '加入重汽亲人配件连锁', 'Joined Sinotruk Family Parts Chain'],
              ['2020', '库存突破 30,000 种', '30,000+ SKUs in Stock'],
              ['2026', '持续服务全国客户及海外客户', 'Serving clients nationwide and overseas'],
            ].map(([year, zh, en], i, arr) => (
              <div key={year} className={`flex gap-6 ${i < arr.length - 1 ? 'pb-6' : ''}`}>
                <div className="flex flex-col items-center">
                  <div className="w-3 h-3 bg-blue-700 rounded-full flex-shrink-0"></div>
                  {i < arr.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 mt-1"></div>}
                </div>
                <div className="pb-0">
                  <div className="font-bold text-blue-700">{year}</div>
                  <div className="text-gray-900">{zh}</div>
                  <div className="text-sm text-gray-500">{en}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 资质荣誉 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">荣誉资质 / Certifications</h2>
          <p className="text-sm text-gray-500 mb-6">诚信经营，品质保证 — Integrity in business, quality guaranteed</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-700 rounded-full mt-2"></div>
              <div>
                <div className="font-semibold text-gray-900">济南市守合同重信用企业</div>
                <div className="text-sm text-gray-500">
                  由济南市工商行政管理局颁发，代表企业在合同履行和商业信誉方面的卓越表现
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-700 rounded-full mt-2"></div>
              <div>
                <div className="font-semibold text-gray-900">重汽亲人配件连锁店</div>
                <div className="text-sm text-gray-500">
                  中国重汽官方授权连锁配件经销商，确保配件品质与原厂标准一致
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-700 rounded-full mt-2"></div>
              <div>
                <div className="font-semibold text-gray-900">文明诚信民营企业</div>
                <div className="text-sm text-gray-500">质量信誉良好</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-700 rounded-full mt-2"></div>
              <div>
                <div className="font-semibold text-gray-900">重卡全车配件一站式供应</div>
                <div className="text-sm text-gray-500">发动机/制动/传动/底盘/电气/滤清器全系统覆盖</div>
              </div>
            </div>
          </div>
        </section>

        {/* 核心价值 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">核心价值 / Core Values</h2>
          <p className="text-sm text-gray-500 mb-6">我们的承诺 — Our commitment to every customer</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900 mb-1">诚信经营</div>
              <div className="text-sm text-gray-500">Integrity First — 客户口碑是我们最大的财富</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900 mb-1">品质保障</div>
              <div className="text-sm text-gray-500">Quality Assured — 每一件产品符合原厂标准</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900 mb-1">快速响应</div>
              <div className="text-sm text-gray-500">Fast Response — 国内当日发货，海外七天发货</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="font-semibold text-gray-900 mb-1">专业服务</div>
              <div className="text-sm text-gray-500">Expert Service — 精准匹配配件型号，避免错购损失</div>
            </div>
          </div>
        </section>

        {/* 销售团队 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">销售团队 / Our Team</h2>
          <p className="text-sm text-gray-500 mb-6">专业团队，随时为您服务</p>
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-blue-700 text-white rounded-full flex items-center justify-center text-2xl font-bold">
              苏
            </div>
            <div>
              <div className="text-lg font-semibold text-gray-900">苏萌 · Su Meng</div>
              <div className="text-sm text-gray-500">销售顾问 Sales Consultant</div>
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
