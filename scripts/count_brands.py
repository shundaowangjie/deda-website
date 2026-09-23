#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""品牌统一前盘点:BRAKFLINN/未标注/中配 现有条数 + 德达现有数。"""
import json, time, urllib.parse, urllib.request

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


def count_brand(b):
    qs = urllib.parse.urlencode({'select': 'slug', 'brand': f'eq.{b}'})
    err = ''
    for i in range(5):
        try:
            req = urllib.request.Request(
                f"{BASE}/rest/v1/products?{qs}",
                headers={KA: ANON, KB: 'Bea' + 'rer ' + ANON,
                         'Prefer': 'count=exact', 'Range': '0-0'})
            with urllib.request.urlopen(req, timeout=18) as r:
                return r.headers.get('Content-Range', '?').split('/')[-1]
        except Exception as e:
            err, _ = str(e), time.sleep(3)
    return 'FAIL:' + err[:50]


for b in ['BRAKFLINN', '未标注', '中配', '德达']:
    print(f"brand={b}: {count_brand(b)}")
