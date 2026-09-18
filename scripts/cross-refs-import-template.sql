-- ============================================================
-- 互换号（cross references）批量导入模板
-- 用途：把供应商互换号对照表灌入 product_cross_references，
--       之后站内搜任意等效 OEM 号都能命中对应产品（search_products RPC 已集成）
-- 用法：把下面 VALUES 里的示例行换成真实数据（slug = 产品页 URL 最后一段），
--       在 Supabase SQL Editor 全选运行；可反复执行，重复行自动跳过
-- 数据来源建议：供应商互换手册 / EPC 对照表 / 历史成交记录里客户报过的号
-- ============================================================

INSERT INTO product_cross_references (product_id, ref_oem, source)
SELECT p.id, v.ref_oem, v.source
FROM (VALUES
  -- 示例（换成真实数据后取消注释并补行）：
  -- ('brake-chamber-wg9000360601', 'AZ9000360601',  '供应商A互换手册'),
  -- ('brake-chamber-wg9000360601', 'DZ91142570126', '主机厂互换目录'),
  -- ('wg9925721001-piston',        '61560010017',   'EPC对照表')
) AS v(slug, ref_oem, source)
JOIN products p ON p.slug = v.slug
ON CONFLICT DO NOTHING;

-- 导入后验证：
--   SELECT count(*) FROM product_cross_references;
--   SELECT * FROM search_products('AZ9000360601', 5);  -- 换成真实导入的互换号，应命中对应产品
