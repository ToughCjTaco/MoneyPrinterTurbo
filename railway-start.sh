#!/usr/bin/env sh
set -eu

exec python -m uvicorn app.asgi:app \
  --host 0.0.0.0 \
  --port "${PORT:-8080}" \
  --proxy-headers \
  --forwarded-allow-ips="*"
