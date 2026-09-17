#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""从《德达发动机配件报价表》生成进口发动机件 SQL（9 品牌 × 13 件类 = 117 条，幂等）。

说明：原 Excel 为空白报价模板（无价格、无 OEM 号），
导入的是"供应能力目录"：品牌 × 件类，适用机型写入 specs 与 truck_model。
"""

BRANDS = [
    # (品牌EN, 品牌中文, [机型...])
    ("Cummins", "康明斯", ["6BT 5.9", "6CT", "NT855", "QSL9", "6LTA 9.3", "4BT 4.9"]),
    ("Doosan", "斗山", ["DB58"]),
    ("Mazda", "马自达", ["3500", "4000", "4100", "5000"]),
    ("Deutz", "道依茨", ["FL912", "FL913"]),
    ("Hino", "日野", ["H07D", "J08C"]),
    ("Komatsu", "小松", ["6D105", "6D108", "6D110"]),
    ("Isuzu", "五十铃", ["6BD1T"]),
    ("Caterpillar", "卡特彼勒", ["3306", "C7.1", "3406", "C15", "C13", "3176"]),
    ("Benz", "奔驰", ["OM-442", "OM-446", "OM-402"]),
]

PARTS = [
    # (件类EN, 件类中文, slug 片段)
    ("Piston Ring", "活塞环", "piston-ring"),
    ("Cylinder Liner", "气缸套", "cylinder-liner"),
    ("Piston Pin", "活塞销", "piston-pin"),
    ("Piston", "活塞", "piston"),
    ("Main Bearing", "主轴承（大瓦）", "main-bearing"),
    ("Connecting Rod Bearing / Small Bearing", "连杆轴承（小瓦）", "connecting-rod-bearing"),
    ("Camshaft Bush", "凸轮轴衬套", "camshaft-bush"),
    ("Gasket Set / Overhaul Kit", "密封垫套件／大修包", "gasket-set"),
    ("Connecting Rod Bush", "连杆衬套", "connecting-rod-bush"),
    ("Intake Valve", "进气门", "intake-valve"),
    ("Exhaust Valve", "排气门", "exhaust-valve"),
    ("Valve Seat", "气门座圈", "valve-seat"),
    ("Valve Guide", "气门导管", "valve-guide"),
]


def q(v: str) -> str:
    return "'" + v.replace("'", "''") + "'"


def main() -> None:
    lines = [
        "-- 进口发动机配件供应目录：9 品牌 × 13 件类 = 117 条（来源：德达发动机配件报价表）",
        "-- 原表为空白报价模板（无价格/OEM），导入的是供应目录结构；价格不公开（询价模式）",
        "-- 幂等：按 slug 去重。执行环境：Supabase Dashboard → SQL Editor",
        "",
    ]
    seen = set()
    n = 0
    for brand_en, brand_zh, models in BRANDS:
        models_str = " / ".join(models)
        models_zh = f"{brand_zh} {'/'.join(models)}"
        for part_en, part_zh, part_slug in PARTS:
            slug = f"{brand_en.lower()}-engine-{part_slug}"
            assert slug not in seen, f"slug 重复: {slug}"
            seen.add(slug)
            name_en = f"{part_en} - {brand_en} Engines"
            name_zh = f"{part_zh}（{brand_zh}）"
            specs = {
                "品牌": brand_en,
                "件类": part_zh,
                "适用机型": models_str,
            }
            desc_zh = (
                f"发动机{part_zh}，适用{brand_zh}机型：{models_str}。"
                "原厂/副厂渠道供应，支持询价。"
            )
            desc_en = (
                f"Engine {part_en.lower()} for {brand_en} engines ({models_str}). "
                "OEM & aftermarket supply, inquiry welcome."
            )
            specs_json = (
                "{"
                + ", ".join(f'"{k}": "{v}"' for k, v in specs.items())
                + "}"
            )
            truck_model = f"{brand_zh} {models_str}"
            lines.append(
                "INSERT INTO products "
                "(slug, name_en, name_zh, brand, truck_model, category, "
                "description_en, description_zh, specs, status) "
                "SELECT " + ", ".join([
                    q(slug), q(name_en), q(name_zh), q(brand_en), q(truck_model),
                    q("engine-parts"), q(desc_en), q(desc_zh),
                    q(specs_json) + "::jsonb", q("published"),
                ]) + f" WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = {q(slug)});"
            )
            n += 1
    lines.append("")
    out = "\n".join(lines)
    path = "/home/fan/.openclaw/workspace/deda-products/scripts/engine-parts-batch.sql"
    with open(path, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"rows={n} slugs={len(seen)} -> {path}")
    print(out[:1200])


if __name__ == "__main__":
    main()
