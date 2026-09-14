// 询价清单：基于 localStorage 的轻量客户端状态
export interface InquiryItem {
  slug: string
  name_en: string
  name_zh?: string
  oem_number?: string
  sku?: string
}

const STORAGE_KEY = 'deda_inquiry_list'
const MAX_ITEMS = 50

export function getInquiryList(): InquiryItem[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    const list = raw ? (JSON.parse(raw) as InquiryItem[]) : []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

export function addInquiryItem(item: InquiryItem): { ok: boolean; reason?: string; count: number } {
  const list = getInquiryList()
  if (list.some((i) => i.slug === item.slug)) {
    return { ok: false, reason: '已在询价单中', count: list.length }
  }
  if (list.length >= MAX_ITEMS) {
    return { ok: false, reason: '询价单最多 50 个产品', count: list.length }
  }
  const next = [...list, item]
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event('deda-inquiry-changed'))
  return { ok: true, count: next.length }
}

export function removeInquiryItem(slug: string): InquiryItem[] {
  const next = getInquiryList().filter((i) => i.slug !== slug)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  window.dispatchEvent(new Event('deda-inquiry-changed'))
  return next
}

export function clearInquiryList(): void {
  window.localStorage.removeItem(STORAGE_KEY)
  window.dispatchEvent(new Event('deda-inquiry-changed'))
}
