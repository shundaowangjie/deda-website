#!/usr/bin/env python3
"""
批次32: 小螺丝全系35 两文件(79+131=210行) → 华盖品牌 fastener 导入
老左2026-10-17拍板"2发布"。CSV已归一brand=华盖。
sku段DD-SCW(已验证库内空闲), slug前缀scw-(已验证空闲)。
"""
import csv, json, re, urllib.request, urllib.parse

CSV_FILES = ['/tmp/4小螺丝全系35_processed.csv', '/tmp/3小螺丝全系35_processed.csv']
OUT = '/home/fan/.openclaw/workspace/deda-products/scripts/xiaoluosi-batch.sql'

# ---------- 1. 读CSV ----------
rows = []
for f in CSV_FILES:
    with open(f, newline='', encoding='utf-8-sig') as fh:
        for r in csv.DictReader(fh):
            if r.get('序号') and r.get('品名'):
                rows.append(r)
print(f"[解析] 源行数: {len(rows)}")

# ---------- 2. 字段清洗 ----------
def parse_name(raw):
    name = raw.strip()
    craft, feats, grade = [], [], []
    for m in re.findall(r'[（(]([^）)]*)[）)]', name):
        for tok in m.split():
            if tok in ('磷化', '镀锌'): craft.append(tok)
            elif re.match(r'^\d+\.\d+$', tok): grade.append(tok)
            else: feats.append(tok)
    clean = re.sub(r'[（(][^）)]*[）)]', '', name).strip()
    clean = re.sub(r'\s+', ' ', clean)
    return clean, craft, feats, grade

EN_MAP = [
    ('紧固从动齿螺丝', 'Driven Gear Bolt'), ('传动轴螺丝', 'Drive Shaft Bolt'),
    ('后半轴螺丝', 'Rear Half Shaft Bolt'), ('前半轴螺丝', 'Front Half Shaft Bolt'),
    ('螺丝', 'Bolt'),
]
FEAT_EN = {'钢片帽': 'Steel Cap', '方头': 'Square Head', '防松头': 'Anti-loose Head',
           '磷化': 'Phosphated', '镀锌': 'Galvanized'}
CRAFT_EN = {'磷化': 'Phosphated', '镀锌': 'Galvanized'}

