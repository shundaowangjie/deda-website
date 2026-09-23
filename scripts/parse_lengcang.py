#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""解析冷藏车配件.txt(1327行)→ 结构化 JSON + 统计。

格式特点:卡片以"编号[:： ]xxxx"为锚;名称多在编号行上方;字段行含
重量/厚度/尺寸标注/用管/配xx管等;混有OCR图片描述散文(跳过并计数);
系列标题行(如"冷藏车不锈钢合页")作分组。无编号具名条目单独列出。
"""
import json, re

SRC = '/home/fan/文档/xwechat_files/wxid_uqld42g0p70a22_ca8b/msg/file/2026-09/冷藏车配件.txt'
raw = [ln.strip() for ln in open(SRC, encoding='utf-8').read().splitlines()]

CODE_RE = re.compile(r'编号[：:]?\s*(\d{3,4})')
FIELD_KEYS = ['重量', '厚度', '尺寸标注', '用管', '配用', '用中', '用22', '用27', '重', '材质']
SECTION_HINT = re.compile(r'^(冷藏车|加工|.*系列|.*门锁$|.*合页$|.*包角.*|.*肉钩.*|.*拉环.*|.*灯.*|.*开关.*|.*脚踏.*|.*风钩.*|.*钩.*|.*附件.*)$')

cards, section = [], None
prose = []
i, n = 0, len(raw)
while i < n:
    ln = raw[i]
    if not ln:
        i += 1
        continue
    if len(ln) > 40 or ('产品展示图' in ln) or ('这张' in ln) or ('排列' in ln) or ('图中' in ln):
        prose.append(ln)
        i += 1
        continue
    if SECTION_HINT.match(ln) and not CODE_RE.search(ln):
        section = ln
        i += 1
        continue
    m = CODE_RE.search(ln)
    if m:
        code = m.group(1)
        # 名称:本行去掉编号段后的剩余,或上一行
        name_part = CODE_RE.sub('', ln).strip(' ,，')
        name = name_part if len(name_part) >= 4 else (raw[i - 1] if i > 0 and raw[i - 1] and not CODE_RE.search(raw[i - 1]) and len(raw[i - 1]) < 30 else name_part)
        card = {'code': code, 'name': re.sub(r'[，,]\s*$', '', name).strip(), 'section': section}
        # 向后吞字段行,直到遇下一个编号/系列/空行隔断后的非字段行
        j = i + 1
        while j < n:
            nx = raw[j]
            if not nx or CODE_RE.search(nx) or SECTION_HINT.match(nx):
                break
            if nx.startswith('（尺寸标注') or nx.startswith('(尺寸标注'):
                card['dims'] = nx.strip('（）()')
                j += 1
                continue
            if any(nx.startswith(k) or k in nx[:6] for k in FIELD_KEYS):
                card.setdefault('fields', []).append(nx)
                j += 1
                continue
            if len(nx) <= 24 and not any(c in nx for c in '。;；'):
                card.setdefault('fields', []).append(nx)
                j += 1
                continue
            break
        cards.append(card)
        i = j
        continue
    i += 1

print(f'卡片数={len(cards)} 散文行跳过={len(prose)}')
secs = {}
for c in cards:
    s = c.get('section') or '(无系列)'
    secs[s] = secs.get(s, 0) + 1
print('系列分布:')
for k, v in sorted(secs.items(), key=lambda x: -x[1]):
    print(f'  [{v:3d}] {k}')
from collections import Counter
dups = {k: v for k, v in Counter(c['code'] for c in cards).items() if v > 1}
print('重复编号:', dups if dups else '无')
noname = [c for c in cards if len(c.get('name', '')) < 4]
print(f'名称过短卡片: {len(noname)}')
for c in noname[:8]:
    print('   ', c['code'], '|', repr(c.get('name', ''))[:40], '|', ' / '.join(c.get('fields', [])[:2]))
json.dump(cards, open('/home/fan/.openclaw/workspace/deda-products/scripts/lengcang-parsed.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=1)
print('-> scripts/lengcang-parsed.json')
