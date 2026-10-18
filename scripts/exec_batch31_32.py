#!/usr/bin/env python3
"""批次32: 小螺丝208款 REST直写(服务密钥) + 批次31: wcyc specs残留1192条清理"""
import json, re, urllib.request, urllib.parse, sys

# --- 密钥与URL ---
env = {}
for line in open('/home/fan/.openclaw/workspace/deda-products/.env.local'):
    line = line.strip()
    if '=' in line and not line.startswith('#'):
        p = line.split('=', 1); env[p[0].strip()] = p[1].strip()
URL = env['NEXT_PUBLIC_SUPABASE_URL']
SK = open('/home/fan/文档/zlw/密码管理器.txt', encoding='utf-8').read().strip().split('\n')[1].strip()

def esc(s): return s.replace("'", "''")

# ============ 批次32: 208款直写 ============
items = json.load(open('/tmp/xiaoluosi_items.json', encoding='utf-8'))

def build_row(it):
    specs = {'规格': it['gg'], '品牌': '华盖', '车型': it['cx']}
    if it['craft']: specs['工艺'] = ''.join(it['craft'])
    if it['feats']: specs['特性'] = ' '.join(it['feats'])
    if it['grade']: specs['等级'] = ' '.join(it['grade'])
    dz = f"{it['clean']}（{it['gg']}，适用{it['cx']}）华盖紧固件，济南德达供应，欢迎询价。"
    de = f"{it['en']} {it['gg']} for {it['cx']}. Huagai fastener from DEDA, inquiry welcome."
    return {
        'slug': it['slug'], 'sku': it['sku'], 'name_zh': it['clean'], 'name_en': it['en'],
        'brand': '华盖', 'category': 'fastener', 'truck_model': it['cx'],
        'specs': specs, 'description_zh': dz, 'description_en': de, 'status': 'published',
    }

def api(method, path, body=None, hdr_extra=None):
    data = json.dumps(body, ensure_ascii=False).encode('utf-8') if body is not None else None
    req = urllib.request.Request(f"{URL}/rest/v1/{path}", data=data, method=method,
        headers={'apikey': SK, 'Authorization': f'Bearer {SK}',
                 'Content-Type': 'application/json', **(hdr_extra or {})})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status, r.read()

# 预检: scw-应为0
st, body = api('GET', f"products?select=slug&slug=like.scw-*&{urllib.parse.urlencode({'select':'slug'})}", None, {'Prefer': 'count=exact', 'Range': '0-0'})
# 用正确的预检
req = urllib.request.Request(f"{URL}/rest/v1/products?select=slug&slug=like.scw-*",
    headers={'apikey': SK, 'Authorization': f'Bearer {SK}', 'Prefer': 'count=exact', 'Range': '0-0'})
with urllib.request.urlopen(req, timeout=15) as r:
    pre = r.headers.get('content-range', '?')
print(f"[批次32预检] scw-现有: {pre}")
if '/0' not in pre:
    print("已有scw-行，中止防重复"); sys.exit(1)

rows = [build_row(it) for it in items]
CHUNK = 70
done = 0
for i in range(0, len(rows), CHUNK):
    chunk = rows[i:i+CHUNK]
    st, _ = api('POST', 'products', chunk, {'Prefer': 'return=minimal'})
    done += len(chunk)
    print(f"  POST {st}: {done}/{len(rows)}")

# 复核
req = urllib.request.Request(f"{URL}/rest/v1/products?select=slug&slug=like.scw-*",
    headers={'apikey': SK, 'Authorization': f'Bearer {SK}', 'Prefer': 'count=exact', 'Range': '0-2'})
with urllib.request.urlopen(req, timeout=15) as r:
    post = r.headers.get('content-range', '?')
    sample = json.loads(r.read())
print(f"[批次32复核] scw-现有: {post}")
for s in sample[:2]: print("  ", s['slug'])

# ============ 批次31: specs清理 ============
print("\n[批次31] 拉取wcyc残留行...")
offset, targets = 0, []
while True:
    b = urllib.parse.quote('潍柴原厂')
    req = urllib.request.Request(
        f"{URL}/rest/v1/products?select=id,slug,specs&brand=eq.{urllib.parse.quote('潍柴')}&slug=like.wcyc-*&specs->>%E5%93%81%E7%89%8C=eq.{b}&order=id",
        headers={'apikey': SK, 'Authorization': f'Bearer {SK}', 'Range': f'{offset}-{offset+999}'})
    with urllib.request.urlopen(req, timeout=30) as r:
        batch = json.loads(r.read())
    targets.extend(batch)
    if len(batch) < 1000: break
    offset += 1000
print(f"[批次31] 待清理: {len(targets)}条")

ok = fail = 0
for t in targets:
    specs = dict(t['specs']); specs['品牌'] = '潍柴'
    try:
        api('PATCH', f"products?id=eq.{t['id']}", {'specs': specs}, {'Prefer': 'return=minimal'})
        ok += 1
    except Exception as e:
        fail += 1
        print(f"  FAIL {t['slug']}: {e}")
    if ok % 200 == 0 and ok > 0:
        print(f"  进度 {ok}/{len(targets)}")

print(f"[批次31] 成功{ok} 失败{fail}")

# 终验
for val, label in [('潍柴原厂', '残留'), ('潍柴', '已合并')]:
    v = urllib.parse.quote(val)
    req = urllib.request.Request(
        f"{URL}/rest/v1/products?select=slug&slug=like.wcyc-*&specs->>%E5%93%81%E7%89%8C=eq.{v}",
        headers={'apikey': SK, 'Authorization': f'Bearer {SK}', 'Prefer': 'count=exact', 'Range': '0-0'})
    with urllib.request.urlopen(req, timeout=15) as r:
        print(f"[终验] specs品牌={val}: {r.headers.get('content-range', '?')}")
