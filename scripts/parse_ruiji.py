#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""瑞立产品介绍图册解析器(280页文本层 → ruiji-parsed.json)。

卡片结构:产品名称:xxx (坐标噪声) / 规格型号: / 产品图号:xxx (B5-3) / 瑞立老图号: / 主机号: / 参数:多行
系列名:页眉 "<系列>参数 返回目录"。目录页(1-2)跳过。对账:目录32系列1752品类。
"""
import json, re

data = open('/tmp/ruiji.txt', encoding='utf-8').read()
pages = data.split('\f')

CARD_RE = re.compile(r'^产品名称[：:]\s*(.+)$')
COORD_RE = re.compile(r'\s*\(\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+\s*,\s*-?\d+\s*\)\s*$')
POSTAG_RE = re.compile(r'\s*\([A-Za-z0-9\-]{1,8}\)\s*$')
SERIES_RE = re.compile(r'(\S{1,12})参数\s*返回目录')
FIELDS = ('规格型号', '产品图号', '瑞立老图号', '主机号')

cards, cur, cur_series = [], None, None
for pno, page in enumerate(pages, 1):
    in_params = False
    for raw in page.splitlines():
        s = raw.strip()
        if not s:
            continue
        m = SERIES_RE.search(s)
        if m:
            cur_series = m.group(1)
            continue
        cm = CARD_RE.match(s)
        if cm:
            if cur:
                cards.append(cur)
            cur = {'page': pno, 'series': cur_series, 'name': COORD_RE.sub('', cm.group(1)).strip()}
            in_params = False
            continue
        if cur is None:
            continue
        hit = False
        for fld in FIELDS:
            if s.startswith(fld):
                val = s.split(':', 1)[1].strip() if (':' in s or '：' in s) else ''
                cur[fld] = POSTAG_RE.sub('', COORD_RE.sub('', val)).strip()
                hit = True
                break
        if hit:
            continue
        if s.startswith('参数'):
            cur['params'] = s.split(':', 1)[1].strip() if ':' in s else ''
            in_params = True
            continue
        if in_params and not re.match(r'^\d+\s', s) and len(s) > 3:
            cur['params'] = (cur.get('params', '') + ' ' + s).strip()
if cur:
    cards.append(cur)

print(f'卡片总数={len(cards)}(目录声明1752)')
from collections import Counter
sc = Counter(c['series'] for c in cards)
print('分系列(前35):')
for k, v in sc.most_common(35):
    print(f'  [{v:4d}] {k}')
nofig = [c for c in cards if not c.get('产品图号')]
print(f'无产品图号卡片={len(nofig)}')
figs = [c['产品图号'] for c in cards if c.get('产品图号')]
dups = {k: v for k, v in Counter(figs).items() if v > 1}
print(f'图号重复={len(dups)}', list(dups.items())[:8])
print('样例:', json.dumps(cards[0], ensure_ascii=False)[:220])
json.dump(cards, open('/home/fan/.openclaw/workspace/deda-products/scripts/ruiji-parsed.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('-> scripts/ruiji-parsed.json')
