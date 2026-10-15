-- ================================================================
-- U型接头产品线 B步: 导入万向节叉新产品
-- 日期: 2026-10-15
-- 说明: 从 U-joint_and_components_1.pdf (P13-P21) 导入 89 条万向节叉规格
-- 厂商: ZHANWANG / DP DRIVESHAFT PARTS (山东济宁瞻程传动)
-- SKU段: DD-UV-001~089
-- 幂等: 按 slug 去重, 重复执行安全
-- ================================================================

-- #1 Yoke 587.10 (slug=ujoint-yoke-587-10-1)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-001', 'ujoint-yoke-587-10-1', 'Yoke 587.10', '万向节叉 587.10', 'Вилка 587.10', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.10 by ZHANWANG. Bore Φ35xL96.8, flange 120mm, 4-Φ12 bolt holes, H=54.5mm. Customization available.', '万向节叉 587.10（瞻程生产）。轴孔径Φ35xL96.8，法兰120mm，总高54.5mm。可定制。', 'Шарнирная Вилка 587.10 от ZHANWANG. Сверловка Φ35xL96.8, фланец 120мм. Возможность кастомизации.', {'系列': '587.10', '轴孔径mm': 35, '总长mm': 96.8, '法兰mm': 120, '总高mm': 54.5, '图册页': 'P13', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '4-Φ12'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-10-1');

-- #2 Yoke 587.10 (slug=ujoint-yoke-587-10-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-002', 'ujoint-yoke-587-10-2', 'Yoke 587.10', '万向节叉 587.10', 'Вилка 587.10', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.10 by ZHANWANG. Bore Φ35xL96.8, flange 120mm, 4-Φ11 bolt holes, H=54.5mm. Customization available.', '万向节叉 587.10（瞻程生产）。轴孔径Φ35xL96.8，法兰120mm，总高54.5mm。可定制。', 'Шарнирная Вилка 587.10 от ZHANWANG. Сверловка Φ35xL96.8, фланец 120мм. Возможность кастомизации.', {'系列': '587.10', '轴孔径mm': 35, '总长mm': 96.8, '法兰mm': 120, '总高mm': 54.5, '图册页': 'P13', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '4-Φ11'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-10-2');

-- #3 Yoke RU50135 (slug=ujoint-yoke-ru50135-3)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-003', 'ujoint-yoke-ru50135-3', 'Yoke RU50135', '万向节叉 RU50135', 'Вилка RU50135', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke RU50135 by ZHANWANG. Bore Φ50xL135, flange 180mm, 4-Φ15 bolt holes, H=100mm. Customization available.', '万向节叉 RU50135（瞻程生产）。轴孔径Φ50xL135，法兰180mm，总高100mm。可定制。', 'Шарнирная Вилка RU50135 от ZHANWANG. Сверловка Φ50xL135, фланец 180мм. Возможность кастомизации.', {'系列': 'RU50135', '轴孔径mm': 50, '总长mm': 135, '法兰mm': 180, '总高mm': 100, '图册页': 'P13', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '4-Φ15'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-ru50135-3');

-- #4 Yoke RU50155 (slug=ujoint-yoke-ru50155-4)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-004', 'ujoint-yoke-ru50155-4', 'Yoke RU50155', '万向节叉 RU50155', 'Вилка RU50155', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke RU50155 by ZHANWANG. Bore Φ50xL135, flange 180mm, 4-Φ15 bolt holes, H=90mm. Customization available.', '万向节叉 RU50155（瞻程生产）。轴孔径Φ50xL135，法兰180mm，总高90mm。可定制。', 'Шарнирная Вилка RU50155 от ZHANWANG. Сверловка Φ50xL135, фланец 180мм. Возможность кастомизации.', {'系列': 'RU50155', '轴孔径mm': 50, '总长mm': 135, '法兰mm': 180, '总高mm': 90, '图册页': 'P13', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '4-Φ15'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-ru50155-4');

-- #5 Yoke 587.30 (slug=ujoint-yoke-587-30-5)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-005', 'ujoint-yoke-587-30-5', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 150mm, 4-Φ13 bolt holes, H=90mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰150mm，总高90mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 150мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 150, '总高mm': 90, '图册页': 'P13', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '4-Φ13'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-5');

-- #6 Yoke 587.30 (slug=ujoint-yoke-587-30-6)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-006', 'ujoint-yoke-587-30-6', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 155mm, 4-Φ13 bolt holes, H=80mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰155mm，总高80mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 155мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 155, '总高mm': 80, '图册页': 'P13', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '4-Φ13'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-6');

-- #7 Yoke 587.30 (slug=ujoint-yoke-587-30-7)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-007', 'ujoint-yoke-587-30-7', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 155mm, 4-Φ13 bolt holes, H=90mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰155mm，总高90mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 155мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 155, '总高mm': 90, '图册页': 'P13', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '4-Φ13'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-7');

-- #8 Yoke 587.30 (slug=ujoint-yoke-587-30-8)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-008', 'ujoint-yoke-587-30-8', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 165mm, 4-Φ13 bolt holes, H=90mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰165mm，总高90mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 165мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 165, '总高mm': 90, '图册页': 'P13', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '4-Φ13'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-8');

-- #9 Yoke 587.30 (slug=ujoint-yoke-587-30-9)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-009', 'ujoint-yoke-587-30-9', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 180mm, 4-Φ15 bolt holes, H=90mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰180mm，总高90mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 180мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 180, '总高mm': 90, '图册页': 'P13', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '4-Φ15'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-9');

-- #10 Yoke 587.30 (slug=ujoint-yoke-587-30-10)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-010', 'ujoint-yoke-587-30-10', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 180mm, 4-Φ15 bolt holes, H=100mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰180mm，总高100mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 180мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 180, '总高mm': 100, '图册页': 'P13', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '4-Φ15'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-10');

-- #11 Yoke 587.30 (slug=ujoint-yoke-587-30-11)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-011', 'ujoint-yoke-587-30-11', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 180mm, 4-Φ15 bolt holes, H=101.5mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰180mm，总高101.5mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 180мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 180, '总高mm': 101.5, '图册页': 'P13', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '4-Φ15'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-11');

-- #12 Yoke 587.30 (slug=ujoint-yoke-587-30-12)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-012', 'ujoint-yoke-587-30-12', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 165mm, 4-Φ13 bolt holes, H=101.5mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰165mm，总高101.5mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 165мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 165, '总高mm': 101.5, '图册页': 'P13', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '4-Φ13'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-12');

-- #13 Yoke 587.35 (slug=ujoint-yoke-587-35-13)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-013', 'ujoint-yoke-587-35-13', 'Yoke 587.35', '万向节叉 587.35', 'Вилка 587.35', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.35 by ZHANWANG. Bore Φ57xL144, flange 155mm, 4-Φ13 bolt holes, H=100mm. Customization available.', '万向节叉 587.35（瞻程生产）。轴孔径Φ57xL144，法兰155mm，总高100mm。可定制。', 'Шарнирная Вилка 587.35 от ZHANWANG. Сверловка Φ57xL144, фланец 155мм. Возможность кастомизации.', {'系列': '587.35', '轴孔径mm': 57, '总长mm': 144, '法兰mm': 155, '总高mm': 100, '图册页': 'P13', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '4-Φ13'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-35-13');

