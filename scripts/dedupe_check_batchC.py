#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""胶粘剂+养护品文件(16款)查重:角斗士品牌 + 本文件赛福特8款 + 工程机械制动液补验。"""
import json, time, urllib.parse, urllib.request

vals = {}
for ln in open('/home/fan/.openclaw/workspace/deda-products/.env.local', encoding='utf-8'):
    ln = ln.strip()
    if '=' in ln and not ln.startswith('#'):
        k, _, v = ln.partition('=')
        vals[k] = v
BASE = vals['NEXT_PUBLIC_SUPABASE_URL']
ANON = vals['NEXT_PUBLIC_SUPABASE_ANON_KEY']
HDRS = {'apikey': ANON, 'Authorization': 'Bearer ' + ANON}


def query(params):
    qs = urllib.parse.urlencode(params)
    url = f"{BASE}/rest/v1/products?{qs}"
    for i in range(5):
        try:
            req = urllib.request.Request(url, headers=HDRS)
            with urllib.request.urlopen(req, timeout=18) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            err, _ = str(e), time.sleep(4)
    return [{'error': err}]


def show(label, resp):
    if resp and 'error' in resp[0]:
        print(f"{label} -> FAIL {resp[0]['error'][:70]}")
    else:
        print(f"{label} -> {len(resp)} hit")
        for p in resp[:20]:
            print('   -', p.get('slug'), '|', p.get('name_zh'), '|', p.get('brand'), '|', p.get('sku'))


print('== 品牌查重 ==')
for kw in ['路丰', '捷创']:
    show(kw, query({'select': 'slug,name_zh,brand,sku', 'brand': f'ilike.*{kw}*'}))
print('== 品类/编号查重 ==')
for kw in ['调整臂', 'JC-5', 'JC-2', '22001']:
    r = query({'select': 'slug,name_zh,brand', 'or': f'(name_zh.ilike.*{kw}*,name_en.ilike.*{kw}*,oem_number.ilike.*{kw}*)'})
    hits = [p for p in r if 'error' not in p]
    print(f"  {kw} -> {len(hits)}: " + '; '.join((p['slug'] + '|' + (p.get('brand') or '?')) for p in hits[:5]))
print('== SKU段占用 ==')
show('DD-ARM', query({'select': 'sku', 'sku': 'ilike.DD-ARM*'}))
