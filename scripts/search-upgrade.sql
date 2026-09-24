-- ============================================================
-- 站内搜索升级 Phase 1+2 —— 唯一脚本（幂等，可重复执行）
-- 内容：pg_trgm 扩展 + trigram 索引 + 中英同义词表
--       + 互换号表 product_cross_references
--       + 加权搜索函数 search_products（含互换号命中）
--       + 自动补全 suggest_products
-- 执行位置：Supabase Dashboard → SQL Editor → 全选运行
-- 验证：
--   SELECT * FROM search_products('brake chamber', 5);  -- 应命中制动室
--   SELECT * FROM search_products('0360601', 5);
--   SELECT * FROM suggest_products('制动', 5);
--   SELECT count(*) FROM product_cross_references;       -- 互换号行数（导入前为 0）
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

-- 3.1) 同义词扩充(2026-09-24,85 组中文行话+英文枢纽,成对双向;重卡全系统)
INSERT INTO search_synonyms (term, synonym) VALUES
  -- 制动系统行话
  ('刹车片', '制动片'), ('制动片', '刹车片'),
  ('摩擦片', '制动片'), ('制动片', '摩擦片'),
  ('刹车皮', '制动片'), ('制动片', '刹车皮'),
  ('刹车盘', '制动盘'), ('制动盘', '刹车盘'),
  ('刹车总泵', '制动总泵'), ('制动总泵', '刹车总泵'),
  ('刹车分泵', '制动分泵'), ('制动分泵', '刹车分泵'),
  ('手刹', '驻车制动'), ('驻车制动', '手刹'),
  ('干燥罐', '干燥器'), ('干燥器', '干燥罐'),
  ('干燥瓶', '干燥器'), ('干燥器', '干燥瓶'),
  ('储气罐', '储气筒'), ('储气筒', '储气罐'),
  ('四回路保护阀', '四回路阀'), ('四回路阀', '四回路保护阀'),
  -- 离合器
  ('离合器片', '从动盘'), ('从动盘', '离合器片'),
  ('离合器压盘', '压盘'), ('压盘', '离合器压盘'),
  ('分离轴承', '离合器分离轴承'), ('离合器分离轴承', '分离轴承'),
  ('离合器总泵', '离合器主缸'), ('离合器主缸', '离合器总泵'),
  ('离合器分泵', '离合器工作缸'), ('离合器工作缸', '离合器分泵'),
  ('离合助力器', '离合器助力器'), ('离合器助力器', '离合助力器'),
  -- 转向
  ('方向机', '转向器'), ('转向器', '方向机'),
  ('转向助力泵', '方向助力泵'), ('方向助力泵', '转向助力泵'),
  ('助力泵', '转向助力泵'), ('转向助力泵', '助力泵'),
  ('直拉杆', '转向直拉杆'), ('转向直拉杆', '直拉杆'),
  ('横拉杆', '转向横拉杆'), ('转向横拉杆', '横拉杆'),
  ('立轴', '主销'), ('主销', '立轴'),
  -- 传动/变速
  ('变速箱', '变速器'), ('变速器', '变速箱'),
  ('波箱', '变速箱'), ('变速箱', '波箱'),
  ('十字轴', '十字节'), ('十字节', '十字轴'),
  ('牙包', '主减速器'), ('主减速器', '牙包'),
  ('轮胎螺丝', '轮胎螺栓'), ('轮胎螺栓', '轮胎螺丝'),
  -- 悬架/桥
  ('钢板', '钢板弹簧'), ('钢板弹簧', '钢板'),
  ('弓子板', '钢板弹簧'), ('钢板弹簧', '弓子板'),
  ('骑马螺栓', 'U型螺栓'), ('U型螺栓', '骑马螺栓'),
  ('骑马螺栓', 'u-bolt'), ('u-bolt', '骑马螺栓'),
  ('U型螺栓', 'u-bolt'), ('u-bolt', 'U型螺栓'),
  -- 发动机
  ('大修包', '发动机大修包'), ('发动机大修包', '大修包'),
  ('缸垫', '气缸垫'), ('气缸垫', '缸垫'),
  ('缸床', '缸垫'), ('缸垫', '缸床'),
  ('气缸床', '缸垫'), ('缸垫', '气缸床'),
  ('缸盖', '气缸盖'), ('气缸盖', '缸盖'),
  ('缸体', '气缸体'), ('气缸体', '缸体'),
  ('油底壳', '机油盘'), ('机油盘', '油底壳'),
  ('机油尺', '机油标尺'), ('机油标尺', '机油尺'),
  ('高压油泵', '喷油泵'), ('喷油泵', '高压油泵'),
  ('输油泵', '供油泵'), ('供油泵', '输油泵'),
  ('摇臂', '气门摇臂'), ('气门摇臂', '摇臂'),
  ('曲轴轮', '曲轴皮带轮'), ('曲轴皮带轮', '曲轴轮'),
  ('过桥轮', '张紧轮'), ('张紧轮', '过桥轮'),
  -- 冷却/空调
  ('水箱', '散热器'), ('散热器', '水箱'),
  ('水箱', 'radiator'), ('radiator', '水箱'),
  ('副水箱', '膨胀水箱'), ('膨胀水箱', '副水箱'),
  ('膨胀水壶', '膨胀水箱'), ('膨胀水箱', '膨胀水壶'),
  ('空调泵', '空调压缩机'), ('空调压缩机', '空调泵'),
  -- 进排气
  ('消音器', '消声器'), ('消声器', '消音器'),
  ('空压机', '气泵'), ('气泵', '空压机'),
  -- 电气
  ('电瓶', '蓄电池'), ('蓄电池', '电瓶'),
  ('电瓶', 'battery'), ('battery', '电瓶'),
  ('蓄电池', 'battery'), ('battery', '蓄电池'),
  ('马达', '起动机'), ('起动机', '马达'),
  ('启动马达', '起动机'), ('起动机', '启动马达'),
  ('起动机', 'starter'), ('starter', '起动机'),
  ('发电机', 'alternator'), ('alternator', '发电机'),
  ('雨刮', '雨刷'), ('雨刷', '雨刮'),
  ('刮水器', '雨刮'), ('雨刮', '刮水器'),
  ('倒车镜', '后视镜'), ('后视镜', '倒车镜'),
  -- 车身/通用
  ('驾驶楼', '驾驶室'), ('驾驶室', '驾驶楼'),
  ('叶子板', '翼子板'), ('翼子板', '叶子板'),
  ('挡泥瓦', '挡泥板'), ('挡泥板', '挡泥瓦'),
  ('鞍座', '牵引座'), ('牵引座', '鞍座'),
  ('马鞍座', '牵引座'), ('牵引座', '马鞍座'),
  ('牵引座', 'fifth wheel'), ('fifth wheel', '牵引座'),
  ('车门泵', '门泵'), ('门泵', '车门泵'),
  ('风扇叶', '风扇'), ('风扇', '风扇叶'),
  ('护风圈', '风扇护罩'), ('风扇护罩', '护风圈'),
  ('硅油离合器', '风扇离合器'), ('风扇离合器', '硅油离合器'),
  ('中冷', '中冷器'), ('中冷器', '中冷'),
  ('中冷器', 'intercooler'), ('intercooler', '中冷器'),
  -- 型号连字符归一
  ('R134a', 'R-134a'), ('R-134a', 'R134a')
