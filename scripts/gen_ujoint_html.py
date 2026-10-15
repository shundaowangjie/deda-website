#!/usr/bin/env python3
"""生成 U型接头 A+B 步的 HTML 一键复制页。"""
import os

BASE = '/home/fan/.openclaw/workspace/deda-products/sql-batch'

CONFIG = [
    {
        'key': 'a',
        'sql': f'{BASE}/ujoint-a-update.sql',
        'title': 'U型接头产品线 · A步：更新现有产品',
        'subtitle': '补充 wan-xiang-jie-015 描述 + 给十字轴/轴承产品补充图册参考',
        'impact': [
            'wan-xiang-jie-015：补充完整三语描述',
            '18 条 universal-joint-cross-*：合并图册参考信息',
            '2 条轴承：合并图册参考 + 补充俄语名称',
        ],
        'expect': '22 条产品更新（UPDATE 语句，无新增行）',
    },
    {
        'key': 'b',
        'sql': f'{BASE}/ujoint-b-insert.sql',
        'title': 'U型接头产品线 · B步：导入万向节叉新产品',
        'subtitle': '从 ZHANWANG 图册 P13-P21 导入 89 条万向节叉规格',
        'impact': [
            '11 大系列: 587.10 / 587.30 / 587.35 / 687.55 / YC64152 / GU7620 / RU50135 / RU50155 / 385.60 / 385.68 / 1810',
            '89 款产品，SKU 段 DD-UV-001~089',
            '三语描述 + specs JSONB + 图册页引用',
        ],
        'expect': '89 条 INSERT 新增（幂等，按 slug 去重）',
    },
]

