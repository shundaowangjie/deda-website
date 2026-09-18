#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成胶粘剂系列 7 条产品 SQL（来源：供应商目录《胶粘剂系列3》文本，2026-09-18）。

说明：原文为 OCR 文本，个别语句模糊；描述按可辨识内容整理，
疑点（916 适用范围、右页三款品牌未标）在交付报告中向用户披露。
价格不入库（询价模式）。幂等：按 slug 去重。
"""

PRODUCTS = [
    # (slug, name_zh, name_en, brand, specs, desc_zh, desc_en)
    (
        "huitian-weld-seam-adhesive",
        "钣金焊缝胶",
        "Sheet Metal Weld Seam Adhesive",
        "回天",
        {"类型": "单组分聚氨酯焊缝密封胶", "特点": "高触变、不流淌、低气味", "适用": "焊缝/箱体密封", "包装规格": "310ml/支 × 24支/箱"},
        "回天聚氨酯系列钣金焊缝胶：单组分、高触变、立面及倒立施工不流淌、低气味，便于手工施工。对各种材质有广泛粘附力，可配套防腐蚀护漆，适应冷热变化与动载荷变动。适用于汽车焊缝、车体设备、箱体密封，以及家具机械、化工、建筑、工程机械等材料间的粘接与密封，可填充、防水、防尘。",
        "One-component PU weld seam sealant with high thixotropy — non-sagging on vertical and overhead surfaces, low odor, easy to apply by hand. Strong adhesion to a wide range of materials, compatible with anti-corrosion paint, resistant to thermal cycling and dynamic loads. For automotive weld seams, body equipment and box sealing, also for furniture machinery, chemical, construction and engineering machinery. Fillable, waterproof and dustproof. 310 ml/cartridge, 24/box.",
    ),
    (
        "suerpu-918-windshield-adhesive",
        "苏尔普918风挡玻璃胶",
        "Suerpu 918 Windshield Adhesive",
        "苏尔普",
        {"类型": "单组分湿气固化聚氨酯", "特点": "胶层不易塌陷、支撑力强", "适用": "风挡玻璃与钣金粘接", "包装规格": "310ml/支 × 24支/箱；400ml/包 × 24包/箱"},
        "高强度型风挡玻璃胶：强度高、支撑力强、胶层不易塌陷；耐候、耐震动、耐水、耐化学介质腐蚀，固化速度快。主要用于汽车挡风玻璃与钣金体的粘接，亦可用于铁路客车、集装箱、船舱等高强度玻璃粘接。",
        "High-strength one-component PU windshield adhesive: strong support, non-collapsing glue layer; weather, vibration and water resistant, resistant to chemical media, fast curing. For bonding windshields to cab panels; also for high-strength glass in railway coaches, containers and ship cabins. 310 ml/cartridge or 400 ml/sausage.",
    ),
    (
        "suerpu-919-multipurpose-sealant",
        "苏尔普919多用途聚氨酯密封胶",
        "Suerpu 919 Multi-purpose PU Sealant",
        "苏尔普",
        {"类型": "单组分聚氨酯密封胶", "特点": "流平性好、固化后可打磨", "适用": "焊缝/间隙密封", "包装规格": "310ml/支 × 24支/箱"},
        "多用途聚氨酯密封胶：易施工、流平性好，耐久密封性优良；固化后可打磨、可修饰；耐候、耐高温性较好；高触变、立面涂胶不流淌。适用于汽车、客车、货车、轿车焊缝的密封，亦可用于车辆车顶加强、车体维修及箱体等间隙密封。",
        "Multi-purpose one-component PU sealant: easy to apply with good leveling and durable sealing; sandable and trimmable after cure; weather and heat resistant; non-sagging on vertical surfaces. For seam sealing of automobiles, buses, trucks and cars; also for roof reinforcement, body repair and gap sealing. 310 ml/cartridge, 24/box.",
    ),
    (
        "suerpu-916-windshield-adhesive",
        "苏尔普916风挡玻璃胶",
        "Suerpu 916 Windshield Adhesive",
        "苏尔普",
        {"类型": "单组分湿气固化聚氨酯（经济型）", "特点": "不含溶剂、不流淌", "适用": "侧窗玻璃/钣面粘接", "包装规格": "310ml/支 × 24支/箱；350ml/包 × 24包/箱"},
        "经济型聚氨酯玻璃胶：单组分、不含溶剂、不流淌，湿气固化、操作方便；抗冲击剪切强度高、支撑性能好，涂敷不下垂、玻璃不塌陷。适用于侧窗玻璃及钣材表面直接粘接（原资料注明：不含风挡玻璃工况），亦可用于铁路客车、集装箱、船舱等场合。",
        "Economy one-component PU glass adhesive: solvent-free, non-sagging, moisture-curing and easy to apply; high impact shear strength and good support, no sagging and no glass collapse. For side windows (not for windshield applications per supplier data) and direct bonding to panel surfaces; also for railway coaches, containers and ship cabins. 310 ml/cartridge or 350 ml/sausage.",
    ),
    (
        "lg-31-polymer-liquid-sealant",
        "LG-31 高分子液体密封胶",
        "LG-31 Polymer Liquid Sealant",
        "中配",
        {"类型": "高分子液体密封胶", "特点": "耐高温、耐油、抗振动", "适用": "结合面密封（可拆卸）", "包装规格": "90g/盒 × 100盒/箱"},
        "LG-31 高分子液体密封胶：耐高温、耐油、抗振动，广泛用于汽车、摩托车、机械、仪器设备各种结合面的密封，可拆卸使用。具有优越的耐老化、耐磨性与耐油、耐酸、耐碱介质性能，不腐蚀金属表面。使用：先清除被密封表面油、水、铁锈、灰尘，常温下按顺序均匀连续涂敷。",
        "Polymer liquid sealant with high-temperature and oil resistance and vibration damping; for sealing mating surfaces of automobiles, motorcycles, machinery and instruments, re-openable after service. Excellent anti-aging and abrasion resistance, resistant to oil, acid and alkali media, non-corrosive to metal. Clean off oil, water, rust and dust before applying evenly at room temperature. 90 g/tube, 100/box.",
    ),
    (
        "casting-repair-adhesive",
        "铸工胶",
        "Casting Repair Adhesive",
        "中配",
        {"类型": "双组分环氧修补胶", "配比": "A:B = 1:1", "特点": "韧性好、耐油、耐水、耐酸碱", "适用": "铸件气孔/砂眼/裂纹修补", "包装规格": "100g/盒 × 100盒/箱"},
        "铸件缺陷修补胶：韧性好、耐油性强、耐水性好、耐酸碱、耐腐蚀，固化快、修补能力强。适用于设备、机械、铸件的气孔、砂眼、麻坑、裂纹、断口等铸造缺陷的修补，也可作一般胶粘剂使用。施工：被粘表面干燥无杂质；A、B 组分按 1:1 比例搅匀，涂于铸件修补处；24 小时固化后打磨修整即可。",
        "Two-part epoxy casting repair adhesive (A:B = 1:1): good toughness, oil and water resistance, acid/alkali and corrosion resistance, fast curing with strong repair capability. For repairing porosity, sand holes, pits, cracks and fractures on castings, machinery and equipment; also usable as a general adhesive. Keep the surface dry and clean, mix A:B at 1:1, apply to the defect, then grind and finish after 24 h cure. 100 g/tube, 100/box.",
    ),
    (
        "cylinder-block-repair-agent",
        "缸体修复剂",
        "Cylinder Block Repair Agent",
        "中配",
        {"类型": "双组分环氧修复剂", "配比": "3:1", "特点": "粘接强度高、固化后强度高、耐温性能优", "适用": "缸体渗漏/箱体水箱堵漏", "包装规格": "150g/盒 × 18盒/箱"},
        "发动机缸体修复剂：粘接强度高、固化后强度高、耐温性能优。主要用于汽车缸体外部渗漏的修复，以及各种设备箱体、水箱接缝处的堵漏与管路修补，操作简便、维修方便。施工：先检修缸体并清除缺陷，裂纹处打磨并加工成 V 形沟槽；按 3:1 配比调胶均匀后涂敷，轻敲铸件驱赶气泡、挤匀胶层；常温 24 小时固化（达强度 60–70%），加热至 80℃ 约 2 小时可达最大强度。",
        "High-strength two-part repair agent (mix ratio 3:1) with excellent temperature resistance. For repairing external leaks of engine cylinder blocks, sealing tank and water-tank joints, and pipeline repair. Prepare the defect into a V-groove after grinding, mix at 3:1 and apply evenly, tap lightly to drive out air bubbles; cures in 24 h at room temperature (60–70% strength), or about 2 h at 80 °C for maximum strength. 150 g/tube, 18/box.",
    ),
]

SKU_PREFIX = "DD-ADH"
SKU_START = 101  # 号段已查空


def q(v: str) -> str:
    return "'" + v.replace("'", "''") + "'"


def sv(v) -> str:
    return "NULL" if v is None else q(v)


def main() -> None:
    import json
    lines = [
        "-- 胶粘剂系列（来源：供应商目录《胶粘剂系列3》文本，2026-09-18 收到）",
        "-- 7 款：聚氨酯胶 4（钣金焊缝胶/苏尔普918/919/916）+ 环氧·液体密封胶 3（LG-31/铸工胶/缸体修复剂）",
        "-- 价格不入库（询价模式）；无 OEM 号，SKU 采用 DD-ADH-101~107 生成段",
        "-- 右页三款（LG-31/铸工胶/缸体修复剂）原资料未标品牌，brand 置空待确认",
        "-- 幂等：按 slug 去重。执行环境：Supabase Dashboard → SQL Editor",
        "",
    ]
    seen = set()
    n = 0
    for i, (slug, name_zh, name_en, brand, specs, desc_zh, desc_en) in enumerate(PRODUCTS):
        assert slug not in seen, f"slug 重复: {slug}"
        seen.add(slug)
        sku = f"{SKU_PREFIX}-{SKU_START + i}"
        specs_json = json.dumps(specs, ensure_ascii=False)
        lines.append(
            "INSERT INTO products "
            "(slug, sku, name_en, name_zh, brand, truck_model, category, "
            "description_en, description_zh, specs, status) "
            "SELECT " + ", ".join([
                q(slug), q(sku), q(name_en), q(name_zh), sv(brand), "NULL",
                q("adhesive"), q(desc_en), q(desc_zh),
                q(specs_json) + "::jsonb", q("published"),
            ]) + f" WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = {q(slug)});"
        )
        n += 1
    lines.append("")
    out = "\n".join(lines)
    path = "/home/fan/.openclaw/workspace/deda-products/scripts/adhesive-series-batch.sql"
    with open(path, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"rows={n} slugs={len(seen)} -> {path}")
    # 断言：INSERT 条数 = 数据行数
    assert out.count("INSERT INTO products") == n
    print("断言通过：INSERT 数 =", n)


if __name__ == "__main__":
    main()
