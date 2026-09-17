// 产品分类：展示顺序 + 中文名映射（与线上 products.category 实际值对应）
export const CATEGORY_ORDER = [
  'engine-parts',
  'brake-system',
  'chassis-suspension',
  'drivetrain',
  'transmission',
  'filters',
  'fuel-system',
  'cooling-system',
  'electrical',
  'suspension',
  'other',
] as const

export const CATEGORY_ZH: Record<string, string> = {
  'engine-parts': '发动机件',
  'brake-system': '制动系统',
  'chassis-suspension': '底盘悬挂',
  drivetrain: '传动系统',
  transmission: '变速箱',
  filters: '滤清器',
  'fuel-system': '燃油系统',
  'cooling-system': '冷却系统',
  electrical: '电器系统',
  suspension: '悬挂',
  other: '其他配件',
}

export function categoryLabel(slug: string): string {
  return CATEGORY_ZH[slug] || slug.replace(/-/g, ' ')
}

export function categorySortIndex(slug: string): number {
  const i = (CATEGORY_ORDER as readonly string[]).indexOf(slug)
  return i === -1 ? 999 : i
}
