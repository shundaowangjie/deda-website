#!/bin/bash
# 一键推送 deda-website 到 GitHub
# 运行: bash /home/fan/.openclaw/workspace/deda-products/push.sh

set -e
cd /home/fan/.openclaw/workspace/deda-products

echo "📦 正在推送到 GitHub..."

# 清除代理，避免干扰
export HTTPS_PROXY=
export HTTP_PROXY=
export https_proxy=
export http_proxy=

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