-- #14 Yoke 587.35 (slug=ujoint-yoke-587-35-14)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-014', 'ujoint-yoke-587-35-14', 'Yoke 587.35', '万向节叉 587.35', 'Вилка 587.35', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.35 by ZHANWANG. Bore Φ57xL144, flange 165mm, 4-Φ13 bolt holes, H=100mm. Customization available.', '万向节叉 587.35（瞻程生产）。轴孔径Φ57xL144，法兰165mm，总高100mm。可定制。', 'Шарнирная Вилка 587.35 от ZHANWANG. Сверловка Φ57xL144, фланец 165мм. Возможность кастомизации.', {'系列': '587.35', '轴孔径mm': 57, '总长mm': 144, '法兰mm': 165, '总高mm': 100, '图册页': 'P13', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '4-Φ13'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-35-14');

-- #15 Yoke 587.35 (slug=ujoint-yoke-587-35-15)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-015', 'ujoint-yoke-587-35-15', 'Yoke 587.35', '万向节叉 587.35', 'Вилка 587.35', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.35 by ZHANWANG. Bore Φ57xL144, flange 180mm, 4-Φ15 bolt holes, H=100mm. Customization available.', '万向节叉 587.35（瞻程生产）。轴孔径Φ57xL144，法兰180mm，总高100mm。可定制。', 'Шарнирная Вилка 587.35 от ZHANWANG. Сверловка Φ57xL144, фланец 180мм. Возможность кастомизации.', {'系列': '587.35', '轴孔径mm': 57, '总长mm': 144, '法兰mm': 180, '总高mm': 100, '图册页': 'P13', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '4-Φ15'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-35-15');

-- #16 Yoke 687.55 (slug=ujoint-yoke-687-55-16)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-016', 'ujoint-yoke-687-55-16', 'Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 687.55 by ZHANWANG. Bore Φ57xL152, flange 180mm, 4-Φ15 bolt holes, H=100mm. Customization available.', '万向节叉 687.55（瞻程生产）。轴孔径Φ57xL152，法兰180mm，总高100mm。可定制。', 'Шарнирная Вилка 687.55 от ZHANWANG. Сверловка Φ57xL152, фланец 180мм. Возможность кастомизации.', {'系列': '687.55', '轴孔径mm': 57, '总长mm': 152, '法兰mm': 180, '总高mm': 100, '图册页': 'P13', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '4-Φ15'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-687-55-16');

-- #17 Yoke YC64152 (slug=ujoint-yoke-yc64152-17)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-017', 'ujoint-yoke-yc64152-17', 'Yoke YC64152', '万向节叉 YC64152', 'Вилка YC64152', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke YC64152 by ZHANWANG. Bore Φ63.5xL152, flange 180mm, 4-Φ15 bolt holes, H=100mm. Customization available.', '万向节叉 YC64152（瞻程生产）。轴孔径Φ63.5xL152，法兰180mm，总高100mm。可定制。', 'Шарнирная Вилка YC64152 от ZHANWANG. Сверловка Φ63.5xL152, фланец 180мм. Возможность кастомизации.', {'系列': 'YC64152', '轴孔径mm': 63.5, '总长mm': 152, '法兰mm': 180, '总高mm': 100, '图册页': 'P13', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '4-Φ15'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-yc64152-17');

-- #18 Yoke 587.30 (slug=ujoint-yoke-587-30-1)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-018', 'ujoint-yoke-587-30-1', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 150mm, 8-Φ12 bolt holes, H=80mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰150mm，总高80mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 150мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 150, '总高mm': 80, '图册页': 'P14', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '8-Φ12'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-1');

-- #19 Yoke 587.30 (slug=ujoint-yoke-587-30-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-019', 'ujoint-yoke-587-30-2', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 180mm, 8-Φ12 bolt holes, H=80mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰180mm，总高80mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 180мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 180, '总高mm': 80, '图册页': 'P14', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '8-Φ12'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-2');

-- #20 Yoke 587.30 (slug=ujoint-yoke-587-30-3)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-020', 'ujoint-yoke-587-30-3', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 180mm, 8-Φ14 bolt holes, H=80mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰180mm，总高80mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 180мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 180, '总高mm': 80, '图册页': 'P14', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '8-Φ14'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-3');

-- #21 Yoke 587.30 (slug=ujoint-yoke-587-30-4)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-021', 'ujoint-yoke-587-30-4', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 180mm, 8-Φ16 bolt holes, H=80mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰180mm，总高80mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 180мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 180, '总高mm': 80, '图册页': 'P14', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '8-Φ16'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-4');

-- #22 Yoke 587.30 (slug=ujoint-yoke-587-30-5-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-022', 'ujoint-yoke-587-30-5-2', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 180mm, 10-Φ16 bolt holes, H=80mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰180mm，总高80mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 180мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 180, '总高mm': 80, '图册页': 'P14', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '10-Φ16'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-5-2');

-- #23 Yoke 587.30 (slug=ujoint-yoke-587-30-6-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-023', 'ujoint-yoke-587-30-6-2', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 150mm, 8-Φ12 bolt holes, H=90mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰150mm，总高90mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 150мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 150, '总高mm': 90, '图册页': 'P14', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '8-Φ12'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-6-2');

-- #24 Yoke 587.30 (slug=ujoint-yoke-587-30-7-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-024', 'ujoint-yoke-587-30-7-2', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 150mm, 8-Φ14 bolt holes, H=90mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰150mm，总高90mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 150мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 150, '总高mm': 90, '图册页': 'P14', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '8-Φ14'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-7-2');

-- #25 Yoke 587.30 (slug=ujoint-yoke-587-30-8-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-025', 'ujoint-yoke-587-30-8-2', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 150mm, 8-Φ16 bolt holes, H=90mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰150mm，总高90mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 150мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 150, '总高mm': 90, '图册页': 'P14', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '8-Φ16'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-8-2');

-- #26 Yoke 587.30 (slug=ujoint-yoke-587-30-9-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-026', 'ujoint-yoke-587-30-9-2', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 165mm, 8-Φ14 bolt holes, H=90mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰165mm，总高90mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 165мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 165, '总高mm': 90, '图册页': 'P14', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '8-Φ14'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-9-2');

-- #27 Yoke 587.30 (slug=ujoint-yoke-587-30-10-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-027', 'ujoint-yoke-587-30-10-2', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 165mm, 8-Φ16 bolt holes, H=90mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰165mm，总高90mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 165мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 165, '总高mm': 90, '图册页': 'P14', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '8-Φ16'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-10-2');

-- #28 Yoke 587.30 (slug=ujoint-yoke-587-30-11-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-028', 'ujoint-yoke-587-30-11-2', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 180mm, 8-Φ12 bolt holes, H=90mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰180mm，总高90mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 180мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 180, '总高mm': 90, '图册页': 'P14', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '8-Φ12'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-11-2');