HTML_TMPL = '''<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title}</title>
<style>
* {{ margin: 0; padding: 0; box-sizing: border-box; }}
body {{ font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Microsoft YaHei", sans-serif; padding: 20px; background: #f0f2f5; max-width: 1200px; margin: 0 auto; }}
.header {{ background: linear-gradient(135deg, #1F6FEB 0%, #0d47a1 100%); color: white; padding: 24px 28px; border-radius: 12px 12px 0 0; }}
.header h1 {{ font-size: 20px; margin-bottom: 8px; }}
.header .sub {{ font-size: 14px; opacity: 0.92; line-height: 1.5; }}
.content {{ background: white; padding: 24px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08); }}
.steps {{ background: #f8f9fa; border: 1px solid #e0e0e0; border-radius: 8px; padding: 16px 20px; margin-bottom: 20px; }}
.steps h3 {{ font-size: 14px; color: #333; margin-bottom: 8px; }}
.steps ol {{ margin-left: 20px; font-size: 13px; color: #555; line-height: 1.8; }}
.steps a {{ color: #1F6FEB; text-decoration: none; }}
.steps a:hover {{ text-decoration: underline; }}
.btn-row {{ margin-bottom: 16px; display: flex; gap: 12px; flex-wrap: wrap; }}
.btn {{ padding: 12px 24px; border: none; border-radius: 8px; font-size: 14px; cursor: pointer; font-weight: 600; transition: all 0.15s; }}
.btn-primary {{ background: #1F6FEB; color: white; }}
.btn-primary:hover {{ background: #1557b5; transform: translateY(-1px); }}
.btn-secondary {{ background: #6c757d; color: white; }}
.btn-secondary:hover {{ background: #545b62; }}
.status {{ padding: 12px 16px; border-radius: 6px; margin-bottom: 16px; font-size: 14px; display: none; }}
.status.success {{ background: #e8f5e9; border: 1px solid #4caf50; color: #2e7d32; }}
.status.error {{ background: #ffebee; border: 1px solid #f44336; color: #c62828; }}
.info-block {{ background: #fff8e1; border: 1px solid #ffecb3; border-radius: 8px; padding: 14px 18px; margin-bottom: 16px; }}
.info-block h3 {{ font-size: 14px; color: #f57c00; margin-bottom: 6px; }}
.info-block ul {{ margin-left: 20px; font-size: 13px; color: #555; line-height: 1.7; }}
.info-block .expect {{ font-size: 13px; color: #2e7d32; margin-top: 8px; font-weight: 600; }}
.sql-meta {{ display: flex; gap: 16px; margin-bottom: 12px; font-size: 12px; color: #666; }}
.sql-meta span {{ background: #f1f3f5; padding: 4px 10px; border-radius: 4px; }}
.sql-box {{ background: #1e1e1e; color: #d4d4d4; padding: 16px; border-radius: 8px; font-family: "SF Mono", Consolas, "Liberation Mono", monospace; font-size: 12px; white-space: pre; word-break: normal; overflow-x: auto; max-height: 500px; overflow-y: auto; line-height: 1.5; }}
</style>
</head>
<body>
<div class="header">
  <h1>📦 {title}</h1>
  <div class="sub">{subtitle}</div>
</div>
<div class="content">
  <div class="info-block">
    <h3>📋 影响范围</h3>
    <ul>
{impact_html}
    </ul>
    <div class="expect">✅ 期望结果：{expect}</div>
  </div>

  <div class="steps">
    <h3>🚀 执行步骤</h3>
    <ol>
      <li>点击上方"复制 SQL"按钮</li>
      <li>打开 Supabase SQL Editor：<a href="https://supabase.com/dashboard/project/dubtupobtddeocmtfndf/sql" target="_blank">supabase.com/dashboard/project/dubtupobtddeocmtfndf/sql</a></li>
      <li>粘贴 SQL 并点击 Run</li>
      <li>验证结果后完成</li>
    </ol>
  </div>

  <div class="btn-row">
    <button class="btn btn-primary" onclick="copySQL()">📋 复制 SQL 到剪贴板</button>
    <button class="btn btn-secondary" onclick="downloadSQL()">💾 下载 SQL 文件</button>
    <a href="{sql_url}" class="btn btn-secondary" style="text-decoration: none;">👁 在线查看</a>
  </div>
  <div id="status" class="status"></div>

  <div class="sql-meta">
    <span>文件大小：{file_size}</span>
    <span>语句数：{stmt_count}</span>
    <span>生成时间：2026-10-15</span>
  </div>

  <div class="sql-box" id="sqlBox">{sql_escaped}</div>
</div>
<script>
const sqlContent = `{sql_js}`;

function copySQL() {{
  navigator.clipboard.writeText(sqlContent).then(() => {{
    const s = document.getElementById('status');
    s.textContent = '✅ SQL 已复制到剪贴板，可粘贴到 Supabase SQL Editor 执行';
    s.style.display = 'block';
    s.className = 'status success';
    setTimeout(() => s.style.display = 'none', 4000);
  }}).catch(() => {{
    const s = document.getElementById('status');
    s.textContent = '❌ 复制失败，请手动选择文本复制';
    s.style.display = 'block';
    s.className = 'status error';
  }});
}}

function downloadSQL() {{
  const blob = new Blob([sqlContent], {{ type: 'text/sql' }});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = '{download_name}';
  a.click();
}}
</script>
</body>
</html>
'''


def build(cfg):
    with open(cfg['sql'], encoding='utf-8') as f:
        sql = f.read()
    file_size = os.path.getsize(cfg['sql'])
    stmt_count = sql.count('INSERT INTO products') + sql.count('UPDATE products')

    impact_html = '\n'.join(f'      <li>{x}</li>' for x in cfg['impact'])
    sql_escaped = sql.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
    # JS 字符串转义
    sql_js = sql.replace('\\', '\\\\').replace('`', '\\`').replace('$', '\\$')

    html = HTML_TMPL.format(
        title=cfg['title'],
        subtitle=cfg['subtitle'],
        impact_html=impact_html,
        expect=cfg['expect'],
        sql_url=f"ujoint-{cfg['key']}-update.sql?v=2" if cfg['key'] == 'a' else f"ujoint-{cfg['key']}-insert.sql?v=2",
        file_size=f"{file_size:,} 字节",
        stmt_count=stmt_count,
        sql_escaped=sql_escaped,
        sql_js=sql_js,
        download_name=f"ujoint-{cfg['key']}-{'update' if cfg['key'] == 'a' else 'insert'}.sql",
    )
    out_path = f"{BASE}/ujoint-{cfg['key']}-{'update' if cfg['key'] == 'a' else 'insert'}.html"
    with open(out_path, 'w', encoding='utf-8') as f:
        f.write(html)
    print(f"✅ {out_path} ({len(html):,} 字节, {stmt_count} 语句)")


for cfg in CONFIG:
    build(cfg)