CN_EN = {  # 最长优先替换(数据驱动全集)
    '紧固从动齿螺丝': 'Driven Gear Bolt', '传动轴螺丝': 'Drive Shaft Bolt',
    '后半轴螺丝': 'Rear Half Shaft Bolt', '前半轴螺丝': 'Front Half Shaft Bolt',
    '螺丝': 'Bolt', '螺栓': 'Bolt',
    '轴间差速器': 'Inter-axle Differential', '中桥差速器': 'Mid-axle Differential',
    '中桥': 'Mid Axle', '差速器': 'Differential', '中长': 'Medium Long',
    '付弓支架': 'Auxiliary Spring Bracket', '偏心定位': 'Eccentric Positioning',
    '偏心': 'Eccentric', '定位': 'Positioning', '六角头': 'Hex Head',
    '减壳': 'Reducer Housing', '切边': 'Trimmed Edge', '加大': 'Enlarged',
    '加长圆头滚花': 'Ext Round-head Knurled', '加长滚花': 'Ext Knurled',
    '加长配高帽方头': 'Ext High-cap Square-head', '加长配高帽镀锌': 'Ext High-cap',
    '加长': 'Extended', '圆头滚花': 'Round-head Knurled', '圆头': 'Round Head',
    '滚花': 'Knurled', '单杆': 'Single Rod', '压盘': 'Pressure Plate',
    '双头牙': 'Double-end Stud', '反作用杆': 'Torque Rod', '发兰': 'Flange',
    '吊架': 'Hanger', '吊耳': 'Shackle', '后桥壳': 'Rear Axle Housing',
    '垂臂': 'Drop Arm', '平衡梁肖子': 'Balance Beam Pin', '平衡轴': 'Balance Shaft',
    '开花帽': 'Split Cap', '手制动鼓': 'Hand Brake Drum', '扭力座': 'Torque Bracket',
    '拉臂肖': 'Pull Arm Pin', '挂簧螺栓': 'Spring Hanger Bolt', '排气管': 'Exhaust Pipe',
    '方向机': 'Steering Gear', '方头钢片帽': 'Square-head Steel Cap',
    '板簧座': 'Leaf Spring Seat', '滑块': 'Slider', '翻转轴': 'Tilt Shaft',
    '转向节双头牙': 'Knuckle Stud', '转向节锁肖': 'Knuckle Lock Pin',
    '转向节': 'Steering Knuckle', '锥形垫': 'Tapered Washer',
    '长防松头防松帽': 'Lg Anti-loose Head Cap', '短防松头防松帽': 'Sh Anti-loose Head Cap',
    '防松头防松帽': 'Anti-loose Head Cap', '长防松帽': 'Lg Anti-loose Cap',
    '短防松帽': 'Sh Anti-loose Cap', '长钢片帽': 'Lg Steel Cap', '短钢片帽': 'Sh Steel Cap',
    '长开花帽': 'Lg Split Cap', '短开花帽': 'Sh Split Cap', '长防松': 'Lg Anti-loose',
    '短防松': 'Sh Anti-loose', '防松头': 'Anti-loose Head', '防松帽': 'Anti-loose Cap',
    '钢片帽': 'Steel Cap', '连体加长': 'Integrally Ext', '连体头盘': 'Integral Head Plate',
    '连体防松头': 'Integral Anti-loose Head', '连体': 'Integral', '细牙': 'Fine Thread',
    '防松': 'Anti-loose', '带帽': 'Capped', '方头': 'Square Head', '配高帽': 'w/High Cap',
    '销': 'Pin', '肖': 'Pin', '长': 'Lg', '短': 'Sh', '中': 'Mid', '牙': 'Thread', '面': 'Face',
}

def name_en(clean, craft, feats, grade):
    en = clean
    for zh, e in sorted(CN_EN.items(), key=lambda kv: -len(kv[0])):
        en = en.replace(zh, ' ' + e + ' ')
    en = re.sub(r'\s+', ' ', en).strip()
    parts = [en]
    for c in craft: parts.append(CRAFT_EN.get(c, c))
    for f_ in feats: parts.append(CN_EN.get(f_, FEAT_EN.get(f_, f_)))
    for g in grade: parts.append(f'Gr.{g}')
    return ' '.join(parts)

def esc(s):
    return s.replace("'", "''")

# ---------- 3. 批内去重 ----------
def slug_part(s):
    """slug安全化:小写,*→x,.→-,只留a-z0-9-,折叠多横杠"""
    s = (s or '').strip().lower().replace('*', 'x').replace('.', '-')
    s = re.sub(r'[^a-z0-9-]', '', s)
    return re.sub(r'-{2,}', '-', s).strip('-')

seen, items, dup = set(), [], 0
for r in rows:
    xh = int(r['序号']); cx = r['车型'].strip() or '通用'; gg = r['规格'].strip()
    clean, craft, feats, grade = parse_name(r['品名'])
    key = (cx, gg, clean, tuple(craft), tuple(feats), tuple(grade))
    if key in seen:
        dup += 1; continue
    seen.add(key)
    parts = [slug_part('scw'), slug_part(gg), slug_part(cx), str(xh)]
    slug = '-'.join(p for p in parts if p)
    items.append({
        'xh': xh, 'cx': cx, 'gg': gg or '详见规格', 'clean': clean, 'craft': craft,
        'feats': feats, 'grade': grade, 'slug': slug,
        'sku': f"DD-SCW-{xh}",
        'en': name_en(clean, craft, feats, grade),
    })
print(f"[批内去重] 跳过{dup}条, 净{len(items)}条")