-- #29 Yoke 587.30 (slug=ujoint-yoke-587-30-12-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-029', 'ujoint-yoke-587-30-12-2', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 180mm, 8-Φ14 bolt holes, H=90mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰180mm，总高90mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 180мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 180, '总高mm': 90, '图册页': 'P14', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '8-Φ14'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-12-2');

-- #30 Yoke 587.30 (slug=ujoint-yoke-587-30-13)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-030', 'ujoint-yoke-587-30-13', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 180mm, 8-Φ16 bolt holes, H=90mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰180mm，总高90mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 180мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 180, '总高mm': 90, '图册页': 'P14', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '8-Φ16'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-13');

-- #31 Yoke 587.30 (slug=ujoint-yoke-587-30-14)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-031', 'ujoint-yoke-587-30-14', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 180mm, 10-Φ14 bolt holes, H=90mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰180mm，总高90mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 180мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 180, '总高mm': 90, '图册页': 'P14', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '10-Φ14'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-14');

-- #32 Yoke 587.30 (slug=ujoint-yoke-587-30-15)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-032', 'ujoint-yoke-587-30-15', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 180mm, 10-Φ16 bolt holes, H=90mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰180mm，总高90mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 180мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 180, '总高mm': 90, '图册页': 'P14', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '10-Φ16'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-15');

-- #33 Yoke 587.35 (slug=ujoint-yoke-587-35-16)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-033', 'ujoint-yoke-587-35-16', 'Yoke 587.35', '万向节叉 587.35', 'Вилка 587.35', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.35 by ZHANWANG. Bore Φ57xL144, flange 180mm, 8-Φ14 bolt holes, H=100mm. Customization available.', '万向节叉 587.35（瞻程生产）。轴孔径Φ57xL144，法兰180mm，总高100mm。可定制。', 'Шарнирная Вилка 587.35 от ZHANWANG. Сверловка Φ57xL144, фланец 180мм. Возможность кастомизации.', {'系列': '587.35', '轴孔径mm': 57, '总长mm': 144, '法兰mm': 180, '总高mm': 100, '图册页': 'P14', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '8-Φ14'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-35-16');

-- #34 Yoke 587.35 (slug=ujoint-yoke-587-35-17)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-034', 'ujoint-yoke-587-35-17', 'Yoke 587.35', '万向节叉 587.35', 'Вилка 587.35', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.35 by ZHANWANG. Bore Φ57xL144, flange 180mm, 8-Φ16 bolt holes, H=100mm. Customization available.', '万向节叉 587.35（瞻程生产）。轴孔径Φ57xL144，法兰180mm，总高100mm。可定制。', 'Шарнирная Вилка 587.35 от ZHANWANG. Сверловка Φ57xL144, фланец 180мм. Возможность кастомизации.', {'系列': '587.35', '轴孔径mm': 57, '总长mm': 144, '法兰mm': 180, '总高mm': 100, '图册页': 'P14', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '8-Φ16'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-35-17');

-- #35 Yoke 587.35 (slug=ujoint-yoke-587-35-18)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-035', 'ujoint-yoke-587-35-18', 'Yoke 587.35', '万向节叉 587.35', 'Вилка 587.35', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.35 by ZHANWANG. Bore Φ57xL144, flange 180mm, 10-Φ16 bolt holes, H=100mm. Customization available.', '万向节叉 587.35（瞻程生产）。轴孔径Φ57xL144，法兰180mm，总高100mm。可定制。', 'Шарнирная Вилка 587.35 от ZHANWANG. Сверловка Φ57xL144, фланец 180мм. Возможность кастомизации.', {'系列': '587.35', '轴孔径mm': 57, '总长mm': 144, '法兰mm': 180, '总高mm': 100, '图册页': 'P14', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '10-Φ16'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-35-18');

-- #36 Yoke 587.35 (slug=ujoint-yoke-587-35-19)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-036', 'ujoint-yoke-587-35-19', 'Yoke 587.35', '万向节叉 587.35', 'Вилка 587.35', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.35 by ZHANWANG. Bore Φ57xL144, flange 225mm, 8-Φ16 bolt holes, H=100mm. Customization available.', '万向节叉 587.35（瞻程生产）。轴孔径Φ57xL144，法兰225mm，总高100mm。可定制。', 'Шарнирная Вилка 587.35 от ZHANWANG. Сверловка Φ57xL144, фланец 225мм. Возможность кастомизации.', {'系列': '587.35', '轴孔径mm': 57, '总长mm': 144, '法兰mm': 225, '总高mm': 100, '图册页': 'P15', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '8-Φ16'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-35-19');

-- #37 Yoke 587.35 (slug=ujoint-yoke-587-35-20)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-037', 'ujoint-yoke-587-35-20', 'Yoke 587.35', '万向节叉 587.35', 'Вилка 587.35', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.35 by ZHANWANG. Bore Φ57xL144, flange 225mm, 8-Φ16 bolt holes, H=100mm. Customization available.', '万向节叉 587.35（瞻程生产）。轴孔径Φ57xL144，法兰225mm，总高100mm。可定制。', 'Шарнирная Вилка 587.35 от ZHANWANG. Сверловка Φ57xL144, фланец 225мм. Возможность кастомизации.', {'系列': '587.35', '轴孔径mm': 57, '总长mm': 144, '法兰mm': 225, '总高mm': 100, '图册页': 'P15', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '8-Φ16'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-35-20');

-- #38 Yoke 587.35 (slug=ujoint-yoke-587-35-21)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-038', 'ujoint-yoke-587-35-21', 'Yoke 587.35', '万向节叉 587.35', 'Вилка 587.35', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.35 by ZHANWANG. Bore Φ57xL144, flange 225mm, 10-Φ16 bolt holes, H=100mm. Customization available.', '万向节叉 587.35（瞻程生产）。轴孔径Φ57xL144，法兰225mm，总高100mm。可定制。', 'Шарнирная Вилка 587.35 от ZHANWANG. Сверловка Φ57xL144, фланец 225мм. Возможность кастомизации.', {'系列': '587.35', '轴孔径mm': 57, '总长mm': 144, '法兰mm': 225, '总高mm': 100, '图册页': 'P15', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '10-Φ16'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-35-21');

-- #39 Yoke 687.55 (slug=ujoint-yoke-687-55-22)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-039', 'ujoint-yoke-687-55-22', 'Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 687.55 by ZHANWANG. Bore Φ57xL152, flange 180mm, 8-Φ14 bolt holes, H=100mm. Customization available.', '万向节叉 687.55（瞻程生产）。轴孔径Φ57xL152，法兰180mm，总高100mm。可定制。', 'Шарнирная Вилка 687.55 от ZHANWANG. Сверловка Φ57xL152, фланец 180мм. Возможность кастомизации.', {'系列': '687.55', '轴孔径mm': 57, '总长mm': 152, '法兰mm': 180, '总高mm': 100, '图册页': 'P15', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '8-Φ14'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-687-55-22');

