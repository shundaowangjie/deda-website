#!/usr/bin/env python3
"""批次31续跑: 清理wcyc specs品牌残留(1181条待处理)"""
import json, urllib.request, urllib.parse

env = {}
for line in open('/home/fan/.openclaw/workspace/deda-products/.env.local'):
    line = line.strip()
    if '=' in line and not line.startswith('#'):
        p = line.split('=', 1); env[p[0].strip()] = p[1].strip()
URL = env['NEXT_PUBLIC_SUPABASE_URL']
SK = open('/home/fan/文档/zlw/密码管理器.txt', encoding='utf-8').read().strip().split('\n')[1].strip()

def api(method, path, body=None, hdr_extra=None):
    data = json.dumps(body, ensure_ascii=False).encode('utf-8') if body is not None else None
    req = urllib.request.Request(f"{URL}/rest/v1/{path}", data=data, method=method,
        headers={'apikey': SK, 'Authorization': f'Bearer {SK}',
                 'Content-Type': 'application/json', **(hdr_extra or {})})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status

b = urllib.parse.quote('潍柴原厂')
offset, targets = 0, []
while True:
    req = urllib.request.Request(
        f"{URL}/rest/v1/products?select=id,slug,specs&slug=like.wcyc-*&specs->>%E5%93%81%E7%89%8C=eq.{b}&order=id",
        headers={'apikey': SK, 'Authorization': f'Bearer {SK}', 'Range': f'{offset}-{offset+999}'})
    with urllib.request.urlopen(req, timeout=30) as r:
        batch = json.loads(r.read())
    targets.extend(batch)
    if len(batch) < 1000: break
    offset += 1000
print(f"[批次31续跑] 待清理: {len(targets)}条", flush=True)

ok = fail = 0
for t in targets:
    specs = dict(t['specs']); specs['品牌'] = '潍柴'
    try:
        api('PATCH', f"products?id=eq.{t['id']}", {'specs': specs}, {'Prefer': 'return=minimal'})
        ok += 1
    except Exception as e:
        fail += 1
        print(f"  FAIL {t['slug']}: {e}", flush=True)
    if ok % 100 == 0:
        print(f"  进度 {ok}/{len(targets)}", flush=True)

print(f"[批次31完成] 成功{ok} 失败{fail}", flush=True)

for val in ['潍柴原厂', '潍柴']:
    v = urllib.parse.quote(val)
    req = urllib.request.Request(
        f"{URL}/rest/v1/products?select=slug&slug=like.wcyc-*&specs->>%E5%93%81%E7%89%8C=eq.{v}",
        headers={'apikey': SK, 'Authorization': f'Bearer {SK}', 'Prefer': 'count=exact', 'Range': '0-0'})
    with urllib.request.urlopen(req, timeout=15) as r:
        print(f"[终验] specs品牌={val}: {r.headers.get('content-range', '?')}", flush=True)
