#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""中配目录批量导入解析器 v2（2026-09-18，15 个表格文件）。

v2 修正：① 5 个空格分隔文件（螺丝/U栓/横接头/空滤芯/柴滤）独立解析
        ② 油封尺寸粘名字末尾拆分 ③ 轴承 6 列误判修复 ④ 分离/轮毂轴承分段感知
"""
import json
import os
import re
from collections import Counter

INBOUND = "/home/fan/.openclaw/media/inbound"

EN_NAMES = [
    ("曲轴前油封", "Crankshaft Front Oil Seal"), ("曲轴后油封", "Crankshaft Rear Oil Seal"),
    ("盆角齿油封", "Hypoid Pinion Oil Seal"),
    ("前轮油封", "Front Wheel Oil Seal"), ("后轮油封", "Rear Wheel Oil Seal"),
    ("半轴油封", "Axle Shaft Oil Seal"), ("贯通轴油封", "Through Shaft Oil Seal"),
    ("贯通油封", "Through Shaft Oil Seal"), ("方向机油封", "Steering Gear Oil Seal"),
    ("主动齿轮油封", "Drive Pinion Oil Seal"), ("平衡轴油封", "Balance Shaft Oil Seal"),
    ("空压机油封", "Air Compressor Oil Seal"), ("传动轴油封", "Propeller Shaft Oil Seal"),
    ("分动箱油封", "Transfer Case Oil Seal"), ("分动箱又", "Transfer Case Oil Seal"),
    ("欧力箱油封", "PTO Oil Seal"), ("取力箱油封", "PTO Oil Seal"),
    ("换挡轴油封", "Gear Shift Shaft Oil Seal"), ("一轴油封", "Input Shaft Oil Seal"),
    ("二轴油封", "Output Shaft Oil Seal"),
    ("半油封", "Axle Shaft Oil Seal"), ("轴油封", "Oil Seal"), ("油封", "Oil Seal"),
    ("曲轴止最轮轴承", "Crankshaft Thrust Bearing"),
    ("分离轴承总成", "Clutch Release Bearing Assembly"), ("分离轴承", "Clutch Release Bearing"),
    ("转向节主销轴承", "King Pin Bearing"), ("转向节主肖轴承", "King Pin Bearing"),
    ("主动锥齿轮后轴承", "Drive Pinion Rear Bearing"), ("主动锥齿轮轴承", "Drive Pinion Bearing"),
    ("变速箱一轴轴承", "Gearbox Input Bearing"), ("中间桥变速箱轴承", "Mid-bridge Gearbox Bearing"),
    ("变速箱顶盖轴承", "Gearbox Top Cover Bearing"), ("变速箱上盖轴承", "Gearbox Cover Bearing"),
    ("轴向减速器轴承", "Axle Reducer Bearing"), ("差速器轴承", "Differential Bearing"),
    ("角齿导向轴承", "Pinion Guide Bearing"),
    ("角齿前/后轴承", "Pinion Front/Rear Bearing"), ("角齿前轴承", "Pinion Front Bearing"),
    ("角齿后轴承", "Pinion Rear Bearing"),
    ("一轴前轴承", "Input Shaft Front Bearing"), ("一轴后轴承", "Input Shaft Rear Bearing"),
    ("一轴中轴承", "Input Shaft Mid Bearing"), ("二轴前轴承", "Output Shaft Front Bearing"),
    ("二轴后轴承", "Output Shaft Rear Bearing"), ("二轴中间轴承", "Output Shaft Mid Bearing"),
    ("副箱中间轴承", "Auxiliary Box Bearing"), ("副箱二轴轴承", "Auxiliary Box Output Bearing"),
    ("主箱二轴轴承", "Main Box Output Bearing"), ("中间轴承", "Intermediate Bearing"),
    ("中导轴承", "Center Guide Bearing"), ("贯通轴轴承", "Through Shaft Bearing"),
    ("发电机前轴承", "Alternator Front Bearing"), ("发电机轴承", "Alternator Bearing"),
    ("空压机曲轴轴承", "Air Compressor Crankshaft Bearing"), ("飞轮轴承", "Flywheel Bearing"),
    ("万向节十字轴承", "Universal Joint Cross Bearing"), ("万向节滚针轴承", "Universal Joint Needle Bearing"),
    ("取力箱轴承", "PTO Bearing"), ("涨紧轮轴承", "Tensioner Bearing"), ("张紧轮轴承", "Tensioner Bearing"),
    ("惰轮轴轴承", "Idler Shaft Bearing"), ("风扇轴承", "Fan Bearing"),
    ("滚针轴承", "Needle Bearing"), ("轴承", "Bearing"),
    ("里程表主动齿轮轴套", "Speedometer Drive Gear Bushing"), ("里程表从动齿轮轴套", "Speedometer Driven Gear Bushing"),
    ("前轮轴承", "Front Wheel Bearing"), ("后轮轴承", "Rear Wheel Bearing"),
    ("中心螺丝", "Center Bolt"), ("拉力胶螺丝", "Torque Rod Bolt"), ("半轴螺丝", "Axle Shaft Bolt"),
    ("传动轮螺丝", "Drivetrain Bolt"), ("副钢板支架螺丝", "Aux Spring Bracket Bolt"),
    ("盖角齿螺丝", "Pinion Cover Bolt"), ("减震器螺丝", "Shock Absorber Bolt"),
    ("轮胎螺丝", "Wheel Bolt"), ("骑马螺丝", "U-bolt"), ("刹车蹄螺丝", "Brake Shoe Bolt"),
    ("传动轴十字轴", "Universal Joint Cross"), ("刹车滚轮轴", "Brake Roller Shaft"),
    ("刹车滚轮", "Brake Roller"), ("刹车蹄固定轴", "Brake Shoe Anchor Pin"),
    ("钢板肖", "Leaf Spring Pin"), ("钢板衬套", "Spring Bushing"), ("平衡轴衬套", "Balance Shaft Bushing"),
    ("分离拨叉衬套", "Release Fork Bushing"),
    ("前轮油封座", "Front Wheel Seal Seat"), ("后轮油封座", "Rear Wheel Seal Seat"),
    ("转向节修理包", "King Pin Repair Kit"), ("转向节肖", "King Pin"),
    ("横接头", "Track Rod End"), ("直接头", "Drag Link End"),
    ("空滤芯", "Air Filter Element"),
    ("油水分离器滤芯", "Water Separator Element"), ("油水分离器滤杯", "Water Separator Bowl"),
    ("油水分离器", "Water Separator"),
    ("柴油滤清器芯", "Diesel Filter Element"), ("柴油滤清器", "Diesel Fuel Filter"), ("柴油滤清", "Diesel Fuel Filter"),
    ("油滤清器", "Oil Filter"),
    ("雨刮片", "Wiper Blade"),
]

OIL_HINTS = ["贯通轴油封", "贯通油封", "方向机油封", "主动齿轮油封", "平衡轴油封", "空压机油封",
             "传动轴油封", "半轴油封", "前轮油封", "后轮油封", "盆角齿油封", "曲轴前油封",
             "曲轴后油封", "换挡轴油封", "分动箱又", "欧力箱油封", "取力箱油封", "一轴油封",
             "二轴油封", "半油封", "轴油封", "油封"]

def en_name(zh: str):
    for k, v in EN_NAMES:
        if zh.startswith(k):
            return v
    return None

DIM_RE = re.compile(r"[A-Za-z]?\d+(?:\.\d+)?(?:\s*[*×xX/]+\s*[A-Za-z]?\d+(?:\.\d+)?)+")

def read_lines(fname_pat):
    f = next(x for x in os.listdir(INBOUND) if x.startswith(fname_pat))
    with open(os.path.join(INBOUND, f), encoding="utf-8") as fh:
        return [l.rstrip("\n") for l in fh]

def has_dim(s):
    return bool(s and DIM_RE.search(s))

def slugify(s):
    s = re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")
    return re.sub(r"-{2,}", "-", s)[:80].rstrip("-") or "p"

def model_ascii(model):
    return "-".join(re.findall(r"[A-Za-z0-9]+", model or ""))[:30].strip("-")

_seen = {}
def unique_slug(base):
    s = slugify(base)
    if s not in _seen:
        _seen[s] = 1
        return s
    _seen[s] += 1
    return f"{s}-{_seen[s]}"

def ws(line):
    return [c.strip() for c in re.split(r"\s{2,}", line.strip()) if c.strip()]

class Series:
    def __init__(self, key, cat, prefix, start=101, brand=None):
        self.key, self.cat, self.prefix, self.n, self.brand = key, cat, prefix, start, brand
        self.rows, self.warnings = [], []
    def add(self, name_zh, dim, model, specs, oem=None, name_en=None, brand=None, cat=None):
        full_zh = f"{name_zh} {dim}".strip() if dim else name_zh
        en = name_en or en_name(name_zh)
        if en is None:
            self.warnings.append(f"无英文名: {name_zh}")
            en = "Part"
        full_en = f"{en} {dim}".strip() if dim else en
        ident = oem or dim or ""
        ma = model_ascii(model)
        if ident and ma:
            base = f"{en}-{ident}-{ma}"
        elif ident:
            base = f"{en}-{ident}"
        elif ma:
            base = f"{en}-{ma}"
        else:
            base = full_en
        slug = unique_slug(base)
        desc_zh = full_zh + (f"，适用{model}。" if model else "，通用件。") + "济南德达供应，欢迎询价。"
        desc_en = full_en + (f" for {model}." if model else ", universal. ") + "Heavy truck parts from DEDA, inquiry welcome."
        self.rows.append(dict(slug=slug, sku=f"DD-{self.prefix}-{self.n}", name_zh=full_zh,
                              name_en=full_en, brand=brand or self.brand, oem=oem,
                              truck_model=model or None, category=cat or self.cat,
                              specs=specs, desc_zh=desc_zh, desc_en=desc_en))
        self.n += 1

def spec_json(**kw):
    return json.dumps({k: v for k, v in kw.items() if v}, ensure_ascii=False)

def split_pipe_merged(row, hints):
    out, changed = [row], True
    while changed:
        changed = False
        for idx, r in enumerate(out):
            if len(r) < 6:
                continue
            for i in range(1, len(r) - 1):
                for k in sorted(hints, key=len, reverse=True):
                    pos = r[i].find(k)
                    if 0 < pos < len(r[i]):
                        left = r[:i] + [r[i][:pos].strip()]
                        right = [r[i][pos:]] + r[i + 1:]
                        out[idx:idx + 1] = [left, right]
                        changed = True
                        break
                if changed: break
            if changed: break
    return out

# ---------- 油封（管道分隔：半轴/前轮盆角齿） ----------
def parse_oil_pipe(ser, pat):
    last = ""
    for line in read_lines(pat):
        line = line.strip()
        if not line or "|" not in line or not has_dim(line):
            continue
        if "零件名称" in line or "内径" in line.split("|")[0]:
            continue
        for row in split_pipe_merged([c.strip() for c in line.split("|")], OIL_HINTS):
            if len(row) < 3:
                continue
            name = row[0]
            # 名字格里粘尺寸（开头/中间/末尾）
            m = DIM_RE.search(name)
            if m and any(k in name[:m.start()] for k in OIL_HINTS):
                pre = name[:m.start()].strip()
                post = name[m.end():].strip()
                row = [pre, m.group(0)] + ([post] if post else []) + row[1:]
                name = pre
            if not name or not any(k in name for k in OIL_HINTS):
                if last and has_dim(name):
                    m2 = DIM_RE.search(name)
                    rest = name[m2.end():].strip()
                    row = [last, m2.group(0)] + ([rest] if rest else []) + row[1:]
                    name = last
                else:
                    continue
            last = name
            dim = model = pack = ""
            for c in row[1:]:
                if not dim and has_dim(c):
                    dim = DIM_RE.search(c).group(0)
                    tail = c[DIM_RE.search(c).end():].strip()
                    if tail and not model:
                        model = tail
                elif not model and c and not has_dim(c):
                    model = c
                elif c:
                    pack = pack or c
            if not dim:
                ser.warnings.append(f"无尺寸: {' | '.join(row)}")
                continue
            ser.add(name, dim, model, spec_json(规格=dim, 适用车型=model or None, 包装=pack or None))

# ---------- 后轮油封（空格分隔） ----------
def parse_oil_ws(ser, pat):
    last = "后轮油封"
    for line in read_lines(pat):
        line = line.strip()
        if not line or "|" in line or "零件名称" in line or "中配" in line or "点滴" in line:
            continue
        fs = ws(line)
        if len(fs) < 2:
            continue
        name = fs[0] if "油封" in fs[0] else last
        last = name
        dim = fs[1] if has_dim(fs[1]) else ""
        rest = fs[2:] if dim else fs[1:]
        model = pack = ""
        for c in rest:
            if not model and not has_dim(c):
                model = c
            elif c:
                pack = pack or c
        if not dim:
            m = DIM_RE.search(line)
            if not m:
                ser.warnings.append(f"跳过: {line}")
                continue
            dim = m.group(0)
        ser.add(name, dim, model, spec_json(规格=dim, 适用车型=model or None, 包装=pack or None))

# ---------- 其他轴承系列3（管道） ----------
def parse_bearing6(ser, pat):
    last = "轴承"
    for line in read_lines(pat):
        line = line.strip()
        if not line or "|" not in line:
            continue
        cs = [c.strip() for c in line.split("|")]
        if any(h in cs[0] for h in ("名称", "产品名称", "零件名称")) or "适用车型" in line:
            continue
        if len(cs) >= 5 and re.match(r"^\d+(\.\d+)?$", cs[3] or ""):
            name, model, car = (cs[0] or last), cs[1], cs[2]
            dims = cs[3:6]
            ser.add(name, model if not has_dim(model) or "/" not in model else model, car,
                    spec_json(型号=model, 适用车型=car or None, 内径mm=dims[0], 外径mm=dims[1] if len(dims) > 1 else None,
                              高度mm=dims[2] if len(dims) > 2 else None), oem=model)
            last = name
            continue
        if len(cs) in (4, 5) and re.match(r"^\d+(\.\d+)?$", cs[2] or ""):
            model, car = cs[0], cs[1]
            dims = cs[2:5]
            ser.add(last, model, car,
                    spec_json(型号=model, 适用车型=car or None, 内径mm=dims[0], 外径mm=dims[1] if len(dims) > 1 else None,
                              高度mm=dims[2] if len(dims) > 2 else None), oem=model)
            continue
        if len(cs) == 3 and cs[1] and cs[2]:
            ser.add(cs[0] or last, cs[1], cs[2], spec_json(型号=cs[1], 适用车型=cs[2]), oem=cs[1])
            last = cs[0] or last
            continue
        ser.warnings.append(f"未识别: {' | '.join(cs)}")

# ---------- 分离轴承系列（管道，分段感知） ----------
def parse_release(ser, pat, hub=None):
    """pat=分离轴承文件；hub=None 只处理分离轴承。组合文件时 hub 传轮毂 series。"""
    section = "release"
    last_hub = "前轮轴承"
    for line in read_lines(pat):
        line = line.strip()
        if not line:
            continue
        if "轮毂轴承系列" in line:
            section = "hub"
            continue
        if section == "hub" and line in ("前轮轴承", "后轮轴承"):
            last_hub = line
            continue
        if "|" not in line:
            continue
        if "适用车型" in line or "零件名称" in line or "拨叉" in line:
            continue
        cs = [c.strip() for c in line.split("|")]
        if section == "hub" and hub is not None:
            if len(cs) < 4:
                continue
            if "轴承" in cs[0]:  # 名字行：name|car|d1|d2|d3
                name, car, dims = cs[0], cs[1], cs[2:5]
                last_hub = name
                ser_rows = hub
                ser_rows.add(name, " / ".join(dims), car,
                             spec_json(规格="*".join(dims), 适用车型=car or None), oem=None)
            else:
                model, car, dims = cs[0], cs[1], cs[2:5]
                hub.add(last_hub, model, car,
                        spec_json(型号=model, 适用车型=car or None,
                                  内径mm=dims[0], 外径mm=dims[1] if len(dims) > 1 else None,
                                  高度mm=dims[2] if len(dims) > 2 else None), oem=model)
            continue
        # release 段
        if len(cs) < 3:
            continue
        model, car = cs[0], cs[1]
        if not re.search(r"[A-Za-z0-9]", model or ""):
            continue
        dims = [c.replace("Φ", "") for c in cs[2:] if re.match(r"^[Φ]?\d+(\.\d+)?$", c or "")]
        name = "分离轴承" if "分离轴承总成" not in line and not re.match(r"^[A-Za-z0-9]", model) else "分离轴承总成"
        ser.add("分离轴承总成", model, car,
                spec_json(型号=model, 适用车型=car or None,
                          内径mm=dims[0] if dims else None,
                          其他尺寸=" / ".join(dims[1:]) if len(dims) > 1 else None), oem=model)

def parse_release_standalone(ser, pat):
    for line in read_lines(pat):
        line = line.strip()
        if not line or "|" not in line or "适用车型" in line or "拨叉" in line:
            continue
        cs = [c.strip() for c in line.split("|")]
        if len(cs) < 3:
            continue
        model, car = cs[0], cs[1]
        if not re.search(r"[A-Za-z0-9]", model or ""):
            continue
        dims = [c.replace("Φ", "") for c in cs[2:] if re.match(r"^[Φ]?\d+(\.\d+)?$", c or "")]
        ser.add("分离轴承总成", model, car,
                spec_json(型号=model, 适用车型=car or None, 内径mm=dims[0] if dims else None,
                          其他尺寸=" / ".join(dims[1:]) if len(dims) > 1 else None), oem=model)

# ---------- 螺丝系列（空格分隔，名字自路由） ----------
def parse_screws_ws(routes, pat):
    last = ""
    for line in read_lines(pat):
        line = line.strip()
        if not line or "零件名称" in line or "适用车型" in line or "螺丝系列" in line or "紧固件" in line:
            continue
        fs = ws(line)
        if len(fs) < 2:
            continue
        name = fs[0]
        hit = None
        for k in sorted(routes, key=len, reverse=True):
            if name.startswith(k):
                hit = k
                break
        if not hit:
            continue
        ser, = (routes[hit],)
        car = fs[1] if len(fs) > 1 else ""
        rest = fs[2:]
        spec = " / ".join(rest[:3]) if rest else ""
        note = rest[-1] if len(rest) > 3 else ""
        ser.add(name, spec, car, spec_json(规格=spec or None, 适用车型=car or None, 说明=note or None))

# ---------- U型螺栓/轮胎螺丝/刹车滚轮（空格分隔） ----------
def parse_ubolt_ws(fast, brk, pat):
    for line in read_lines(pat):
        line = line.strip()
        if not line or "零件名称" in line or "适用车型" in line or "系列" in line:
            continue
        fs = ws(line)
        if len(fs) < 3:
            continue
        name = fs[0]
        if name.startswith(("骑马螺丝", "轮胎螺丝")):
            car, spec, note = fs[1], fs[2], (fs[3] if len(fs) > 3 else "")
            fast.add(name, spec, car, spec_json(规格=spec, 适用车型=car, 说明=note or None))
        elif name.startswith("刹车滚轮轴"):
            brk.add("刹车滚轮轴", fs[1], fs[2] if len(fs) > 2 else "",
                    spec_json(规格=fs[1], 适用车型=fs[2] if len(fs) > 2 else None))
        elif name.startswith("刹车蹄螺丝"):
            brk.add("刹车蹄螺丝", fs[1], fs[2] if len(fs) > 2 else "",
                    spec_json(规格=fs[1], 适用车型=fs[2] if len(fs) > 2 else None))
        elif name.startswith("刹车滚轮"):
            feat = fs[1] if not has_dim(fs[1]) else ""
            dim = next((c for c in fs[1:] if has_dim(c)), "")
            axial = next((c for c in fs[2:] if re.match(r"^L\d+mm$", c or "")), "")
            car = fs[-1] if fs[-1] not in (dim, axial) else ""
            brk.add("刹车滚轮", dim, car,
                    spec_json(特征=feat or None, 规格=dim or None, 轴长=axial or None, 适用车型=car or None))

# ---------- 横接头/直接头/修理包（空格分隔，段状态） ----------
def parse_steering_ws(chas, brg, pat):
    section = None
    for line in read_lines(pat):
        line = line.strip()
        if not line:
            continue
        if "横接头系列" in line:
            section = "横向"
            continue
        if "直接头系列" in line:
            section = "直接"
            continue
        if "主肖修理包系列" in line:
            section = "修理包"
            continue
        if "转向节主肖轴承" in line:
            section = "主肖轴承"
        if "适用车型" in line or "零件名称" in line:
            continue
        fs = ws(line)
        if len(fs) < 2:
            continue
        if section in ("横向", "直接") and not any(k in fs[0] for k in ("修理包", "轴承")):
            car, feat = fs[0], (fs[1] if len(fs) > 1 and fs[1] in ("不可调", "可调") else "")
            spec = next((c for c in fs if c.startswith(("内牙", "外牙"))), "")
            sides = ("左右" if line.count("✓") >= 2 else ("单侧" if "✓" in line else ""))
            en = "Track Rod End" if section == "横向" else "Drag Link End"
            chas.add(f"{('横接头' if section == '横向' else '直接头')} {car}", spec, car,
                     spec_json(特征=feat or None, 规格=spec or None, 供货面=sides or None), name_en=en)
        elif fs[0].startswith("转向节修理包"):
            car, spec = fs[1], (fs[2] if len(fs) > 2 else "")
            bearing = next((c for c in fs[2:] if re.search(r"[0-9]", c or "") and c != spec), "")
            chas.add(fs[0], spec, car, spec_json(规格=spec or None, 适用车型=car, 配套轴承=bearing or None))
        elif section == "主肖轴承" and fs[0].startswith("转向节主肖轴承"):
            car, model = fs[1], (fs[2] if len(fs) > 2 else "")
            brg.add(fs[0], model, car, spec_json(型号=model, 适用车型=car), oem=model)
        elif fs[0].startswith("转向节主肖") or "606K" in fs[0]:
            car, model = fs[1], (fs[2] if len(fs) > 2 else "")
            brg.add("转向节主肖轴承", model, car, spec_json(型号=model, 适用车型=car), oem=model)

# ---------- 空滤芯（空格分隔） ----------
def parse_air_ws(ser, pat):
    for line in read_lines(pat):
        line = line.strip()
        if not line or "型号" in line[:3] or "中配" in line or "用芯" in line:
            continue
        fs = ws(line)
        if len(fs) < 3:
            continue
        model, car = fs[0], fs[1]
        series_type = fs[2] if fs[2] in ("重卡", "轻卡", "客车") else ""
        note = fs[3] if len(fs) > 3 and not re.match(r"^\d+只", fs[3]) else ""
        pack = next((c for c in fs if re.match(r"^\d+只", c)), "")
        if not re.search(r"[A-Za-z0-9]", model):
            continue
        ser.add("空滤芯", model, car,
                spec_json(型号=model, 适用车型=car, 车系=series_type or None, 说明=note or None, 包装=pack or None),
                oem=model, brand="中配")

# ---------- 柴油滤清器（空格分隔） ----------
def parse_fuel_ws(ser, pat):
    for line in read_lines(pat):
        line = line.strip()
        if not line or "零件名称" in line or "柴油滤清器系列" in line or "柴油滤清器 /" in line:
            continue
        fs = ws(line)
        if len(fs) < 3:
            continue
        name = fs[0] if any(k in fs[0] for k in ("滤", "油水")) else "柴油滤清器"
        model, oem, car, extra, pack = "", "", "", "", ""
        if len(fs) >= 5 and re.search(r"[A-Za-z0-9]", fs[1]) and re.search(r"[A-Za-z0-9]", fs[2]):
            model, oem, car = fs[1], fs[2], fs[3]
            extra = fs[4] if len(fs) > 4 and not re.match(r"^\d+只", fs[4]) else ""
            pack = next((c for c in fs if re.match(r"^\d+只", c)), "")
        elif len(fs) >= 4:
            model, car = fs[1] if re.search(r"[A-Za-z0-9]", fs[1]) else "", fs[2] if len(fs) > 2 else ""
            extra = fs[3] if len(fs) > 3 and has_dim(fs[3]) else ""
            pack = next((c for c in fs if re.match(r"^\d+只", c)), "")
        ser.add(name, model or oem, car,
                spec_json(型号=model or None, OEM号=oem or None, 适用车型=car or None,
                          安装规格=extra or None, 包装=pack or None),
                oem=(oem if oem and re.search(r"[A-Za-z0-9]", oem) else (model or None)))

# ---------- 雨刮片（管道） ----------
def parse_wiper(ser, pat):
    for line in read_lines(pat):
        m = re.match(r"^(\d+寸)\s+(\S+)\s*\|\s*(.+)$", line.strip())
        if not m:
            continue
        size, sp, pack = m.groups()
        ser.add("雨刮片", f"{size} {sp}", None, spec_json(规格=f"{size} {sp}", 包装=pack))

# ---------- 主流程 ----------
def main():
    S = {
        "oil": Series("oil", "oil-seal", "OIL"),
        "bearing": Series("bearing", "bearing", "BRG"),
        "fastener": Series("fastener", "fastener", "FST"),
        "brake": Series("brake", "brake-system", "BRR"),
        "chassis": Series("chassis", "chassis-suspension", "STG"),
        "drivetrain": Series("drivetrain", "drivetrain", "DRV"),
        "wiper": Series("wiper", "wiper", "WIP"),
        "filters": Series("filters", "filters", "FLT"),
    }
    parse_oil_pipe(S["oil"], "半轴油封系列")
    parse_oil_pipe(S["oil"], "前轮盆角齿油封系列")
    parse_oil_ws(S["oil"], "油封系列_后轮油封")
    parse_bearing6(S["bearing"], "其他轴承系列3")
    parse_release(S["bearing"], "分离轴承系列_轮毂轴承系列", hub=S["bearing"])
    parse_release_standalone(S["bearing"], "分离轴承系列---")
    routes = {k: S[m] for k, m in [
        ("中心螺丝", "fastener"), ("拉力胶螺丝", "fastener"), ("半轴螺丝", "fastener"),
        ("传动轮螺丝", "fastener"), ("副钢板支架螺丝", "fastener"), ("盖角齿螺丝", "fastener"),
        ("减震器螺丝", "fastener"), ("转向节肖", "chassis"),
        ("传动轴十字轴", "drivetrain"), ("刹车蹄固定轴", "brake"),
        ("钢板肖", "chassis"), ("前轮油封座", "chassis"), ("后轮油封座", "chassis"),
        ("分离拨叉衬套", "chassis"), ("平衡轴衬套", "chassis"), ("钢板衬套", "chassis"),
    ]}
    parse_screws_ws(routes, "螺丝系列_其它紧固件")
    parse_ubolt_ws(S["fastener"], S["brake"], "U型螺栓")
    parse_steering_ws(S["chassis"], S["bearing"], "横接头")
    parse_air_ws(S["filters"], "空滤芯系列")
    parse_fuel_ws(S["filters"], "柴油滤清器系列2")
    parse_wiper(S["wiper"], "雨刮片系列")

    total = 0
    for key, ser in S.items():
        seen, uniq = set(), []
        for r in ser.rows:
            k = (r["name_zh"], r["truck_model"])
            if k in seen:
                ser.warnings.append(f"重复跳过: {r['name_zh']} @ {r['truck_model']}")
                continue
            seen.add(k)
            uniq.append(r)
        ser.rows = uniq
        total += len(uniq)
        print(f"[{key}] {len(uniq)} 条 | 警告 {len(ser.warnings)}")
        for w in ser.warnings[:6]:
            print(f"   ⚠ {w}")

    # 交叉查重
    try:
        existing = json.load(open("/tmp/existing.json"))
        if isinstance(existing, list) and len(existing) > 100:
            ex_oems = {r.get("oem_number") for r in existing if r.get("oem_number")}
            hits = sum(1 for ser in S.values() for r in ser.rows if r["oem"] and r["oem"] in ex_oems)
            print(f"交叉查重: 与现有库 OEM 重合 {hits} 条")
    except Exception as e:
        print("交叉查重跳过:", e)

    print("TOTAL:", total)

    def q(v): return "'" + str(v).replace("'", "''") + "'"
    def sv(v): return "NULL" if v is None else q(v)
    def emit(ser):
        lines = [f"-- {ser.key} 系列（来源：中配供应商目录文本，2026-09-18）",
                 f"-- 共 {len(ser.rows)} 条；价格不入库（询价模式）；幂等：按 slug 去重", ""]
        for r in ser.rows:
            lines.append(
                "INSERT INTO products (slug, sku, name_en, name_zh, brand, truck_model, category, "
                "description_en, description_zh, specs, status) SELECT "
                + ", ".join([q(r["slug"]), q(r["sku"]), q(r["name_en"]), q(r["name_zh"]), sv(r["brand"]),
                             sv(r["truck_model"]), q(r["category"]), q(r["desc_en"]), q(r["desc_zh"]),
                             q(r["specs"]) + "::jsonb", q("published")])
                + f" WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug = {q(r['slug'])});")
        lines.append("")
        return "\n".join(lines)

    base = "/home/fan/.openclaw/workspace/deda-products/scripts"
    master = []
    for key, ser in S.items():
        if not ser.rows:
            continue
        sql = emit(ser)
        with open(f"{base}/catalog-batch2-{key}.sql", "w", encoding="utf-8") as f:
            f.write(sql)
        master.append(sql)
        print(f"→ catalog-batch2-{key}.sql ({len(ser.rows)})")
    with open(f"{base}/catalog-batch2-master.sql", "w", encoding="utf-8") as f:
        f.write("-- ============ 中配目录批量导入 master（全部系列合并）============\n"
                "-- 执行环境：Supabase Dashboard → SQL Editor → 全选运行\n"
                "-- 幂等：按 slug 去重，可重复执行\n\n" + "\n".join(master))
    print("→ catalog-batch2-master.sql")

if __name__ == "__main__":
    main()
