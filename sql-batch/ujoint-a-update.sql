-- ================================================================
-- U型接头产品线 A步：更新现有产品
-- 日期：2026-10-15
-- 说明：补充 wan-xiang-jie-015 的三语描述 + 给十字轴/轴承产品补充图册参考
-- 来源：U-joint_and_components_1.pdf（山东济宁瞻程传动 ZHANWANG）
-- ================================================================

-- 1) 更新 wan-xiang-jie-015（万向节，缺描述）
UPDATE products
SET
  name_zh = '万向节总成（Universal Joint Assembly）',
  name_en = 'Universal Joint Assembly (Howo/Haohan)',
  name_ru = 'Шарнирный вал в сборе (Howo/Haohan)',
  description_zh = '万向节总成，适用于豪沃/豪瀚系列重卡。传动轴关键部件，济南德达供应，品质保证，欢迎询价。',
  description_en = 'Universal Joint Assembly for Howo/Haohan series heavy trucks. Key driveshaft component. Quality guaranteed, inquiry welcome from DEDA Auto Parts, Jinan.',
  description_ru = 'Шарнирный вал в сборе для тяжелых грузовиков Howo/Haohan. Ключевой компонент карданного вала. Гарантия качества, приглашаем к расспросам от DEDA Auto Parts, Цзинань.',
  specs = '{"适用车型": "HOWO/豪瀚/豪沃", "品牌": "原厂/副厂", "说明": "万向节总成，传动轴关键部件", "图册参考": "U-joint_and_components_1.pdf"}'::jsonb
WHERE slug = 'wan-xiang-jie-015';

-- 2) 给 18 条十字轴产品补充图册参考信息（合并 JSONB，不覆盖原 specs）
UPDATE products
SET specs = specs || jsonb_build_object(
  '图册参考', 'U-joint_and_components_1.pdf (ZHANWANG/P2-P10)',
  '图册适用', jsonb_build_object('适用车型', specs->>'适用车型', '规格', specs->>'规格')
)
WHERE slug LIKE 'universal-joint-cross-%'
  AND slug NOT LIKE '%bearing%'
  AND slug NOT LIKE '%needle%';

-- 3) 更新 2 条轴承产品，补充图册参考 + 类型
UPDATE products
SET specs = specs || jsonb_build_object(
  '图册参考', 'U-joint_and_components_1.pdf (ZHANWANG/P11)',
  '类型', '万向节轴承'
)
WHERE slug IN (
  'universal-joint-cross-bearing-180204-6204-2rs-ca151',
  'universal-joint-needle-bearing-7304-304304-bj130'
);

-- 4) 补充 2 条十字轴轴承的俄语名称（缺失）
UPDATE products
SET name_ru = 'Подшипник карданного шарнира 180204(6204-2RS)'
WHERE slug = 'universal-joint-cross-bearing-180204-6204-2rs-ca151' AND name_ru IS NULL;

UPDATE products
SET name_ru = 'Игольчатый подшипник карданного шарнира 7304(304304)'
WHERE slug = 'universal-joint-needle-bearing-7304-304304-bj130' AND name_ru IS NULL;
