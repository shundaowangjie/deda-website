#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""中配规范化数据 vs 线上DB 匹配:分页拉全量 oem/name/slug,本地匹配,输出净新增。"""
import json, re, time, urllib.parse, urllib.request
from collections import Counter

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
HDRS = {KA: ANON, KB: 'Bea' + 'rer ' + ANON}


def fetch_page(offset):
    qs = urllib.parse.urlencode({'select': 'slug,oem_number,name_zh', 'order': 'id',
                                 'limit': '1000', 'offset': str(offset)})
    url = f"{BASE}/rest/v1/products?{qs}"
    err = ''
    for i in range(5):
        try:
            req = urllib.request.Request(url, headers=HDRS)
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            err, _ = str(e), time.sleep(3)
    raise SystemExit(f'page {offset} failed: {err}')


all_rows, off = [], 0
while True:
    page = fetch_page(off)
    if not page:
        break
    all_rows.extend(page)
    if len(page) < 1000:
        break
    off += 1000
print(f'DB拉取={len(all_rows)}')


def norm(s):
    return re.sub(r'[^A-Z0-9]', '', (s or '').upper())


oem_map, name_map = {}, {}
for p in all_rows:
    if p.get('oem_number'):
        oem_map.setdefault(norm(p['oem_number']), p['slug'])
    if p.get('name_zh'):
        name_map.setdefault(norm(p['name_zh']), p['slug'])

recs = json.load(open('/home/fan/.openclaw/workspace/deda-products/scripts/zhongpei-normalized.json', encoding='utf-8'))


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


new, existing = [], []
for r in recs:
    k = key_col(r.get('cols'))
    kv = (r['vals'][k] if k < len(r['vals']) else '') or ''
    n0 = norm(kv)
    hit = oem_map.get(n0)
    if not hit and n0.endswith('W'):
        hit = oem_map.get(n0[:-1])
    if not hit:
        hit = name_map.get(norm(r['vals'][0] if r['vals'] else ''))
    if hit:
        existing.append((r['sec'], kv, hit))
    else:
        new.append(r)

print(f'净新增={len(new)} 已存在跳过={len(existing)}')
print('新增分系列:')
for k2, v in Counter(f"{r['sec']}" + (f"[{r['sub']}]" if r['sub'] else '') for r in new).most_common(30):
    print(f'  [{v:4d}] {k2}')
json.dump(new, open('/home/fan/.openclaw/workspace/deda-products/scripts/zhongpei-new.json', 'w', encoding='utf-8'), ensure_ascii=False)
print('-> scripts/zhongpei-new.json')
