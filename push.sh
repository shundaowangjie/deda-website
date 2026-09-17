#!/bin/bash
# 一键推送 deda-website 到 GitHub
# 运行: bash /home/fan/.openclaw/workspace/deda-products/push.sh

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

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ 推送成功！"
  echo ""
  echo "下一步：去 Vercel 连接这个仓库"
  echo "1. 访问 https://vercel.com"
  echo "2. 点击 'Add New...' -> 'Project'"
  echo "3. 点击 'Continue with GitHub' 授权"
  echo "4. 找到 deda-website 仓库，点击 'Import'"
  echo "5. 在环境变量中添加 Supabase 配置"
else
  echo ""
  echo "❌ 推送失败！"
  echo "请检查："
  echo "1. GitHub 账号是否正确"
  echo "2. 是否有仓库权限"
  echo "3. 网络是否正常"
fi