ON CONFLICT (term, synonym) DO NOTHING;

-- 4) 互换号表（一款产品对应多个等效 OEM 号；表已存在时自动跳过）
--    喂数据用 scripts/cross-refs-import-template.sql
CREATE TABLE IF NOT EXISTS product_cross_references (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  ref_oem text NOT NULL,
  source text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE product_cross_references ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_cross_refs" ON product_cross_references;
CREATE POLICY "anon_read_cross_refs" ON product_cross_references
  FOR SELECT TO anon USING (true);

CREATE INDEX IF NOT EXISTS idx_pcr_ref_oem      ON product_cross_references (ref_oem);
CREATE INDEX IF NOT EXISTS idx_pcr_ref_oem_trgm ON product_cross_references USING gin (ref_oem gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_pcr_product_id   ON product_cross_references (product_id);

-- 5) 主搜索函数：多字段加权打分 + 同义词自动扩展 + 互换号命中
--    权重：OEM 精确 100 > 互换号精确 90 > OEM 含 80 / SKU 含 70 / OEM 规范含 70
--         > 同义词 OEM 含 65 > 中英名含 60 > 同义词名含 50 > 互换号含 45
--         > 机型含 40 / 同义词机型 35 > 品牌含 30 / 同义词品牌 25
--    （互换号表为空时与 Phase 1 行为完全一致）
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
           CASE WHEN EXISTS (
                  SELECT 1 FROM product_cross_references cr
                  WHERE cr.product_id = p.id
                    AND upper(regexp_replace(cr.ref_oem, '[\s\-]+', '', 'g')) = (SELECT n_q FROM norm)
                ) THEN 90 ELSE 0 END,
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
           CASE WHEN EXISTS (
                  SELECT 1 FROM product_cross_references cr
                  WHERE cr.product_id = p.id AND cr.ref_oem ILIKE '%' || q || '%'
                ) THEN 45 ELSE 0 END,
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
      OR EXISTS (
        SELECT 1 FROM product_cross_references cr
        WHERE cr.product_id = p.id
          AND (cr.ref_oem ILIKE '%' || q || '%'
               OR (length((SELECT n_q FROM norm)) >= 4
                   AND cr.ref_oem ILIKE '%' || (SELECT n_q FROM norm) || '%'))
      )
    )
  ORDER BY score DESC, p.name_en ASC
  LIMIT max_rows
$$;

-- 6) 自动补全函数（输入框实时建议：产品名 + OEM）
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
