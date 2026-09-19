#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""第五批：油品系列 12（畅威）+ 角斗士胶 8 + 赛福特养护 8 = 28 款。

价格不入库（询价模式）；OCR 疑点照录并披露；幂等：按 slug 去重。
SKU 段：DD-LUB-101~112（新段）、DD-ADH-124~131、DD-CHM-118~125。
附带：畅威 3 款润滑脂从 chemical 归位到新分类 oil（幂等 UPDATE）。
"""

PRODUCTS = [
    # ===== 畅威油品（新分类 oil） =====
    ("changwei-heavy-duty-gear-oil", "DD-LUB-101",
     "Changwei Heavy-Duty Gear Oil", "畅威重负荷齿轮油", "畅威", "oil",
     {"类型": "重负荷齿轮油", "粘度级别": "SAE 80W-90 / 85W-90 / 85W-140",
      "特点": "10万公里长换油周期、进口加氢基础油、无增粘剂超高粘度指数、高承载抗擦伤抗点蚀",
      "包装规格": "3.5L×6；4L×6；16L×1；18L×1；170kg×1"},
     "畅威重负荷齿轮油：采用进口加氢基础油，无增粘剂即达超高粘度指数；高承载、抗擦伤、抗点蚀、抗冲击，长寿命强抗磨，10 万公里换油周期。",
     "Changwei heavy-duty gear oil on imported hydrogenated base stocks: very high viscosity index without VI improvers; high load-carrying, anti-scuffing and anti-pitting; up to 100,000 km drain intervals. SAE 80W-90 / 85W-90 / 85W-140."),
    ("changwei-hydraulic-oil", "DD-LUB-102",
     "Changwei Hydraulic Oil", "畅威液压油", "畅威", "oil",
     {"类型": "抗磨液压油", "粘度级别": "HM32 / HM46 / HM68 / HM100 / HM150",
      "特点": "高清洁、超高压、高抗磨", "适用": "工程机械、挖掘机、混凝土输送",
      "包装规格": "16L×1；170kg×（原文截断）"},
     "畅威液压油：高清洁度、超高压、高抗磨配方。适用于工程机械、挖掘机、混凝土输送等液压系统。牌号 HM32~HM150。注：原资料一处包装规格截断（照录）。",
     "Changwei anti-wear hydraulic oil: high cleanliness, ultra-high pressure, high anti-wear. For construction machinery, excavators and concrete-pumping hydraulic systems. HM32-HM150. (One pack size truncated in source.)"),
    ("changwei-torque-converter-oil", "DD-LUB-103",
     "Changwei Torque Converter Oil", "畅威液力传动油", "畅威", "oil",
     {"类型": "液力传动油", "牌号": "6# / 8# / 10#",
      "特点": "长寿命、高传动效率、抗氧化", "适用": "方向机、液力设备",
      "包装规格": "16L×1；170kg×1"},
     "畅威液力传动油：长寿命、高传动效率、抗氧化配方，适用于方向机及各类液力设备。牌号 6# / 8# / 10#。",
     "Changwei torque converter oil: long life, high transmission efficiency, oxidation resistant; for power steering and hydraulic torque equipment. Grades 6# / 8# / 10#."),
    ("changwei-8-torque-converter-oil", "DD-LUB-104",
     "Changwei 8# Torque Converter Oil", "畅威 8# 液力传动油", "畅威", "oil",
     {"类型": "液力传动油（方向机助力泵专用）", "牌号": "8#",
      "特点": "方向机助力泵专用配方", "包装规格": "1.8L×12"},
     "畅威 8# 液力传动油（方向机助力泵专用）：适用于方向机助力泵系统（原资料语句较乱，按可辨识内容整理）。",
     "Changwei 8# torque converter oil dedicated for power steering pumps. 1.8 L×12."),
    ("changwei-power-steering-oil", "DD-LUB-105",
     "Power Steering Pump Oil", "方向机助力泵专用油", "畅威", "oil",
     {"类型": "助力转向油", "特点": "转向顺滑、低温流动性好",
      "包装规格": "1.8L×12；3.6L×6"},
     "方向机助力泵专用油：使转向更顺滑，低温流动性好。注：原卡片未标品牌，按目录主品牌畅威录入。",
     "Dedicated power steering pump oil for smooth steering and good cold fluidity. (Brand unmarked on card; recorded as Changwei per catalog.) 1.8 L or 3.6 L packs."),
    ("changwei-ck4-synthetic-oil-10w-40", "DD-LUB-106",
     "Changwei CK-4 Full Synthetic Engine Oil", "畅威 CK-4 全合成机油", "畅威", "oil",
     {"类型": "全合成柴油机油", "级别": "API CK-4", "粘度": "SAE 10W-40",
      "特点": "20万公里长换油周期", "包装规格": "4L×4；18L×1"},
     "畅威 CK-4 全合成机油（10W-40）：高品质全合成配方，长效 20 万公里换油周期。注：原资料一句应用描述严重乱码，未录入。",
     "Changwei CK-4 full synthetic diesel engine oil (SAE 10W-40): premium full-synthetic formulation with up to 200,000 km drain interval. (One garbled usage sentence in source omitted.)"),
    ("changwei-ck4-diesel-oil-10w-40", "DD-LUB-107",
     "Changwei CK-4 Diesel Engine Oil 10W-40", "畅威柴油机油 CK-4 10W-40", "畅威", "oil",
     {"类型": "柴油机油", "级别": "API CK-4", "粘度": "SAE 10W-40",
      "特点": "国六 Low SAPS（低硫酸盐灰分/磷/硫）配方", "包装规格": "18L×1"},
     "畅威柴油机油 CK-4（10W-40）：国六排放阶段 Low SAPS 配方，适配加装 DPF/SCR 后处理系统的柴油机。",
     "Changwei CK-4 diesel engine oil (SAE 10W-40): Low SAPS formulation for China-VI engines with DPF/SCR aftertreatment. 18 L pack."),
    ("changwei-ck4-diesel-oil-15w-40", "DD-LUB-108",
     "Changwei CK-4 Diesel Engine Oil 15W-40", "畅威柴油机油 CK-4 15W-40", "畅威", "oil",
     {"类型": "柴油机油", "级别": "API CK-4", "粘度": "SAE 15W-40",
      "特点": "长寿命智能润滑", "包装规格": "18L×1"},
     "畅威柴油机油 CK-4（15W-40）：长寿命智能润滑配方，适用于重负荷柴油机长效养护。",
     "Changwei CK-4 diesel engine oil (SAE 15W-40): long-life smart lubrication for heavy-duty diesel engines. 18 L pack."),
    ("changwei-ci4-heavy-duty-diesel-oil", "DD-LUB-109",
     "Changwei CI-4 Heavy-Duty Diesel Oil", "畅威 CI-4 重负荷柴油机油", "畅威", "oil",
     {"类型": "重负荷柴油机油", "级别": "API CI-4", "粘度": "SAE 15W-40 / 20W-50",
      "包装规格": "4L×6；18L×1"},
     "畅威 CI-4 重负荷柴油机油（15W-40 / 20W-50）：高碱值储备、抗氧化抗磨损，适用于重负荷、高速长途运输柴油机。",
     "Changwei CI-4 heavy-duty diesel engine oil (SAE 15W-40 / 20W-50): high TBN reserve, anti-oxidation and anti-wear for heavy-duty long-haul diesels."),
    ("changwei-ch4-heavy-duty-diesel-oil", "DD-LUB-110",
     "Changwei CH-4 Heavy-Duty Diesel Oil", "畅威 CH-4 重负荷柴油机油", "畅威", "oil",
     {"类型": "重负荷柴油机油", "级别": "API CH-4", "粘度": "SAE 15W-40 / 20W-50",
      "包装规格": "4L×6；18L×1"},
     "畅威 CH-4 重负荷柴油机油（15W-40 / 20W-50）：适用于重载货车、工程机械柴油机日常养护。",
     "Changwei CH-4 heavy-duty diesel engine oil (SAE 15W-40 / 20W-50): for heavy trucks and construction machinery diesel engines."),
    ("changwei-cf4-diesel-oil", "DD-LUB-111",
     "Changwei CF-4 Diesel Oil", "畅威 CF-4 柴油机油", "畅威", "oil",
     {"类型": "柴油机油", "级别": "API CF-4", "粘度": "SAE 15W-40 / 20W-50",
      "包装规格": "4L×6；18×1（原文如此，疑为18L×1）"},
     "畅威 CF-4 柴油机油（15W-40 / 20W-50）：经济型重负荷柴油机油。注：原资料一处包装\"18×1\"疑为\"18L×1\"，照录。",
     "Changwei CF-4 diesel engine oil (SAE 15W-40 / 20W-50): cost-effective heavy-duty diesel engine oil. (One pack size \"18×1\" recorded verbatim, likely 18 L.)"),
    ("changwei-gas-engine-oil", "DD-LUB-112",
     "Changwei Gas Engine Oil", "畅威燃气发动机机油", "畅威", "oil",
     {"类型": "燃气发动机机油", "适用燃料": "LNG / CNG / LPG", "粘度": "SAE 15W-40",
      "包装规格": "4L×6；18L×1"},
     "畅威燃气发动机机油（15W-40）：专为 LNG/CNG/LPG 燃气发动机设计，有效控制灰分沉积、防止阀门磨损。",
     "Changwei gas engine oil (SAE 15W-40): designed for LNG/CNG/LPG engines; controls ash deposits and valve wear. 4 L or 18 L packs."),
    # ===== 角斗士胶粘剂（adhesive；目录英文品牌名 Fish Fighter） =====
    ("fish-fighter-586-silicone-sealant", "DD-ADH-124",
     "Fish Fighter 586 Silicone Sealant", "角斗士 586 硅酮密封胶", "角斗士", "adhesive",
     {"类型": "RTV 硅酮免垫密封胶", "特点": "耐高油温、遇油不收缩",
      "包装规格": "55g/盒 100盒/箱"},
     "角斗士 586 硅酮密封胶：耐高油温、遇油不收缩，适用于变速箱、油底壳等油环境结合面免垫密封。",
     "Fish Fighter 586 RTV silicone gasket maker: high oil-temperature resistant, no shrinkage on oil contact; for gearboxes and oil pans. 55 g/tube, 100/box."),
    ("fish-fighter-588-silicone-sealant", "DD-ADH-125",
     "Fish Fighter 588 Silicone Sealant", "角斗士 588 硅酮密封胶", "角斗士", "adhesive",
     {"类型": "RTV 硅酮免垫密封胶", "特点": "耐高温 280℃", "包装规格": "85g/板 80板/箱"},
     "角斗士 588 硅酮密封胶：耐高温 280℃，适用于排气歧管附近等高温部位平面密封。",
     "Fish Fighter 588 RTV silicone gasket maker: heat resistant to 280 ℃; for high-temperature flanges such as exhaust-adjacent joints. 85 g/board, 80/box."),
    ("fish-fighter-589-silicone-sealant", "DD-ADH-126",
     "Fish Fighter 589 Silicone Sealant", "角斗士 589 硅酮密封胶", "角斗士", "adhesive",
     {"类型": "RTV 硅酮免垫密封胶", "特点": "快速固化、与金属颜色一致",
      "包装规格": "55g/盒 100盒/箱；90g/板 80板/箱"},
     "角斗士 589 硅酮密封胶：快速固化，固化后与金属颜色一致，外观整洁；通用平面密封。",
     "Fish Fighter 589 RTV silicone gasket maker: fast curing, metal-matching color for a clean appearance; general flange sealing. 55 g or 90 g."),
    ("fish-fighter-689-silicone-sealant", "DD-ADH-127",
     "Fish Fighter 689 Silicone Sealant", "角斗士 689 硅酮密封胶", "角斗士", "adhesive",
     {"类型": "RTV 硅酮免垫密封胶", "特点": "极佳耐油性、耐老化", "包装规格": "85g/板 80板/箱"},
     "角斗士 689 硅酮密封胶：极佳耐油性与耐老化性能，适用于长期接触油介质的结合面。",
     "Fish Fighter 689 RTV silicone gasket maker: excellent oil resistance and aging stability for oil-wetted flanges. 85 g/board, 80/box."),
    ("fish-fighter-0242-threadlocker", "DD-ADH-128",
     "Fish Fighter 0242 Threadlocker", "角斗士 0242 厌氧螺纹锁固胶", "角斗士", "adhesive",
     {"类型": "厌氧型螺纹锁固胶", "强度": "中强度、低粘度、易拆卸",
      "包装规格": "10g/板 120板/箱"},
     "角斗士 0242 厌氧螺纹锁固胶：中强度、低粘度、易拆卸，适用于常规螺纹防松锁固与密封。",
     "Fish Fighter 0242 anaerobic threadlocker: medium strength, low viscosity, removable; for general thread locking and sealing. 10 g/card, 120/box."),
    ("fish-fighter-0271-threadlocker", "DD-ADH-129",
     "Fish Fighter 0271 Threadlocker", "角斗士 0271 厌氧螺纹锁固胶", "角斗士", "adhesive",
     {"类型": "厌氧型螺纹锁固胶", "强度": "高强度、快速粘接",
      "适用": "原资料标注\"70 以下螺纹锁固\"（照录，疑为 M70 或 M7.0）", "包装规格": "50g/瓶 100瓶/箱"},
     "角斗士 0271 厌氧螺纹锁固胶：高强度、快速粘接，用于永久性螺纹锁固与密封。注：原资料适用范围标注\"70 以下\"（照录，疑为 M70 或 M7.0）。",
     "Fish Fighter 0271 anaerobic threadlocker: high strength, fast bonding for permanent locking. (Source says \"below 70\" threads, recorded verbatim — likely M70 or M7.0.) 50 g/bottle."),
    ("fish-fighter-0510-flange-sealant", "DD-ADH-130",
     "Fish Fighter 0510 Flange Sealant", "角斗士 0510 厌氧平面密封胶", "角斗士", "adhesive",
     {"类型": "厌氧型平面密封胶", "特点": "结合面密封、取代垫片",
      "包装规格": "50g/支 25支/箱"},
     "角斗士 0510 厌氧平面密封胶：用于刚性结合面密封，取代预裁垫片。",
     "Fish Fighter 0510 anaerobic flange sealant: seals rigid mating surfaces, replaces pre-cut gaskets. 50 g/tube, 25/box."),
    ("fish-fighter-0515-flange-sealant", "DD-ADH-131",
     "Fish Fighter 0515 Flange Sealant", "角斗士 0515 厌氧平面密封胶", "角斗士", "adhesive",
     {"类型": "厌氧型平面密封胶", "特点": "固化后柔韧、耐油耐介质、最大填充间隙 0.25mm",
      "包装规格": "50g/支 25支/箱"},
     "角斗士 0515 厌氧平面密封胶：固化后柔韧、耐油耐介质，最大填充间隙 0.25mm，适用于振动位移结合面。",
     "Fish Fighter 0515 anaerobic flange sealant: flexible cure, oil and media resistant, max gap 0.25 mm; for flanges subject to vibration. 50 g/tube, 25/box."),
    # ===== 赛福特养护品（chemical） =====
    ("saifute-parts-cleaner", "DD-CHM-118",
     "Saifute Parts Cleaner", "赛福特零部件清洗剂", "赛福特", "chemical",
     {"类型": "零部件清洗剂", "适用": "化油器内部胶质与沉积物",
      "包装规格": "450ml×24/箱"},
     "赛福特零部件清洗剂：快速清除化油器内部胶质与沉积物（与积碳净为不同用途产品）。",
     "Saifute parts cleaner: quickly removes gum and deposits inside carburetors (a different product from the carbon cleaner). 450 ml×24."),
    ("saifute-cold-start-fluid", "DD-CHM-119",
     "Saifute Cold Start Fluid", "赛福特低温启动液", "赛福特", "chemical",
     {"类型": "低温启动辅助液", "适用": "柴油车严寒启动",
      "包装规格": "450ml×24/箱；300ml×40/箱"},
     "赛福特低温启动液：严寒环境辅助快速启动，降低电瓶与起动机负荷。",
     "Saifute cold start fluid: helps quick cold starts in severe winter, reducing battery and starter load. 450 ml or 300 ml."),
    ("saifute-rust-lubricant", "DD-CHM-120",
     "Saifute Rust Remover & Lubricant", "赛福特多功能除锈润滑剂", "赛福特", "chemical",
     {"类型": "除锈润滑剂", "特点": "渗透松锈 + 润滑防锈",
      "包装规格": "270ml×24/箱"},
     "赛福特多功能除锈润滑剂：渗透松解锈蚀件并长效润滑防锈（与中配除锈剂为不同品牌产品，270ml 规格）。",
     "Saifute multi-purpose rust remover and lubricant: penetrates to free rusted parts and leaves long-lasting lubrication (distinct from the Zhongpei 450 ml version). 270 ml×24."),
    ("saifute-diesel-antigel", "DD-CHM-121",
     "Saifute Diesel Antigel", "赛福特柴油防凝剂", "赛福特", "chemical",
     {"类型": "柴油低温流动改进剂", "适用": "降低柴油凝点、防蜡结晶",
      "包装规格": "400ml×24/箱"},
     "赛福特柴油防凝剂：改善柴油低温流动性，防止蜡结晶堵塞油路。",
     "Saifute diesel antigel: improves low-temperature flow of diesel fuel and prevents wax crystallization. 400 ml×24."),
    ("saifute-bolt-loosener", "DD-CHM-122",
     "Saifute Bolt Loosener", "赛福特螺栓松动润滑剂", "赛福特", "chemical",
     {"类型": "渗透松动剂", "适用": "锈死螺栓螺母拆装",
      "包装规格": "450ml×24/箱"},
     "赛福特螺栓松动润滑剂：快速渗透锈蚀螺纹，松动锈死螺栓螺母，兼防锈。",
     "Saifute bolt loosener: fast-penetrating release agent for rusted bolts and nuts, with anti-rust protection. 450 ml×24."),
    ("saifute-long-life-coolant", "DD-CHM-123",
     "Saifute Long-Life Coolant", "赛福特长效冷却液", "赛福特", "chemical",
     {"类型": "长效防冻冷却液", "冰点档位": "15/25/35/45 度（原文无负号，疑为 -15/-25/-35/-45℃，照录）",
      "特点": "使用周期最长四年或二十万公里", "包装规格": "15kg×12；2kg×8；4kg×6；9kg×1；18kg×1"},
     "赛福特长效冷却液：长效配方，使用周期最长四年或二十万公里；冰点档位 15/25/35/45 度（原文无负号，疑为 -15/-25/-35/-45℃，照录）。",
     "Saifute long-life coolant: up to 4 years or 200,000 km service; freeze-point grades 15/25/35/45 as printed (likely -15/-25/-35/-45 ℃, verbatim). Multiple pack sizes 2-18 kg."),
    ("saifute-radiator-stop-leak", "DD-CHM-124",
     "Saifute Radiator Stop Leak", "赛福特水箱止漏剂", "赛福特", "chemical",
     {"类型": "水箱补漏剂", "适用": "水箱/冷却系统微小渗漏",
      "包装规格": "325ml×24/箱"},
     "赛福特水箱止漏剂：快速止住水箱及冷却系统微小渗漏，不堵塞水道（原资料一句乱码未录入）。",
     "Saifute radiator stop leak: quickly seals small leaks in radiators and cooling systems without clogging passages. (One garbled sentence in source omitted.) 325 ml×24."),
    ("saifute-radiator-cleaner", "DD-CHM-125",
     "Saifute Radiator Cleaner", "赛福特水箱清洗剂", "赛福特", "chemical",
     {"类型": "水箱清洗剂", "适用": "清除水箱水垢锈蚀",
      "包装规格": "325ml×24/箱"},
     "赛福特水箱清洗剂：清除水箱及冷却系统水垢、锈蚀沉积，恢复散热效率。",
     "Saifute radiator cleaner: removes scale and rust deposits from radiators, restoring cooling efficiency. 325 ml×24."),
]

# 润滑脂归位：chemical → oil（幂等）
CATEGORY_MOVES = [
    ("UPDATE products SET category = 'oil' WHERE slug IN "
     "('changwei-hep-grease','changwei-hep2-grease','changwei-hp-grease');"),
]


def q(v):
    return "'" + str(v).replace("'", "''") + "'"


def main():
    import json
    assert len(PRODUCTS) == 28, len(PRODUCTS)
    seen = set()
    lines = [
        "-- 第五批：油品 12（畅威）+ 角斗士胶 8 + 赛福特养护 8 = 28 款",
        "-- 来源：供应商目录《油品系列3》《油品系列2/方向机助力泵专用油系列》《胶粘剂系列/养护品系列》（2026-09-19）",
        "-- 价格不入库（询价模式）；OCR 疑点照录并在交付说明披露；幂等：按 slug 去重",
        "-- 附：畅威 3 款润滑脂从 chemical 归位到新分类 oil",
        "",
    ]
    for slug, sku, name_en, name_zh, brand, cat, specs, dz, de in PRODUCTS:
        assert slug not in seen, slug
        seen.add(slug)
        assert brand, slug
        sj = json.dumps(specs, ensure_ascii=False)
        lines.append(
            "INSERT INTO products (slug, sku, name_en, name_zh, brand, truck_model, category, "
            "description_en, description_zh, specs, status) SELECT "
            + ", ".join([q(slug), q(sku), q(name_en), q(name_zh), q(brand), "NULL", q(cat),
                         q(de), q(dz), q(sj) + "::jsonb", q("published")])
            + f" WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = {q(slug)});")
    lines.append("")
    lines.extend(CATEGORY_MOVES)
    lines.append("")
    out = "\n".join(lines)
    path = "/home/fan/.openclaw/workspace/deda-products/scripts/catalog-batch5-oils-adhesives.sql"
    with open(path, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"rows={len(PRODUCTS)} (+{len(CATEGORY_MOVES)} UPDATE) -> {path}")
    print("INSERT 数 =", out.count("INSERT INTO products"))


if __name__ == "__main__":
    main()