-- #40 Yoke 687.55 (slug=ujoint-yoke-687-55-23)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-040', 'ujoint-yoke-687-55-23', 'Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 687.55 by ZHANWANG. Bore Φ57xL152, flange 180mm, 8-Φ16 bolt holes, H=100mm. Customization available.', '万向节叉 687.55（瞻程生产）。轴孔径Φ57xL152，法兰180mm，总高100mm。可定制。', 'Шарнирная Вилка 687.55 от ZHANWANG. Сверловка Φ57xL152, фланец 180мм. Возможность кастомизации.', {'系列': '687.55', '轴孔径mm': 57, '总长mm': 152, '法兰mm': 180, '总高mm': 100, '图册页': 'P15', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '8-Φ16'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-687-55-23');

-- #41 Yoke 687.55 (slug=ujoint-yoke-687-55-24)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-041', 'ujoint-yoke-687-55-24', 'Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 687.55 by ZHANWANG. Bore Φ57xL152, flange 180mm, 10-Φ16 bolt holes, H=100mm. Customization available.', '万向节叉 687.55（瞻程生产）。轴孔径Φ57xL152，法兰180mm，总高100mm。可定制。', 'Шарнирная Вилка 687.55 от ZHANWANG. Сверловка Φ57xL152, фланец 180мм. Возможность кастомизации.', {'系列': '687.55', '轴孔径mm': 57, '总长mm': 152, '法兰mm': 180, '总高mm': 100, '图册页': 'P15', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '10-Φ16'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-687-55-24');

-- #42 Yoke 687.55 (slug=ujoint-yoke-687-55-25)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-042', 'ujoint-yoke-687-55-25', 'Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 687.55 by ZHANWANG. Bore Φ57xL152, flange 225mm, 8-Φ16 bolt holes, H=100mm. Customization available.', '万向节叉 687.55（瞻程生产）。轴孔径Φ57xL152，法兰225mm，总高100mm。可定制。', 'Шарнирная Вилка 687.55 от ZHANWANG. Сверловка Φ57xL152, фланец 225мм. Возможность кастомизации.', {'系列': '687.55', '轴孔径mm': 57, '总长mm': 152, '法兰mm': 225, '总高mm': 100, '图册页': 'P15', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '8-Φ16'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-687-55-25');

-- #43 Yoke 687.55 (slug=ujoint-yoke-687-55-26)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-043', 'ujoint-yoke-687-55-26', 'Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 687.55 by ZHANWANG. Bore Φ57xL152, flange 225mm, 10-Φ16 bolt holes, H=100mm. Customization available.', '万向节叉 687.55（瞻程生产）。轴孔径Φ57xL152，法兰225mm，总高100mm。可定制。', 'Шарнирная Вилка 687.55 от ZHANWANG. Сверловка Φ57xL152, фланец 225мм. Возможность кастомизации.', {'系列': '687.55', '轴孔径mm': 57, '总长mm': 152, '法兰mm': 225, '总高mm': 100, '图册页': 'P15', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '10-Φ16'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-687-55-26');

-- #44 Yoke 687.55 (slug=ujoint-yoke-687-55-27)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-044', 'ujoint-yoke-687-55-27', 'Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 687.55 by ZHANWANG. Bore Φ57xL152, flange 250mm, 8-Φ18 bolt holes, H=100mm. Customization available.', '万向节叉 687.55（瞻程生产）。轴孔径Φ57xL152，法兰250mm，总高100mm。可定制。', 'Шарнирная Вилка 687.55 от ZHANWANG. Сверловка Φ57xL152, фланец 250мм. Возможность кастомизации.', {'系列': '687.55', '轴孔径mm': 57, '总长mm': 152, '法兰mm': 250, '总高mm': 100, '图册页': 'P15', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '8-Φ18'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-687-55-27');

-- #45 Yoke 385.60 (slug=ujoint-yoke-385-60-1)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-045', 'ujoint-yoke-385-60-1', 'Yoke 385.60', '万向节叉 385.60', 'Вилка 385.60', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 385.60 by ZHANWANG. Bore Φ68xL89, flange 180mm, 4-Φ15 bolt holes, H=100mm. Customization available.', '万向节叉 385.60（瞻程生产）。轴孔径Φ68xL89，法兰180mm，总高100mm。可定制。', 'Шарнирная Вилка 385.60 от ZHANWANG. Сверловка Φ68xL89, фланец 180мм. Возможность кастомизации.', {'系列': '385.60', '轴孔径mm': 68, '总长mm': 89, '法兰mm': 180, '总高mm': 100, '图册页': 'P16', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '4-Φ15'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-385-60-1');

-- #46 Yoke 385.68 (slug=ujoint-yoke-385-68-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-046', 'ujoint-yoke-385-68-2', 'Yoke 385.68', '万向节叉 385.68', 'Вилка 385.68', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 385.68 by ZHANWANG. Bore Φ68xL117, flange 200mm, 4-Φ15 bolt holes, H=113mm. Customization available.', '万向节叉 385.68（瞻程生产）。轴孔径Φ68xL117，法兰200mm，总高113mm。可定制。', 'Шарнирная Вилка 385.68 от ZHANWANG. Сверловка Φ68xL117, фланец 200мм. Возможность кастомизации.', {'系列': '385.68', '轴孔径mm': 68, '总长mm': 117, '法兰mm': 200, '总高mm': 113, '图册页': 'P16', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '4-Φ15'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-385-68-2');

-- #47 Yoke 1810 (slug=ujoint-yoke-1810-1)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-047', 'ujoint-yoke-1810-1', 'Yoke 1810', '万向节叉 1810', 'Вилка 1810', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 1810 by ZHANWANG. Bore Φ49.2xL191.9, flange 180mm, 4-Φ15 bolt holes, H=90mm. Customization available.', '万向节叉 1810（瞻程生产）。轴孔径Φ49.2xL191.9，法兰180mm，总高90mm。可定制。', 'Шарнирная Вилка 1810 от ZHANWANG. Сверловка Φ49.2xL191.9, фланец 180мм. Возможность кастомизации.', {'系列': '1810', '轴孔径mm': 49.2, '总长mm': 191.9, '法兰mm': 180, '总高mm': 90, '图册页': 'P17', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)', '螺栓孔': '4-Φ15'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-1810-1');

-- #48 Yoke 587.10 (slug=ujoint-yoke-587-10-1-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-048', 'ujoint-yoke-587-10-1-2', 'Yoke 587.10', '万向节叉 587.10', 'Вилка 587.10', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.10 by ZHANWANG. Bore Φ35xL96.8, flange 71mm, H=54mm. Customization available.', '万向节叉 587.10（瞻程生产）。轴孔径Φ35xL96.8，法兰71mm，总高54mm。可定制。', 'Шарнирная Вилка 587.10 от ZHANWANG. Сверловка Φ35xL96.8, фланец 71мм. Возможность кастомизации.', {'系列': '587.10', '轴孔径mm': 35, '总长mm': 96.8, '法兰mm': 71, '总高mm': 54, '图册页': 'P18', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-10-1-2');

