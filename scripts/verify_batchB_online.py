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


print('== DD-ZZ 段清点(期望222) ==')
rows = query({'select': 'slug,name_zh,sku,brand,status',
              'sku': 'ilike.DD-ZZ*', 'order': 'sku', 'limit': '300'})
if rows and 'error' in rows[0]:
    print('FAIL', rows[0]['error'][:80])
else:
    for p in rows[:3]:
        print('  ', p.get('sku'), '|', p.get('name_zh'), '|', p.get('brand'), '|', p.get('status'))
    st = [p.get('status') for p in rows]
    print(f'合计: {len(rows)} published={st.count("published")}')


def count_all():
    req = urllib.request.Request(
        BASE + '/rest/v1/products?select=slug',
        headers={**HDRS, 'Prefer': 'count=exact', 'Range': '0-0'})
    err = ''
    for i in range(5):
        try:
            with urllib.request.urlopen(req, timeout=18) as r:
                return r.headers.get('Content-Range', '?').split('/')[-1]
        except Exception as e:
            err, _ = str(e), time.sleep(4)
    return 'FAIL:' + err[:60]


print('== DB 总数(期望 8221) ==')
print('  total =', count_all())
print('== 线上API抽查 ==')
try:
    u = 'https://products.dedaautoparts.com/api/search?' + urllib.parse.urlencode({'q': '邢台中重', 'limit': '3'})
    with urllib.request.urlopen(u, timeout=15) as r:
        print('  牵引座 →', r.read().decode()[:160])
except Exception as e:
    print('  暂不可达(不影响DB验证):', str(e)[:60])
