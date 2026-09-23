#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""中配三件套统一解析器(中配配件 / 中配配件2 / 中配配件修改版)。

- 系列注册表:21个系列→分类;未注册系列行按最近系列继承;
- 格式自适应:pipe(|) / tab / 多空格;
- 行级解析:跳过"以下是…纯文本"导语、注释行(- 开头)、空行;
- 输出:zhongpei-parsed.json + 分文件×系列行数统计 + 同文件内OEM重复统计。
"""
import json, re
from collections import Counter

BASE = '/home/fan/文档/xwechat_files/wxid_uqld42g0p70a22_ca8b/msg/file/2026-09/'
FILES = ['中配配件.txt', '中配配件2.txt', '中配配件修改版.txt']

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
SEC_KEYS = sorted(REGISTRY.keys(), key=len, reverse=True)

INTRO_RE = re.compile(r'^(以下是|-)');
HEADER_HINT = re.compile(r'(OEM|oem|适用车型|安装尺寸|缸径|铆径|孔数)')


def find_section(ln):
    for k in SEC_KEYS:
        if k in ln and len(ln) < 45:
            return k
    return None


def split_cols(ln):
    if '|' in ln:
        return 'pipe', [c.strip() for c in ln.split('|') if c.strip() != '']
    if '\t' in ln:
        return 'tab', [c.strip() for c in ln.split('\t') if c.strip() != '']
    parts = re.split(r'\s{2,}', ln.strip())
    if len(parts) >= 3:
        return 'space', [p.strip() for p in parts]
    return None, None


records = []
stats = {}
for fn in FILES:
    raw = [ln.rstrip('\n') for ln in open(BASE + fn, encoding='utf-8')]
    cur_sec, cur_fmt, cur_cols = None, None, None
    for ln in raw:
        s = ln.strip()
        if not s:
            continue
        sec = find_section(s)
        if sec:
            cur_sec, cur_fmt, cur_cols = sec, None, None
            continue
        if INTRO_RE.match(s) or s.startswith('#') or s.startswith('**'):
            continue
        fmt, cols = split_cols(s)
        if not cols:
            continue
        if HEADER_HINT.search(s) and len(cols) >= 3 and ('|' in ln or '\t' in ln):
            cur_fmt, cur_cols = fmt, cols
            continue
        if cur_sec and len(cols) >= 2:
            records.append({'file': fn[:6], 'sec': cur_sec, 'fmt': fmt or cur_fmt,
                            'cols': cur_cols, 'vals': cols})
            stats[f"{fn[:6]}|{cur_sec}"] = stats.get(f"{fn[:6]}|{cur_sec}", 0) + 1

print(f'总行记录={len(records)}')
print('分文件×系列统计:')
for k, v in sorted(stats.items(), key=lambda x: -x[1]):
    print(f'  [{v:4d}] {k}')
def oem_idx(r):
    for i, c in enumerate(r.get('cols') or []):
        if 'OEM' in c or 'oem' in c.lower():
            return i
    return 2


oems = [r['vals'][oem_idx(r)] for r in records if len(r['vals']) > oem_idx(r)]
dups = {k: v for k, v in Counter(oems).items() if v > 1}
print(f'OEM重复(跨文件+文件内): {len(dups)} 个')
print('重复Top10:', Counter(dups).most_common(10) if dups else '无')
json.dump(records, open('/home/fan/.openclaw/workspace/deda-products/scripts/zhongpei-parsed.json', 'w', encoding='utf-8'), ensure_ascii=False, indent=0)
print('-> scripts/zhongpei-parsed.json')
