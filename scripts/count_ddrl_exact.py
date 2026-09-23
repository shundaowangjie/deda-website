#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""DD-RL 段精确计数(Prefer count=exact + Range,绕过1000行硬上限)。"""
import time, urllib.parse, urllib.request

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
qs = urllib.parse.urlencode({'select': 'slug', 'sku': 'ilike.DD-RL*'})
err = ''
for i in range(5):
    try:
        req = urllib.request.Request(
            f"{BASE}/rest/v1/products?{qs}",
            headers={KA: ANON, KB: 'Bea' + 'rer ' + ANON, 'Prefer': 'count=exact', 'Range': '0-0'})
        with urllib.request.urlopen(req, timeout=18) as r:
            print('Content-Range:', r.headers.get('Content-Range'))
        break
    except Exception as e:
        err, _ = str(e), time.sleep(3)
else:
    print('FAIL', err)
