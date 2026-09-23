// 产品分类：展示顺序 + 中文名映射（与线上 products.category 实际值对应）
export const CATEGORY_ORDER = [
  'engine-parts',
  'brake-system',
  'chassis-suspension',
  'drivetrain',
  'transmission',
  'filters',
  'adhesive',
  'oil-seal',
  'bearing',
  'fastener',
  'wiper',
  'oil',
  'chemical',
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
  adhesive: '胶粘剂',
  'oil-seal': '油封系列',
  bearing: '轴承',
  fastener: '紧固件',
  wiper: '雨刮片',
  oil: '油品',
  chemical: '养护化工',
  'fuel-system': '燃油系统',
  'cooling-system': '冷却系统',
  electrical: '电器系统',
  suspension: '悬挂',
  other: '其他配件',
}

export const CATEGORY_RU: Record<string, string> = {
  'engine-parts': 'Детали двигателя',
  'brake-system': 'Тормозная система',
  'chassis-suspension': 'Шасси и подвеска',
  drivetrain: 'Трансмиссия',
  transmission: 'КПП',
  filters: 'Фильтры',
  adhesive: 'Клеи и герметики',
  'oil-seal': 'Сальники',
  bearing: 'Подшипники',
  fastener: 'Крепёж',
  wiper: 'Щётки стеклоочистителя',
  oil: 'Масла',
  chemical: 'Автохимия',
  'fuel-system': 'Топливная система',
  'cooling-system': 'Система охлаждения',
  electrical: 'Электрооборудование',
  suspension: 'Подвеска',
  other: 'Прочие запчасти',
}

export const CATEGORY_EN: Record<string, string> = {
  'engine-parts': 'Engine Parts',
  'brake-system': 'Brake System',
  'chassis-suspension': 'Chassis & Suspension',
  drivetrain: 'Drivetrain',
  transmission: 'Transmission',
  filters: 'Filters',
  adhesive: 'Adhesives',
  'oil-seal': 'Oil Seals',
  bearing: 'Bearings',
  fastener: 'Fasteners',
  wiper: 'Wiper Blades',
  oil: 'Lubricants',
  chemical: 'Chemicals',
  'fuel-system': 'Fuel System',
  'cooling-system': 'Cooling System',
  electrical: 'Electrical',
  suspension: 'Suspension',
  other: 'Other Parts',
}

export function categoryLabel(slug: string): string {
  return CATEGORY_ZH[slug] || slug.replace(/-/g, ' ')
}

export function categoryLabelFor(slug: string, locale: string): string {
  if (locale === 'en') return CATEGORY_EN[slug] || slug.replace(/-/g, ' ')
  if (locale === 'ru') return CATEGORY_RU[slug] || slug.replace(/-/g, ' ')
  return categoryLabel(slug)
}

export function categorySortIndex(slug: string): number {
  const i = (CATEGORY_ORDER as readonly string[]).indexOf(slug)
  return i === -1 ? 999 : i
}
