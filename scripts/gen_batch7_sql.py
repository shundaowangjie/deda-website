#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""批次A(2026-09-19 六小文件)生成 20 条产品 SQL。

来源:微信文件 2026-09/ 下 牵引座/波纹板/制动蹄系列/赛特制动蹄交叉表/大盘片系列。
- 三鑫牵引座 5 款(DD-TS-001~005, chassis-suspension)
- 波纹板 SX90S-B41 1 款(DD-WV-001, other;品牌照录文件尾 BRAKFLINN,待确认)
- 赛特蹄铁 8 款(DD-SHO-001~008, brake-system;4515/4515Q/4551/4551总成/4707/4707总成/德式200/德式200总成)
- 赛特工程机械盘片 4 款(DD-PAD-001~004) + 大盘片超越/引领 2 款(DD-PAD-005~006, brake-system)
- 康迈轮端 OCR 严重乱码,本批不导(披露)
- 4707 制动尺寸:产品页 419*177.8 与交叉表 B=219 冲突,照录并存披露
- 价格不入库;幂等按 slug。
"""

BRAND_TS = "三鑫"
BRAND_WV = "BRAKFLINN"
BRAND_ST = "赛特"

P = []  # (slug, name_zh, name_en, brand, truck_model, category, specs, desc_zh, desc_en)

# ---------- 三鑫牵引座 ----------
P.append(("sanxin-sx90s-b21-traction-seat", "三鑫牵引座 SX90S-B21", "SANXIN Fifth Wheel SX90S-B21",
          BRAND_TS, None, "chassis-suspension",
          {"高度": "165mm", "最大牵引质量": "70T", "牵引座面板厚度": "8mm", "D值": "200KN",
           "额定承载载荷": "30T", "重量": "130KG", "重汽配套图号": "WG9925939002 / WG9525930910"},
          "三鑫牵引座 SX90S-B21,高度165mm,最大牵引质量70T,D值200KN,重汽配套。",
          "SANXIN fifth wheel SX90S-B21: height 165mm, max towing 70T, D-value 200KN, Sinotruk OE refs."))
P.append(("sanxin-sx50s-c21-traction-seat", "三鑫牵引座 SX50S-C21", "SANXIN Fifth Wheel SX50S-C21",
          BRAND_TS, None, "chassis-suspension",
          {"高度": "185mm", "最大牵引质量": "50T", "牵引座面板厚度": "8mm", "重量": "115KG",
           "重汽配套图号": "WG9121935000 / WG9525930500"},
          "三鑫牵引座 SX50S-C21,高度185mm,最大牵引质量50T。",
          "SANXIN fifth wheel SX50S-C21: height 185mm, max towing 50T."))
P.append(("sanxin-sx50s-c32-traction-seat", "三鑫牵引座 SX50S-C32", "SANXIN Fifth Wheel SX50S-C32",
          BRAND_TS, None, "chassis-suspension",
          {"高度": "158mm", "最大牵引质量": "50T", "牵引座面板厚度": "8mm", "重量": "117KG",
           "重汽配套图号": "WG9122935000"},
          "三鑫牵引座 SX50S-C32,高度158mm,最大牵引质量50T。",
          "SANXIN fifth wheel SX50S-C32: height 158mm, max towing 50T."))
P.append(("sanxin-sx90s-a61-traction-seat", "三鑫牵引座 SX90S-A61", "SANXIN Fifth Wheel SX90S-A61",
          BRAND_TS, None, "chassis-suspension",
          {"高度": "200mm", "最大牵引质量": "120T", "牵引座面板厚度": "10mm", "D值": "220KN",
           "额定垂直载荷": "35T", "重量": "185KG", "陕汽配套图号": "DZ912599300012"},
          "三鑫牵引座 SX90S-A61,高度200mm,最大牵引质量120T,D值220KN,陕汽配套。",
          "SANXIN fifth wheel SX90S-A61: height 200mm, max towing 120T, D-value 220KN, Shaanxi Auto OE ref."))
P.append(("sanxin-sx90s-b41-traction-seat", "三鑫牵引座 SX90S-B41", "SANXIN Fifth Wheel SX90S-B41",
          BRAND_TS, None, "chassis-suspension",
          {"高度": "173mm", "最大牵引质量": "70T", "牵引座面板厚度": "8mm", "D值": "200KN",
           "额定承载载荷": "30T", "重量": "135KG", "陕汽配套图号": "SZ997000796"},
          "三鑫牵引座 SX90S-B41,高度173mm,最大牵引质量70T,陕汽配套。",
          "SANXIN fifth wheel SX90S-B41: height 173mm, max towing 70T, Shaanxi Auto OE ref."))

# ---------- 波纹板 ----------
P.append(("sx90s-b41-corrugated-plate", "波纹板 SX90S-B41", "Corrugated Plate SX90S-B41",
          BRAND_WV, None, "other",
          {"材质": "高强钢冲压成型", "特点": "多种高度可选择",
           "重汽配套图号": "WG9525930256", "陕汽配套图号": "DZ951899A30023"},
          "波纹板 SX90S-B41,高强钢冲压成型,多种高度可选,重汽/陕汽配套图号照录。",
          "Corrugated plate SX90S-B41, high-strength steel stamped, multiple heights, Sinotruk/Shaanxi OE refs."))

# ---------- 赛特蹄铁(黄石赛特摩擦材料) ----------
P.append(("saite-4515-brake-shoe", "赛特蹄铁 4515", "SAITE Brake Shoe 4515",
          BRAND_ST, None, "brake-system",
          {"OEM": "FUWA 13T", "制动尺寸": "Φ419*177.8mm", "配套": "Supply to FUWA",
           "参考尺寸": "R203 Φ27/Φ19.05 A1+A2=323.85 B=177.8 H1/H2=48.5/50.9"},
          "黄石赛特蹄铁 4515,配套富华FUWA 13T车桥,制动尺寸Φ419*177.8mm。",
          "SAITE brake shoe 4515 for FUWA 13T axle, brake size 419x177.8mm."))
P.append(("saite-4515q-brake-shoe", "赛特蹄铁 4515Q", "SAITE Brake Shoe 4515Q",
          BRAND_ST, None, "brake-system",
          {"OEM": "152.05.533", "制动尺寸": "Φ419*177.8mm",
           "参考尺寸": "R203 Φ25.6/Φ19.2 A1+A2=323.85 B=177.8 H1/H2=49/45", "对应刹车片": "4515 / 4515E"},
          "黄石赛特蹄铁 4515Q,OEM 152.05.533,制动尺寸Φ419*177.8mm。",
          "SAITE brake shoe 4515Q, OEM 152.05.533, brake size 419x177.8mm."))
P.append(("saite-4551-brake-shoe", "赛特蹄铁 4551", "SAITE Brake Shoe 4551",
          BRAND_ST, None, "brake-system",
          {"OEM": "FUWA 16T", "制动尺寸": "Φ419*219mm", "配套": "Supply to FUWA",
           "参考尺寸": "R203 Φ27/Φ19.05 A1+A2=323.85 B=219 H1/H2=48.5/50.9", "WVA": "19369/0"},
          "黄石赛特蹄铁 4551,配套富华FUWA 16T车桥,制动尺寸Φ419*219mm。",
          "SAITE brake shoe 4551 for FUWA 16T axle, brake size 419x219mm."))
P.append(("saite-4551-shoe-assembly", "赛特蹄铁总成 4551", "SAITE Brake Shoe Assembly 4551",
          BRAND_ST, None, "brake-system",
          {"类型": "蹄铁总成", "基础型号": "4551", "制动尺寸": "Φ419*219mm"},
          "黄石赛特蹄铁总成 4551(含滚轮等附件),基础型号4551。",
          "SAITE brake shoe assembly 4551, based on shoe 4551."))
P.append(("saite-4707-brake-shoe", "赛特蹄铁 4707", "SAITE Brake Shoe 4707",
          BRAND_ST, None, "brake-system",
          {"OEM": "152.24.724", "制动尺寸": "419*177.8mm(产品页);交叉表 B=219 以原件为准",
           "互换": "ROCKWELL/MERITOR A3222D2006; SPICER OE M16WS193X",
           "参考尺寸": "R203 Φ25.6/Φ19 A1+A2=323.85 B=219 H1/H2=48.5/50.9"},
          "黄石赛特蹄铁 4707,OEM 152.24.724,可互换 Meritor A3222D2006 / Spicer M16WS193X。",
          "SAITE brake shoe 4707, OEM 152.24.724, interchangeable with Meritor A3222D2006 / Spicer M16WS193X."))
P.append(("saite-4707-shoe-assembly", "赛特蹄铁总成 4707", "SAITE Brake Shoe Assembly 4707",
          BRAND_ST, None, "brake-system",
          {"类型": "蹄铁总成", "基础型号": "4707"},
          "黄石赛特蹄铁总成 4707(含滚轮等附件)。",
          "SAITE brake shoe assembly 4707."))
P.append(("saite-bpw200-brake-shoe", "赛特德式200蹄铁 BPW200 NEW", "SAITE German-type 200 Brake Shoe (BPW200 NEW)",
          BRAND_ST, None, "brake-system",
          {"OEM": "05.091.27.83.0", "制动尺寸": "Φ420*200mm", "WVA": "19094", "BMFC": "BC37/1",
           "参考尺寸": "R205 Φ26/Φ36 A1+A2=317.7 B=200 H1/H2=49.17/54.1"},
          "黄石赛特德式200蹄铁(BPW200 NEW),OEM 05.091.27.83.0,制动尺寸Φ420*200mm。",
          "SAITE German-type 200 brake shoe (BPW200 NEW), OEM 05.091.27.83.0, brake size 420x200mm."))
P.append(("saite-bpw200-shoe-assembly", "赛特德式200蹄铁总成", "SAITE German-type 200 Shoe Assembly",
          BRAND_ST, None, "brake-system",
          {"类型": "蹄铁总成", "基础型号": "BPW200 NEW"},
          "黄石赛特德式200蹄铁总成(含滚轮等附件)。",
          "SAITE German-type 200 brake shoe assembly."))

# ---------- 赛特工程机械盘片 + 大盘片 ----------
P.append(("saite-60-brake-pad", "赛特工程机械刹车片 60", "SAITE Engineering Brake Pad 60",
          BRAND_ST, "龙工6T; 临工6T", "brake-system",
          {"适用": "龙工6T、临工6T装载机"},
          "黄石赛特工程机械刹车片 60,适用龙工6T/临工6T。",
          "SAITE engineering brake pad 60 for Lonking 6T / Lingong 6T loaders."))
P.append(("saite-3050-brake-pad", "赛特刹车片 30.50(厦工)", "SAITE Brake Pad 30.50 (XGMA)",
          BRAND_ST, "龙工5T; 临工5T; 厦工5T/6T; 柳工5T", "brake-system",
          {"适用": "龙工5T、临工5T、厦工5T/6T、柳工5T"},
          "黄石赛特刹车片 30.50(厦工),适用龙工/临工/厦工/柳工5T级。",
          "SAITE brake pad 30.50 for Lonking/Lingong/XGMA/LiuGong 5T class."))
P.append(("saite-50c-brake-pad", "赛特刹车片 50C(柳工)", "SAITE Brake Pad 50C (LiuGong)",
          BRAND_ST, "柳工老款", "brake-system",
          {"适用": "柳工老款"},
          "黄石赛特刹车片 50C,适用柳工老款。",
          "SAITE brake pad 50C for LiuGong old models."))
P.append(("saite-liugong-4050-brake-pad", "赛特柳工40/50刹车片", "SAITE LiuGong 40/50 Brake Pad",
          BRAND_ST, "柳工老款", "brake-system",
          {"适用": "柳工老款"},
          "黄石赛特柳工40/50刹车片,适用柳工老款。",
          "SAITE brake pad for LiuGong 40/50 old models."))
P.append(("saite-chaoyue-trailer-disc-pad", "赛特大盘片 超越款(挂车)", "SAITE Premium Trailer Disc Pad",
          BRAND_ST, "挂车", "brake-system",
          {"配方材质": "低金属/芳纶与钛酸钾纤维增强", "外观": "深灰色/表面有颗粒石墨",
           "寿命": "平原6-12万公里(视路况载重)"},
          "赛特大盘片超越款,挂车用,摩擦系数与制动力量稳定,低磨耗长寿命,适用平原及部分重载山区高速。",
          "SAITE premium trailer disc pad: low-metal/aramid-potassium titanate formulation, stable friction, long life."))
P.append(("saite-yinling-copper-disc-pad", "赛特大盘片 引领款(铜基)", "SAITE Copper-fiber Disc Pad",
          BRAND_ST, "重型货车; 危化品运输车", "brake-system",
          {"配方材质": "有机钢背、铜纤维增强", "外观": "浅灰色、表面可见铜纤维",
           "寿命": "平原15-20万公里(视路况载重)"},
          "赛特大盘片引领款铜基,高制动扭矩耐高温,对刹车盘友好,适用重型货车及危化品运输车。",
          "SAITE copper-fiber disc pad: high torque, heat resistant, disc-friendly, for heavy trucks and hazmat carriers."))

SKU_PLAN = {"sanxin-": "DD-TS", "sx90s-b41-corrugated": "DD-WV", "saite-45": "DD-SHO",
            "saite-4707": "DD-SHO", "saite-bpw200": "DD-SHO", "saite-60": "DD-PAD",
            "saite-30": "DD-PAD", "saite-50": "DD-PAD", "saite-liugong": "DD-PAD",
            "saite-chaoyue": "DD-PAD", "saite-yinling": "DD-PAD"}


def q(v):
    return "'" + v.replace("'", "''") + "'"


def sv(v):
    return "NULL" if v is None else q(v)


def main():
    import json
    counters = {}
    lines = [
        "-- 批次A:9-19六小文件 20款(三鑫牵引座5/波纹板1/赛特蹄铁8/赛特盘片6) 2026-09-21",
        "-- 康迈轮端OCR乱码未导;波纹板品牌照录BRAKFLINN待确认;4707尺寸两源冲突照录",
        "-- 价格不入库(询价模式);幂等按slug。执行环境:Supabase SQL Editor",
        "",
    ]
    seen = set()
    for (slug, zh, en, brand, model, cat, specs, dz, de) in P:
        assert slug not in seen, slug
        seen.add(slug)
        prefix = next(v for k, v in SKU_PLAN.items() if slug.startswith(k))
        counters[prefix] = counters.get(prefix, 0) + 1
        sku = f"{prefix}-{counters[prefix]:03d}"
        lines.append(
            "INSERT INTO products "
            "(slug, sku, name_en, name_zh, brand, truck_model, category, "
            "description_en, description_zh, specs, status) "
            "SELECT " + ", ".join([
                q(slug), q(sku), q(en), q(zh), q(brand), sv(model), q(cat),
                q(de), q(dz), q(json.dumps(specs, ensure_ascii=False)) + "::jsonb",
                q("published"),
            ]) + f" WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = {q(slug)});"
        )
    out = "\n".join(lines) + "\n"
    path = "/home/fan/.openclaw/workspace/deda-products/scripts/batch7-small-files.sql"
    with open(path, "w", encoding="utf-8") as f:
        f.write(out)
    n = len(P)
    print(f"rows={n} slugs={len(seen)} -> {path}")
    print(f"sku分配: {counters}")
    # 校验1:INSERT数=数据行数
    assert out.count("INSERT INTO products") == n
    print("校验1通过: INSERT数 =", n)


if __name__ == "__main__":
    main()