-- #49 Yoke 587.10 (slug=ujoint-yoke-587-10-2-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-049', 'ujoint-yoke-587-10-2-2', 'Yoke 587.10', '万向节叉 587.10', 'Вилка 587.10', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.10 by ZHANWANG. Bore Φ35xL96.8, flange 55mm, H=83mm. Customization available.', '万向节叉 587.10（瞻程生产）。轴孔径Φ35xL96.8，法兰55mm，总高83mm。可定制。', 'Шарнирная Вилка 587.10 от ZHANWANG. Сверловка Φ35xL96.8, фланец 55мм. Возможность кастомизации.', {'系列': '587.10', '轴孔径mm': 35, '总长mm': 96.8, '法兰mm': 55, '总高mm': 83, '图册页': 'P18', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-10-2-2');

-- #50 Yoke GU7620 (slug=ujoint-yoke-gu7620-3)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-050', 'ujoint-yoke-gu7620-3', 'Yoke GU7620', '万向节叉 GU7620', 'Вилка GU7620', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke GU7620 by ZHANWANG. Bore Φ48xL126, flange 81mm, H=83mm. Customization available.', '万向节叉 GU7620（瞻程生产）。轴孔径Φ48xL126，法兰81mm，总高83mm。可定制。', 'Шарнирная Вилка GU7620 от ZHANWANG. Сверловка Φ48xL126, фланец 81мм. Возможность кастомизации.', {'系列': 'GU7620', '轴孔径mm': 48, '总长mm': 126, '法兰mm': 81, '总高mm': 83, '图册页': 'P18', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-gu7620-3');

-- #51 Yoke GU7620 (slug=ujoint-yoke-gu7620-4)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-051', 'ujoint-yoke-gu7620-4', 'Yoke GU7620', '万向节叉 GU7620', 'Вилка GU7620', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke GU7620 by ZHANWANG. Bore Φ48xL126, flange 79mm, H=83mm. Customization available.', '万向节叉 GU7620（瞻程生产）。轴孔径Φ48xL126，法兰79mm，总高83mm。可定制。', 'Шарнирная Вилка GU7620 от ZHANWANG. Сверловка Φ48xL126, фланец 79мм. Возможность кастомизации.', {'系列': 'GU7620', '轴孔径mm': 48, '总长mm': 126, '法兰mm': 79, '总高mm': 83, '图册页': 'P18', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-gu7620-4');

-- #52 Yoke RU50135 (slug=ujoint-yoke-ru50135-5)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-052', 'ujoint-yoke-ru50135-5', 'Yoke RU50135', '万向节叉 RU50135', 'Вилка RU50135', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke RU50135 by ZHANWANG. Bore Φ50xL135, flange 82mm, H=90mm. Customization available.', '万向节叉 RU50135（瞻程生产）。轴孔径Φ50xL135，法兰82mm，总高90mm。可定制。', 'Шарнирная Вилка RU50135 от ZHANWANG. Сверловка Φ50xL135, фланец 82мм. Возможность кастомизации.', {'系列': 'RU50135', '轴孔径mm': 50, '总长mm': 135, '法兰mm': 82, '总高mm': 90, '图册页': 'P18', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-ru50135-5');

-- #53 Yoke RU50155 (slug=ujoint-yoke-ru50155-6)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-053', 'ujoint-yoke-ru50155-6', 'Yoke RU50155', '万向节叉 RU50155', 'Вилка RU50155', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke RU50155 by ZHANWANG. Bore Φ50xL155, flange 94mm, H=85mm. Customization available.', '万向节叉 RU50155（瞻程生产）。轴孔径Φ50xL155，法兰94mm，总高85mm。可定制。', 'Шарнирная Вилка RU50155 от ZHANWANG. Сверловка Φ50xL155, фланец 94мм. Возможность кастомизации.', {'系列': 'RU50155', '轴孔径mm': 50, '总长mm': 155, '法兰mm': 94, '总高mm': 85, '图册页': 'P18', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-ru50155-6');

-- #54 Yoke 587.30 (slug=ujoint-yoke-587-30-7-3)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-054', 'ujoint-yoke-587-30-7-3', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 82mm, H=93mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰82mm，总高93mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 82мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 82, '总高mm': 93, '图册页': 'P18', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-7-3');

-- #55 Yoke 587.30 (slug=ujoint-yoke-587-30-8-3)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-055', 'ujoint-yoke-587-30-8-3', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 94mm, H=92mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰94mm，总高92mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 94мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 94, '总高mm': 92, '图册页': 'P18', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-8-3');

-- #56 Yoke 587.30 (slug=ujoint-yoke-587-30-9-3)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-056', 'ujoint-yoke-587-30-9-3', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 79mm, H=93mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰79mm，总高93mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 79мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 79, '总高mm': 93, '图册页': 'P18', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-9-3');

-- #57 Yoke 587.30 (slug=ujoint-yoke-587-30-10-3)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-057', 'ujoint-yoke-587-30-10-3', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 81mm, H=93mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰81mm，总高93mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 81мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 81, '总高mm': 93, '图册页': 'P18', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-10-3');

-- #58 Yoke 587.30 (slug=ujoint-yoke-587-30-11-3)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-058', 'ujoint-yoke-587-30-11-3', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 91.6mm, H=92mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰91.6mm，总高92mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 91.6мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 91.6, '总高mm': 92, '图册页': 'P18', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-11-3');

-- #59 Yoke 587.30 (slug=ujoint-yoke-587-30-12-3)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-059', 'ujoint-yoke-587-30-12-3', 'Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.30 by ZHANWANG. Bore Φ52xL133, flange 93mm, H=92mm. Customization available.', '万向节叉 587.30（瞻程生产）。轴孔径Φ52xL133，法兰93mm，总高92mm。可定制。', 'Шарнирная Вилка 587.30 от ZHANWANG. Сверловка Φ52xL133, фланец 93мм. Возможность кастомизации.', {'系列': '587.30', '轴孔径mm': 52, '总长mm': 133, '法兰mm': 93, '总高mm': 92, '图册页': 'P18', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-30-12-3');

-- #60 Yoke 587.35 (slug=ujoint-yoke-587-35-13-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-060', 'ujoint-yoke-587-35-13-2', 'Yoke 587.35', '万向节叉 587.35', 'Вилка 587.35', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.35 by ZHANWANG. Bore Φ57xL144, flange 94mm, H=100mm. Customization available.', '万向节叉 587.35（瞻程生产）。轴孔径Φ57xL144，法兰94mm，总高100mm。可定制。', 'Шарнирная Вилка 587.35 от ZHANWANG. Сверловка Φ57xL144, фланец 94мм. Возможность кастомизации.', {'系列': '587.35', '轴孔径mm': 57, '总长mm': 144, '法兰mm': 94, '总高mm': 100, '图册页': 'P18', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-35-13-2');

-- #61 Yoke 587.35 (slug=ujoint-yoke-587-35-14-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-061', 'ujoint-yoke-587-35-14-2', 'Yoke 587.35', '万向节叉 587.35', 'Вилка 587.35', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.35 by ZHANWANG. Bore Φ57xL144, flange 88mm, H=103mm. Customization available.', '万向节叉 587.35（瞻程生产）。轴孔径Φ57xL144，法兰88mm，总高103mm。可定制。', 'Шарнирная Вилка 587.35 от ZHANWANG. Сверловка Φ57xL144, фланец 88мм. Возможность кастомизации.', {'系列': '587.35', '轴孔径mm': 57, '总长mm': 144, '法兰mm': 88, '总高mm': 103, '图册页': 'P18', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-35-14-2');

