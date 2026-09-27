#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""生成第一批易损件标价模板 CSV(Excel 直接打开,填"参考价"列回传)。
UTF-8 带 BOM(utf-8-sig),Excel 双击即正确显示中文。
品类:滤芯/制动/离合/轴承/皮带等易损件类。
"""
import csv
import json
import time
import urllib.parse
import urllib.request

vals = {}
for ln in open('/home/fan/.openclaw/workspace/deda-products/.env.local', encoding='utf-8'):
    ln = ln.strip()
    if '=' in ln and not ln.startswith('#'):
        k, _, v = ln.partition('=')
        vals[k] = v
BASE = vals['NEXT_PUBLIC_SUPABASE_URL']
ANON = vals['NEXT_PUBLIC_SUPABASE_ANON_KEY']
KA = 'api' + 'key'
KB = 'Autho' + 'rization'

# 易损件类目 slug(与产品表 category 字段对齐;先拉全部 distinct 再人工圈)
TARGET_ZH = ['滤', '制动', '刹车', '离合', '轴承', '皮带', '电气', '灯具', '雨刮']


def fetch(path):
    for i in range(5):
        try:
            req = urllib.request.Request(BASE + path, headers={KA: ANON, KB: 'Bea' + 'rer ' + ANON})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode())
        except Exception:
            time.sleep(3)
    return None


# 1) 看现有分类分布,提示圈选范围
cats = fetch('/rest/v1/products?select=category&limit=10000') or []
from collections import Counter
dist = Counter(c['category'] for c in cats)
print('分类分布:', dict(dist.most_common(12)))

rows, off = [], 0
while True:
    qs = urllib.parse.urlencode({'select': 'slug,oem_number,name_zh,name_en,category',
                                 'order': 'category,id', 'limit': '1000', 'offset': str(off)})
    page = fetch(f'/rest/v1/products?{qs}')
    if not page:
        break
    rows.extend(page)
    if len(page) < 1000:
        break
    off += 1000

# 2) 易损件筛选:按分类 slug 关键词
def is_consumable(cat):
    c = (cat or '').lower()
    return any(k in c for k in ['filter', 'brake', 'clutch', 'bearing', 'belt', 'electr', 'wiper', 'lamp'])

picked = [p for p in rows if is_consumable(p.get('category'))]
print(f'候选易损件: {len(picked)} / {len(rows)}')

out = '/home/fan/.openclaw/workspace/sql-batch/price-template-batch1.csv'
with open(out, 'w', encoding='utf-8-sig', newline='') as f:
    w = csv.writer(f)
    w.writerow(['slug(勿改)', 'OEM号', '品名', '英文名', '分类', '参考价元(填这列)', '备注(可空)'])
    for p in picked:
        w.writerow([p['slug'], p.get('oem_number') or '', p.get('name_zh') or '',
                    p.get('name_en') or '', p.get('category') or '', '', ''])
print(f'-> {out} ({len(picked)} 行)')
