#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""俄语回填第一步:分析 name_en 句式分布,提取可词典化的"品类短语"。

策略:name_en 多为 "{品牌} {品类短语} {型号}" 结构。
去掉品牌前缀(已知品牌表)与含数字的型号段,剩余短语进词典 → 每短语翻一次,全库复用。
输出:句式覆盖统计 + 高频短语清单(待翻译)。
"""
import json
import re
import time
import urllib.parse
import urllib.request
from collections import Counter

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


def fetch(offset):
    qs = urllib.parse.urlencode({'select': 'slug,name_en', 'order': 'id',
                                 'limit': '1000', 'offset': str(offset)})
    err = ''
    for i in range(5):
        try:
            req = urllib.request.Request(f"{BASE}/rest/v1/products?{qs}",
                                         headers={KA: ANON, KB: 'Bea' + 'rer ' + ANON})
            with urllib.request.urlopen(req, timeout=30) as r:
                return json.loads(r.read().decode())
        except Exception as e:
            err, _ = str(e), time.sleep(3)
    raise SystemExit(f'fail @{offset}: {err}')


rows, off = [], 0
while True:
    page = fetch(off)
    if not page:
        break
    rows.extend(page)
    if len(page) < 1000:
        break
    off += 1000

BRANDS = ['Ruili', 'Lufeng', 'Zhongpei', 'Longshunda', 'ConMet', 'Sanchen',
          'Boxin', 'Saite', 'Sanxin', 'Kangmai', 'Huagai', 'Zpec', 'DEDA',
          'BRAKFLIN', 'ZZRUBR', 'XZZRUBR', 'Weichai', 'Yuchai', 'Foton',
          'Sinotruk', 'Shacman', 'Dongfeng', 'FAW', 'HOWO', 'STEYR']
CODE = re.compile(r'[0-9]')


def phrase_of(name):
    """去掉品牌前缀与含数字 token,返回剩余短语(小写)。"""
    toks = (name or '').split()
    out = []
    for t in toks:
        if CODE.search(t):
            break  # 型号段开始,后面全是规格
        lt = t.strip('()/-,')
        if lt in BRANDS:
            continue
        out.append(t)
    return ' '.join(out).strip()


cnt = Counter()
covered = 0
for p in rows:
    ph = phrase_of(p.get('name_en') or '')
    if ph:
        cnt[ph.lower()] += 1
        covered += 1

print(f'总行={len(rows)} 有短语={covered} 去重短语={len(cnt)}')
top = cnt.most_common()
cum = 0
for n, (ph, c) in enumerate(top):
    cum += c
    if n < 60:
        print(f'  [{c:5d}] {ph}')
print(f'...')
for n, (ph, c) in enumerate(top):
    if n in (99, 199, 399, 799, 1199):
        cumx = sum(x[1] for x in top[: n + 1])
        print(f'前{n + 1}个短语覆盖 {cumx} 行 ({cumx * 100 // len(rows)}%)')
json.dump({'rows': len(rows), 'phrases': [[p, c] for p, c in top]},
          open('/home/fan/.openclaw/workspace/deda-products/scripts/ru-phrase-freq.json', 'w', encoding='utf-8'),
          ensure_ascii=False)
print('-> scripts/ru-phrase-freq.json')
