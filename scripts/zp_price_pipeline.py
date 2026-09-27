#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""中配采购价 → 参考价管线。

输入:/tmp/zp-results.json(浏览器 Blob 下载的跑批结果)
      /tmp/oe-map.json(slug → {oe, cat})
规则:参考价 = 采购价 × 品类系数,四舍五入取整;buy 无效跳过
输出:对照表 CSV(review)+ UPDATE SQL(batch22)
"""
import csv
import json
import math

COEF = {
    'bearing': 1.5,
    'brake-system': 1.5,
    'filters': 1.6,
    'electrical': 1.25,
    'clutch': 1.45,
    'belt': 1.55,
}
DEFAULT_COEF = 1.45

results = json.load(open('/tmp/zp-results.json', encoding='utf-8'))
oe_map = json.load(open('/tmp/oe-map.json', encoding='utf-8'))

# oe → 采购价(取首个命中)
oe_price = {}
oe_info = {}
for r in results:
    if r.get('hit') and r.get('buy') not in (None, 0, '', '0'):
        oe = r['oe']
        if oe not in oe_price:
            oe_price[oe] = float(r['buy'])
            oe_info[oe] = r

rows_out = []
sql = ["-- 批次22:参考价回填(中配采购价×品类系数,来源标注见对照表)",
       "-- 幂等:WHERE slug 定位,重复执行同值无副作用", '']
n_priced = 0
for slug, m in oe_map.items():
    oe, cat = m['oe'], m['cat']
    if oe not in oe_price:
        continue
    buy = oe_price[oe]
    coef = COEF.get(cat, DEFAULT_COEF)
    ref = max(1, int(math.round(buy * coef))) if False else max(1, round(buy * coef))
    info = oe_info[oe]
    rows_out.append([slug, oe, info.get('name', ''), info.get('brand', ''), cat, buy, coef, ref])
    sql.append(f"UPDATE products SET price = {ref} WHERE slug = '{slug}';")
    n_priced += 1

# 对照表
with open('/home/fan/.openclaw/workspace/sql-batch/price-batch22-review.csv', 'w', encoding='utf-8-sig', newline='') as f:
    w = csv.writer(f)
    w.writerow(['slug', 'OE', '中配品名', '品牌', '品类', '采购价', '系数', '建议参考价'])
    w.writerows(rows_out)

sql_text = '\n'.join(sql) + '\n'
open('/home/fan/.openclaw/workspace/sql-batch/batch22-price-import.sql', 'w', encoding='utf-8').write(sql_text)

total_hit = sum(1 for r in results if r.get('hit'))
print(f'跑批结果:{len(results)} 查询 / {total_hit} 命中 / {len(oe_price)} 个唯一OE有价')
print(f'可标价 slug:{n_priced}(其余留询价)')
print(f'-> 对照表 sql-batch/price-batch22-review.csv({len(rows_out)} 行)')
print(f'-> SQL sql-batch/batch22-price-import.sql({n_priced} 条 UPDATE,{len(sql_text)} 字节)')
by_cat = {}
for r0 in rows_out:
    by_cat[r0[4]] = by_cat.get(r0[4], 0) + 1
print('分品类:', by_cat)
