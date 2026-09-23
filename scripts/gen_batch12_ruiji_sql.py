#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""批次F:瑞立产品图册净新增 1776 款 SQL 生成器(读 ruiji-new.json)。

来源:瑞立产品介绍图册.pdf(280页文本层)→ 解析1805卡 → DB比对净新增1776。
品牌"瑞立";oem_number=产品图号(无图号者用老图号/主机号);
truck_model=规格型号;specs含老图号/主机号/参数;SKU段 DD-RL-001~1776;
价格不入库;幂等按slug(图号重复加后缀)。
"""
import json, re

BRAND = "瑞立"
cards = json.load(open('/home/fan/.openclaw/workspace/deda-products/scripts/ruiji-new.json', encoding='utf-8'))

SERIES_CAT = {
    '离合器总泵': 'drivetrain', '离合助力器': 'drivetrain', '压盘片': 'drivetrain', '变速箱': 'drivetrain',
    '制动总阀': 'brake-system', '四回路': 'brake-system', '干燥器': 'brake-system', '前分室': 'brake-system',
    '弹簧缸': 'brake-system', '手阀': 'brake-system', '继动阀': 'brake-system', '挂车阀、感载阀': 'brake-system',
    '快放阀': 'brake-system', '刹车片': 'brake-system', '调整臂': 'brake-system', 'ABS': 'brake-system',
    '冷凝器': 'brake-system', '刹车软管': 'brake-system', '放水阀': 'brake-system',
    '转向泵': 'chassis-suspension', '举升泵、举升缸': 'chassis-suspension', '空气弹簧JS': 'chassis-suspension',
    '高度阀': 'chassis-suspension',
    '皮带涨紧轮': 'engine-parts', '空压机': 'engine-parts', '增压器': 'engine-parts',
    '水泵': 'cooling-system',
    '电器': 'electrical', '电瓶': 'electrical',
    '辅料': 'other', '其它': 'other', '修理包': 'other', '轮毂PD': 'other',
}
SERIES_EN = {
    '离合器总泵': 'Clutch Master Cylinder', '离合助力器': 'Clutch Booster', '压盘片': 'Clutch Cover',
    '变速箱': 'Gearbox', '制动总阀': 'Brake Valve', '四回路': 'Four-circuit Valve', '干燥器': 'Air Dryer',
    '前分室': 'Brake Chamber', '弹簧缸': 'Spring Brake Chamber', '手阀': 'Hand Valve', '继动阀': 'Relay Valve',
    '挂车阀、感载阀': 'Trailer Valve', '快放阀': 'Quick Release Valve', '刹车片': 'Brake Pad',
    '调整臂': 'Slack Adjuster', 'ABS': 'ABS Component', '冷凝器': 'Condenser', '刹车软管': 'Brake Hose',
    '放水阀': 'Drain Valve', '转向泵': 'Power Steering Pump', '举升泵、举升缸': 'Lifting Pump',
    '空气弹簧JS': 'Air Spring', '高度阀': 'Height Control Valve', '皮带涨紧轮': 'Belt Tensioner',
    '空压机': 'Air Compressor', '增压器': 'Turbocharger', '水泵': 'Water Pump', '电器': 'Electrical',
    '电瓶': 'Battery', '辅料': 'Auxiliary', '修理包': 'Repair Kit', '轮毂PD': 'Wheel Hub', '其它': 'Part',
}


def slugify(s):
    return re.sub(r'[^a-z0-9]+', '-', str(s).lower()).strip('-')


def q(v):
    return "'" + v.replace("'", "''") + "'"


def sv(v):
    return "NULL" if not v else q(v)


rows, seen = [], set()
for i, c in enumerate(cards, 1):
    series = c.get('series') or '其它'
    name = (c.get('name') or series).strip()
    fig = (c.get('产品图号') or '').strip()
    old = (c.get('瑞立老图号') or '').strip()
    host = (c.get('主机号') or '').strip()
    model = (c.get('规格型号') or '').strip()[:30]
    params = (c.get('params') or '').strip()[:200]
    oem = fig or old or (host if re.search(r'\d', host) else '')
    base = 'rl-' + (slugify(fig) if fig else (slugify(old) if old else f'n{c.get("page", 0)}-{i:03d}'))
    if len(base) < 4:
        base = f'rl-n{i:03d}'
    slug, n = base, 2
    while slug in seen:
        slug = f'{base}-{n}'
        n += 1
    seen.add(slug)
    tail = f" {model}" if model else (f" {fig}" if fig else '')
    name_zh = f"瑞立{name}{tail}".strip()[:60]
    en = SERIES_EN.get(series, 'Ruili Part')
    full_en = f"Ruili {en}" + (f" {fig}" if fig else '')
    truck = model or ''
    specs = {'系列': series}
    if old:
        specs['瑞立老图号'] = old
    if host:
        specs['主机号'] = host
    if params:
        specs['参数'] = params
    dz = f"瑞立{series}:{name}。" + (f"适用{model}。" if model else '') + (f"图号{fig}。" if fig else '')
    de = f"Ruili {en.lower()}" + (f" {fig}" if fig else '') + (f", fits {model}" if model else '')
    rows.append((slug, name_zh, full_en, oem, truck, SERIES_CAT.get(series, 'other'), specs, dz, de))


def main():
    lines = [
        "-- 批次F:瑞立产品图册净新增(1776款)",
        "-- 33系列:转向泵188/刹车片178/离合助力器112/弹簧缸99/调整臂86/举升79/离合总泵78/压盘片71/其它303等",
        "-- 品牌瑞立;SKU段 DD-RL-001~1776;图号入OEM;29条已在库剔除;价格不入库;幂等按slug",
        "",
    ]
    for i, (slug, name_zh, en, oem, truck, cat, specs, dz, de) in enumerate(rows, 1):
        sku = f"DD-RL-{i:04d}"
        lines.append(
            "INSERT INTO products "
            "(slug, sku, name_en, name_zh, brand, truck_model, category, oem_number, "
            "description_en, description_zh, specs, status) "
            "SELECT " + ", ".join([
                q(slug), q(sku), q(en), q(name_zh), q(BRAND), sv(truck), q(cat), sv(oem),
                q(de), q(dz), q(json.dumps(specs, ensure_ascii=False)) + "::jsonb",
                q("published"),
            ]) + f" WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = {q(slug)});"
        )
    out = "\n".join(lines) + "\n"
    path = "/home/fan/.openclaw/workspace/deda-products/scripts/batch12-ruiji.sql"
    with open(path, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"rows={len(rows)} slugs={len(seen)} -> {path}")
    assert out.count("INSERT INTO products") == len(rows)
    print("生成器自检: INSERT数 =", len(rows))
    from collections import Counter
    print("分类分布:", dict(Counter(r[5] for r in rows)))
    print("名称样例:", [r[1] for r in rows[:4]])


if __name__ == "__main__":
    main()
