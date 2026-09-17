#!/bin/bash
# 一键推送 deda-website 到 GitHub 并触发 Vercel 部署
# 运行: cd /home/fan/.openclaw/workspace/deda-products && ./push.sh
# 说明: GitHub→Vercel 自动集成曾断链（2026-09-17），
#       部署改走 Deploy Hook；URL 存放在 .env.local（已 gitignore，勿提交）

set -e
cd /home/fan/.openclaw/workspace/deda-products

echo "📦 正在推送到 GitHub..."

# 清除全部代理变量（含 ALL_PROXY，避免 GnuTLS handshake failed）
unset HTTPS_PROXY HTTP_PROXY https_proxy http_proxy ALL_PROXY all_proxy FTP_PROXY ftp_proxy NO_PROXY no_proxy 2>/dev/null

echo "🌐 连通性自检..."
if ! git ls-remote --heads origin >/dev/null 2>&1; then
  echo "⚠️  直连 GitHub 失败，请把下面这行输出发给助手："
  echo "   env | grep -i proxy"
fi

git push -u origin main
echo "✅ 推送成功！"

# 触发 Vercel Deploy Hook
if [ -f .env.local ] && grep -q '^DEPLOY_HOOK_URL=' .env.local; then
  HOOK=$(grep '^DEPLOY_HOOK_URL=' .env.local | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'" | tr -d '\r')
  echo ""
  echo "🚀 触发 Vercel 部署（Deploy Hook）..."
  code=$(curl -s -o /tmp/deploy-hook.json -w "%{http_code}" -X POST "$HOOK" --max-time 20 || echo 000)
  if [ "$code" = "201" ]; then
    echo "✅ 构建已排队，约 1-2 分钟上线 → products.dedaautoparts.com"
  else
    echo "⚠️  Hook 触发失败（HTTP $code）——把此输出发给助手处理"
    cat /tmp/deploy-hook.json 2>/dev/null | head -c 200
  fi
else
  echo "ℹ️  .env.local 未配置 DEPLOY_HOOK_URL，跳过自动部署（仅推送）"
fi
