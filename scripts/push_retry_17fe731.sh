#!/bin/bash
# 补推 17fe731(首页精选卡片图片)+ 触发部署钩子,带 5 轮重试
# 由 automations 任务在 GitHub 出口恢复后调用
cd /home/fan/.openclaw/workspace/deda-products || exit 1
for i in 1 2 3 4 5; do
  timeout 60 env -u HTTPS_PROXY -u HTTP_PROXY -u https_proxy -u http_proxy -u ALL_PROXY -u all_proxy -u GIT_SSL_CAINFO -u CURL_CA_BUNDLE -u SSL_CERT_FILE \
    git -c http.version=HTTP/1.1 push origin main >/tmp/gitpush.log 2>&1
  timeout 15 git fetch origin main 2>/dev/null
  N=$(git log origin/main..main --oneline 2>/dev/null | wc -l)
  if [ "$N" = "0" ]; then
    HOOK=$(grep '^DEPLOY_HOOK_URL=' .env.local | head -1 | cut -d= -f2- | tr -d '"' | tr -d "'" | tr -d '\r')
    code=$(timeout 15 curl -s -o /dev/null -w '%{http_code}' -X POST "$HOOK" --max-time 12 || echo 000)
    echo "第${i}轮:推送成功,部署钩子HTTP $code。17fe731 已上远端,约2分钟构建上线(首页精选卡片图片生效)。"
    exit 0
  fi
  echo "第${i}轮:推送未成(领先${N}),2分钟后重试"
  sleep 120
done
echo "5轮均失败:本机到GitHub出口仍断,需人工排查(可参考 host-egress-diagnostics 技能,或重启代理后手动跑本脚本)"