-- #62 Yoke 587.35 (slug=ujoint-yoke-587-35-15-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-062', 'ujoint-yoke-587-35-15-2', 'Yoke 587.35', '万向节叉 587.35', 'Вилка 587.35', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.35 by ZHANWANG. Bore Φ57xL144, flange 101mm, H=100mm. Customization available.', '万向节叉 587.35（瞻程生产）。轴孔径Φ57xL144，法兰101mm，总高100mm。可定制。', 'Шарнирная Вилка 587.35 от ZHANWANG. Сверловка Φ57xL144, фланец 101мм. Возможность кастомизации.', {'系列': '587.35', '轴孔径mm': 57, '总长mm': 144, '法兰mm': 101, '总高mm': 100, '图册页': 'P18', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-35-15-2');

-- #63 Yoke 587.35 (slug=ujoint-yoke-587-35-16-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-063', 'ujoint-yoke-587-35-16-2', 'Yoke 587.35', '万向节叉 587.35', 'Вилка 587.35', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.35 by ZHANWANG. Bore Φ57xL144, flange 108mm, H=103mm. Customization available.', '万向节叉 587.35（瞻程生产）。轴孔径Φ57xL144，法兰108mm，总高103mm。可定制。', 'Шарнирная Вилка 587.35 от ZHANWANG. Сверловка Φ57xL144, фланец 108мм. Возможность кастомизации.', {'系列': '587.35', '轴孔径mm': 57, '总长mm': 144, '法兰mm': 108, '总高mm': 103, '图册页': 'P18', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-35-16-2');

-- #64 Yoke 587.35 (slug=ujoint-yoke-587-35-17-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-064', 'ujoint-yoke-587-35-17-2', 'Yoke 587.35', '万向节叉 587.35', 'Вилка 587.35', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.35 by ZHANWANG. Bore Φ57xL144, flange 112mm, H=103mm. Customization available.', '万向节叉 587.35（瞻程生产）。轴孔径Φ57xL144，法兰112mm，总高103mm。可定制。', 'Шарнирная Вилка 587.35 от ZHANWANG. Сверловка Φ57xL144, фланец 112мм. Возможность кастомизации.', {'系列': '587.35', '轴孔径mm': 57, '总长mm': 144, '法兰mm': 112, '总高mm': 103, '图册页': 'P18', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-35-17-2');

-- #65 Yoke 587.35 (slug=ujoint-yoke-587-35-18-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-065', 'ujoint-yoke-587-35-18-2', 'Yoke 587.35', '万向节叉 587.35', 'Вилка 587.35', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.35 by ZHANWANG. Bore Φ57xL144, flange 98mm, H=103mm. Customization available.', '万向节叉 587.35（瞻程生产）。轴孔径Φ57xL144，法兰98mm，总高103mm。可定制。', 'Шарнирная Вилка 587.35 от ZHANWANG. Сверловка Φ57xL144, фланец 98мм. Возможность кастомизации.', {'系列': '587.35', '轴孔径mm': 57, '总长mm': 144, '法兰mm': 98, '总高mm': 103, '图册页': 'P18', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-35-18-2');

-- #66 Yoke 587.35 (slug=ujoint-yoke-587-35-19-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-066', 'ujoint-yoke-587-35-19-2', 'Yoke 587.35', '万向节叉 587.35', 'Вилка 587.35', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.35 by ZHANWANG. Bore Φ57xL144, flange 94mm, H=88mm. Customization available.', '万向节叉 587.35（瞻程生产）。轴孔径Φ57xL144，法兰94mm，总高88mm。可定制。', 'Шарнирная Вилка 587.35 от ZHANWANG. Сверловка Φ57xL144, фланец 94мм. Возможность кастомизации.', {'系列': '587.35', '轴孔径mm': 57, '总长mm': 144, '法兰mm': 94, '总高mm': 88, '图册页': 'P19', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-35-19-2');

-- #67 Yoke 587.35 (slug=ujoint-yoke-587-35-20-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-067', 'ujoint-yoke-587-35-20-2', 'Yoke 587.35', '万向节叉 587.35', 'Вилка 587.35', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 587.35 by ZHANWANG. Bore Φ57xL144, flange 105mm, H=103mm. Customization available.', '万向节叉 587.35（瞻程生产）。轴孔径Φ57xL144，法兰105mm，总高103mm。可定制。', 'Шарнирная Вилка 587.35 от ZHANWANG. Сверловка Φ57xL144, фланец 105мм. Возможность кастомизации.', {'系列': '587.35', '轴孔径mm': 57, '总长mm': 144, '法兰mm': 105, '总高mm': 103, '图册页': 'P19', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-587-35-20-2');

-- #68 Yoke 687.55 (slug=ujoint-yoke-687-55-21)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-068', 'ujoint-yoke-687-55-21', 'Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 687.55 by ZHANWANG. Bore Φ57xL152, flange 108mm, H=90mm. Customization available.', '万向节叉 687.55（瞻程生产）。轴孔径Φ57xL152，法兰108mm，总高90mm。可定制。', 'Шарнирная Вилка 687.55 от ZHANWANG. Сверловка Φ57xL152, фланец 108мм. Возможность кастомизации.', {'系列': '687.55', '轴孔径mm': 57, '总长mm': 152, '法兰mm': 108, '总高mm': 90, '图册页': 'P19', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-687-55-21');

-- #69 Yoke 687.55 (slug=ujoint-yoke-687-55-22-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-069', 'ujoint-yoke-687-55-22-2', 'Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 687.55 by ZHANWANG. Bore Φ57xL152, flange 98mm, H=95mm. Customization available.', '万向节叉 687.55（瞻程生产）。轴孔径Φ57xL152，法兰98mm，总高95mm。可定制。', 'Шарнирная Вилка 687.55 от ZHANWANG. Сверловка Φ57xL152, фланец 98мм. Возможность кастомизации.', {'系列': '687.55', '轴孔径mm': 57, '总长mm': 152, '法兰mm': 98, '总高mm': 95, '图册页': 'P19', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-687-55-22-2');

-- #70 Yoke 687.55 (slug=ujoint-yoke-687-55-23-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-070', 'ujoint-yoke-687-55-23-2', 'Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 687.55 by ZHANWANG. Bore Φ57xL152, flange 98mm, H=95mm. Customization available.', '万向节叉 687.55（瞻程生产）。轴孔径Φ57xL152，法兰98mm，总高95mm。可定制。', 'Шарнирная Вилка 687.55 от ZHANWANG. Сверловка Φ57xL152, фланец 98мм. Возможность кастомизации.', {'系列': '687.55', '轴孔径mm': 57, '总长mm': 152, '法兰mm': 98, '总高mm': 95, '图册页': 'P19', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-687-55-23-2');

