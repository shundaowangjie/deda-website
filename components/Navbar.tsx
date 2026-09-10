import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-lg font-bold text-gray-900 hover:text-blue-700 transition">
          DEDA Auto Parts
        </Link>
        <Link
          href="/search-test"
          className="text-sm text-gray-600 hover:text-blue-700 transition px-3 py-1.5 rounded-lg hover:bg-gray-50"
        >
          OEM 搜索
        </Link>
      </div>
    </nav>
  )
}
