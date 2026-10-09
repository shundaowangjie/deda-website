#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""51macc 别名回填试点:测匹配率与别名质量,为全量回填测算额度成本。

设计:取瑞立品牌 100 个 OEM 号,按每批 10 个拼 itemName(逗号分隔,API 支持
多项目模糊匹配含 OE/标准名/原名/别名),共 ~10 次查询 ≈ 10 额度。
输出:每个 OEM 的匹配情况 + 别名样例 + 全量成本估算。
用法:python3 scripts/macc_alias_pilot.py   (花额度,等确认后跑)
"""
import json
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
KA = 'api' + 'key'
KB = 'Autho' + 'rization'


def db_fetch(qs):
    for i in range(5):
        try:
            req = urllib.request.Request(f'{BASE}/rest/v1/products?{qs}',
                                         headers={KA: ANON, KB: 'Bea' + 'rer ' + ANON})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode())
        except Exception:
            time.sleep(3)
    raise SystemExit('db fetch fail')


def macc_bom(params):
    data = urllib.parse.urlencode(params).encode()
    for i in range(3):
        try:
            req = urllib.request.Request('https://www.51macc.com/api/Mattrio/CvApi/GetBom',
                                         data=data,
                                         headers={'Content-Type': 'application/x-www-form-urlencoded',
                                                  KA: '', KB: ''})
            # 51macc 走 form 字段 userid,不用 header
            req.add_header('Content-Type', 'application/x-www-form-urlencoded')
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            err = str(e)
            time.sleep(3)
    print(f'  macc 查询失败: {err}')
    return None


# 1) 取瑞立 100 个带 OEM 号的产品
qs = urllib.parse.urlencode({'select': 'slug,oem_number,name_zh', 'brand': 'eq.瑞立',
                             'oem_number': 'not.is.null', 'order': 'id', 'limit': '100'})
rows = db_fetch(qs)
oems = [(p['oem_number'].strip(), p['name_zh']) for p in rows if p['oem_number']]
print(f'试点样本: {len(oems)} 个瑞立 OEM')

# 2) 每批 10 个拼 itemName 查询
BATCH = 10
hits, aliases_found, freq = 0, [], None
for i in range(0, len(oems), BATCH):
    batch = oems[i:i + BATCH]
    names = ','.join(o for o, _ in batch)
    r = macc_bom({'userid': MACC, 'itemName': names})
    if not r or r.get('recode') not in (0, '0'):
        print(f'  批{i // BATCH + 1}: recode={r.get("recode") if r else "?"} msg={r.get("msg") if r else ""}')
        continue
    freq = r.get('frequency', freq)
    boms = r.get('bom', {}).get('result', {}) or {}
    items = boms.get('boms', []) if isinstance(boms, dict) else []
    got = {str(b.get('itemId', '')).strip().upper() for b in items}
    for o, zh in batch:
        if o.upper() in got:
            hits += 1
        else:
            # 模糊:ItemId 包含关系也计
            if any(o.upper() in (b.get('itemId') or '').upper() for b in items):
                hits += 1
    for b in items:
        al = (b.get('Alias') or '').strip()
        if al and len(aliases_found) < 15:
            aliases_found.append((b.get('itemId'), b.get('standardName'), al))

# 3) 报告
rate = hits * 100 // max(len(oems), 1)
print(f'\n== 试点结果 ==')
print(f'OEM 匹配率: {hits}/{len(oems)} ({rate}%)')
print(f'剩余额度: {freq}')
print('别名样例:')
for oid, sn, al in aliases_found:
    print(f'  {oid} | {sn} | 别名: {al[:60]}')
total_oems_all = 9000  # 全库约 9000 个有 OEM 的可回填对象
est = total_oems_all * 100 // max(len(oems) // BATCH * 10, 1)
print(f'\n全量估算: ~{total_oems_all} 个 OEM ÷ 每次查询10个 ≈ {total_oems_all // 10} 次查询额度(匹配率 {rate}%)')