-- #71 Yoke 687.55 (slug=ujoint-yoke-687-55-24-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-071', 'ujoint-yoke-687-55-24-2', 'Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 687.55 by ZHANWANG. Bore Φ57xL152, flange 98mm, H=103mm. Customization available.', '万向节叉 687.55（瞻程生产）。轴孔径Φ57xL152，法兰98mm，总高103mm。可定制。', 'Шарнирная Вилка 687.55 от ZHANWANG. Сверловка Φ57xL152, фланец 98мм. Возможность кастомизации.', {'系列': '687.55', '轴孔径mm': 57, '总长mm': 152, '法兰mm': 98, '总高mm': 103, '图册页': 'P19', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-687-55-24-2');

-- #72 Yoke 687.55 (slug=ujoint-yoke-687-55-25-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-072', 'ujoint-yoke-687-55-25-2', 'Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 687.55 by ZHANWANG. Bore Φ57xL152, flange 105mm, H=103mm. Customization available.', '万向节叉 687.55（瞻程生产）。轴孔径Φ57xL152，法兰105mm，总高103mm。可定制。', 'Шарнирная Вилка 687.55 от ZHANWANG. Сверловка Φ57xL152, фланец 105мм. Возможность кастомизации.', {'系列': '687.55', '轴孔径mm': 57, '总长mm': 152, '法兰mm': 105, '总高mm': 103, '图册页': 'P19', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-687-55-25-2');

-- #73 Yoke 687.55 (slug=ujoint-yoke-687-55-26-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-073', 'ujoint-yoke-687-55-26-2', 'Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 687.55 by ZHANWANG. Bore Φ57xL152, flange 108mm, H=103mm. Customization available.', '万向节叉 687.55（瞻程生产）。轴孔径Φ57xL152，法兰108mm，总高103mm。可定制。', 'Шарнирная Вилка 687.55 от ZHANWANG. Сверловка Φ57xL152, фланец 108мм. Возможность кастомизации.', {'系列': '687.55', '轴孔径mm': 57, '总长mm': 152, '法兰mm': 108, '总高mm': 103, '图册页': 'P19', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-687-55-26-2');

-- #74 Yoke 687.55 (slug=ujoint-yoke-687-55-27-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-074', 'ujoint-yoke-687-55-27-2', 'Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 687.55 by ZHANWANG. Bore Φ57xL152, flange 101mm, H=103mm. Customization available.', '万向节叉 687.55（瞻程生产）。轴孔径Φ57xL152，法兰101mm，总高103mm。可定制。', 'Шарнирная Вилка 687.55 от ZHANWANG. Сверловка Φ57xL152, фланец 101мм. Возможность кастомизации.', {'系列': '687.55', '轴孔径mm': 57, '总长mm': 152, '法兰mm': 101, '总高mm': 103, '图册页': 'P19', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-687-55-27-2');

-- #75 Yoke 687.55 (slug=ujoint-yoke-687-55-28)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-075', 'ujoint-yoke-687-55-28', 'Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 687.55 by ZHANWANG. Bore Φ57xL152, flange 108mm, H=103mm. Customization available.', '万向节叉 687.55（瞻程生产）。轴孔径Φ57xL152，法兰108mm，总高103mm。可定制。', 'Шарнирная Вилка 687.55 от ZHANWANG. Сверловка Φ57xL152, фланец 108мм. Возможность кастомизации.', {'系列': '687.55', '轴孔径mm': 57, '总长mm': 152, '法兰mm': 108, '总高mm': 103, '图册页': 'P19', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-687-55-28');

-- #76 Yoke 687.55 (slug=ujoint-yoke-687-55-29)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-076', 'ujoint-yoke-687-55-29', 'Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 687.55 by ZHANWANG. Bore Φ57xL152, flange 110mm, H=95mm. Customization available.', '万向节叉 687.55（瞻程生产）。轴孔径Φ57xL152，法兰110mm，总高95mm。可定制。', 'Шарнирная Вилка 687.55 от ZHANWANG. Сверловка Φ57xL152, фланец 110мм. Возможность кастомизации.', {'系列': '687.55', '轴孔径mm': 57, '总长mm': 152, '法兰mm': 110, '总高mm': 95, '图册页': 'P19', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-687-55-29');

-- #77 Yoke 687.55 (slug=ujoint-yoke-687-55-30)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-077', 'ujoint-yoke-687-55-30', 'Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 687.55 by ZHANWANG. Bore Φ57xL152, flange 108mm, H=107mm. Customization available.', '万向节叉 687.55（瞻程生产）。轴孔径Φ57xL152，法兰108mm，总高107mm。可定制。', 'Шарнирная Вилка 687.55 от ZHANWANG. Сверловка Φ57xL152, фланец 108мм. Возможность кастомизации.', {'系列': '687.55', '轴孔径mm': 57, '总长mm': 152, '法兰mm': 108, '总高mm': 107, '图册页': 'P19', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-687-55-30');

-- #78 Yoke 687.55 (slug=ujoint-yoke-687-55-31)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-078', 'ujoint-yoke-687-55-31', 'Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 687.55 by ZHANWANG. Bore Φ57xL152, flange 106mm, H=100mm. Customization available.', '万向节叉 687.55（瞻程生产）。轴孔径Φ57xL152，法兰106mm，总高100mm。可定制。', 'Шарнирная Вилка 687.55 от ZHANWANG. Сверловка Φ57xL152, фланец 106мм. Возможность кастомизации.', {'系列': '687.55', '轴孔径mm': 57, '总长mm': 152, '法兰mm': 106, '总高mm': 100, '图册页': 'P19', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-687-55-31');

-- #79 Yoke 687.55 (slug=ujoint-yoke-687-55-32)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-079', 'ujoint-yoke-687-55-32', 'Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 687.55 by ZHANWANG. Bore Φ57xL152, flange 92mm, H=100mm. Customization available.', '万向节叉 687.55（瞻程生产）。轴孔径Φ57xL152，法兰92mm，总高100mm。可定制。', 'Шарнирная Вилка 687.55 от ZHANWANG. Сверловка Φ57xL152, фланец 92мм. Возможность кастомизации.', {'系列': '687.55', '轴孔径mm': 57, '总长mm': 152, '法兰mm': 92, '总高mm': 100, '图册页': 'P19', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-687-55-32');

-- #80 Yoke 687.55 (slug=ujoint-yoke-687-55-33)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-080', 'ujoint-yoke-687-55-33', 'Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 687.55 by ZHANWANG. Bore Φ57xL152, flange 108mm, H=103mm. Customization available.', '万向节叉 687.55（瞻程生产）。轴孔径Φ57xL152，法兰108mm，总高103mm。可定制。', 'Шарнирная Вилка 687.55 от ZHANWANG. Сверловка Φ57xL152, фланец 108мм. Возможность кастомизации.', {'系列': '687.55', '轴孔径mm': 57, '总长mm': 152, '法兰mm': 108, '总高mm': 103, '图册页': 'P19', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-687-55-33');

-- #81 Yoke YC64152 (slug=ujoint-yoke-yc64152-34)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-081', 'ujoint-yoke-yc64152-34', 'Yoke YC64152', '万向节叉 YC64152', 'Вилка YC64152', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke YC64152 by ZHANWANG. Bore Φ63.5xL152, flange 108mm, H=116mm. Customization available.', '万向节叉 YC64152（瞻程生产）。轴孔径Φ63.5xL152，法兰108mm，总高116mm。可定制。', 'Шарнирная Вилка YC64152 от ZHANWANG. Сверловка Φ63.5xL152, фланец 108мм. Возможность кастомизации.', {'系列': 'YC64152', '轴孔径mm': 63.5, '总长mm': 152, '法兰mm': 108, '总高mm': 116, '图册页': 'P19', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-yc64152-34');

