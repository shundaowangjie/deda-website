#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""从《制动室系列》PDF 数据生成 Supabase products 表 INSERT SQL（幂等）。"""

ROWS = [
    # (oem, mount, model_zh, air_port, pos_zh, push, ret, guibian)
    ("14170300000D3-W", "M16*τ120mm", "ST桥", "M22", "前", "L130", "/", "L56"),
    ("9910030030G+TDL", "M16*τ120mm", "ST桥", "M16", "后", "L145", "L95", "L59"),
    ("9910030030G+TDS-L", "M16*τ120mm", "ST桥", "M16", "后", "L160", "L95", "L59"),
    ("9910030030G+TDL-YQ", "M16*τ120mm", "ST桥", "M16", "后", "L145", "L100", "L60"),
    ("9910036020G+TSA", "M16*τ120mm", "ST桥", "M16", "后", "L115", "L95", "L58"),
    ("WG9000360601-W", "M16*τ120mm", "重汽HOWO", "M22", "后", "L160", "L95", "L58"),
    ("WG9000360602-W", "M16*τ120mm", "重汽HOWO", "M22", "后", "L160", "L100", "L58"),
    ("WG9000360600-W", "M16*τ120mm", "重汽HOWO", "M22", "后", "L245", "L95", "L58"),
    ("WG9000360600-W/Q", "M16*τ120mm", "重汽HOWO", "M22", "后", "L245", "L95", "L60"),
    ("39300007009-Q", "M16*τ120mm", "重汽HOWO T7H", "M22", "后左", "/", "L80", "/"),
    ("35300607069-D-W", "M16*τ120mm", "重汽HOWO T7H", "M22", "后右", "/", "L80", "/"),
    ("WJE4A-010-W", "M16*τ120mm", "重汽HOWO T7H", "M16", "后右", "/", "L80", "/"),
    ("WJE4AA-015-W", "M16*τ120mm", "重汽HOWO T7H", "M16", "后右", "/", "L85", "/"),
    ("T3D1MY-W", "M16*τ120mm", "GC挂车", "M16", "前舱", "L185", "/", "L60"),
    ("353001O-230-W/Q", "M16*τ120mm", "GC挂车", "M16", "后", "L260", "/", "/"),
    ("353001O-250-W/Q", "M16*τ120mm", "GC挂车", "M16", "后", "L270", "/", "L58"),
    ("353001O-250-W", "M16*τ120mm", "GC挂车", "M16", "后", "L350", "/", "L58"),
    ("353001O-290-W/Q", "M16*τ120mm", "GC挂车", "M16", "后", "L350", "/", "/"),
    ("353001O-BPW-W", "M16*τ120mm", "GC挂车", "M16", "后", "L240", "/", "L60"),
    ("353001O-BPW+W/Q", "M16*τ120mm", "GC挂车", "M16", "后", "L250", "/", "L57"),
    ("WA92163XL-01401-W", "M12*τ620mm", "HFC782", "M16", "前左", "L30", "L70", "L54"),
    ("WA92163XL-0200-W", "M12*τ620mm", "HFC782", "M16", "后右", "L30", "L70", "L54"),
    ("WA92163XL-012LW-M34", "M14*τ620mm", "HFC782", "M14", "后左", "L30", "L70", "L54"),
    ("WA92163XL032LW+M34", "M14*τ620mm", "HFC782", "M14", "后右", "L30", "L70", "L54"),
    ("WA92163XL-0505-W", "M12*τ620mm", "HFC782", "M14", "后左", "L30", "L80", "/"),
    ("WA92163XL-808-W", "M12*τ620mm", "HFC782", "M16", "后右", "L32", "L80", "/"),
    ("WA9230240JL-010-W", "M16*τ120mm", "XMQ6120", "M16", "后", "L35", "L110", "L57"),
    ("WJE4AA-3538000-W", "M16*τ120mm", "金龙客车", "M16", "后", "/", "L80", "/"),
    ("Y35319092-010-W", "M16*τ120mm", "宇通客车", "M16", "前左", "/", "/", "/"),
    ("Y3519MPZ-010-W", "M16*τ120mm", "宇通客车", "M16", "前右", "/", "/", "/"),
    ("WJE4/24AZ-25300100-W", "M16*τ120mm", "宇通客车", "M16", "后", "/", "L80", "/"),
]

