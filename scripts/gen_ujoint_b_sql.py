#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""U型接头产品线 B步:万向节叉 89 款 SQL 生成器。

数据源: 重汽U型接头及配件大全_图册完整转换_20261015.xlsx 的"万向节叉规格"sheet (P13-P21)
厂商: ZHANWANG / DP DRIVESHAFT PARTS (山东济宁瞻程传动)
分类: drivetrain
SKU 段: DD-UV-NNN (未占用)
幂等: WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = ...)
"""
import openpyxl
import re
import os

EXCEL = '/home/fan/.openclaw/workspace/重汽U型接头及配件大全_图册完整转换_20261015.xlsx'
OUT = '/home/fan/.openclaw/workspace/deda-products/sql-batch/ujoint-b-insert.sql'

BRAND = 'ZHANWANG/德达'
CATEGORY = 'drivetrain'

# 系列 -> (英文品名, 中文品名, 俄文品名)
SERIE_NAMES = {
    '587.10': ('Yoke 587.10', '万向节叉 587.10', 'Вилка 587.10'),
    '587.30': ('Yoke 587.30', '万向节叉 587.30', 'Вилка 587.30'),
    '587.35': ('Yoke 587.35', '万向节叉 587.35', 'Вилка 587.35'),
    '687.55': ('Yoke 687.55', '万向节叉 687.55', 'Вилка 687.55'),
    'YC64152': ('Yoke YC64152', '万向节叉 YC64152', 'Вилка YC64152'),
    'GU7620': ('Yoke GU7620', '万向节叉 GU7620', 'Вилка GU7620'),
    'RU50135': ('Yoke RU50135', '万向节叉 RU50135', 'Вилка RU50135'),
    'RU50155': ('Yoke RU50155', '万向节叉 RU50155', 'Вилка RU50155'),
    '385.60': ('Yoke 385.60', '万向节叉 385.60', 'Вилка 385.60'),
    '385.68': ('Yoke 385.68', '万向节叉 385.68', 'Вилка 385.68'),
    '1810': ('Yoke 1810', '万向节叉 1810', 'Вилка 1810'),
}


def q(s):
    """SQL 单引号转义"""
    return "'" + str(s).replace("'", "''") + "'"


def slugify(s):
    s = re.sub(r'[^A-Za-z0-9]+', '-', str(s)).strip('-').lower()
    return s or 'generic'


def load_rows():
    wb = openpyxl.load_workbook(EXCEL)
    ws = wb['万向节叉规格']
    rows = []
    for row in range(5, ws.max_row + 1):
        page = ws.cell(row=row, column=1).value
        no = ws.cell(row=row, column=2).value
        serie = ws.cell(row=row, column=3).value
        d = ws.cell(row=row, column=4).value
        l = ws.cell(row=row, column=5).value
        a = ws.cell(row=row, column=6).value
        o = ws.cell(row=row, column=7).value
        h = ws.cell(row=row, column=8).value
        if serie and d is not None:
            rows.append({
                'page': page, 'no': no, 'serie': str(serie),
                'd': d, 'l': l, 'a': a, 'o': o, 'h': h,
            })
    return rows


def build_sql(rows):
    lines = [
        "-- ================================================================",
        "-- U型接头产品线 B步: 导入万向节叉新产品",
        "-- 日期: 2026-10-15",
        f"-- 说明: 从 U-joint_and_components_1.pdf (P13-P21) 导入 {len(rows)} 条万向节叉规格",
        "-- 厂商: ZHANWANG / DP DRIVESHAFT PARTS (山东济宁瞻程传动)",
        "-- SKU段: DD-UV-001~{0:03d}".format(len(rows)),
        "-- 幂等: 按 slug 去重, 重复执行安全",
        "-- ================================================================",
        "",
    ]
    seen = set()
    sku_counter = 0
    for r in rows:
        serie = r['serie']
        names = SERIE_NAMES.get(serie, (f'Yoke {serie}', f'万向节叉 {serie}', f'Вилка {serie}'))
        name_en, name_zh_base, name_ru_base = names

        # slug 生成: ujoint-yoke-{serie}-{no}; 若重复则追加 -2/-3
        base_slug = f'ujoint-yoke-{slugify(serie)}-{r["no"]}'
        slug = base_slug
        n = 2
        while slug in seen:
            slug = f'{base_slug}-{n}'
            n += 1
        seen.add(slug)

        sku_counter += 1
        sku = f'DD-UV-{sku_counter:03d}'

        # specs JSONB
        specs = {
            '系列': serie,
            '轴孔径mm': r['d'],
            '总长mm': r['l'],
            '法兰mm': r['a'],
            '总高mm': r['h'],
            '图册页': r['page'],
            '厂商': 'ZHANWANG/瞻程',
            '说明': '可定制 (customization is acceptable)',
        }
        if r['o']:
            specs['螺栓孔'] = r['o']
        # JSONB literal: 手工构建避免 json.dumps 引号转义问题
        spec_items = []
        for k, v in specs.items():
            if isinstance(v, (int, float)):
                spec_items.append(f"{q(k)}: {v}")
            else:
                spec_items.append(f"{q(k)}: {q(v)}")
        specs_literal = '{' + ', '.join(spec_items) + '}'

        # 描述文本（products 表无 description_ru 列，只写 description_en/zh）
        dim = f'Φ{r["d"]}xL{r["l"]}'
        flange = f'flange {r["a"]}mm' if r['a'] else ''
        bolt = f', {r["o"]} bolt holes' if r['o'] else ''
        height = f', H={r["h"]}mm' if r['h'] else ''
        de = f'Universal Joint {name_en} by ZHANWANG. Bore {dim}, {flange}{bolt}{height}. Customization available.'
        dz = f'万向节叉 {serie}（瞻程生产）。轴孔径{dim}，法兰{r["a"] if r["a"] else "-"}mm，总高{r["h"] if r["h"] else "-"}mm。可定制。'

        # INSERT 语句
        stmt = (
            f"INSERT INTO products "
            f"(sku, slug, name_en, name_zh, name_ru, brand, category, "
            f"description_en, description_zh, specs, status, created_at, updated_at)\n"
            f"SELECT {q(sku)}, {q(slug)}, {q(name_en)}, {q(name_zh_base)}, {q(name_ru_base)}, "
            f"{q(BRAND)}, {q(CATEGORY)},\n"
            f"  {q(de)}, {q(dz)}, {specs_literal}::jsonb, 'published', NOW(), NOW()\n"
            f"WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = {q(slug)});"
        )
        lines.append(f'-- #{sku_counter} {name_en} (slug={slug})')
        lines.append(stmt)
        lines.append('')

    return '\n'.join(lines)


def main():
    rows = load_rows()
    print(f'读入 {len(rows)} 条万向节叉规格')
    sql = build_sql(rows)
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(sql)
    print(f'已生成: {OUT}')
    print(f'文件大小: {os.path.getsize(OUT)} 字节')


if __name__ == '__main__':
    main()
