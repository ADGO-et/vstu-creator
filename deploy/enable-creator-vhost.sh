#!/usr/bin/env bash
# Run ON the Ubuntu server as root AFTER vstu-creator-web is healthy on 3082.
set -euo pipefail

DOMAIN="creator.vstu.pitrontech.et"
CONF_SRC="$(cd "$(dirname "$0")" && pwd)/${DOMAIN}.conf"
NGINX_AVAILABLE="/etc/nginx/sites-available/${DOMAIN}.conf"
NGINX_ENABLED="/etc/nginx/sites-enabled/${DOMAIN}.conf"
UPSTREAM="http://127.0.0.1:3082"

if ! command -v nginx >/dev/null 2>&1; then
  echo "nginx not found."
  exit 1
fi

if [ ! -f "$CONF_SRC" ]; then
  echo "Missing: ${CONF_SRC}"
  exit 1
fi

if ! curl -sf "${UPSTREAM}/health" >/dev/null 2>&1; then
  echo "vstu-creator is not healthy on 3082. Deploy the container first:"
  echo "  docker ps --filter name=vstu-creator-web"
  echo "  curl -s ${UPSTREAM}/health"
  exit 1
fi

cp "$CONF_SRC" "$NGINX_AVAILABLE"
ln -sfn "$NGINX_AVAILABLE" "$NGINX_ENABLED"

nginx -t
systemctl reload nginx

echo "==> HTTP vhost enabled for ${DOMAIN} -> ${UPSTREAM}"
echo
echo "Verify routing (must NOT show Prime Capital):"
echo "  curl -sI -H 'Host: ${DOMAIN}' http://127.0.0.1/ | head -5"
echo
echo "Then issue SSL:"
echo "  certbot --nginx -d ${DOMAIN}"
