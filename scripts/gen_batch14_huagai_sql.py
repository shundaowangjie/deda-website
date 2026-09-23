#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""批次H:华盖机械(螺丝/黑米系列)78 款 SQL 生成器(读 huagai-parsed.json)。

品牌"华盖"(福建省华盖机械制造有限公司);分类 fastener;
三来源:螺丝参数17(markdown字段全收) / 黑米配置54(编号卡) / 参数图7(品名锚);
SKU段 DD-HG-001~078;价格不入库;幂等按slug。
"""
import json, re

BRAND = "华盖"
cards = json.load(open('/home/fan/.openclaw/workspace/deda-products/scripts/huagai-parsed.json', encoding='utf-8'))


def slugify(s):
    s = re.sub(r'[^\u4e00-\u9fa5A-Za-z0-9]+', '-', str(s)).strip('-').lower()
    return re.sub(r'[\u4e00-\u9fa5]+', lambda m: '', s).strip('-') or None


PY = {'153': '153', '奥威': 'aw', '北奔': 'bb', '德龙': 'dl', '斯太尔': 'ste', '豪沃': 'hw',
      '欧曼': 'om', '天龙': 'tl', '重汽': 'zc', 'J6': 'j6', 'BPW': 'bpw', 'AA2Q': 'aa2q'}


def slug_for(name, i):
    low = name.lower()
    for k, v in PY.items():
        if low.startswith(k.lower()):
            rest = re.sub(r'[^a-z0-9]+', '-', low[len(k):]).strip('-')
            return f'hg-{v}' + (f'-{rest}' if rest else f'-{i:03d}')
    s = re.sub(r'[^a-z0-9]+', '-', low).strip('-')
    return f'hg-{s}' if s else f'hg-n{i:03d}'


def q(v):
    return "'" + v.replace("'", "''") + "'"


rows, seen = [], set()
for i, c in enumerate(cards, 1):
    name = (c.get('name') or '').strip()
    src = c.get('src')
    specs = {'来源': src}
    if src == '螺丝参数':
        for k, v in c.items():
            if k not in ('name', 'src'):
                specs[k] = str(v)[:80]
    elif src == '黑米配置':
        for ln in c.get('spec_lines', []):
            if '：' in ln:
                k, _, v = ln.partition('：')
                specs[k.strip()] = v.strip()[:80]
            elif len(ln) <= 60:
                specs.setdefault('说明', []).append(ln)
        if isinstance(specs.get('说明'), list):
            specs['说明'] = ' / '.join(specs['说明'])[:120]
    elif src == '参数图':
        dims = [x for x in c.get('dim_lines', []) if len(x) <= 20]
        if dims:
            specs['图纸参数'] = ' '.join(dims[:15])[:150]
    base = slug_for(name, i)
    slug, n = base, 2
    while slug in seen:
        slug = f'{base}-{n}'
        n += 1
    seen.add(slug)
    name_zh = f"华盖{name}"[:60]
    en = 'Huagai Fastener'
    dz = f"华盖机械{name}。" + (f"规格{specs['规格']}。" if specs.get('规格') else '')
    de = 'Huagai Machinery fastener.'
    rows.append((slug, name_zh, en, 'fastener', specs, dz, de))


def main():
    lines = [
        "-- 批次H:华盖机械 螺丝/黑米系列(78款)",
        "-- 反作用杆/滑板座/中心螺丝17 + 黑米轮胎螺丝/活动环54 + 钢板中心螺丝7",
        "-- 品牌华盖;SKU段 DD-HG-001~078;分类fastener;价格不入库;幂等按slug",
        "",
    ]
    for i, (slug, name_zh, en, cat, specs, dz, de) in enumerate(rows, 1):
        sku = f"DD-HG-{i:03d}"
        lines.append(
            "INSERT INTO products "
            "(slug, sku, name_en, name_zh, brand, truck_model, category, oem_number, "
            "description_en, description_zh, specs, status) "
            "SELECT " + ", ".join([
                q(slug), q(sku), q(en), q(name_zh), q(BRAND), "NULL", q(cat), "NULL",
                q(de), q(dz), q(json.dumps(specs, ensure_ascii=False)) + "::jsonb",
                q("published"),
            ]) + f" WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = {q(slug)});"
        )
    out = "\n".join(lines) + "\n"
    path = "/home/fan/.openclaw/workspace/deda-products/scripts/batch14-huagai.sql"
    with open(path, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"rows={len(rows)} slugs={len(seen)} -> {path}")
    assert out.count("INSERT INTO products") == len(rows)
    print("生成器自检: INSERT数 =", len(rows))
    print("名称样例:", [r[1] for r in rows[:6]])


if __name__ == "__main__":
    main()
