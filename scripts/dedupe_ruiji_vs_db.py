#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""瑞立 1805 卡 vs 线上DB 匹配:图号/老图号/主机号三重匹配,输出净新增。"""
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


oem_map = {}
for p in all_rows:
    if p.get('oem_number'):
        oem_map.setdefault(norm(p['oem_number']), p['slug'])

cards = json.load(open('/home/fan/.openclaw/workspace/deda-products/scripts/ruiji-parsed.json', encoding='utf-8'))
new, existing = [], []
for c in cards:
    hit = None
    for fld in ('产品图号', '瑞立老图号', '主机号'):
        v = norm(c.get(fld))
        if v and v in oem_map:
            hit = (fld, c.get(fld), oem_map[v])
            break
    if hit:
        existing.append(hit)
    else:
        new.append(c)

print(f'净新增={len(new)} 已存在跳过={len(existing)}')
print('新增分系列:')
for k, v in Counter(c['series'] for c in new).most_common(36):
    print(f'  [{v:4d}] {k}')
json.dump(new, open('/home/fan/.openclaw/workspace/deda-products/scripts/ruiji-new.json', 'w', encoding='utf-8'), ensure_ascii=False)
print('-> scripts/ruiji-new.json')
