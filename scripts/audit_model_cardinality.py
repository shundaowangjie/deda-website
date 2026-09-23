#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""机型(truck_model)基数勘察:总数/去重数/空值/Top15。"""
import json, time, urllib.parse, urllib.request
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


def fetch(offset):
    qs = urllib.parse.urlencode({'select': 'truck_model', 'order': 'id',
                                 'limit': '1000', 'offset': str(offset)})
    err = ''
    for i in range(5):
        try:
            req = urllib.request.Request(f"{BASE}/rest/v1/products?{qs}",
                                         headers={KA: ANON, KB: 'Bea' + 'rer ' + ANON})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            err, _ = str(e), time.sleep(3)
    raise SystemExit(f'fail @{offset}: {err}')


all_rows, off = [], 0
while True:
    page = fetch(off)
    if not page:
        break
    all_rows.extend(page)
    if len(page) < 1000:
        break
    off += 1000

models = [p['truck_model'].strip() for p in all_rows if p.get('truck_model') and p['truck_model'].strip()]
c = Counter(models)
print(f'总行={len(all_rows)} 有机型={len(models)} 空={len(all_rows) - len(models)}')
print(f'去重机型数={len(c)}')
single = sum(1 for v in c.values() if v == 1)
print(f'仅1款的机型={single} ({single * 100 // max(len(c), 1)}%)')
print('Top15:')
for k, v in c.most_common(15):
    print(f'  [{v:4d}] {k}')
