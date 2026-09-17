-- ============================================================
-- 站内搜索升级 Phase 1 —— 唯一脚本（幂等，可重复执行）
-- 内容：pg_trgm 扩展 + trigram 索引 + 中英同义词表
--       + 加权搜索函数 search_products + 自动补全 suggest_products
-- 执行位置：Supabase Dashboard → SQL Editor → 全选运行
-- 验证：
--   SELECT * FROM search_products('brake chamber', 5);  -- 应命中制动室
--   SELECT * FROM search_products('0360601', 5);
--   SELECT * FROM suggest_products('制动', 5);
-- ============================================================

-- 1) trigram 扩展（模糊匹配 + ILIKE 加速）
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2) 关键字段 trigram 索引
CREATE INDEX IF NOT EXISTS idx_products_name_en_trgm ON products USING gin (name_en gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_name_zh_trgm ON products USING gin (name_zh gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_oem_trgm     ON products USING gin (oem_number gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_sku_trgm     ON products USING gin (sku gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_model_trgm   ON products USING gin (truck_model gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_brand_trgm   ON products USING gin (brand gin_trgm_ops);

-- 3) 中英同义词表（双向成对录入；anon 只读）
CREATE TABLE IF NOT EXISTS search_synonyms (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  term text NOT NULL,
  synonym text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (term, synonym)
);

ALTER TABLE search_synonyms ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_synonyms" ON search_synonyms;
CREATE POLICY "anon_read_synonyms" ON search_synonyms
  FOR SELECT TO anon USING (true);

INSERT INTO search_synonyms (term, synonym) VALUES
  -- 制动系统
  ('制动室', 'brake chamber'), ('brake chamber', '制动室'),
  ('气刹室', 'brake chamber'), ('brake chamber', '气刹室'),
  ('刹车室', 'brake chamber'), ('brake chamber', '刹车室'),
  ('制动阀', 'brake valve'), ('brake valve', '制动阀'),
  ('气刹阀', 'brake valve'), ('brake valve', '气刹阀'),
  ('刹车', 'brake'), ('brake', '刹车'),
  -- 活塞 / 缸套
  ('活塞环', 'piston ring'), ('piston ring', '活塞环'),
  ('活塞', 'piston'), ('piston', '活塞'),
  ('活塞销', 'piston pin'), ('piston pin', '活塞销'),
  ('气缸套', 'cylinder liner'), ('cylinder liner', '气缸套'),
  ('缸套', 'cylinder liner'), ('cylinder liner', '缸套'),
  -- 轴承
  ('主轴承', 'main bearing'), ('main bearing', '主轴承'),
  ('大瓦', 'main bearing'), ('main bearing', '大瓦'),
  ('连杆瓦', 'connecting rod bearing'), ('connecting rod bearing', '连杆瓦'),
  ('小瓦', 'connecting rod bearing'), ('connecting rod bearing', '小瓦'),
  -- 曲柄连杆 / 配气
  ('曲轴', 'crankshaft'), ('crankshaft', '曲轴'),
  ('凸轮轴', 'camshaft'), ('camshaft', '凸轮轴'),
  ('气门', 'valve'), ('valve', '气门'),
  -- 泵 / 涡轮 / 喷射
  ('机油泵', 'oil pump'), ('oil pump', '机油泵'),
  ('水泵', 'water pump'), ('water pump', '水泵'),
  ('增压器', 'turbocharger'), ('turbocharger', '增压器'),
  ('喷油器', 'injector'), ('injector', '喷油器'),
  ('喷油嘴', 'injector'), ('injector', '喷油嘴'),
  -- 滤清器
  ('滤芯', 'filter element'), ('filter element', '滤芯'),
  ('机油滤', 'oil filter'), ('oil filter', '机油滤'),
  ('柴滤', 'fuel filter'), ('fuel filter', '柴滤'),
  ('空滤', 'air filter'), ('air filter', '空滤'),
  -- 通用
  ('密封垫', 'gasket'), ('gasket', '密封垫'),
  ('发动机', 'engine'), ('engine', '发动机'),
  ('引擎', 'engine'), ('engine', '引擎')
ON CONFLICT (term, synonym) DO NOTHING;

-- 4) 主搜索函数：多字段加权打分 + 同义词自动扩展
--    权重：OEM 精确 100 > OEM 含 80 / SKU 含 70 / OEM 规范含 70
--         > 同义词 OEM 含 65 > 中英名含 60 > 同义词名含 50
--         > 机型含 40 / 同义词机型 35 > 品牌含 30 / 同义词品牌 25
CREATE OR REPLACE FUNCTION search_products(q text, max_rows int DEFAULT 24)
RETURNS TABLE (
  slug text, sku text, name_en text, name_zh text, brand text,
  truck_model text, oem_number text, category text, score double precision
) LANGUAGE sql STABLE AS $$
  WITH norm AS (
    SELECT upper(regexp_replace(trim(q), '[\s\-]+', '', 'g')) AS n_q
  ),
  terms AS (
    SELECT trim(q) AS t
    UNION
    SELECT s.synonym FROM search_synonyms s WHERE s.term = trim(q)
    UNION
    SELECT s.term FROM search_synonyms s WHERE s.synonym = trim(q)
  )
  SELECT p.slug, p.sku, p.name_en, p.name_zh, p.brand, p.truck_model,
         p.oem_number, p.category,
         GREATEST(
           CASE WHEN (SELECT n_q FROM norm) <> ''
                 AND upper(regexp_replace(p.oem_number, '[\s\-]+', '', 'g')) = (SELECT n_q FROM norm)
                THEN 100 ELSE 0 END,
           CASE WHEN p.oem_number ILIKE '%' || q || '%' THEN 80 ELSE 0 END,
           CASE WHEN length((SELECT n_q FROM norm)) >= 4
                 AND p.oem_number ILIKE '%' || (SELECT n_q FROM norm) || '%'
                THEN 70 ELSE 0 END,
           CASE WHEN p.sku ILIKE '%' || q || '%' THEN 70 ELSE 0 END,
           CASE WHEN EXISTS (SELECT 1 FROM terms t WHERE p.oem_number ILIKE '%' || t.t || '%')
                THEN 65 ELSE 0 END,
           SIMILARITY(p.name_en, q) * 100,
           CASE WHEN p.name_en ILIKE '%' || q || '%' THEN 60 ELSE 0 END,
           CASE WHEN p.name_zh ILIKE '%' || q || '%' THEN 60 ELSE 0 END,
           CASE WHEN EXISTS (SELECT 1 FROM terms t WHERE p.name_en ILIKE '%' || t.t || '%')
                THEN 50 ELSE 0 END,
           CASE WHEN EXISTS (SELECT 1 FROM terms t WHERE p.name_zh ILIKE '%' || t.t || '%')
                THEN 50 ELSE 0 END,
           CASE WHEN p.truck_model ILIKE '%' || q || '%' THEN 40 ELSE 0 END,
           CASE WHEN EXISTS (SELECT 1 FROM terms t WHERE p.truck_model ILIKE '%' || t.t || '%')
                THEN 35 ELSE 0 END,
           CASE WHEN p.brand ILIKE '%' || q || '%' THEN 30 ELSE 0 END,
           CASE WHEN EXISTS (SELECT 1 FROM terms t WHERE p.brand ILIKE '%' || t.t || '%')
                THEN 25 ELSE 0 END
         ) AS score
  FROM products p
  WHERE p.status IN ('published', 'active')
    AND (
      p.oem_number   ILIKE '%' || q || '%'
      OR p.sku       ILIKE '%' || q || '%'
      OR p.name_en   ILIKE '%' || q || '%'
      OR p.name_zh   ILIKE '%' || q || '%'
      OR p.truck_model ILIKE '%' || q || '%'
      OR p.brand     ILIKE '%' || q || '%'
      OR p.name_en   % q
      OR p.name_zh   % q
      OR EXISTS (
        SELECT 1 FROM terms t
        WHERE p.oem_number ILIKE '%' || t.t || '%'
           OR p.name_en   ILIKE '%' || t.t || '%'
           OR p.name_zh   ILIKE '%' || t.t || '%'
           OR p.truck_model ILIKE '%' || t.t || '%'
           OR p.brand     ILIKE '%' || t.t || '%'
      )
    )
  ORDER BY score DESC, p.name_en ASC
  LIMIT max_rows
$$;

-- 5) 自动补全函数（输入框实时建议：产品名 + OEM）
CREATE OR REPLACE FUNCTION suggest_products(q text, max_rows int DEFAULT 8)
RETURNS TABLE (slug text, label text, oem text, kind text)
LANGUAGE sql STABLE AS $$
  SELECT p.slug,
         trim(coalesce(nullif(p.name_zh, ''), p.name_en) || ' ' || p.name_en) AS label,
         p.oem_number AS oem,
         'product'::text AS kind
  FROM products p
  WHERE p.status IN ('published', 'active')
    AND (
      p.name_zh     ILIKE q || '%'
      OR p.name_en   ILIKE q || '%'
      OR p.oem_number ILIKE '%' || q || '%'
      OR p.sku       ILIKE '%' || q || '%'
    )
  ORDER BY
    CASE WHEN p.name_en ILIKE q || '%' THEN 0
         WHEN p.name_zh ILIKE q || '%' THEN 1
         ELSE 2 END,
    p.name_en ASC
  LIMIT max_rows
$$;
