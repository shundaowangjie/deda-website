#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""批次E:中配三件套净新增 680 款 SQL 生成器(读 zhongpei-new.json)。

来源:中配配件/中配配件2/中配配件修改版 三文件 → 解析4151 → 合并去重3535 → DB比对净新增680。
规则:品牌"中配";分类按系列注册表;oem_number=关键列(OEM/型号,含数字者);
specs=表头列值对(无损);卡车列=适用车型;SKU段 DD-ZP-001~680;价格不入库;幂等按slug。
"""
import json, re

BRAND = "中配"
recs = json.load(open('/home/fan/.openclaw/workspace/deda-products/scripts/zhongpei-new.json', encoding='utf-8'))

SEC_SHORT = {'离合总泵系列': '离合总泵', '离合助力器系列': '离合助力器', '制动室系列': '制动室',
             '空滤芯系列': '空滤芯', '蓄电池系列': '蓄电池', '横接头系列': '横接头',
             '直接头系列': '直接头', '泵阀系列': '泵阀', '主肖修理包系列': '主肖修理包',
             '其它紧固件系列': '紧固件'}
SEC_EN = {'离合总泵': 'Clutch Master Cylinder', '离合助力器': 'Clutch Booster',
          '制动室': 'Brake Chamber', '空滤芯': 'Air Filter', '蓄电池': 'Battery',
          '横接头': 'Cross Joint', '直接头': 'Direct Joint', '泵阀': 'Valve',
          '主肖修理包': 'Kingpin Repair Kit', '紧固件': 'Fastener', '轴承': 'Bearing',
          '分离轴承总成': 'Release Bearing Assembly', '后轮轴承': 'Rear Wheel Bearing',
          '前轮轴承': 'Front Wheel Bearing', '分离轴承': 'Release Bearing'}


def key_col(cols):
    if not cols:
        return 0
    for i, c in enumerate(cols):
        if 'OEM' in c or 'oem' in c:
            return i
    for i, c in enumerate(cols):
        if '型号' in c or '名称' in c:
            return i
    return 0


def truck_col(cols):
    if not cols:
        return None
    for i, c in enumerate(cols):
        if '适用车型' in c or c == '车型' or '车系' in c:
            return i
    return None


def q(v):
    return "'" + v.replace("'", "''") + "'"


def sv(v):
    return "NULL" if not v else q(v)


rows, seen = [], set()
for i, r in enumerate(recs, 1):
    sec, sub, cols, vals = r['sec'], r.get('sub') or '', r.get('cols'), r['vals']
    short = SEC_SHORT.get(sec, sec.replace('系列', ''))
    if sec == '轴承系列' and sub:
        short = sub
    k = key_col(cols)
    kv = (vals[k] if k < len(vals) else (vals[0] if vals else '')) or ''
    kv = str(kv).strip()
    base = 'zp-' + re.sub(r'[^a-z0-9]+', '-', kv.lower()).strip('-')
    if len(base) < 4:
        base = f'zp-n{i:03d}'
    slug, n = base, 2
    while slug in seen:
        slug = f'{base}-{n}'
        n += 1
    seen.add(slug)
    name_zh = f"中配{short} {kv}".strip()
    tc = truck_col(cols)
    truck = str(vals[tc]).strip() if tc is not None and tc < len(vals) else ''
    if cols and len(cols) == len(vals):
        specs = {c: str(v) for c, v in zip(cols, vals) if v and v != '/'}
    else:
        specs = {'参数': ' / '.join(str(v) for v in vals if v)[:150]}
    specs['系列'] = sec + (f'({sub})' if sub else '')
    oem = kv if re.search(r'\d', kv) and 2 <= len(kv) <= 32 else None
    en = f"{SEC_EN.get(short, 'Zhongpei Part')} {kv}".strip()
    dz = f"中配{short}:{kv}。" + (f"适用{truck}。" if truck else '')
    de = f"Zhongpei {SEC_EN.get(short, 'part').lower()}" + (f" {kv}" if kv else '') + (f", fits {truck}" if truck else '')
    rows.append((slug, name_zh, en, oem, truck, r['cat'], specs, dz, de))


def main():
    lines = [
        "-- 批次E:中配三件套净新增(680款)",
        f"-- 离合总泵121/轴承314(4子表)/制动室67/空滤芯63/蓄电池60/横直接头49/其他6",
        "-- 2855条已在库被比对剔除;品牌中配;SKU段 DD-ZP-001~680;价格不入库;幂等按slug",
        "",
    ]
    for i, (slug, name_zh, en, oem, truck, cat, specs, dz, de) in enumerate(rows, 1):
        sku = f"DD-ZP-{i:03d}"
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
    path = "/home/fan/.openclaw/workspace/deda-products/scripts/batch11-zhongpei.sql"
    with open(path, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"rows={len(rows)} slugs={len(seen)} -> {path}")
    assert out.count("INSERT INTO products") == len(rows)
    print("生成器自检: INSERT数 =", len(rows))
    from collections import Counter
    cats = Counter(r[5] for r in rows)
    print("分类分布:", dict(cats))
    noem = sum(1 for r in rows if not r[3])
    print(f"无OEM录入数={noem}(纯尺寸/名称行,oem为NULL属正常)")
    print("名称样例:", [r[1] for r in rows[:5]])


if __name__ == "__main__":
    main()
