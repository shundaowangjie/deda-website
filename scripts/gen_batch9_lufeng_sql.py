#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""批次C-1:路丰(捷创样本)调整臂 SQL 生成器。

来源:捷创样本路丰配件.txt(2770行)→ parse_jiechuang.py → jiechuang-parsed.json(358卡)。
系列:阻逆式手动130 / 锁片式手动96 / 自动132(福田35/东风32/解放28/解放重汽14/青特12/重汽11)。
修复(fixlog打印):#58 notes内JC-512、#188 name内嵌JC-265、#355 name内嵌22001509、
2张code混入"车型:"前缀剥离;JC25/J220等无连字符编号照录。
SKU段 DD-ARM-001~358;分类 brake-system;品牌 路丰;价格不入库;幂等按slug。
"""
import json, re

BRAND = "路丰"
cards = json.load(open('/home/fan/.openclaw/workspace/deda-products/scripts/jiechuang-parsed.json', encoding='utf-8'))

SEC_ZH = {'Anti-reverse Manual Adjustment Arm Series': '阻逆式手动调整臂'}


def sec_zh(s):
    s = (s or '').strip().lstrip('#').strip()
    if s in SEC_ZH:
        return SEC_ZH[s]
    return s.replace('调整臂系列', '调整臂') or '调整臂'


def slugify(s):
    return re.sub(r'[^a-z0-9]+', '-', s.lower()).strip('-')


def q(v):
    return "'" + v.replace("'", "''") + "'"


def sv(v):
    return "NULL" if v is None else q(v)


rows, seen, fixlog = [], set(), []
for i, c in enumerate(cards, 1):
    name = (c.get('name') or '').strip()
    code = (c.get('code') or '').strip()
    m = re.match(r'^(手动调整臂|自动调整臂)产品编号[：:]\s*(\S+)$', name)
    if m:
        name, code = m.group(1), m.group(2)
        fixlog.append(f'#{i} name内嵌编号→{code}')
    m = re.match(r'^自动(\d{6,})$', name)
    if m and not code:
        name, code = '自动调整臂', m.group(1)
        fixlog.append(f'#{i} name提取编号→{code}')
    if not code:
        for nt in c.get('notes', []):
            m2 = re.search(r'产品[：:]\s*(JC-?\d+)', nt)
            if m2:
                code = m2.group(1)
                fixlog.append(f'#{i} notes提取编号→{code}')
                break
    if '车型：' in code:
        code = code.split('车型：')[0].strip()
        fixlog.append(f'#{i} code剥离车型→{code!r}')
    sec = sec_zh(c.get('section'))
    is_auto = '自动' in sec or name.startswith('自动')
    name_zh = '自动调整臂' if is_auto else '手动调整臂'
    base = 'lufeng-' + (slugify(code) if code else f'n{i:03d}')
    slug, k = base, 2
    while slug in seen:
        slug = f'{base}-{k}'
        k += 1
    seen.add(slug)
    fit = (c.get('fit') or c.get('model') or '').strip()
    specs = {'系列': sec}
    if c.get('teeth'):
        specs['齿数'] = c['teeth']
    if c.get('params'):
        specs['参数'] = c['params']
    odd = [nt for nt in c.get('notes', []) if nt not in ('Road fine', '路丰')]
    if odd:
        specs['原文备注'] = ' / '.join(odd)[:120]
    rows.append((slug, name_zh, code, fit, specs, is_auto))


def main():
    lines = [
        "-- 批次C-1:路丰调整臂(捷创样本)",
        f"-- {len(rows)} 款:阻逆式手动130 / 锁片式手动96 / 自动132",
        "-- SKU段 DD-ARM-001~358;品牌路丰;OEM列=厂编(JC-xxx/22001xxx);价格不入库;幂等按slug",
        f"-- 修复记录:{'; '.join(fixlog) if fixlog else '无'}",
        "",
    ]
    for i, (slug, name_zh, code, fit, specs, is_auto) in enumerate(rows, 1):
        sku = f"DD-ARM-{i:03d}"
        full_zh = f"路丰{name_zh}" + (f" {code}" if code else "")
        en_type = 'Automatic' if is_auto else 'Manual'
        full_en = f"Lufeng {en_type} Slack Adjuster" + (f" {code}" if code else "")
        dz = f"路丰{specs['系列']}:{name_zh}" + (f",{code}。" if code else "。")
        if fit:
            dz += f"适用{fit}。"
        if specs.get('参数'):
            dz += specs['参数'] + "。"
        de = f"Lufeng {en_type.lower()} slack adjuster" + (f" {code}" if code else "")
        if fit:
            de += f", fits {fit}."
        lines.append(
            "INSERT INTO products "
            "(slug, sku, name_en, name_zh, brand, truck_model, category, oem_number, "
            "description_en, description_zh, specs, status) "
            "SELECT " + ", ".join([
                q(slug), q(sku), q(full_en), q(full_zh), q(BRAND), sv(fit or None),
                q("brake-system"), sv(code or None), q(de), q(dz),
                q(json.dumps(specs, ensure_ascii=False)) + "::jsonb", q("published"),
            ]) + f" WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = {q(slug)});"
        )
    out = "\n".join(lines) + "\n"
    path = "/home/fan/.openclaw/workspace/deda-products/scripts/batch9-lufeng.sql"
    with open(path, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"rows={len(rows)} slugs={len(seen)} -> {path}")
    assert out.count("INSERT INTO products") == len(rows)
    print("生成器自检: INSERT数 =", len(rows))
    autos = sum(1 for r in rows if r[5])
    print(f"手动={len(rows) - autos} 自动={autos}")
    for f_ in fixlog:
        print("  fix:", f_)


if __name__ == "__main__":
    main()
