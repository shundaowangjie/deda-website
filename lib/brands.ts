// 车型导航数据：Taxonomy V0.2 内部审核稿（2026-11-25，方案 A）＋库内 vehicle_model 映射附表。
// 来源：~/workspace/deda-team/DEDA重卡产品目录车型分类表_Taxonomy_V0.2_内部审核稿_2026-11-25.md
// 与 ~/workspace/deda-team/第二阶段2.1导航方案稿_品牌墙_2026-11-26.md（Bill 2026-11-26 批）。
// 注意：V0.2 是内部审核稿，未核厂商原始目录；凡标“待核”的映射，进 V1.0 前须产品岗确认。
// 品牌墙顺序＝本表顺序：欧洲 6 品牌在前，中国 7 品牌在后（按有价件数降序）。
import { unstable_cache } from 'next/cache'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { tryGetSupabase } from '@/lib/supabase'

export interface BrandModel {
  id: string
  name: string
  nameEn: string
  engines: string[]
}

export interface Brand {
  id: string
  name: string
  nameEn: string
  models: BrandModel[]
}

export const BRANDS: Brand[] = [
  {
    id: 'daf',
    name: 'DAF',
    nameEn: 'DAF',
    models: [
      { id: 'xf', name: 'XF', nameEn: 'XF', engines: ['MX-11', 'MX-13'] },
      { id: 'cf', name: 'CF', nameEn: 'CF', engines: ['PX-7', 'MX-11', 'MX-13'] },
      { id: 'xg', name: 'XG', nameEn: 'XG', engines: ['MX-13'] },
      { id: 'xg-plus', name: 'XG+', nameEn: 'XG+', engines: ['MX-13'] },
      { id: 'xd', name: 'XD', nameEn: 'XD', engines: ['MX-11', 'PX-7'] },
    ],
  },
  {
    id: 'man',
    name: 'MAN',
    nameEn: 'MAN',
    models: [
      { id: 'tgx', name: 'TGX', nameEn: 'TGX', engines: ['D26', 'D38', 'D15'] },
      { id: 'tgs', name: 'TGS', nameEn: 'TGS', engines: ['D20', 'D26', 'D15'] },
      { id: 'tgm', name: 'TGM', nameEn: 'TGM', engines: ['D08'] },
      { id: 'tga', name: 'TGA', nameEn: 'TGA', engines: ['D20', 'D28'] },
      { id: 'f2000', name: 'F2000', nameEn: 'F2000', engines: ['D28'] },
    ],
  },
  {
    id: 'mercedes-benz',
    name: 'Mercedes-Benz',
    nameEn: 'Mercedes-Benz',
    models: [
      { id: 'actros-mp1-3', name: 'Actros MP1–MP3', nameEn: 'Actros MP1–MP3', engines: ['OM 501 LA', 'OM 502 LA'] },
      { id: 'actros-mp4-5', name: 'Actros MP4–MP5', nameEn: 'Actros MP4–MP5', engines: ['OM 470', 'OM 471', 'OM 473'] },
      { id: 'arocs', name: 'Arocs', nameEn: 'Arocs', engines: ['OM 470', 'OM 471', 'OM 473'] },
      { id: 'axor', name: 'Axor', nameEn: 'Axor', engines: ['OM 457 LA', 'OM 906 LA', 'OM 926 LA'] },
      { id: 'atego', name: 'Atego', nameEn: 'Atego', engines: ['OM 904 LA', 'OM 906 LA', 'OM 934'] },
      { id: 'zetros', name: 'Zetros', nameEn: 'Zetros', engines: ['OM 926 LA', 'OM 457 LA'] },
    ],
  },
  {
    id: 'volvo',
    name: 'Volvo',
    nameEn: 'Volvo',
    models: [
      { id: 'fh', name: 'FH', nameEn: 'FH', engines: ['D12', 'D13'] },
      { id: 'fh16', name: 'FH16', nameEn: 'FH16', engines: ['D16', 'D17'] },
      { id: 'fm', name: 'FM', nameEn: 'FM', engines: ['D9', 'D11', 'D13'] },
      { id: 'fmx', name: 'FMX', nameEn: 'FMX', engines: ['D11', 'D13'] },
      { id: 'fe', name: 'FE', nameEn: 'FE', engines: ['D7', 'D8'] },
      { id: 'fl', name: 'FL', nameEn: 'FL', engines: ['D5', 'D7', 'D8'] },
    ],
  },
  {
    id: 'scania',
    name: 'Scania',
    nameEn: 'Scania',
    models: [
      { id: 'r', name: 'R 系列', nameEn: 'R Series', engines: ['DC09', 'DC13', 'DC16'] },
      { id: 's', name: 'S 系列', nameEn: 'S Series', engines: ['DC13', 'DC16'] },
      { id: 'g', name: 'G 系列', nameEn: 'G Series', engines: ['DC09', 'DC13'] },
      { id: 'p', name: 'P 系列', nameEn: 'P Series', engines: ['DC07', 'DC09', 'DC13'] },
      { id: '4-series', name: '4 系列', nameEn: '4 Series', engines: ['DC11', 'DC12', 'DSC14'] },
      { id: '164', name: '164', nameEn: '164', engines: ['DSC16'] },
    ],
  },
  {
    id: 'renault',
    name: 'Renault Trucks',
    nameEn: 'Renault Trucks',
    models: [
      { id: 't', name: 'T 系列', nameEn: 'T Series', engines: ['DTI 11', 'DTI 13'] },
      { id: 'c', name: 'C 系列', nameEn: 'C Series', engines: ['DTI 8', 'DTI 11', 'DTI 13'] },
      { id: 'k', name: 'K 系列', nameEn: 'K Series', engines: ['DTI 11', 'DTI 13'] },
      { id: 'premium', name: 'Premium', nameEn: 'Premium', engines: ['dCi 11', 'DXi 7', 'DXi 11'] },
      { id: 'magnum', name: 'Magnum', nameEn: 'Magnum', engines: ['Mack E7', 'DXi 12', 'DXi 13'] },
      { id: 'kerax', name: 'Kerax', nameEn: 'Kerax', engines: ['dCi 11', 'DXi 11', 'DXi 13'] },
    ],
  },
  {
    id: 'dongfeng',
    name: '东风',
    nameEn: 'Dongfeng',
    models: [
      { id: 'tianlong', name: '天龙', nameEn: 'Tianlong', engines: ['dCi 11', '康明斯 ISLe', 'ISZ'] },
      { id: 'tianlong-kl', name: '天龙 KL', nameEn: 'Tianlong KL', engines: ['DDi11', '康明斯 Z14', 'dCi 11'] },
      { id: 'tianlong-kx', name: '天龙 KX', nameEn: 'Tianlong KX', engines: ['康明斯 Z14', 'DDi13'] },
      { id: 'tianlong-gx', name: '天龙 GX', nameEn: 'Tianlong GX', engines: ['康明斯 Z14'] },
      { id: 'tianjin-kr', name: '天锦 KR', nameEn: 'Tianjin KR', engines: ['康明斯 B6.2', 'D4.5', 'ISDe6.7'] },
    ],
  },
  {
    id: 'jiefang',
    name: '解放',
    nameEn: 'FAW Jiefang',
    models: [
      { id: 'j5', name: 'J5 / J5P', nameEn: 'J5 / J5P', engines: ['锡柴 CA6DL', '道依茨 BF6M1013'] },
      { id: 'j6', name: 'J6 / J6P', nameEn: 'J6 / J6P', engines: ['CA6DL2', 'CA6DM2', 'CA6DM3'] },
      { id: 'j6m', name: 'J6M', nameEn: 'J6M', engines: ['CA6DL', 'CA6DL2', '大柴 CA6DK1'] },
      { id: 'j7', name: 'J7', nameEn: 'J7', engines: ['CA6DM3'] },
      { id: 'jh6', name: 'JH6', nameEn: 'JH6', engines: ['CA6DM2', 'CA6DL2'] },
    ],
  },
  {
    id: 'howo',
    name: 'HOWO',
    nameEn: 'HOWO',
    models: [
      { id: 'howo-7', name: 'HOWO 7', nameEn: 'HOWO 7', engines: ['WD615', 'D10'] },
      { id: 'a7', name: 'A7', nameEn: 'A7', engines: ['WD615', 'D10', 'D12'] },
      { id: 't7h', name: 'T7H', nameEn: 'T7H', engines: ['MC11', 'MC13'] },
      { id: 'tx', name: 'TX / TX7', nameEn: 'TX / TX7', engines: ['MC11', 'WP10H', 'WP12'] },
      { id: 'th7', name: 'TH7', nameEn: 'TH7', engines: ['MC13', 'MC13H', 'MC11H'] },
    ],
  },
  {
    id: 'shacman',
    name: '陕汽',
    nameEn: 'Shacman',
    models: [
      { id: 'f2000', name: 'F2000', nameEn: 'F2000', engines: ['WP10', 'WD615'] },
      { id: 'f3000', name: 'F3000', nameEn: 'F3000', engines: ['WP10', 'WP12'] },
      { id: 'm3000', name: 'M3000', nameEn: 'M3000', engines: ['WP10', 'WP12'] },
      { id: 'x3000', name: 'X3000', nameEn: 'X3000', engines: ['WP12', 'WP13', '康明斯 ISM11'] },
      { id: 'x5000', name: 'X5000', nameEn: 'X5000', engines: ['WP12', 'WP13'] },
    ],
  },
  {
    id: 'auman',
    name: '欧曼',
    nameEn: 'Foton Auman',
    models: [
      { id: 'etx', name: 'ETX', nameEn: 'ETX', engines: ['WP10', 'WP12'] },
      { id: 'gtl', name: 'GTL', nameEn: 'GTL', engines: ['福田康明斯 ISG'] },
      { id: 'est', name: 'EST', nameEn: 'EST', engines: ['ISG', 'X12'] },
      { id: 'est-a', name: 'EST-A', nameEn: 'EST-A', engines: ['ISG'] },
    ],
  },
  {
    id: 'beiben',
    name: '北奔',
    nameEn: 'Beiben',
    models: [
      { id: 'ng80', name: 'NG80', nameEn: 'NG80', engines: ['WP10', 'WP12'] },
      { id: 'v3', name: 'V3', nameEn: 'V3', engines: ['WP10'] },
      { id: 'v3m', name: 'V3M', nameEn: 'V3M', engines: ['玉柴 YC6MK', 'WP10'] },
      { id: 'v3et', name: 'V3ET', nameEn: 'V3ET', engines: ['福田康明斯 ISG', 'WP12'] },
    ],
  },
  {
    id: 'hongyan',
    name: '红岩',
    nameEn: 'SAIC Hongyan',
    models: [
      { id: 'genlyon', name: 'Genlyon 杰狮', nameEn: 'Genlyon', engines: ['Cursor 9', 'Cursor 13'] },
      { id: 'kingkan', name: 'Kingkan 金刚', nameEn: 'Kingkan', engines: ['WP10', 'WP12'] },
      { id: 'jiehu', name: 'Jiehu 杰虎', nameEn: 'Jiehu', engines: ['Cursor 9', 'WP10'] },
      { id: 'jiebao', name: 'Jiebao 杰豹', nameEn: 'Jiebao', engines: [] },
    ],
  },
]

