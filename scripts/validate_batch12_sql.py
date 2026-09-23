#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""batch7-small-files.sql 独立三道校验 v2(注释感知):
预处理:逐行剥离 -- 注释(引号外),再按 ; 切分语句。
① INSERT 数 = 20
② 每条语句单引号配平且切分后无残留
③ 每条 SELECT 第5值(brand)非 NULL 非空
"""
import sys

PATH = '/home/fan/.openclaw/workspace/deda-products/scripts/batch12-ruiji.sql'
src = open(PATH, encoding='utf-8').read()

# --- 预处理:逐行剥离注释(引号外 -- 到行尾) ---
clean_lines, in_q = [], False
for ln in src.splitlines():
    out, j = [], 0
    while j < len(ln):
        c = ln[j]
        if in_q:
            out.append(c)
            if c == "'":
                if j + 1 < len(ln) and ln[j + 1] == "'":
                    out.append("'")
                    j += 1
                else:
                    in_q = False
        else:
            if c == "'":
                in_q = True
                out.append(c)
            elif c == '-' and j + 1 < len(ln) and ln[j + 1] == '-':
                break
            else:
                out.append(c)
        j += 1
    clean_lines.append(''.join(out))
clean = '\n'.join(clean_lines)

# --- 按分号切语句(引号感知) ---
stmts, buf, in_q2 = [], [], False
i = 0
while i < len(clean):
    c = clean[i]
    if in_q2:
        buf.append(c)
        if c == "'":
            if i + 1 < len(clean) and clean[i + 1] == "'":
                buf.append("'")
                i += 1
            else:
                in_q2 = False
    else:
        if c == "'":
            in_q2 = True
            buf.append(c)
        elif c == ';':
            buf.append(';')
            stmts.append(''.join(buf).strip())
            buf = []
        else:
            buf.append(c)
    i += 1
tail = ''.join(buf).strip()

inserts = [s for s in stmts if s.startswith('INSERT INTO products')]
print(f"① INSERT 数 = {len(inserts)} (期望 1776)", "PASS" if len(inserts) == 1776 else "FAIL")
print(f"② 尾部残留: {tail[:50]!r}", "PASS" if not tail else "FAIL")
print(f"② 预处理+切分后引号状态: in_q={in_q or in_q2}", "PASS" if not (in_q or in_q2) else "FAIL")

ok3 = True
for s in inserts:
    if not s.endswith(';'):
        print("  FAIL 不以;结尾:", s[:60])
        ok3 = False
        continue
    a = s.find('SELECT ')
    b = s.find(' WHERE NOT EXISTS')
    if a < 0 or b < 0:
        print("  FAIL 结构异常:", s[:60])
        ok3 = False
        continue
    body = s[a + 7:b]
    vals, cur, q = [], [], False
    j = 0
    while j < len(body):
        ch = body[j]
        if q:
            cur.append(ch)
            if ch == "'":
                if j + 1 < len(body) and body[j + 1] == "'":
                    cur.append("'")
                    j += 1
                else:
                    q = False
        else:
            if ch == "'":
                q = True
                cur.append(ch)
            elif ch == ',':
                vals.append(''.join(cur).strip())
                cur = []
            else:
                cur.append(ch)
        j += 1
    vals.append(''.join(cur).strip())
    if len(vals) != 12:
        print(f"  FAIL 值数={len(vals)} != 11:", s[:60])
        ok3 = False
        continue
    brand = vals[4]
    if brand == 'NULL' or brand.strip("'") == '':
        print(f"  FAIL brand空: {s[:60]}")
        ok3 = False
print("③ brand(第5值)非空:", "PASS" if ok3 else "FAIL")

sys.exit(0 if (len(inserts) == 1776 and not tail and not (in_q or in_q2) and ok3) else 1)
