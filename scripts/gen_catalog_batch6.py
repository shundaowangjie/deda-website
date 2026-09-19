#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""第六批：库存主档 6330 行 → 公开目录（价格全剥离）。

决策（2026-09-19，用户批准"导入"）：
- 价格列（销售价1/2/3、销售限价、最新进价、平均进价）物理剥离，不入库
- 内部列（查配件/最低最高库存/体积重量/页码/简码/内部序号/主供应商/是否停用）不导
- 编号 → oem_number & sku（重号不同名加后缀）；名称 → name_zh
- 分类 → 现有 category + 发动机系列 → truck_model（喂机型筛选侧栏）
- brand 统一 '德达'（自有库存件，后续可按需 UPDATE）
- name_en：常见件名前缀映射 + 回退中文名
- 幂等：按 slug 去重；文件内 编号+名称 完全重复行剔除（92 行）
"""
import json
import os
import re
import unicodedata
import openpyxl

XLSX = "/home/fan/.openclaw/workspace/.openclaw/tmp/库存报表---e32ab6bb-6f3b-4fd6-bb92-bc2a2a55b426.XLSX".replace(".XLSX", ".xlsx")
OUT_DIR = "/home/fan/.openclaw/workspace/deda-products/scripts"
BRAND = "德达"

# 分类 → (category, truck_model)
CAT_MAP = {
    "WP10发动机": ("engine-parts", "WP10"), "WP10": ("engine-parts", "WP10"),
    "WP13配件": ("engine-parts", "WP13"), "潍柴H10": ("engine-parts", "潍柴H10"),
    "道依茨": ("engine-parts", "道依茨"), "发动机附件": ("engine-parts", None),
    "发动机附": ("engine-parts", None), "发动机": ("engine-parts", None),
    "皮带": ("engine-parts", None), "WP12": ("engine-parts", "WP12"),
    "WP7发动机": ("engine-parts", "WP7"), "WP8": ("engine-parts", "WP8"),
    "WD615欧II发动机": ("engine-parts", "WD615"), "WD615发动机附件": ("engine-parts", "WD615"),
    "WD615国III(EGR)柴油机": ("engine-parts", "WD615"),
    "WD618发动机": ("engine-parts", "WD618"), "WD618发动机附件": ("engine-parts", "WD618"),
    "重汽曼MC11/13发动机": ("engine-parts", "MC11/MC13"), "重汽曼MC05/07": ("engine-parts", "MC05/MC07"),
    "国四发动机": ("engine-parts", "国四"), "国Ⅲ发动机": ("engine-parts", "国Ⅲ"),
    "国六后处理": ("engine-parts", "国六后处理"), "CNG": ("engine-parts", "CNG"),
    "潍柴后驱力": ("engine-parts", "潍柴后处理"),  # 原文疑为后处理，分类语义照录披露
    "豪沃": ("engine-parts", "豪沃HOWO"), "09款HOWO": ("engine-parts", "HOWO 09款"),
    "斯太尔": ("engine-parts", "斯太尔"), "重汽通用": ("engine-parts", "重汽通用"),
    "工程机械": ("engine-parts", "工程机械"),
    "支撑块": ("engine-parts", None), "油尺": ("engine-parts", None),
    "密封圈": ("engine-parts", None), "胶管": ("engine-parts", None),
    "螺栓": ("fastener", None),
    "驾驶室": ("other", None), "底盘": ("chassis-suspension", None),
    "制动系统": ("brake-system", None), "制动装置": ("brake-system", None),
    "转向装置": ("chassis-suspension", None),
    "后驱动桥": ("drivetrain", None), "后桥部分": ("drivetrain", None),
    "驱动桥": ("drivetrain", None), "前桥部分": ("drivetrain", None),
    "VDO电器仪": ("electrical", None),
}

# 常见件名前缀 → 英文（未命中回退中文名）
EN_PREFIX = [
    ("多挈带", "Poly-V Belt"), ("多锲带", "Poly-V Belt"), ("三角带", "V-Belt"),
    ("皮带轮", "Pulley"), ("支撑块", "Engine Support Block"),
    ("管接头组件", "Pipe Joint Assembly"), ("管接头", "Pipe Joint"),
    ("飞轮", "Flywheel"), ("六角头螺栓", "Hex Head Bolt"),
    ("六角法兰面螺栓", "Hex Flange Bolt"), ("法兰面六角头螺栓", "Hex Flange Bolt"),
    ("双头螺栓", "Stud Bolt"), ("空心螺栓", "Hollow Bolt"), ("内六角螺栓", "Hex Socket Bolt"),
    ("螺栓", "Bolt"), ("螺母", "Nut"), ("垫圈", "Washer"), ("垫片", "Washer"),
    ("水泵总成", "Water Pump Assembly"), ("水泵皮带轮", "Water Pump Pulley"), ("水泵", "Water Pump"),
    ("增压器进油管", "Turbo Oil Feed Pipe"), ("增压器回油管", "Turbo Oil Return Pipe"),
    ("增压器", "Turbocharger"), ("机油尺总成", "Oil Dipstick Assembly"), ("机油尺", "Oil Dipstick"),
    ("密封圈", "Seal Ring"), ("密封垫", "Gasket"), ("缸盖出水管", "Cylinder Head Water Outlet"),
    ("喷油器回油管", "Injector Return Pipe"), ("喷油器", "Injector"),
    ("后排气管", "Rear Exhaust Pipe"), ("排气管", "Exhaust Pipe"),
    ("燃油管", "Fuel Pipe"), ("高压油管", "High Pressure Fuel Pipe"), ("油管", "Oil Pipe"),
    ("发电机支架", "Alternator Bracket"), ("发电机", "Alternator"),
    ("油底壳总成", "Oil Pan Assembly"), ("油底壳垫", "Oil Pan Gasket"), ("油底壳", "Oil Pan"),
    ("水管接头", "Water Pipe Joint"), ("水管卡子", "Water Pipe Clamp"), ("水管", "Water Pipe"),
    ("油气分离器", "Oil-Gas Separator"), ("曲轴止推片", "Crankshaft Thrust Washer"),
    ("曲轴", "Crankshaft"), ("气缸套", "Cylinder Liner"), ("缸套", "Cylinder Liner"),
    ("主轴瓦", "Main Bearing"), ("轴瓦", "Bearing Shell"), ("活塞环", "Piston Ring"),
    ("活塞", "Piston"), ("气门", "Valve"), ("凸轮轴", "Camshaft"),
    ("机油泵", "Oil Pump"), ("喷油泵", "Fuel Injection Pump"),
    ("机油滤", "Oil Filter"), ("柴滤", "Fuel Filter"), ("空滤", "Air Filter"),
    ("节温器", "Thermostat"), ("散热器", "Radiator"), ("中冷器", "Intercooler"),
    ("气缸盖", "Cylinder Head"), ("缸体", "Cylinder Block"), ("进气管", "Intake Pipe"),
    ("涡轮", "Turbine"), ("法兰", "Flange"), ("卡子", "Clamp"), ("接头", "Joint"),
    ("支架", "Bracket"), ("皮带", "Belt"), ("齿轮", "Gear"), ("轴承", "Bearing"),
    ("油封", "Oil Seal"), ("弹簧", "Spring"), ("阀", "Valve"), ("传感器", "Sensor"),
    ("线束", "Wiring Harness"), ("马达", "Motor"), ("起动机", "Starter"),
]

def en_name(zh: str) -> str:
    for k, v in EN_PREFIX:
        if zh.startswith(k):
            return v
    return zh  # 回退中文名（两字段都可被搜索命中）

def slugify(s: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", (s or "").lower()).strip("-")
    return re.sub(r"-{2,}", "-", s)[:70].rstrip("-")

def q(v) -> str:
    return "'" + str(v).replace("'", "''") + "'"

def cell(v) -> str:
    if v is None:
        return ""
    if isinstance(v, float) and v == int(v):
        return str(int(v))
    return str(v).strip()

def main():
    wb = openpyxl.load_workbook(XLSX, read_only=True, data_only=True)
    ws = wb["Sheet1"]
    rows = list(ws.iter_rows(values_only=True))
    header = [str(h) for h in rows[0]]
    idx = {h: i for i, h in enumerate(header)}
    raw = rows[1:]

    seen_keys, seen_slugs, seen_skus = set(), set(), {}
    out_rows, skipped_dup = [], 0
    for r in raw:
        cat_raw = cell(r[idx["分类"]]) or "未分类"
        oem = cell(r[idx["编号"]])
        name = cell(r[idx["名称"]])
        if not name or name == "None":
            continue
        key = (oem, name)
        if key in seen_keys:
            skipped_dup += 1
            continue
        seen_keys.add(key)
        spec = cell(r[idx["规格"]])
        unit = cell(r[idx["单位"]])
        origin = cell(r[idx["产地"]])
        note = cell(r[idx["商品备注"]])
        cat, model = CAT_MAP.get(cat_raw, ("engine-parts", cat_raw))

        name_zh = f"{name} {spec}".strip() if spec else name
        name_en = f"{en_name(name)} {spec}".strip() if spec else en_name(name)
        base = f"deda-inv-{slugify(oem) or slugify(name_zh)}"
        slug = base
        n = 1
        while slug in seen_slugs:
            n += 1
            slug = f"{base}-{n}"
        seen_slugs.add(slug)
        sku = oem or f"DD-INV-{len(out_rows)+1:05d}"
        if sku in seen_skus:
            seen_skus[sku] += 1
            sku = f"{sku}-{seen_skus[sku]}"
        else:
            seen_skus[sku] = 1

        specs = {"编号": oem or None, "规格": spec or None, "单位": unit or None,
                 "产地": origin or None, "备注": note or None, "原分类": cat_raw}
        desc_zh = f"{name_zh}（{cat_raw}）" + (f"，适用{model}。" if model else "。") + "德达自有库存，原厂编号直查，欢迎询价。"
        desc_en = (f"{name_en}" + (f" for {model}" if model else "") +
                   f". DEDA stock item, OEM {oem or 'N/A'}. Inquiry welcome.")
        out_rows.append({
            "slug": slug, "sku": sku, "name_en": name_en, "name_zh": name_zh,
            "brand": BRAND, "oem": oem or None, "model": model, "cat": cat,
            "specs": json.dumps({k: v for k, v in specs.items() if v}, ensure_ascii=False),
            "dz": desc_zh, "de": desc_en,
        })

    # 断言：brand 全非空；无价格键
    assert all(r["brand"] for r in out_rows)
    assert all(("价" not in k and "进价" not in k) for r in out_rows for k in json.loads(r["specs"]))

    def emit(rs):
        lines = []
        for r in rs:
            lines.append(
                "INSERT INTO products (slug, sku, name_en, name_zh, brand, truck_model, category, "
                "description_en, description_zh, specs, status) SELECT "
                + ", ".join([q(r["slug"]), q(r["sku"]), q(r["name_en"]), q(r["name_zh"]), q(r["brand"]),
                             q(r["model"]) if r["model"] else "NULL", q(r["cat"]),
                             q(r["de"]), q(r["dz"]), q(r["specs"]) + "::jsonb", q("published")])
                + f" WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = {q(r['slug'])});")
        return lines

    header_lines = [
        "-- 第六批：库存主档导入（价格已全部剥离）",
        "-- 来源：库存报表.xls（6330 行，44 分类；文件内编号+名称重复剔除）",
        "-- 价格/进价/内部管理列一律不入库（询价模式）；brand=德达（自有库存）",
        "-- 幂等：按 slug 去重。执行：Supabase SQL Editor 分批运行",
        "",
    ]
    total = len(out_rows)
    CHUNK = 1500
    n_chunks = (total + CHUNK - 1) // CHUNK
    for ci in range(n_chunks):
        chunk = out_rows[ci * CHUNK:(ci + 1) * CHUNK]
        path = os.path.join(OUT_DIR, f"catalog-batch6-inventory-{ci+1}of{n_chunks}.sql")
        with open(path, "w", encoding="utf-8") as f:
            f.write("\n".join(header_lines + emit(chunk)) + "\n")
        print(f"→ {os.path.basename(path)}: {len(chunk)} 条")
    master = os.path.join(OUT_DIR, "catalog-batch6-inventory-master.sql")
    with open(master, "w", encoding="utf-8") as f:
        f.write("\n".join(header_lines + emit(out_rows)) + "\n")
    print(f"→ catalog-batch6-inventory-master.sql: {total} 条")
    print(f"合计 {total} 条 | 文件内重复剔除 {skipped_dup} | 分类未映射 {sum(1 for r in out_rows if r['cat'] not in set(c for c,_ in CAT_MAP.values()))}")

if __name__ == "__main__":
    main()
