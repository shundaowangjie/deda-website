#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""批次D:冷藏车不锈钢五金 138 款 SQL 生成器(读 lengcang-parsed.json)。

修复与规则:
- 品牌未标注 → brand='未标注'(后续可一句 UPDATE 批量改真实品牌);
- 重复编号 0170×3 / 0644×2:slug 加 -b/-c 后缀,specs 记录同号照录;
- 名称过短(<4字)卡片:按"系列+编号"补名;
- 0118(车厢专用胶/氯丁密封胶)归 adhesive 分类,其余 other;
- 系列名清洗:去 #/* 前缀、去"重量:2.90"等噪音尾、合并近义;
- truck_model 统一'冷藏车';编号入 OEM 列;价格不入库;幂等按 slug。
SKU 段:DD-LC-001~138。
"""
import json, re

BRAND = "未标注"
cards = json.load(open('/home/fan/.openclaw/workspace/deda-products/scripts/lengcang-parsed.json', encoding='utf-8'))

SEC_FIX = {
    '重量：2.90四分门锁': '四分门锁',
    '# 包角': '包角',
    '# 冷藏车不锈钢四分门锁': '冷藏车不锈钢四分门锁',
    '铁拉环粗度6mm': '铁拉环',
    '304不锈钢绳钩实际福度品米双层管5.7cm4.3cm3.4cm': '304不锈钢绳钩',
    '冷藏车不锈钢六分门锁': '六分门锁',
    '304不锈钢四分门锁': '四分门锁',
    '4分门锁': '四分门锁',
    '304不锈钢一寸门锁': '一寸门锁',
    '304不锈钢包角': '包角',
}
SPECIAL = {
    '0118': {'name': '车厢专用胶(强力嵌缝)', 'category': 'adhesive', 'sec': '车厢密封胶'},
}


def clean_sec(s):
    s = (s or '').strip().lstrip('#* ').rstrip('*')
    return SEC_FIX.get(s, s)


def slugify(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def q(v):
    return "'" + v.replace("'", "''") + "'"


def sv(v):
    return "NULL" if v is None else q(v)


rows, seen_slug, seen_code = [], {}, {}
for i, c in enumerate(cards, 1):
    code = c['code']
    sec = clean_sec(c.get('section'))
    sp = SPECIAL.get(code)
    if sp:
        name = sp['name']
        sec = sp['sec']
        category = sp['category']
    else:
        name = (c.get('name') or '').strip()
        category = 'other'
        # 清洗:去列表序号/双逗号/内嵌重量段(重量转specs)
        mw = re.search(r'重量[：:]?\s*([\d.]+)\s*(千克|kg|克|g)', name)
        name = re.sub(r'^\d+\.\s*', '', name)
        name = re.sub(r'[，,]{2,}', '，', name)
        name = re.sub(r'[，,]\s*重量[：:].*$', '', name)
        name = re.sub(r'[，,]\s*$', '', name).strip()
        if len(name) < 4:
            name = f"{sec or '冷藏车五金'} {code}"
    seen_code[code] = seen_code.get(code, 0) + 1
    occ = seen_code[code]
    base = f"lc-{code}" + ("" if occ == 1 else f"-{chr(96 + occ)}")
    slug = base
    assert slug not in seen_slug, slug
    seen_slug[slug] = 1
    specs = {'系列': sec or '冷藏车五金'}
    if mw:
        specs['重量'] = mw.group(1) + mw.group(2)
    if occ > 1:
        specs['同号说明'] = f'原文编号 {code} 出现多卡,本卡第{occ}条,照录'
    if c.get('dims'):
        specs['尺寸'] = c['dims'][:120]
    if c.get('fields'):
        specs['参数'] = ' / '.join(c['fields'])[:150]
    name_zh = name if code in name else f"{name} {code}"
    rows.append((slug, name_zh, code, category, specs))


def main():
    lines = [
        "-- 批次D:冷藏车不锈钢五金(138款)",
        f"-- 系列:门锁(一寸/四分/六分/盒锁)/合页(304/316/镀锌飞翼)/包角/风钩/拉环/弯板钩/绳钩/密封胶等",
        "-- 品牌未标注(可批量UPDATE);重复编号0170×3/0644×2加后缀照录;短名卡按系列补名",
        "-- SKU段 DD-LC-001~138;truck_model=冷藏车;编号入OEM列;价格不入库;幂等按slug",
        "",
    ]
    for i, (slug, name_zh, code, category, specs) in enumerate(rows, 1):
        sku = f"DD-LC-{i:03d}"
        en = "Reefer Truck Hardware " + code
        dz = f"冷藏车{specs.get('系列', '五金')}:{name_zh}。" + (specs.get('参数', '') + "。")[:80]
        de = f"Stainless hardware for reefer trucks, item {code}."
        lines.append(
            "INSERT INTO products "
            "(slug, sku, name_en, name_zh, brand, truck_model, category, oem_number, "
            "description_en, description_zh, specs, status) "
            "SELECT " + ", ".join([
                q(slug), q(sku), q(en), q(name_zh), q(BRAND), q("冷藏车"), q(category),
                sv(code), q(de), q(dz),
                q(json.dumps(specs, ensure_ascii=False)) + "::jsonb", q("published"),
            ]) + f" WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = {q(slug)});"
        )
    out = "\n".join(lines) + "\n"
    path = "/home/fan/.openclaw/workspace/deda-products/scripts/batch10-lengcang.sql"
    with open(path, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"rows={len(rows)} slugs={len(seen_slug)} -> {path}")
    assert out.count("INSERT INTO products") == len(rows)
    print("生成器自检: INSERT数 =", len(rows))
    cats = {}
    for r in rows:
        cats[r[3]] = cats.get(r[3], 0) + 1
    print("分类分布:", cats)
    print("同号后缀卡:", [r[0] for r in rows if '-b' in r[0] or '-c' in r[0]])
    print("补名卡(名称=系列+编号)样例:", [r[1] for r in rows if r[1].endswith(r[2])][:6])


if __name__ == "__main__":
    main()