/** 通用入口的品牌 id（伪品牌）：vehicle_model='通用'＋待归类（未映射）件 */
export const UNIVERSAL_ID = 'universal'
export const UNIVERSAL_VALUE = '通用'

/** vehicle_model 原值 → 品牌 id（导航方案稿附表，2026-11-26 按 2,683 条去重核对） */
export const VEHICLE_MODEL_BRAND: Record<string, string> = {
  'HOWO TX': 'howo',
  豪沃: 'howo',
  '豪沃H7': 'howo',
  '豪沃(HOWO A7)': 'howo',
  'HOWO 09款': 'howo',
  '豪沃HOWO': 'howo',
  'HOWO豪沃TX': 'howo',
  'HOWO豪沃': 'howo',
  豪瀚后: 'howo',
  豪瀚前: 'howo',
  新款豪瀚后: 'howo',
  新款豪瀚前: 'howo',
  重汽王牌: 'howo',
  重汽T7H: 'howo',
  解放: 'jiefang',
  J6: 'jiefang',
  J6领航版: 'jiefang',
  奥威: 'jiefang',
  一汽解放: 'jiefang',
  J6领航者: 'jiefang',
  J6荣耀版: 'jiefang',
  'J6 领航版': 'jiefang',
  '新j6/领航版': 'jiefang',
  解放J6领航版3: 'jiefang',
  长春一汽J6P: 'jiefang',
  长春一汽: 'jiefang',
  青岛一汽: 'jiefang',
  一汽红塔: 'jiefang',
  东风: 'dongfeng',
  天龙: 'dongfeng',
  东风天龙: 'dongfeng',
  天龙旗舰版: 'dongfeng',
  东风霸龙: 'dongfeng',
  天锦: 'dongfeng',
  东风商用: 'dongfeng',
  霸龙507: 'dongfeng',
  天龙KX后: 'dongfeng',
  天龙KX前: 'dongfeng',
  天龙KL后: 'dongfeng',
  天龙KL前: 'dongfeng',
  天龙旗舰后: 'dongfeng',
  天龙旗舰前: 'dongfeng',
  天龙启航版: 'dongfeng',
  天龙窄距: 'dongfeng',
  东风康明斯: 'dongfeng',
  东风刹车王: 'dongfeng',
  陕汽德龙: 'shacman',
  德龙: 'shacman',
  德龙X5000: 'shacman',
  德龙X5000后: 'shacman',
  德龙X5000前: 'shacman',
  德龙X3000加强: 'shacman',
  德龙M3000牵引后: 'shacman',
  德龙F3000: 'shacman',
  德龙3000: 'shacman',
  L3000: 'shacman',
  欧曼: 'auman',
  欧曼GTL: 'auman',
  欧曼新款: 'auman',
  '欧曼ETX 新款': 'auman',
  红岩: 'hongyan',
  红岩金刚: 'hongyan',
  红岩杰狮: 'hongyan',
  北奔: 'beiben',
  北方奔驰: 'beiben',
  奔驰: 'mercedes-benz',
  梅赛德斯奔驰: 'mercedes-benz',
  '进口 奔驰': 'mercedes-benz',
}

