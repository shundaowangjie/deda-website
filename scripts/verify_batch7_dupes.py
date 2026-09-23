#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""确认batch7文件9款全部已在库 + 抽查已入库数据完整性(specs/sku/category/status)。"""
import json, time, urllib.parse, urllib.request

BASE = KEY = None
for line in open('/home/fan/.openclaw/workspace/deda-products/.env.local', encoding='utf-8'):
    line = line.strip()
    if line.startswith('NEXT_PUBLIC_SUPABASE_URL='):
        BASE = line.split('=', 1)[1]
    elif line.startswith('NEXT_PUBLIC_SUPABASE_ANON_KEY='):
        KEY = line.split('=', 1)[1]


def query(params):
    qs = urllib.parse.urlencode(params)
    url = f"{BASE}/rest/v1/products?{qs}"
    for i in range(5):
        try:
            req = urllib.request.Request(url, headers={
                'apikey': KEY, 'Authorization': 'Bearer ' + KEY})
            with urllib.request.urlopen(req, timeout=18) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            err, slp = str(e), time.sleep(4)
    return [{'error': err}]


print('== 工程机械制动液 ==')
for p in query({'select': 'slug,name_zh,brand,sku', 'name_zh': 'ilike.*工程机械制动液*'}):
    print(' ', p)

print('== 抽查完整性(3款) ==')
for slug in ['saifute-r134a-refrigerant', 'saifute-dot4-brake-fluid', 'changwei-hep-grease']:
    rows = query({'select': 'slug,name_zh,brand,sku,category,status,specs', 'slug': f'eq.{slug}'})
    if rows and 'error' not in rows[0]:
        p = rows[0]
        print(f"  {p['slug']}: sku={p['sku']} cat={p['category']} status={p['status']}")
        print(f"    specs={json.dumps(p.get('specs'), ensure_ascii=False)[:160]}")
    else:
        print(f"  {slug}: 查询失败 {rows}")

print('== 两个品牌全量清单 ==')
for kw in ['赛福特', '畅威']:
    rows = query({'select': 'slug,name_zh', 'brand': f'ilike.*{kw}*', 'order': 'slug', 'limit': '30'})
    print(f'  [{kw}] {len(rows)} 款:')
    for p in rows:
        print('   -', p['slug'], '|', p['name_zh'])
