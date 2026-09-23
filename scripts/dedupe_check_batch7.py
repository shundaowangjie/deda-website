#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""batch7(空调养护/油品,9款)入库前查重:品牌/名称型号/SKU段占用。带5次重试。"""
import json, time, urllib.parse, urllib.request

BASE = KEY = None
for line in open('/home/fan/.openclaw/workspace/deda-products/.env.local', encoding='utf-8'):
    line = line.strip()
    if line.startswith('NEXT_PUBLIC_SUPABASE_URL='):
        BASE = line.split('=', 1)[1]
    elif line.startswith('NEXT_PUBLIC_SUPABASE_ANON_KEY='):
        KEY = line.split('=', 1)[1]
assert BASE and KEY, 'env 读取失败'


def query(params):
    qs = urllib.parse.urlencode(params)
    url = f"{BASE}/rest/v1/products?{qs}"
    last = ''
    for i in range(5):
        try:
            req = urllib.request.Request(url, headers={
                'apikey': KEY, 'Authorization': 'Bearer ' + KEY})
            with urllib.request.urlopen(req, timeout=18) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            last = str(e)
            time.sleep(4)
    return {'__failed__': last}


def show(label, resp, n=3):
    if isinstance(resp, dict) and '__failed__' in resp:
        print(f"{label} -> FAIL {resp['__failed__'][:70]}")
    else:
        hits = '; '.join(((p.get('slug') or '?') + '|' + (p.get('name_zh') or ''))[:42] for p in resp[:n])
        print(f"{label} -> {len(resp)} hit: {hits}")


print('== brand ==')
for kw in ['赛福特', '畅威']:
    show(kw, query({'select': 'slug,name_zh,brand', 'brand': f'ilike.*{kw}*'}))
print('== name/model ==')
for kw in ['R134a', '雪种', '积碳净', '修复剂', 'DOT3', 'DOT4', '润滑脂', 'HEP']:
    show(kw, query({'select': 'slug,name_zh',
                    'or': f'(name_zh.ilike.*{kw}*,name_en.ilike.*{kw}*,oem_number.ilike.*{kw}*)'}))
print('== sku segments ==')
show('DD-ACM/BFL/GRE', query({'select': 'sku',
                              'or': '(sku.ilike.DD-ACM*,sku.ilike.DD-BFL*,sku.ilike.DD-GRE*)'}))