/** vehicle_model 原值 → 车型 id（仅列有把握的；未列的为品牌级、车型待核） */
export const VEHICLE_MODEL_MODEL: Record<string, string> = {
  'HOWO TX': 'tx',
  'HOWO豪沃TX': 'tx',
  '豪沃(HOWO A7)': 'a7',
  重汽T7H: 't7h',
  J6: 'j6',
  J6领航版: 'j6',
  J6领航者: 'j6',
  J6荣耀版: 'j6',
  'J6 领航版': 'j6',
  '新j6/领航版': 'j6',
  解放J6领航版3: 'j6',
  长春一汽J6P: 'j6',
  // 待核：奥威为解放 J6P 动力链名称
  奥威: 'j6',
  天龙: 'tianlong',
  天龙旗舰版: 'tianlong',
  天龙旗舰后: 'tianlong',
  天龙旗舰前: 'tianlong',
  天龙启航版: 'tianlong',
  天龙窄距: 'tianlong',
  天龙KL后: 'tianlong-kl',
  天龙KL前: 'tianlong-kl',
  天龙KX后: 'tianlong-kx',
  天龙KX前: 'tianlong-kx',
  // 待核：天锦对应天锦 KR
  天锦: 'tianjin-kr',
  欧曼GTL: 'gtl',
  红岩金刚: 'kingkan',
  红岩杰狮: 'genlyon',
  德龙X5000: 'x5000',
  德龙X5000后: 'x5000',
  德龙X5000前: 'x5000',
  德龙F3000: 'f3000',
  // 待核
  德龙X3000加强: 'x3000',
  德龙M3000牵引后: 'm3000',
}

