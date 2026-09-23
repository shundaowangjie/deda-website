#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""中配三件套规范化(第二阶段):子表感知重解析 + 跨文件合并去重。

修正第一阶段的三个问题:
1. 刹车皮区吞了蓄电池表头 → 表头行含 安时/CCA 时路由到蓄电池系列;
2. 轴承系列内多张子表(分离轴承总成/轮毂轴承等)→ 子表名取表头首列;
3. 跨文件重复 → 按(系列+关键列+前几列指纹)去重,优先保留修改版。
"""
import json, re
from collections import Counter

BASE = '/home/fan/文档/xwechat_files/wxid_uqld42g0p70a22_ca8b/msg/file/2026-09/'
FILES = [('中配配件修改版.txt', 3), ('中配配件2.txt', 2), ('中配配件.txt', 1)]

REGISTRY = {
    '制动室系列': 'brake-system', '离合总泵系列': 'drivetrain', '离合助力器系列': 'drivetrain',
    '干燥器系列': 'brake-system', '泵阀系列': 'brake-system', '手控阀系列': 'brake-system',
    '继动阀系列': 'brake-system', '调压阀系列': 'brake-system', '四回路保护阀系列': 'brake-system',
    '刹车皮系列': 'brake-system', '蓄电池系列': 'electrical', '机油滤芯系列': 'filters',
    '燃油滤芯系列': 'filters', '柴油滤清器': 'filters', '油水分离器': 'filters',
    '机油滤清器': 'filters', '空滤芯系列': 'filters', '横接头系列': 'other',
    '直接头系列': 'other', '主肖修理包系列': 'chassis-suspension',
    'U型螺栓/轮胎螺丝系列': 'fastener', '刹车滚轮系列': 'brake-system',
    '螺丝系列': 'fastener', '其它紧固件系列': 'fastener', '轴承系列': 'bearing',
}
SEC_KEYS = sorted(REGISTRY, key=len, reverse=True)
INTRO_RE = re.compile(r'^(以下是|-|#|\*\*)')
HEADER_CELL = re.compile(r'(车型|OEM|oem|型号|名称|内径|外径|高度|宽度|厚度|直径|长度|规格|说明|包装|重量|孔数|铆径|位置|过水|牙径|安时|CCA|缸径|气孔|气口|推杆|后杆|拔叉|接叉|发哈孔|强油口|进油口|出油口|安装|车系|层数|螺母|对边)')


def find_section(ln):
    for k in SEC_KEYS:
        if k in ln and len(ln) < 45:
            return k
    return None


def split_cols(ln):
    if '|' in ln:
        return [c.strip() for c in ln.split('|') if c.strip()]
    if '\t' in ln:
        return [c.strip() for c in ln.split('\t') if c.strip()]
    parts = re.split(r'\s{2,}', ln.strip())
    return parts if len(parts) >= 3 else None


def is_header(cells):
    hits = sum(1 for c in cells if HEADER_CELL.search(c) and len(c) <= 20)
    return hits >= 2 and not re.match(r'^\d{4,}', cells[0])


records = []
for fn, prio in FILES:
    cur_sec, cur_cols = None, None
    for ln in open(BASE + fn, encoding='utf-8').read().splitlines():
        s = ln.strip()
        if not s:
            continue
        sec = find_section(s)
        if sec:
            cur_sec, cur_cols = sec, None
            continue
        if INTRO_RE.match(s):
            continue
        cells = split_cols(s)
        if not cells:
            continue
        if is_header(cells):
            if any(('安时' in c or 'CCA' in c or 'AH' in c) for c in cells):
                cur_sec = '蓄电池系列'
            cur_cols = cells
            continue
        if cur_sec:
            records.append({'prio': prio, 'sec': cur_sec, 'cols': cur_cols, 'vals': cells})

print(f'重解析记录={len(records)}')


def key_col(cols):
    if not cols:
        return 0
    for i, c in enumerate(cols):
        if 'OEM' in c or 'oem' in c:
            return i
    for i, c in enumerate(cols):
        if '型号' in c or '名称' in c:
            return i
    return 0


def subtable_name(cols):
    if cols and re.match(r'^[\u4e00-\u9fa5]{2,10}$', cols[0]) and not HEADER_CELL.search(cols[0]):
        return cols[0]
    return ''


seen, final = set(), []
drop_by_file = Counter()
for r in sorted(records, key=lambda x: -x['prio']):
    k = key_col(r['cols'])
    key_val = r['vals'][k] if k < len(r['vals']) else ''
    ident = (r['sec'], key_val, ' '.join(v for v in r['vals'][:5])[:60])
    if ident in seen:
        drop_by_file[r['prio']] += 1
        continue
    seen.add(ident)
    final.append({
        'sec': r['sec'], 'cat': REGISTRY[r['sec']], 'sub': subtable_name(r['cols']),
        'cols': r['cols'], 'vals': r['vals'], 'src': r['prio'],
    })

print(f'合并去重后={len(final)} (丢弃: 修改版内重复不计,配件2丢{drop_by_file[2]},配件丢{drop_by_file[1]})')
print('分系列统计:')
for k, v in Counter(f"{f['sec']}" + (f"[{f['sub']}]" if f['sub'] else '') for f in final).most_common(40):
    print(f'  [{v:4d}] {k}')
json.dump(final, open('/home/fan/.openclaw/workspace/deda-products/scripts/zhongpei-normalized.json', 'w', encoding='utf-8'), ensure_ascii=False)
print('-> scripts/zhongpei-normalized.json')
