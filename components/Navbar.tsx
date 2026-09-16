import Link from 'next/link'
import AuthButton from './AuthButton'

const MAIN_SITE = 'https://dedaautoparts.com'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-40">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-gray-900 hover:text-blue-700 transition">
          DEDA Auto Parts
        </Link>
        <div className="flex items-center gap-1 text-sm">
          <a
            href={MAIN_SITE}
            title="返回公司形象官网"
            className="hidden sm:inline text-gray-600 hover:text-blue-700 transition px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            公司首页
          </a>
          <Link
            href="/products"
            className="text-gray-600 hover:text-blue-700 transition px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            产品目录
          </Link>
          <Link
            href="/inquiry"
            className="text-blue-700 font-medium hover:text-blue-800 transition px-3 py-1.5 rounded-lg hover:bg-blue-50"
          >
            询价单
          </Link>
          <Link
            href="/search-test"
            className="hidden sm:inline text-gray-600 hover:text-blue-700 transition px-3 py-1.5 rounded-lg hover:bg-gray-50"
          >
            OEM 搜索
          </Link>
          <AuthButton />
        </div>
      </div>
    </nav>
  )
}
