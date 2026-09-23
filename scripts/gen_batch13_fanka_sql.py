#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""批次G:任丘弗兰卡(隆顺达)风扇叶等 582 款 SQL 生成器(读 fanka-parsed.json)。

品牌"隆顺达"(任丘弗兰卡/隆顺达风扇叶厂,可一句UPDATE改);分类按系列:
风扇/水箱/副水箱→cooling-system,挡泥板→chassis-suspension,电瓶盖→electrical,
喷水壶/零件盒/其它→other;型号/图号入OEM列;SKU段 DD-FK-001~582;价格不入库;幂等按slug。
"""
import json, re

BRAND = "隆顺达"
cards = json.load(open('/home/fan/.openclaw/workspace/deda-products/scripts/fanka-parsed.json', encoding='utf-8'))

SEC_MAP = {
    '尼龙风扇': ('尼龙风扇', 'Nylon Fan', 'cooling-system'),
    '挡泥板': ('挡泥板', 'Mud Flap', 'chassis-suspension'),
    '水箱': ('水箱', 'Water Tank', 'cooling-system'),
    '副水箱': ('膨胀副水箱', 'Expansion Tank', 'cooling-system'),
    '电瓶盖': ('电瓶盖', 'Battery Cover', 'electrical'),
    '喷水壶': ('喷水壶', 'Water Pot', 'other'),
    '零件盒': ('零件盒', 'Parts Box', 'other'),
}


def sec_info(sec):
    s = (sec or '').split(' ')[0]
    for k, v in SEC_MAP.items():
        if k in (sec or ''):
            return v
    return ('配件', 'Part', 'other')


def slugify(s):
    return re.sub(r'[^a-z0-9]+', '-', str(s).lower()).strip('-')


def q(v):
    return "'" + v.replace("'", "''") + "'"


def sv(v):
    return "NULL" if not v else q(v)


COMPANY_RE = re.compile(r'任丘市弗兰卡汽车部件有限公司.*$|弗兰卡、隆顺顺达汽车风扇叶厂.*$|弗兰卡、隆顺达汽车风扇叶厂.*$')

rows, seen = [], set()
for i, c in enumerate(cards, 1):
    short, en_name, cat = sec_info(c.get('sec'))
    ly, model, zh, fig = c.get('ly', ''), c.get('model', ''), c.get('zh', ''), c.get('fig', '')
    zh = COMPANY_RE.sub('', zh).strip(' ,，')
    base = 'fk-' + (slugify(ly) if ly else slugify(model) or f'n{i:03d}')
    slug, n = base, 2
    while slug in seen:
        slug = f'{base}-{n}'
        n += 1
    seen.add(slug)
    oem = model if re.search(r'\d', model or '') else (fig if fig else '')
    tail = ' '.join(x for x in [model, zh] if x)[:40]
    name_zh = f"隆顺达{short} {tail}".strip()[:60]
    en = f"Longshunda {en_name}" + (f" {model}" if model else '')
    specs = {'系列': (c.get('sec') or '配件').split(' ')[0]}
    if ly:
        specs['LY'] = ly
    if fig:
        specs['图号'] = fig
    dz = f"隆顺达(任丘弗兰卡){short}:{tail or zh}。" + (f"图号{fig}。" if fig else '')
    de = f"Longshunda {en_name.lower()}" + (f" {model}" if model else '') + '.'
    rows.append((slug, name_zh, en, oem, cat, specs, dz, de))


def main():
    lines = [
        "-- 批次G:任丘弗兰卡(隆顺达)风扇叶/水箱/挡泥板等(582款)",
        "-- 系列:尼龙风扇321/挡泥板98/水箱(LYT/B)79/电瓶盖37/膨胀副水箱19/喷水壶16/零件盒12等",
        "-- 品牌隆顺达;SKU段 DD-FK-001~582;型号/图号入OEM;价格不入库;幂等按slug",
        "-- 披露:无型号卡344张(尺寸/名称型)照录;零件盒系列为工具类可按需下架",
        "",
    ]
    for i, (slug, name_zh, en, oem, cat, specs, dz, de) in enumerate(rows, 1):
        sku = f"DD-FK-{i:03d}"
        lines.append(
            "INSERT INTO products "
            "(slug, sku, name_en, name_zh, brand, truck_model, category, oem_number, "
            "description_en, description_zh, specs, status) "
            "SELECT " + ", ".join([
                q(slug), q(sku), q(en), q(name_zh), q(BRAND), "NULL", q(cat), sv(oem),
                q(de), q(dz), q(json.dumps(specs, ensure_ascii=False)) + "::jsonb",
                q("published"),
            ]) + f" WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = {q(slug)});"
        )
    out = "\n".join(lines) + "\n"
    path = "/home/fan/.openclaw/workspace/deda-products/scripts/batch13-fanka.sql"
    with open(path, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"rows={len(rows)} slugs={len(seen)} -> {path}")
    assert out.count("INSERT INTO products") == len(rows)
    print("生成器自检: INSERT数 =", len(rows))
    from collections import Counter
    print("分类分布:", dict(Counter(r[4] for r in rows)))
    print("名称样例:", [r[1] for r in rows[:5]])


if __name__ == "__main__":
    main()
