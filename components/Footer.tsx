export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-semibold text-gray-900 mb-2">济南德达汽车配件有限公司</p>
            <p className="text-gray-600">📞 186-7839-0736</p>
            <p className="text-gray-600 mt-1">📧 info@dedaautoparts.com</p>
          </div>
          <div className="sm:text-right">
            <p className="text-gray-600">📍 总部：山东省济南市槐荫区经七路669号5号楼2单元601室</p>
            <p className="text-gray-600 mt-1">📍 门店：济南市泉利汽配城8A-201室</p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t border-gray-100 text-xs text-gray-400 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {new Date().getFullYear()} DEDA Auto Parts. All rights reserved.</p>
          <p>鲁ICP备XXXXXXXX号（备案申请中）</p>
        </div>
      </div>
    </footer>
  )
}
