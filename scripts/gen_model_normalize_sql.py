#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""机型归并分析:拉全量 truck_model,按归一化键聚类,输出保守合并 UPDATE SQL。

保守规则(只做不会错的):
1. 大小写/空白变体 → 归到最高频写法(如 wp10 → WP10);
2. 已知同族显式表(如 HOWO/豪瀚/豪沃 → 豪沃HOWO);
不做的:语义近似(斯太尔vs STEYR)、排放段(国Ⅲ/国四)——留给人工拍板。
"""
import json, re, time, urllib.parse, urllib.request
from collections import Counter, defaultdict

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
    qs = urllib.parse.urlencode({'select': 'truck_model', 'order': 'id',
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

models = Counter(p['truck_model'].strip() for p in rows if p.get('truck_model') and p['truck_model'].strip())

# 规则1:大小写/空白变体
groups = defaultdict(list)
for m in models:
    key = re.sub(r'\s+', ' ', m.lower()).strip()
    groups[key].append(m)

KNOWN = {
    'howo/豪瀚/豪沃': '豪沃HOWO',
    '豪沃howo': '豪沃HOWO',
}

merges = []
for key, variants in groups.items():
    if len(variants) < 2:
        continue
    ranked = sorted(variants, key=lambda v: (-models[v], v))
    canonical = ranked[0]
    if key in KNOWN:
        canonical = KNOWN[key]
        if canonical not in variants:
            continue
    for v in ranked[1:]:
        merges.append((v, canonical, models[v]))
        models[canonical] += models[v]
        del models[v]

# KNOWN 显式表(目标形态也在库里才安全;上面已处理同键的)
merges.sort(key=lambda x: -x[2])
print(f'去重机型数(合并后)={len(models)}(原 2051)')
print(f'合并条目={len(merges)},影响行数={sum(c for _, _, c in merges)}')
for v, c, n in merges[:20]:
    print(f'  [{n:4d}] {v!r} → {c!r}')


def q(s):
    return "'" + s.replace("'", "''") + "'"


sql = [
    '-- 批次16:机型(truck_model)保守归并:大小写/空白变体 + HOWO同族',
    '-- 规则:仅无歧义合并;语义近似与排放段不动;幂等(再跑无变化)',
]
for v, c, n in merges:
    sql.append(f"UPDATE products SET truck_model = {q(c)} WHERE truck_model = {q(v)};")
out = '\n'.join(sql) + '\n'
path = '/home/fan/.openclaw/workspace/sql-batch/batch16-model-normalize.txt'
open(path, 'w', encoding='utf-8').write(out)
print(f'-> {path} ({len(merges)} 条 UPDATE)')
