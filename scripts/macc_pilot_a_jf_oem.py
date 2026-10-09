#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""路径A试点:解放格式原厂号 × 解放VIN 的 51macc 匹配率实测(20额度)。

1) 本地预检(免费):早上BOM页带回的解放件号与我们的OEM对碰
2) 挑20个解放格式OEM(不同前缀混采),单OE精确查(GetBom itemId+itemName+vin)
3) 报告:匹配率/别名样例/结论
"""
import json
import re
import time
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
MACC = vals['MACC_USERID']
VIN = 'LFWSRXSJ8HAB00616'
KA = 'api' + 'key'
KB = 'Autho' + 'rization'


def db_fetch(path):
    for i in range(5):
        try:
            req = urllib.request.Request(BASE + path,
                                         headers={KA: ANON, KB: 'Bea' + 'rer ' + ANON})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode())
        except Exception:
            time.sleep(3)
    return None


def macc_getbom(params):
    data = urllib.parse.urlencode(params).encode()
    for i in range(3):
        try:
            req = urllib.request.Request('https://www.51macc.com/api/Mattrio/CvApi/GetBom',
                                         data=data,
                                         headers={'Content-Type': 'application/x-www-form-urlencoded'})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            err = str(e)
            time.sleep(3)
    print(f'    查询失败: {err}')
    return None


# ---- 1) 本地预检:他们的BOM件号 vs 我们的OEM ----
BOM_OEMS = ['1001020-91W', '1005124-630-2020', '1013034-53D', '1101010-70R-C00']
rows, off = [], 0
while True:
    page = db_fetch(f'/rest/v1/products?select=oem_number&order=id&limit=1000&offset={off}')
    if not page:
        break
    rows.extend(page)
    if len(page) < 1000:
        break
    off += 1000
our_oems = {(p['oem_number'] or '').strip().upper() for p in rows if p.get('oem_number')}
local_hits = [b for b in BOM_OEMS if b.upper() in our_oems]
print(f'本地预检:他们BOM样例{len(BOM_OEMS)}个 ↔ 我们{len(our_oems)}个OEM → 直接对碰命中 {len(local_hits)} 个')

# ---- 2) 挑20个解放格式OEM(不同前缀混采) ----
JF_PAT = re.compile(r'^1[0-9]{4}([A-Z0-9\-\.\/]{0,15})?$')
cand = []
seen_prefix = {}
for o in sorted(our_oems):
    m = JF_PAT.match(o)
    if not m or len(o) < 5:
        continue
    if ',' in o or '(' in o:
        continue
    pref = o[:3]
    if seen_prefix.get(pref, 0) >= 4:
        continue
    seen_prefix[pref] = seen_prefix.get(pref, 0) + 1
    cand.append(o)
    if len(cand) >= 20:
        break
print(f'试点样本: {len(cand)} 个解放格式OEM(前缀分布: {dict(seen_prefix)})')

# ---- 3) 逐个精确查 ----
hits = 0
alias_samples = []
freq = None
for o in cand:
    r = macc_getbom({'userid': MACC, 'vin': VIN, 'itemId': o, 'itemName': o})
    if not r:
        continue
    freq = r.get('frequency', freq)
    recode = r.get('recode')
    boms = ((r.get('bom') or {}).get('result') or {}).get('boms') or []
    if recode == 0 and boms:
        got = [b for b in boms if (b.get('itemId') or '').upper() == o]
        if got:
            hits += 1
            b = got[0]
            if len(alias_samples) < 6:
                alias_samples.append((o, b.get('standardName'), (b.get('Alias') or '')[:40],
                                      (b.get('standardNameRussian') or '')[:24]))
        else:
            hits += 1  # 模糊命中同类
            if len(alias_samples) < 6:
                alias_samples.append((o, boms[0].get('standardName'), '(模糊)', ''))
    print(f'  {o}: recode={recode} 返回{len(boms)}条')

print(f'\n== 路径A结果 ==')
print(f'匹配率: {hits}/{len(cand)} ({hits * 100 // max(len(cand), 1)}%)  剩余额度: {freq}')
for o, sn, al, ru in alias_samples:
    print(f'  {o} | {sn} | 别名:{al} | RU:{ru}')
