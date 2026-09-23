#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""解析捷创路丰配件.txt(2770行卡片目录)→ 结构化 JSON + 统计。
卡片字段:产品名称/产品编号/产品齿数/适用车型/参数/车型(有OCR变体)。
"""
import json, re
from collections import Counter

SRC = '/home/fan/文档/xwechat_files/wxid_uqld42g0p70a22_ca8b/msg/file/2026-09/捷创样本路丰配件.txt'
text = open(SRC, encoding='utf-8').read()
lines = [ln.strip() for ln in text.splitlines()]

cards, cur, section = [], None, None
for ln in lines:
    if not ln:
        continue
    if '调整臂系列' in ln or ('Adjustment Arm' in ln and 'Series' in ln):
        section = ln
        continue
    m = re.match(r'^(?:产品名称|名称)[：:]\s*(.+)$', ln)
    if m:
        if cur:
            cards.append(cur)
        cur = {'section': section, 'name': m.group(1).strip()}
        continue
    if cur is None:
        continue
    for pat, key in [
        (r'^(?:产品编号|编号|型号|OEM号?|图号|件号)[：:]\s*(.+)$', 'code'),
        (r'^(?:产品齿数|齿数)[：:]\s*(.+)$', 'teeth'),
        (r'^适用车型[：:]\s*(.+)$', 'fit'),
        (r'^参数[：:]\s*(.+)$', 'params'),
        (r'^车型[：:]\s*(.+)$', 'model'),
        (r'^(?:产品规格|规格|包装)[：:]\s*(.+)$', 'spec'),
    ]:
        mm = re.match(pat, ln)
        if mm:
            cur[key] = mm.group(1).strip()
            break
    else:
        cur.setdefault('notes', []).append(ln)
if cur:
    cards.append(cur)

n = len(cards)
with_code = sum(1 for c in cards if 'code' in c)
secs = {}
for c in cards:
    s = c.get('section') or '(无系列)'
    secs[s] = secs.get(s, 0) + 1
print(f'卡片数={n} 有编号={with_code} 无编号={n - with_code}')
print('系列分布:')
for k, v in sorted(secs.items(), key=lambda x: -x[1]):
    print(f'  [{v:3d}] {k}')
no_code = [(i, c.get('name', '?'), ' '.join(c.get('notes', [])[:2])) for i, c in enumerate(cards) if 'code' not in c]
if no_code:
    print('无编号卡片(前8):')
    for i, nm, nt in no_code[:8]:
        print(f'   #{i} {nm} | {nt[:50]}')
codes = [c['code'] for c in cards if 'code' in c]
dups = {k: v for k, v in Counter(codes).items() if v > 1}
print('重复编号:', dups if dups else '无')
field_cov = {k: sum(1 for c in cards if k in c) for k in ('teeth', 'fit', 'params', 'model', 'spec')}
print('字段覆盖:', field_cov)
json.dump(cards, open('/home/fan/.openclaw/workspace/deda-products/scripts/jiechuang-parsed.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('-> scripts/jiechuang-parsed.json')
