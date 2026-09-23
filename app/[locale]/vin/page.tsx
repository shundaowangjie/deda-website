import type { Metadata } from 'next'
import VinTool from '@/components/VinTool'

export const metadata: Metadata = {
  title: 'VIN 查件(内部工具)| DEDA Auto Parts',
  robots: { index: false, follow: false },
}

export default function VinPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <VinTool />
    </main>
  )
}
