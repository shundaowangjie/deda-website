export default function Footer() {
  return (
    <footer data-chrome className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
          <div>
            <p className="font-semibold text-gray-900 mb-2">济南德达汽车配件有限公司</p>
            <p className="text-gray-600">📞 0531-85737222（座机）</p>
            <p className="text-gray-600 mt-1">📱 15169121111（手机 / 微信）</p>
            <p className="text-gray-600 mt-1">📧 info@dedaautoparts.com</p>
            <p className="text-gray-600 mt-1">👤 销售顾问：苏萌</p>
          </div>
          <div className="sm:text-right">
            <p className="text-gray-600">📍 山东省济南市天桥区蓝翔路15号时代总部基地一区20栋</p>
            <p className="text-gray-500 text-xs mt-1">
              Bldg 20, Zone 1, Times HQ Base, No.15 Lanxiang Rd, Tianqiao District, Jinan, Shandong
            </p>
            <p className="text-gray-600 mt-2 flex sm:justify-end gap-4">
              <a
                href="https://wa.me/8615169121111"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-800"
              >
                WhatsApp 咨询
              </a>
              <a
                href="https://www.facebook.com/dedaautoparts"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-700 hover:text-blue-800"
              >
                Facebook 主页
              </a>
            </p>
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