export function getBrand(id: string): Brand | undefined {
  return BRANDS.find((b) => b.id === id)
}

export function getModel(brand: Brand, modelId: string): BrandModel | undefined {
  return brand.models.find((m) => m.id === modelId)
}

/** 某品牌映射的 vehicle_model 原值全集 */
export function brandVehicleValues(brandId: string): string[] {
  return Object.entries(VEHICLE_MODEL_BRAND)
    .filter(([, b]) => b === brandId)
    .map(([v]) => v)
}

/** 某车型映射的 vehicle_model 原值 */
export function modelVehicleValues(brandId: string, modelId: string): string[] {
  return Object.entries(VEHICLE_MODEL_MODEL)
    .filter(([v, m]) => m === modelId && VEHICLE_MODEL_BRAND[v] === brandId)
    .map(([v]) => v)
}

/** 某品牌下未分车型的 vehicle_model 原值（品牌级、车型待核） */
export function brandLevelValues(brandId: string): string[] {
  return brandVehicleValues(brandId).filter((v) => !(v in VEHICLE_MODEL_MODEL))
}

export type VehicleModelCounts = Record<string, number>

/** 有价件（price 不为空）的 vehicle_model 分布，300 秒缓存（与 getFacets 同口径） */
export const getPricedVehicleModelCounts = unstable_cache(
  async (): Promise<VehicleModelCounts> => {
    const supabase = tryGetSupabase()
    const counts: VehicleModelCounts = {}
    if (!supabase) return counts
    const { count } = await supabase
      .from('products')
      .select('id', { count: 'exact', head: true })
      .in('status', ['published', 'active'])
      .not('price', 'is', null)
    const pages = Math.ceil((count || 0) / 1000)
    const chunks = await Promise.all(
      Array.from({ length: pages }, (_, i) => i * 1000).map((from) =>
        supabase
          .from('products')
          .select('vehicle_model')
          .in('status', ['published', 'active'])
          .not('price', 'is', null)
          .order('id', { ascending: true })
          .range(from, from + 999)
          .then(({ data }) => (data as { vehicle_model: string | null }[]) || []),
      ),
    )
    for (const rows of chunks) {
      for (const r of rows) {
        const v = r.vehicle_model?.trim()
        if (v) counts[v] = (counts[v] || 0) + 1
      }
    }
    return counts
  },
  ['brand-vehicle-model-counts-v1'],
  { revalidate: 300 },
)

