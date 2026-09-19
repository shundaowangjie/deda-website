#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""第四批：空调养护_油品系列 9 款（赛福特 6 + 畅威润滑脂 3）。

价格不入库（询价模式）；OCR 疑点照录并在交付说明披露；幂等：按 slug 去重。
SKU 段：DD-CHM-109~117（昨日批次占用 101~108）。分类：chemical（养护化工）。
"""

PRODUCTS = [
    ("saifute-r134a-refrigerant", "DD-CHM-109",
     "Saifute R134a Refrigerant", "赛福特 R134a 雪种", "赛福特",
     {"类型": "环保制冷剂 R134a", "特点": "汽化潜热大、单位容积制冷量高；无色、不燃、不易爆炸",
      "适用": "各类车型空调系统", "包装规格": "200g×30/箱；250g×30/箱"},
     "赛福特 R134a 环保雪种（车用空调制冷剂）：正规 R134a，汽化潜热大、比容较大、单位容积制冷量高；无色、不燃、不易爆炸。适用于各类车型的空调系统。",
     "Saifute R134a eco-friendly refrigerant (auto A/C): large latent heat of vaporization and high volumetric cooling capacity; colorless, non-flammable, non-explosive. For all vehicle A/C systems. 200 g or 250 g cans."),
    ("saifute-engine-repair-additive", "DD-CHM-110",
     "Saifute Engine Repair Additive", "赛福特发动机修复剂", "赛福特",
     {"类型": "发动机养护修复剂", "特点": "形成保护膜、防止干摩擦、降低油耗、延长发动机寿命",
      "适用": "汽油发动机", "包装规格": "350ml×24/箱"},
     "赛福特发动机修复剂：在摩擦表面形成保护膜，防止干摩擦，降低油耗、减少磨损、延长发动机使用寿命。适用于汽油发动机。",
     "Saifute engine repair additive: forms a protective film on friction surfaces, prevents dry friction, reduces fuel consumption and wear, extends engine life. For gasoline engines. 350 ml/bottle, 24/box."),
    ("saifute-carbon-cleaner", "DD-CHM-111",
     "Saifute Carbon Deposit Cleaner", "赛福特积碳净", "赛福特",
     {"类型": "燃油系统清洗剂", "特点": "3 分钟快速清除积碳",
      "适用": "油路、滤清器、进气门、活塞顶", "包装规格": "350ml×24/箱"},
     "赛福特积碳净：3 分钟快速清除油路、滤清器、进气门、活塞顶积碳，恢复动力、降低油耗。",
     "Saifute carbon deposit cleaner: removes carbon deposits from fuel lines, filters, intake valves and piston tops in about 3 minutes; restores power and lowers fuel consumption. 350 ml/bottle, 24/box."),
    ("saifute-dot3-brake-fluid", "DD-CHM-112",
     "Saifute DOT3 Brake Fluid", "赛福特 DOT3 制动液", "赛福特",
     {"类型": "合成制动液 DOT3", "特点": "低温流动性好、高温不气阻",
      "适用": "汽车液压制动及离合系统", "包装规格": "500g×20/箱；800g×20/箱"},
     "赛福特 DOT3 合成制动液：低温流动性好，高温不产生气阻，制动安全可靠。适用于汽车液压制动及离合系统。",
     "Saifute DOT3 synthetic brake fluid: good cold fluidity, no vapor lock at high temperature. For hydraulic brake and clutch systems. 500 g or 800 g packs."),
    ("saifute-dot4-brake-fluid", "DD-CHM-113",
     "Saifute DOT4 Brake Fluid", "赛福特 DOT4 制动液", "赛福特",
     {"类型": "合成制动液（HZY4/DOT4 级别）", "平衡沸点": "≥265℃",
      "适用": "汽车液压制动及离合系统", "包装规格": "500g×20/箱；1kg×12/箱"},
     "赛福特 DOT4 制动液：HZY4 级别合成制动液，平衡沸点 ≥265℃，高温抗气阻性能优于 DOT3。适用于汽车液压制动及离合系统。",
     "Saifute DOT4 (HZY4) synthetic brake fluid: equilibrium boiling point ≥265 ℃, better vapor-lock resistance than DOT3. For hydraulic brake and clutch systems. 500 g or 1 kg packs."),
    ("saifute-construction-brake-fluid", "DD-CHM-114",
     "Saifute Construction Machinery Brake Fluid", "赛福特工程机械制动液", "赛福特",
     {"类型": "工程机械制动液", "适用": "工程机械液压及机械制动系统（原句部分模糊，按可辨识整理）",
      "包装规格": "4kg×6/箱"},
     "赛福特工程机械制动液：专为工程机械液压及机械制动系统设计（原资料适用语句部分模糊，按可辨识内容整理）。",
     "Saifute brake fluid for construction machinery: designed for hydraulic and mechanical brake systems of construction machinery (usage wording partly illegible in source). 4 kg pack."),
    ("changwei-hep-grease", "DD-CHM-115",
     "Changwei HEP Premium Grease", "畅威 HEP 高档润滑脂", "畅威",
     {"类型": "高档润滑脂", "特点": "高温稳定性好、分油量少（<5.0%）",
      "包装规格": "800g×12/箱；1.8kg×（原文截断）"},
     "畅威 HEP 高档润滑脂：高温稳定性好，分油量少（<5.0%），长期使用不流失、不干涸。注：原资料第二包装规格处截断（照录）。",
     "Changwei HEP premium grease: excellent high-temperature stability, oil separation <5.0%. Note: second pack size truncated in source, recorded verbatim. 800 g/tub, 12/box."),
    ("changwei-hep2-grease", "DD-CHM-116",
     "Changwei HEP-2 Premium Grease", "畅威 HEP-2 高档润滑脂", "畅威",
     {"类型": "高档润滑脂", "滴点": "≥200℃", "特点": "高温稳定性好、重载工况适用",
      "适用": "重载、高速、高温等恶劣工况（原文'存于重载'疑为'用于重载'）", "包装规格": "800g×12/箱；1.8kg×6/箱"},
     "畅威 HEP-2 高档润滑脂：滴点 ≥200℃，高温稳定性好；适用于重载、高速、高温等恶劣工况（原资料'存于重载'疑为'用于重载'，按此整理）。",
     "Changwei HEP-2 premium grease: dropping point ≥200 ℃, excellent high-temperature stability; for heavy-load, high-speed and high-temperature conditions. 800 g or 1.8 kg packs."),
    ("changwei-hp-grease", "DD-CHM-117",
     "Changwei HP Mid-grade Grease", "畅威 HP 中档润滑脂", "畅威",
     {"类型": "中档润滑脂", "特点": "极压抗磨、耐腐蚀、防锈、粘附性好、抗氧化",
      "适用": "较高温度、较高速度、重载荷工况", "包装规格": "800g×12/箱；1.8kg×6/箱"},
     "畅威 HP 中档润滑脂：极压抗磨、耐腐蚀、防锈、粘附性好、抗氧化，适用于较高温度、较高速度、重载荷工况的滚动和滑动轴承。",
     "Changwei HP mid-grade grease: extreme-pressure anti-wear, corrosion and rust resistant, good adhesion and oxidation stability; for rolling and sliding bearings under elevated temperature, speed and heavy load. 800 g or 1.8 kg packs."),
]


def q(v):
    return "'" + str(v).replace("'", "''") + "'"


def main():
    import json
    assert len(PRODUCTS) == 9, len(PRODUCTS)
    seen = set()
    lines = [
        "-- 第四批：空调养护_油品系列 9 款（赛福特 6 + 畅威润滑脂 3）",
        "-- 来源：供应商目录《空调养护_油品》（2026-09-19 收到）",
        "-- 价格不入库（询价模式）；OCR 疑点照录并在交付说明披露；幂等：按 slug 去重",
        "",
    ]
    for slug, sku, name_en, name_zh, brand, specs, dz, de in PRODUCTS:
        assert slug not in seen, slug
        seen.add(slug)
        assert brand, slug  # brand 必填（NOT NULL 教训）
        sj = json.dumps(specs, ensure_ascii=False)
        lines.append(
            "INSERT INTO products (slug, sku, name_en, name_zh, brand, truck_model, category, "
            "description_en, description_zh, specs, status) SELECT "
            + ", ".join([q(slug), q(sku), q(name_en), q(name_zh), q(brand), "NULL", q("chemical"),
                         q(de), q(dz), q(sj) + "::jsonb", q("published")])
            + f" WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = {q(slug)});")
    lines.append("")
    out = "\n".join(lines)
    path = "/home/fan/.openclaw/workspace/deda-products/scripts/catalog-batch4-oil-care.sql"
    with open(path, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"rows={len(PRODUCTS)} -> {path}")
    print("INSERT 数 =", out.count("INSERT INTO products"))


if __name__ == "__main__":
    main()
