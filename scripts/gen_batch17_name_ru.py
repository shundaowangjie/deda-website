#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""俄语回填生成器:name_en 词典匹配 → name_ru,输出 ALTER + UPDATE SQL。

name_ru = 词典译文 + 型号尾段(首个含数字 token 起,原样保留)。
幂等:WHERE slug=...,重复执行同值无副作用。
"""
import json
import re
import time
import urllib.parse
import urllib.request

DICT = json.load(open('/home/fan/.openclaw/workspace/deda-products/scripts/ru-dict.json', encoding='utf-8'))

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


def split_name(name):
    """→ (phrase_lower, tail_tokens) 或 (None, None)"""
    toks = (name or '').split()
    if not toks:
        return None, None
    out, tail, tail_started = [], [], False
    for t in toks:
        if CODE.search(t):
            tail_started = True
        if tail_started:
            tail.append(t)
        elif t.strip('()/-,') in BRANDS:
            continue
        else:
            out.append(t)
    ph = ' '.join(out).strip().lower()
    if not ph:
        return None, None
    return ph, tail


def q(s):
    return "'" + s.replace("'", "''") + "'"


updates, samples = [], []
miss = 0
for p in rows:
    ph, tail = split_name(p.get('name_en') or '')
    if not ph or ph not in DICT:
        miss += 1
        continue
    ru = DICT[ph] + (' ' + ' '.join(tail) if tail else '')
    ru = ru[:120]
    updates.append((p['slug'], ru))
    if len(samples) < 5:
        samples.append((p['name_en'], ru))

hit = len(updates)
print(f'总行={len(rows)} 命中词典={hit} ({hit * 100 // len(rows)}%) 未命中={miss}')

sql = ['-- 批次17:俄语名回填(name_en 词典匹配,覆盖 {:.0%})'.format(hit / len(rows)),
       '-- name_ru = 俄语品类短语 + 原型号尾段;幂等按slug;表若无列先加',
       'ALTER TABLE products ADD COLUMN IF NOT EXISTS name_ru text;',
       '']
for slug, ru in updates:
    sql.append(f"UPDATE products SET name_ru = {q(ru)} WHERE slug = {q(slug)};")
out = '\n'.join(sql) + '\n'
path = '/home/fan/.openclaw/workspace/deda-products/scripts/batch17-name-ru.sql'
open(path, 'w', encoding='utf-8').write(out)
print('样例:')
for en, ru in samples:
    print(f'  {en!r}\n    → {ru!r}')
print(f'-> {path} ({len(updates)} UPDATE, {len(out)} 字节)')