BRAND = {
    "ST桥": ("SINOTRUK", "SINOTRUK STR桥"),
    "重汽HOWO": ("SINOTRUK", "重汽HOWO"),
    "重汽HOWO T7H": ("SINOTRUK", "重汽HOWO T7H"),
    "GC挂车": ("GC", "GC挂车"),
    "HFC782": ("JAC", "江淮HFC782"),
    "XMQ6120": ("KING LONG", "金龙XMQ6120"),
    "金龙客车": ("KING LONG", "金龙客车"),
    "宇通客车": ("YUTONG", "宇通客车"),
}

POS_EN = {
    "前": "Front", "后": "Rear", "后左": "Rear Left", "后右": "Rear Right",
    "前左": "Front Left", "前右": "Front Right", "前舱": "Front Compartment",
}


def slugify(oem: str, brand: str) -> str:
    s = oem.lower()
    s = s.replace("+", "-").replace("/", "-").replace("_", "-")
    while "--" in s:
        s = s.replace("--", "-")
    return f"{brand.lower().replace(' ', '')}-brake-chamber-{s}"


def q(v: str) -> str:
    return "'" + v.replace("'", "''") + "'"


def main() -> None:
    lines = [
        "-- 制动室系列 31 个产品批量入库（来源：产品资料《制动室系列》）",
        "-- 幂等：按 slug 去重，重复执行不会产生重复数据",
        "-- 执行环境：Supabase Dashboard → SQL Editor",
        "",
    ]
    seen_slugs = set()
    for oem, mount, model_zh, air, pos, push, ret, gb in ROWS:
        brand_en, brand_zh_model = BRAND[model_zh]
        slug = slugify(oem, brand_en)
        assert slug not in seen_slugs, f"slug 重复: {slug}"
        seen_slugs.add(slug)
        name_en = f"Brake Chamber {brand_zh_model} {POS_EN[pos]}"
        name_zh = f"制动室 {model_zh} {pos}"
        specs = {
            "安装尺寸": mount,
            "气口": air,
            "安装位置": pos,
            "推杆行程": (push + "mm") if push != "/" else "/",
            "回杆行程": (ret + "mm") if ret != "/" else "/",
            "规变": gb,
        }
        desc_zh = (
            f"制动室（刹车气室），适用车型：{model_zh}，安装位置：{pos}，"
            f"气口 {air}，安装尺寸 {mount}"
            + (f"，推杆行程 {push}mm" if push != "/" else "")
            + (f"，回杆行程 {ret}mm" if ret != "/" else "")
            + "。"
        )
        desc_en = (
            f"Brake chamber for {brand_zh_model} ({POS_EN[pos]} position). "
            f"Air port {air}, mounting {mount}"
            + (f", push rod stroke {push}mm" if push != "/" else "")
            + (f", return rod {ret}mm" if ret != "/" else "")
            + "."
        )
        specs_json = (
            "{"
            + ", ".join(f'"{k}": "{v}"' for k, v in specs.items())
            + "}"
        )
        lines.append(
            "INSERT INTO products "
            "(slug, sku, name_en, name_zh, brand, truck_model, oem_number, category, "
            "description_en, description_zh, specs, status) "
            "SELECT " + ", ".join([
                q(slug), q(oem), q(name_en), q(name_zh), q(brand_en), q(model_zh),
                q(oem), q("brake-system"), q(desc_en), q(desc_zh),
                q(specs_json) + "::jsonb", q("published"),
            ]) + f" WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = {q(slug)});"
        )
    lines.append("")
    out = "\n".join(lines)
    path = "/home/fan/.openclaw/workspace/deda-products/scripts/brake-chamber-batch.sql"
    with open(path, "w", encoding="utf-8") as f:
        f.write(out)
    print(f"rows={len(ROWS)} slugs={len(seen_slugs)} -> {path}")
    print(out[:1500])


if __name__ == "__main__":
    main()
