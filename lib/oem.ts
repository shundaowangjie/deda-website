/**
 * OEM 号标准化：转大写、去空格、去横线
 * 与 migration_v2_0.sql 中 normalize_oem() 函数逻辑一致
 */
export function normalizeOem(oem: string): string {
  return oem.trim().toUpperCase().replace(/[\s\-]+/g, '')
}
