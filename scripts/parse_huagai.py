#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""华盖三件套解析器:螺丝参数markdown块 / 黑米编号卡 / 参数图品名锚。"""
import json, re
from collections import Counter

BASE = '/home/fan/文档/xwechat_files/wxid_uqld42g0p70a22_ca8b/msg/file/2026-09/'
cards = []

# ---- 1. 螺丝参数0921(markdown) ----
raw = open(BASE + '华盖螺丝参数0921.txt', encoding='utf-8').read()
blocks = re.split(r'^# ', raw, flags=re.M)[1:]
FIELD_KEYS = ('品名', '规格', '材质标识', '螺纹', '杆径 Φ', '杆径Φ', '头部厚度',
              '螺母对边宽度', '垫片直径', '等级', '直径', '型号标识')
for b in blocks:
    fields = {}
    lens = []
    for ln in b.splitlines():
        s = ln.strip()
        m2 = re.match(r'^\|\s*(\d+)\s*\|\s*(\d+)\s*\|$', s)
        if m2:
            lens.append(f'L{m2.group(1)}/L1={m2.group(2)}')
            continue
        m = re.match(r'^\|\s*([^|]+?)\s*\|\s*([^|]*?)\s*\|$', s)
        if m and m.group(1) not in ('项目', '内容', 'L', '参数', '数值') and not set(m.group(1)) <= {'-'}:
            k, v = m.group(1), m.group(2).replace('\\*', '*').strip()
            if v:
                fields[k] = v
    if fields.get('品名'):
        fields['name'] = fields.pop('品名')
        fields['src'] = '螺丝参数'
        cards.append(fields)

# ---- 2. 黑米配置(编号卡) ----
cur = None
for ln in open(BASE + '华盖配置图2024.11.13.txt', encoding='utf-8').read().splitlines():
    s = ln.strip()
    m = re.match(r'^(\d+)\.\s+(.+)$', s)
    if m:
        if cur:
            cards.append(cur)
        cur = {'name': m.group(2).strip(), 'src': '黑米配置', 'spec_lines': []}
        continue
    if cur and s and not s.startswith('====') and not s.startswith('一、') and not s.startswith('华盖机械'):
        cur['spec_lines'].append(s)
if cur:
    cards.append(cur)

# ---- 3. 参数图(品名锚) ----
cur = None
buf = []
for ln in open(BASE + '华盖参数图.txt', encoding='utf-8').read().splitlines():
    s = ln.strip()
    if not s:
        continue
    m = re.match(r'^品名\s*\|\s*(.+)$', s)
    if m:
        if cur:
            cards.append(cur)
        cur = {'name': m.group(1).strip(), 'src': '参数图', 'dim_lines': buf[-10:]}
        buf = []
        continue
    buf.append(s)
if cur:
    cards.append(cur)

# 去重(按 name+src)
seen, final = set(), []
for c in cards:
    key = c.get('name', '') + '|' + c.get('src', '')
    if not c.get('name') or key in seen:
        continue
    seen.add(key)
    final.append(c)

print(f'总产品={len(final)}(原始{len(cards)})')
print('来源分布:', dict(Counter(c["src"] for c in final)))
print('螺丝参数样例:', [c['name'] for c in final if c['src'] == '螺丝参数'][:8])
print('黑米样例:', [c['name'] for c in final if c['src'] == '黑米配置'][:5])
print('参数图样例:', [c['name'] for c in final if c['src'] == '参数图'][:8])
json.dump(final, open('/home/fan/.openclaw/workspace/deda-products/scripts/huagai-parsed.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('-> scripts/huagai-parsed.json')
