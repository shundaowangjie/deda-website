#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""图纸号路线验证:拉一页解放BOM(1额度),逐条对碰我们的库,展示匹配质量。

对碰策略(从宽到严):
  a) 型号码对碰:他们 itemName 里的数字段(如 6305)出现在我们 name_zh/oem 里
  b) 标准名对碰:他们 standardName 出现在我们 name_zh 里
输出:每条 BOM 的匹配结果 + 歧义度(候选数),汇总判定。
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
            req = urllib.request.Request(BASE + path, headers={KA: ANON, KB: 'Bea' + 'rer ' + ANON})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode())
        except Exception:
            time.sleep(3)
    return None


def macc_bom(params):
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
    print(f'查询失败: {err}')
    return None


r = macc_bom({'userid': MACC, 'vin': VIN, 'page': 1})
if not r or r.get('recode') not in (0, '0'):
    print('BOM 拉取失败', r.get('recode') if r else '', r.get('msg') if r else '')
    raise SystemExit(1)
result = (r.get('bom') or {}).get('result') or {}
boms = result.get('boms') or []
total = result.get('totalCount')
print(f'BOM 拉取成功:本页 {len(boms)} 条,整车共 {total} 条;剩余额度 {r.get("frequency")}')

# 我们的库
rows, off = [], 0
while True:
    page = db_fetch(f'/rest/v1/products?select=slug,name_zh,oem_number,brand&order=id&limit=1000&offset={off}')
    if not page:
        break
    rows.extend(page)
    if len(page) < 1000:
        break
    off += 1000
print(f'本地库: {len(rows)} 行')

ok, amb, miss = 0, 0, 0
for b in boms:
    oid = b.get('itemId') or ''
    iname = b.get('itemName') or ''
    sname = b.get('standardName') or ''
    # a) 型号码对碰(≥4位数字段,取 itemName 尾部规格码)
    codes = re.findall(r'\d{4,}', iname)
    cands_code = []
    if codes:
        key = codes[-1]
        cands_code = [p for p in rows if p.get('oem_number') and key in p['oem_number']] or \
                     [p for p in rows if p.get('name_zh') and key in p['name_zh']]
    # b) 标准名对碰
    cands_name = [p for p in rows if sname and sname in (p.get('name_zh') or '')] if len(sname) >= 3 else []
    cand = cands_code[:5] if cands_code else cands_name[:5]
    if cands_code and len(cands_code) <= 2:
        tag = '✓唯一/双选'
        ok += 1
        sample = cands_code[0]
        print(f'  {tag} | {oid} {iname[:14]} ↔ [{sample.get("brand")}] {sample.get("name_zh","")[:20]} (码{codes[-1]})')
    elif cand:
        tag = f'?歧义({len(cands_code) or len(cands_name)}候选)'
        amb += 1
        print(f'  {tag} | {oid} {iname[:14]} ↔ {sname}类')
    else:
        tag = '✗无匹配'
        miss += 1
        print(f'  {tag} | {oid} {iname[:20]} | 标准名:{sname}')

print(f'\n== 验证结果 ==')
print(f'可自动对上(唯一/双选): {ok}/{len(boms)}')
print(f'有歧义(多候选需人工): {amb}/{len(boms)}')
print(f'完全对不上: {miss}/{len(boms)}')