/** 某品牌的映射有价件数 */
export function brandCount(counts: VehicleModelCounts, brandId: string): number {
  return brandVehicleValues(brandId).reduce((s, v) => s + (counts[v] || 0), 0)
}

/** 某车型的映射有价件数 */
export function modelCount(counts: VehicleModelCounts, brandId: string, modelId: string): number {
  return modelVehicleValues(brandId, modelId).reduce((s, v) => s + (counts[v] || 0), 0)
}

/** 通用入口数：vehicle_model='通用'＋未映射（待归类）件 */
export function universalCount(counts: VehicleModelCounts): number {
  return Object.entries(counts).reduce(
    (s, [v, n]) => s + (v === UNIVERSAL_VALUE || !(v in VEHICLE_MODEL_BRAND) ? n : 0),
    0,
  )
}

/** 待归类（未映射）件数 */
export function unmappedCount(counts: VehicleModelCounts): number {
  return Object.entries(counts).reduce(
    (s, [v, n]) => s + (v !== UNIVERSAL_VALUE && !(v in VEHICLE_MODEL_BRAND) ? n : 0),
    0,
  )
}

/** 通用入口的 vehicle_model 原值全集：'通用'＋全部未映射值 */
export function universalVehicleValues(counts: VehicleModelCounts): string[] {
  const values = new Set<string>([UNIVERSAL_VALUE])
  for (const v of Object.keys(counts)) {
    if (!(v in VEHICLE_MODEL_BRAND)) values.add(v)
  }
  return Array.from(values)
}

export interface BrandListProduct {
  slug: string
  sku: string
  name_en: string
  name_zh: string | null
  name_ru: string | null
  brand: string | null
  category: string
  oem_number: string | null
  price: number | null
  img_file: string | null
  truck_model: string | null
  status: string
}

export const BRAND_PAGE_SIZE = 24

/** 品牌／车型／通用页的件清单：仅有价件（vehicle_model 只在有价件上回填），与品牌墙计数同一口径 */
export async function fetchBrandProducts(
  values: string[],
  pageNum: number,
  pageSize: number = BRAND_PAGE_SIZE,
): Promise<{ products: BrandListProduct[]; total: number }> {
  const supabase = tryGetSupabase()
  if (!supabase || values.length === 0) return { products: [], total: 0 }
  const { count } = await supabase
    .from('products')
    .select('slug', { count: 'exact', head: true })
    .in('status', ['published', 'active'])
    .not('price', 'is', null)
    .in('vehicle_model', values)
  const total = count || 0
  const { data } = await supabase
    .from('products')
    .select(
      'slug, sku, name_en, name_zh, name_ru, price, brand, category, oem_number, truck_model, status',
    )
    .in('status', ['published', 'active'])
    .not('price', 'is', null)
    .in('vehicle_model', values)
    .order('category', { ascending: true })
    .order('name_en', { ascending: true })
    .order('id', { ascending: true })
    .range((pageNum - 1) * pageSize, pageNum * pageSize - 1)
  const products = ((data as BrandListProduct[]) || []).map((p) => {
    const ext = ['.webp', '.jpg', '.png'].find((e) =>
      existsSync(join(process.cwd(), 'public', 'products', `${p.slug}${e}`)),
    )
    return { ...p, img_file: ext ? `${p.slug}${ext}` : null }
  })
  return { products, total }
}