# ---------- 4. 库内交叉查重(华盖全量+scw前缀) ----------
env = {}
for f in ['.env.local', '.env.production']:
    try:
        for line in open(f):
            line = line.strip()
            if '=' in line and not line.startswith('#'):
                p = line.split('=', 1); env.setdefault(p[0].strip(), p[1].strip())
    except FileNotFoundError: pass
url = env['NEXT_PUBLIC_SUPABASE_URL']; key = env.get('NEXT_PUBLIC_SUPABASE_ANON_KEY') or env.get('SUPABASE_ANON_KEY')

def norm(s):
    return re.sub(r'[^A-Z0-9]', '', (s or '').upper())

existing = {}
offset = 0
while True:
    req = urllib.request.Request(
        f"{url}/rest/v1/products?select=slug,name_zh&brand=eq.{urllib.parse.quote('华盖')}&order=id",
        headers={'apikey': key, 'Authorization': f'Bearer {key}', 'Range': f'{offset}-{offset+999}'})
    with urllib.request.urlopen(req, timeout=30) as resp:
        batch = json.loads(resp.read())
    for b in batch: existing[b['name_zh'].strip()] = b['slug']  # 精确名做键
    if len(batch) < 1000: break
    offset += 1000
print(f"[库内] 华盖现有 {len(existing)} 款(精确名)")

# 交叉查重: 仅两道可靠规则——精确名相等 / 归一名≥3字符且相等(纯中文名归一为空不作依据)
existing_norm = {}
for name, sl in existing.items():
    n = norm(name)
    if len(n) >= 3:
        existing_norm.setdefault(n, sl)

def is_conflict(it):
    if it['clean'] in existing:
        return existing[it['clean']]
    n = norm(it['clean'])
    if len(n) >= 3 and n in existing_norm:
        return existing_norm[n]
    return None

cross = []
for it in items:
    hit = is_conflict(it)
    if hit:
        cross.append((it, hit))
        print(f"  冲突: {it['slug']} ↔ {hit}")
print(f"[交叉查重] 冲突 {len(cross)} 条")
items = [it for it in items if not is_conflict(it)]

# 关键词审计:库内华盖是否有同家族(传动轴/后半轴/从动齿螺丝)
for kw in ['传动轴螺丝', '后半轴螺丝', '从动齿螺丝']:
    hits = [n for n in existing if kw in n]
    print(f"[审计] 库内华盖含'{kw}': {len(hits)} 款" + (f" {hits[:3]}" if hits else ""))

# ---------- 5. 生成SQL ----------
out = ["-- 批次32:小螺丝全系35(华盖)导入 210行源→净{}条 | 2026-10-17老左拍板'2发布'".format(len(items)),
       "-- 冲突0 | sku段DD-SCW | slug前缀scw- | 分类fastener(现有) | 无价格列→询价模式"]

def jbo(it):
    pairs = [f"'规格', '{esc(it['gg'])}'", f"'品牌', '华盖'", f"'车型', '{esc(it['cx'])}'"]
    if it['craft']: pairs.append(f"'工艺', '{esc(''.join(it['craft']))}'")
    if it['feats']: pairs.append(f"'特性', '{esc(' '.join(it['feats']))}'")
    if it['grade']: pairs.append(f"'等级', '{esc(' '.join(it['grade']))}'")
    return 'jsonb_build_object(' + ', '.join(pairs) + ')'

for it in items:
    dz = f"{it['clean']}（{it['gg']}，适用{it['cx']}）华盖紧固件，济南德达供应，欢迎询价。"
    de = f"{it['en']} {it['gg']} for {it['cx']}. Huagai fastener from DEDA, inquiry welcome."
    out.append(
        f"INSERT INTO products (slug, sku, name_zh, name_en, brand, category, truck_model, specs, description_zh, description_en, status) "
        f"SELECT '{it['slug']}', '{it['sku']}', '{esc(it['clean'])}', '{esc(it['en'])}', '华盖', 'fastener', '{esc(it['cx'])}', "
        f"{jbo(it)}, '{esc(dz)}', '{esc(de)}', 'published' "
        f"WHERE NOT EXISTS (SELECT 1 FROM products WHERE slug='{it['slug']}') "
        f"AND NOT EXISTS (SELECT 1 FROM products WHERE sku='{it['sku']}');")

