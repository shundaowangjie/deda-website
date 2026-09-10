/**
 * generate-import-sql.ts — 从缓存 JSON 生成 UPSERT SQL
 *
 * 输出到：database/seeds/catalog_import.sql
 *
 * 运行：cd deda-products && npx tsx scripts/generate-import-sql.ts
 *
 * 执行步骤：
 *   1. 先在 Supabase SQL Editor 执行 migration_v2_1_oem_nullable.sql
 *   2. 再执行 catalog_import.sql
 */

import * as fs from 'fs'
import * as path from 'path'

const cachePath = path.resolve(__dirname, '../../.cache/catalog-import.json')
const outputPath = path.resolve(__dirname, '../../../DEDA-AUTOPARTS/database/seeds/catalog_import.sql')

if (!fs.existsSync(cachePath)) {
  console.error(`❌ 缓存文件不存在：${cachePath}`)
  console.error('   请先运行：npx tsx scripts/import-catalog-dryrun-v2.ts')
  process.exit(1)
}

interface Entry {
  h2: string; h3: string; h4: string;
  product: string; model: string; brand: string; price: string;
  category: string; name_en: string; name_zh: string;
  sku: string; oem_number: string | null; slug: string;
}

const entries: Entry[] = JSON.parse(fs.readFileSync(cachePath, 'utf-8'))

// Normalize OEM: uppercase, no spaces, no hyphens
function normalizeOem(oem: string | null): string | null {
  if (!oem) return null
  return oem.toUpperCase().replace(/[\s\-]/g, '')
}

// Escape SQL string
function sqlStr(s: string): string {
  return "'" + s.replace(/'/g, "''") + "'"
}

// Build UPSERT SQL
let sql = `-- ============================================================
-- 德达汽配产品目录导入 SQL
-- 生成时间：${new Date().toISOString()}
-- 总条数：${entries.length}
-- ============================================================
-- 前置步骤（必须先执行）：
--   1. migration_v2_1_oem_nullable.sql  → ALTER COLUMN oem_number DROP NOT NULL
-- ============================================================
-- 执行方式：Supabase SQL Editor 或直接 psql
-- 幂等键：sku（UNIQUE constraint）
-- ON CONFLICT ON CONSTRAINT products_sku_key → UPDATE
--
-- 更新字段：name_en, name_zh, brand, truck_model, category,
--           oem_number, slug, status, updated_at
-- 不更新字段：id, created_at
-- ============================================================

BEGIN;

`

const batches: Entry[][] = []
const BATCH_SIZE = 50
for (let i = 0; i < entries.length; i += BATCH_SIZE) {
  batches.push(entries.slice(i, i + BATCH_SIZE))
}

batches.forEach((batch, bi) => {
  sql += `-- ── Batch ${bi + 1}/${batches.length}（${batch.length} 条）──\n`
  batch.forEach(e => {
    const oem = normalizeOem(e.oem_number)
    const oemVal = oem ? sqlStr(oem) : 'NULL'
    sql += `INSERT INTO products (sku, slug, name_zh, name_en, brand, truck_model, oem_number, category, description_en, description_zh, specs, images, status, created_at, updated_at)\n`
    sql += `VALUES (\n`
    sql += `  ${sqlStr(e.sku)},\n`
    sql += `  ${sqlStr(e.slug)},\n`
    sql += `  ${sqlStr(e.name_zh)},\n`
    sql += `  ${sqlStr(e.name_en)},\n`
    sql += `  ${sqlStr(e.brand)},\n`
    sql += `  ${e.model ? sqlStr(e.model) : 'NULL'},\n`
    sql += `  ${oemVal},\n`
    sql += `  ${sqlStr(e.category)},\n`
    sql += `  NULL, NULL, NULL, NULL,\n`
    sql += `  'active', now(), now()\n`
    sql += `)\n`
    sql += `ON CONFLICT (sku) DO UPDATE SET\n`
    sql += `  name_zh         = EXCLUDED.name_zh,\n`
    sql += `  name_en         = EXCLUDED.name_en,\n`
    sql += `  brand           = EXCLUDED.brand,\n`
    sql += `  truck_model     = EXCLUDED.truck_model,\n`
    sql += `  oem_number      = EXCLUDED.oem_number,\n`
    sql += `  category        = EXCLUDED.category,\n`
    sql += `  slug            = EXCLUDED.slug,\n`
    sql += `  status          = 'active',\n`
    sql += `  updated_at      = now();\n\n`
  })
})

sql += `COMMIT;

-- ── 导入后验证查询 ─────────────────────────────────────────────
-- 1. 总条数
-- SELECT count(*) FROM products WHERE sku LIKE 'DD-%';
--
-- 2. 品类分布
-- SELECT category, count(*) FROM products WHERE sku LIKE 'DD-%' GROUP BY category ORDER BY count(*) DESC;
--
-- 3. OEM 状态
-- SELECT count(*) as with_oem FROM products WHERE sku LIKE 'DD-%' AND oem_number IS NOT NULL;
-- SELECT count(*) as null_oem FROM products WHERE sku LIKE 'DD-%' AND oem_number IS NULL;
--
-- 4. 前桥总成 × 4 验证
-- SELECT sku, slug, truck_model FROM products WHERE name_zh = '前桥总成' ORDER BY sku;
--
-- 5. 润滑油不在 filters 中验证
-- SELECT category, count(*) FROM products WHERE sku LIKE 'DD-%' AND name_zh LIKE '%机油%' OR name_zh LIKE '%齿轮油%' OR name_zh LIKE '%防冻液%' GROUP BY category;
`

fs.mkdirSync(path.dirname(outputPath), { recursive: true })
fs.writeFileSync(outputPath, sql, 'utf-8')

console.log(`✅ SQL 已生成：${outputPath}`)
console.log(`   总条数：${entries.length}`)
console.log(`   分批：${batches.length} 批（每批 ${BATCH_SIZE} 条）`)

// Print batch summary
batches.forEach((batch, bi) => {
  const skus = batch.map(e => e.sku).join(', ')
  console.log(`   Batch ${bi + 1}: ${skus}`)
})
