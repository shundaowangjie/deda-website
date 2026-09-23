#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""任丘弗兰卡(隆顺达)风扇叶画册解析器:676行 → LY卡 JSON。

格式:LY001 | ZB20H-280-300-14 重汽7057(尼龙) 图号：202V06600-7057
变体:无型号行(φ450 正吹8叶.../J6 喷水壶/车用尿素溶液)、双语描述(尾随英文句)。
系列标题:= 分隔块内非LY行。英文尾用正则剥离进note。
"""
import json, re

SRC = '/home/fan/文档/xwechat_files/wxid_uqld42g0p70a22_ca8b/msg/file/2026-09/任丘市弗兰卡汽车部件画册.txt'
lines = open(SRC, encoding='utf-8').read().splitlines()

CARD_RE = re.compile(r'^(LY\d+)\s*\|\s*(.+)$')
FIG_RE = re.compile(r'图号[：:]\s*([A-Za-z0-9\-/.]+)')
EN_TAIL_RE = re.compile(r'\s+[A-Za-z][A-Za-z ,.\-/&()0-9]{6,}$')

cards, cur_sec = [], None
for ln in lines:
    s = ln.strip()
    if not s or set(s) >= {'='}:
        continue
    m = CARD_RE.match(s)
    if m:
        ly, rest = m.group(1), m.group(2).strip()
        fig = ''
        mf = FIG_RE.search(rest)
        if mf:
            fig = mf.group(1)
            rest = FIG_RE.sub('', rest).strip()
        parts = rest.split(None, 1)
        model = ''
        desc = rest
        if parts and re.match(r'^[ZFφΦ][0-9φΦ]|^[0-9]', parts[0]) and re.search(r'-', parts[0]):
            model = parts[0]
            desc = parts[1].strip() if len(parts) > 1 else ''
        zh = EN_TAIL_RE.sub('', desc).strip(' ,，')
        en = desc[len(zh):].strip() if len(desc) > len(zh) else ''
        cards.append({'ly': ly, 'model': model, 'zh': zh[:60], 'en': en[:80], 'fig': fig, 'sec': cur_sec})
        continue
    if not re.match(r'^(LY|风扇示意图)', s):
        cur_sec = EN_TAIL_RE.sub('', s)[:40]

from collections import Counter
print(f'卡片数={len(cards)}')
secs = Counter(c['sec'] or '(无)' for c in cards)
print('系列分布(前15):')
for k, v in secs.most_common(15):
    print(f'  [{v:3d}] {k}')
nomodel = [c for c in cards if not c['model']]
print(f'无型号卡={len(nomodel)},样例:', [(c["ly"], c["zh"]) for c in nomodel[:6]])
figs = [c['fig'] for c in cards if c['fig']]
print(f'带图号={len(figs)},图号重复={sum(1 for _, v in Counter(figs).items() if v > 1)}个')
dups_ly = {k: v for k, v in Counter(c['ly'] for c in cards).items() if v > 1}
print('LY重复:', dups_ly if dups_ly else '无')
print('样例:', json.dumps(cards[0], ensure_ascii=False), '|', json.dumps(cards[-2], ensure_ascii=False))
json.dump(cards, open('/home/fan/.openclaw/workspace/deda-products/scripts/fanka-parsed.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('-> scripts/fanka-parsed.json')
