#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""弗兰卡解析器v2:修复换行断裂/LY前缀分离/多竖线表格/重复块。"""
import json, re
from collections import Counter

SRC = '/home/fan/文档/xwechat_files/wxid_uqld42g0p70a22_ca8b/msg/file/2026-09/任丘市弗兰卡汽车部件画册.txt'
raw = open(SRC, encoding='utf-8').read().splitlines()

CARD_RE = re.compile(r'^(LY\d+)\s*\|\s*(.+)$')
WRAP_RE = re.compile(r'^(\d{1,3})\s*\|\s*(.+)$')
TBL_RE = re.compile(r'^([A-Za-z]{1,4}[0-9][A-Za-z0-9/]*)\s*\|(.+)$')
FIG_RE = re.compile(r'图号[：:]\s*([A-Za-z0-9\-/.]+)')
EN_TAIL_RE = re.compile(r'\s+[A-Za-z][A-Za-z ,.\-/&()0-9]{6,}$')
DIV_RE = re.compile(r'^[-=—]{5,}$')
LEGEND_RE = re.compile(r'^(注明|注[:：]|Z表示|风扇示意图)')


def is_model(tok):
    return bool(re.match(r'^[ZFφΦ(]', tok) or re.match(r'^\d', tok)) and bool(re.search(r'\d', tok)) and len(tok) <= 24


norm = []
for ln in raw:
    s = ln.strip()
    if not s:
        continue
    if DIV_RE.match(s):
        norm.append(('DIV', ''))
        continue
    if LEGEND_RE.match(s):
        continue
    m = CARD_RE.match(s)
    if m:
        norm.append(('CARD', f'{m.group(1)}|{m.group(2)}'))
        continue
    m = WRAP_RE.match(s)
    if m and 1 <= int(m.group(1)) <= 999:
        norm.append(('CARD', f'LY{int(m.group(1)):03d}|{m.group(2)}'))
        continue
    m = TBL_RE.match(s)
    if m:
        norm.append(('TBL', s))
        continue
    norm.append(('TXT', s))

cards, cur_sec = [], None
for kind, val in norm:
    if kind == 'DIV':
        continue
    if kind == 'CARD':
        ly, rest = val.split('|', 1)
        rest = rest.strip()
        fig = ''
        mf = FIG_RE.search(rest)
        if mf:
            fig = mf.group(1)
            rest = FIG_RE.sub('', rest).strip()
        parts = rest.split(None, 1)
        model, desc = '', rest
        if parts and is_model(parts[0]):
            model = parts[0]
            desc = parts[1].strip() if len(parts) > 1 else ''
        zh = EN_TAIL_RE.sub('', desc).strip(' ,，')
        cards.append({'ly': ly, 'model': model, 'zh': zh[:60], 'fig': fig, 'sec': cur_sec})
    elif kind == 'TBL':
        parts = [p.strip() for p in val.split('|') if p.strip()]
        cards.append({'ly': '', 'model': parts[0], 'zh': ' '.join(parts[1:])[:60], 'fig': '', 'sec': cur_sec, 'tbl': True})
    else:
        if ('系列' in val or '/' in val) and len(val) <= 45 and not re.match(r'^\d', val) and '|' not in val:
            cur_sec = EN_TAIL_RE.sub('', val)[:40]
        elif cards and len(val) <= 50 and re.search(r'[\u4e00-\u9fa5]', val):
            cards[-1]['zh'] = (cards[-1]['zh'] + ' ' + val)[:60]

seen, final = set(), []
for c in cards:
    key = c['ly'] or f"{c.get('model', '')}|{c['zh']}"
    if key in seen:
        continue
    seen.add(key)
    final.append(c)

print(f'去重后卡片={len(final)} (原始{len(cards)})')
print('系列分布(前16):')
for k, v in Counter((c['sec'] or '(无)') for c in final).most_common(16):
    print(f'  [{v:3d}] {k}')
nm = [c for c in final if not c['model']]
print(f'无型号卡={len(nm)},样例:', [(c["ly"], c["zh"][:20]) for c in nm[:5]])
figs = [c['fig'] for c in final if c['fig']]
fd = {k: v for k, v in Counter(figs).items() if v > 1}
print(f'带图号={len(figs)} 图号重复={len(fd)}个')
print('样例:', json.dumps(final[0], ensure_ascii=False)[:150], '|', json.dumps(final[-1], ensure_ascii=False)[:150])
json.dump(final, open('/home/fan/.openclaw/workspace/deda-products/scripts/fanka-parsed.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('-> scripts/fanka-parsed.json')
