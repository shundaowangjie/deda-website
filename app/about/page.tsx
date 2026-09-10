import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '关于我们 | DEDA Auto Parts',
  description: '济南德达汽车配件有限公司成立于2001年，专注重卡配件20余年，30000+产品库存，正品保证。',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold text-gray-900">关于我们</h1>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* 公司介绍 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">济南德达汽车配件有限公司</h2>
          <p className="text-gray-700 mb-4">
            济南德达汽车配件有限公司成立于2001年，经过20多年的发展，公司已成长为集配件销售、仓储物流、售后服务于一体的综合性重卡配件供应商。
          </p>
          <p className="text-gray-700 mb-4">
            公司拥有员工83人，仓库面积6000平方米，配备ERP信息化管理系统，实现配件的精准库存管理和快速配送。公司与多家物流企业合作，支持全国范围内当天发货。
          </p>
          <p className="text-gray-700">
            主营产品涵盖中国重汽HOWO系列、一汽解放系列、陕汽德龙系列、福田欧曼系列等重卡全车配件，累计库存30000余种，满足各类维修厂、经销商的采购需求。
          </p>
        </section>

        {/* 核心优势 */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">核心优势</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-3xl font-bold text-blue-700 mb-2">20+</div>
              <div className="text-gray-700">年专业经验</div>
              <div className="text-sm text-gray-500 mt-2">成立于2001年</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-3xl font-bold text-blue-700 mb-2">30000+</div>
              <div className="text-gray-700">产品库存</div>
              <div className="text-sm text-gray-500 mt-2">覆盖全系配件</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-3xl font-bold text-blue-700 mb-2">6000㎡</div>
              <div className="text-gray-700">现代化仓库</div>
              <div className="text-sm text-gray-500 mt-2">ERP信息化管理</div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-3xl font-bold text-blue-700 mb-2">当天</div>
              <div className="text-gray-700">快速发货</div>
              <div className="text-sm text-gray-500 mt-2">全国物流覆盖</div>
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

        {/* 资质荣誉 */}
        <section className="bg-white rounded-xl border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">资质荣誉</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-700 rounded-full mt-2"></div>
              <div>
                <div className="font-semibold text-gray-900">重汽亲人配件连锁店</div>
                <div className="text-sm text-gray-500">官方授权连锁店品牌</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-700 rounded-full mt-2"></div>
              <div>
                <div className="font-semibold text-gray-900">守合同重信用企业</div>
                <div className="text-sm text-gray-500">济南市工商局认定</div>
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
                <div className="font-semibold text-gray-900">20+年行业经验</div>
                <div className="text-sm text-gray-500">资深重卡配件供应商</div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}