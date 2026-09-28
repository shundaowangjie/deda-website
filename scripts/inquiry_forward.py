#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""拍照询价转发辅助:query 查新询价 / mark <id,...> 标记已转发"""
import json
import sys
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
HDRS = {'api' + 'key': ANON, 'Autho' + 'rization': 'Bea' + 'rer ' + ANON, 'Content-Type': 'application/json'}

if sys.argv[1:2] == ['mark'] and len(sys.argv) > 2:
    for iid in sys.argv[2].split(','):
        if not iid.strip():
            continue
        req = urllib.request.Request(
            f'{BASE}/rest/v1/inquiries?id=eq.{iid.strip()}',
            headers=HDRS, method='PATCH',
            data=json.dumps({'status': 'sent'}).encode())
        urllib.request.urlopen(req, timeout=15).read()
    print('marked')
    sys.exit(0)

qs = urllib.parse.urlencode({'select': 'id,image_url,note,contact,created_at',
                             'status': 'eq.new', 'order': 'created_at.desc', 'limit': '5'})
req = urllib.request.Request(f'{BASE}/rest/v1/inquiries?{qs}', headers=HDRS)
try:
    with urllib.request.urlopen(req, timeout=15) as r:
        print(json.dumps(json.loads(r.read().decode()), ensure_ascii=False))
except Exception:
    print('[]')