-- #82 Yoke YC64152 (slug=ujoint-yoke-yc64152-35)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-082', 'ujoint-yoke-yc64152-35', 'Yoke YC64152', '万向节叉 YC64152', 'Вилка YC64152', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke YC64152 by ZHANWANG. Bore Φ63.5xL152, flange 108mm, H=103mm. Customization available.', '万向节叉 YC64152（瞻程生产）。轴孔径Φ63.5xL152，法兰108mm，总高103mm。可定制。', 'Шарнирная Вилка YC64152 от ZHANWANG. Сверловка Φ63.5xL152, фланец 108мм. Возможность кастомизации.', {'系列': 'YC64152', '轴孔径mm': 63.5, '总长mm': 152, '法兰mm': 108, '总高mm': 103, '图册页': 'P19', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-yc64152-35');

-- #83 Yoke YC64152 (slug=ujoint-yoke-yc64152-36)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-083', 'ujoint-yoke-yc64152-36', 'Yoke YC64152', '万向节叉 YC64152', 'Вилка YC64152', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke YC64152 by ZHANWANG. Bore Φ63.5xL152, flange 110mm, H=95mm. Customization available.', '万向节叉 YC64152（瞻程生产）。轴孔径Φ63.5xL152，法兰110mm，总高95mm。可定制。', 'Шарнирная Вилка YC64152 от ZHANWANG. Сверловка Φ63.5xL152, фланец 110мм. Возможность кастомизации.', {'系列': 'YC64152', '轴孔径mm': 63.5, '总长mm': 152, '法兰mm': 110, '总高mm': 95, '图册页': 'P19', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-yc64152-36');

-- #84 Yoke 385.60 (slug=ujoint-yoke-385-60-1-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-084', 'ujoint-yoke-385-60-1-2', 'Yoke 385.60', '万向节叉 385.60', 'Вилка 385.60', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 385.60 by ZHANWANG. Bore Φ68xL89, flange 128mm, H=105mm. Customization available.', '万向节叉 385.60（瞻程生产）。轴孔径Φ68xL89，法兰128mm，总高105mm。可定制。', 'Шарнирная Вилка 385.60 от ZHANWANG. Сверловка Φ68xL89, фланец 128мм. Возможность кастомизации.', {'系列': '385.60', '轴孔径mm': 68, '总长mm': 89, '法兰mm': 128, '总高mm': 105, '图册页': 'P20', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-385-60-1-2');

-- #85 Yoke 385.60 (slug=ujoint-yoke-385-60-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-085', 'ujoint-yoke-385-60-2', 'Yoke 385.60', '万向节叉 385.60', 'Вилка 385.60', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 385.60 by ZHANWANG. Bore Φ68xL89, flange 130mm, H=105mm. Customization available.', '万向节叉 385.60（瞻程生产）。轴孔径Φ68xL89，法兰130mm，总高105mm。可定制。', 'Шарнирная Вилка 385.60 от ZHANWANG. Сверловка Φ68xL89, фланец 130мм. Возможность кастомизации.', {'系列': '385.60', '轴孔径mm': 68, '总长mm': 89, '法兰mm': 130, '总高mm': 105, '图册页': 'P20', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-385-60-2');

-- #86 Yoke 385.60 (slug=ujoint-yoke-385-60-3)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-086', 'ujoint-yoke-385-60-3', 'Yoke 385.60', '万向节叉 385.60', 'Вилка 385.60', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 385.60 by ZHANWANG. Bore Φ68xL89, flange 103mm, H=105mm. Customization available.', '万向节叉 385.60（瞻程生产）。轴孔径Φ68xL89，法兰103mm，总高105mm。可定制。', 'Шарнирная Вилка 385.60 от ZHANWANG. Сверловка Φ68xL89, фланец 103мм. Возможность кастомизации.', {'系列': '385.60', '轴孔径mm': 68, '总长mm': 89, '法兰mm': 103, '总高mm': 105, '图册页': 'P20', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-385-60-3');

-- #87 Yoke 385.68 (slug=ujoint-yoke-385-68-4)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-087', 'ujoint-yoke-385-68-4', 'Yoke 385.68', '万向节叉 385.68', 'Вилка 385.68', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 385.68 by ZHANWANG. Bore Φ68xL117, flange 136mm, H=140mm. Customization available.', '万向节叉 385.68（瞻程生产）。轴孔径Φ68xL117，法兰136mm，总高140mm。可定制。', 'Шарнирная Вилка 385.68 от ZHANWANG. Сверловка Φ68xL117, фланец 136мм. Возможность кастомизации.', {'系列': '385.68', '轴孔径mm': 68, '总长mm': 117, '法兰mm': 136, '总高mm': 140, '图册页': 'P20', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-385-68-4');

-- #88 Yoke 1810 (slug=ujoint-yoke-1810-1-2)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-088', 'ujoint-yoke-1810-1-2', 'Yoke 1810', '万向节叉 1810', 'Вилка 1810', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 1810 by ZHANWANG. Bore Φ49.2xL191.9, flange 101.5mm, H=86mm. Customization available.', '万向节叉 1810（瞻程生产）。轴孔径Φ49.2xL191.9，法兰101.5mm，总高86mm。可定制。', 'Шарнирная Вилка 1810 от ZHANWANG. Сверловка Φ49.2xL191.9, фланец 101.5мм. Возможность кастомизации.', {'系列': '1810', '轴孔径mm': 49.2, '总长mm': 191.9, '法兰mm': 101.5, '总高mm': 86, '图册页': 'P21', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-1810-1-2');

-- #89 Yoke 1810 (slug=ujoint-yoke-1810-1-3)
INSERT INTO products (sku, slug, name_en, name_zh, name_ru, brand, category, description_en, description_zh, description_ru, specs, status, created_at, updated_at)
SELECT 'DD-UV-089', 'ujoint-yoke-1810-1-3', 'Yoke 1810', '万向节叉 1810', 'Вилка 1810', 'ZHANWANG/德达', 'drivetrain',
  'Universal Joint Yoke 1810 by ZHANWANG. Bore Φ49.2xL191.9, flange 107.7mm, H=86mm. Customization available.', '万向节叉 1810（瞻程生产）。轴孔径Φ49.2xL191.9，法兰107.7mm，总高86mm。可定制。', 'Шарнирная Вилка 1810 от ZHANWANG. Сверловка Φ49.2xL191.9, фланец 107.7мм. Возможность кастомизации.', {'系列': '1810', '轴孔径mm': 49.2, '总长mm': 191.9, '法兰mm': 107.7, '总高mm': 86, '图册页': 'P21', '厂商': 'ZHANWANG/瞻程', '说明': '可定制 (customization is acceptable)'}::jsonb, 'published', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = 'ujoint-yoke-1810-1-3');