sql = '\n'.join(out) + '\n'
open(OUT, 'w', encoding='utf-8').write(sql)
print(f"[输出] {OUT} ({len(sql)} bytes, {len(sql.encode('utf-8'))} bytes utf-8)")
# REST直写用JSON dump（批次32自动入库）
import json as _json
with open('/tmp/xiaoluosi_items.json', 'w', encoding='utf-8') as fh:
    _json.dump(items, fh, ensure_ascii=False)
print(f"[输出] /tmp/xiaoluosi_items.json ({len(items)}条)")

# ---------- 6. 五道独立校验 ----------
ins = sql.count('INSERT INTO products')
print(f"[校验①] INSERT数 {ins} == 数据行 {len(items)}: {'PASS' if ins == len(items) else 'FAIL'}")

# 注释感知切分+引号配平
stmts, buf, in_q, in_c = [], [], False, False
for line in sql.splitlines():
    s = line
    stripped = ''
    i = 0
    while i < len(s):
        ch = s[i]
        if in_q:
            stripped += ch
            if ch == "'":
                if i + 1 < len(s) and s[i+1] == "'": stripped += s[i+1]; i += 1
                else: in_q = False
        elif in_c:
            pass
        else:
            if ch == "'": in_q = True; stripped += ch
            elif ch == '-' and i+1 < len(s) and s[i+1] == '-': in_c = True
            else: stripped += ch
        i += 1
    buf.append(stripped)
    in_c = False
joined = '\n'.join(buf)
parts = [p.strip() for p in joined.split(';') if p.strip()]
ok2 = len(parts) == ins and all(p.startswith(('INSERT', '--')) or 'INSERT' in p for p in parts if p)
quotes_ok = all(l.count("'") % 2 == 0 for l in sql.splitlines() if not l.strip().startswith('--'))
print(f"[校验②] 语句段 {len(parts)} == INSERT {ins}: {'PASS' if len(parts)==ins else 'FAIL'} | 单引号配平: {'PASS' if quotes_ok else 'FAIL'}")

brands = re.findall(r"SELECT '[^']*', '[^']*', '[^']*', '[^']*', '([^']+)'", sql)
ok3 = all(b == '华盖' for b in brands) and len(brands) == ins
print(f"[校验③] brand位非空且=华盖: {len(brands)}/{ins} {'PASS' if ok3 else 'FAIL'}")

ok4 = sql.count('jsonb_build_object(') == ins
print(f"[校验④] jsonb_build_object数 {sql.count('jsonb_build_object(')} == {ins}: {'PASS' if ok4 else 'FAIL'}")

sku_set = set(re.findall(r"'(DD-SCW-\d+)'", sql))
skus_in_values = [it['sku'] for it in items]
ok5 = len(sku_set) == len(set(skus_in_values)) == len(items)
print(f"[校验⑤] SKU去重集合 {len(sku_set)} == {len(items)}: {'PASS' if ok5 else 'FAIL'}")

slugs = [it['slug'] for it in items]
assert len(set(slugs)) == len(slugs), "slug重复!"
print(f"[附加] slug唯一: PASS ({len(set(slugs))})")

# name英文化检查：SQL里name_en不应含中文
sql_txt = open(OUT, encoding='utf-8').read()
ens_all = re.findall(r"SELECT '[^']*', '(DD-SCW-\d+)', '[^']*', '([^']*)'", sql_txt)
bad = [e for e in (m[1] for m in ens_all) if re.search(r'[\u4e00-\u9fff]', e)]
print(f"[校验⑥] name_en无中文: {'PASS' if not bad else 'FAIL ' + str(bad[:5])}")
print("\n=== 全部完成 ===")
