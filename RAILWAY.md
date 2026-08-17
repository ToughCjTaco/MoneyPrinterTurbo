# Railway deployment

MoneyPrinterTurbo can run on Railway as a FastAPI backend using `Dockerfile.railway`.

## Service configuration

Set the Railway service Dockerfile path to `Dockerfile.railway`. The included `railway-start.sh` binds Uvicorn to `0.0.0.0` and reads Railway's injected `PORT` value, defaulting to `8080` locally.

Health checks:

- `GET /health` returns `{ "status": "ok", "service": "moneyprinterturbo" }`.
- `GET /ping` remains available for compatibility.

Set the frontend's `MONEYPRINTER_API_URL` to the Railway public service URL, without a trailing slash. The Next.js proxy routes use this server-only variable, so it is not exposed to browsers.

## Runtime variables

Configure only the provider and service variables needed by your installation. Common values include:

- `PORT` — supplied by Railway; do not hardcode it.
- `CORS_ALLOWED_ORIGINS` — comma-separated frontend origins, such as `https://your-frontend.example`.
- `REDIS_HOST`, `REDIS_PORT`, `REDIS_DB`, `REDIS_PASSWORD` — required when using Redis-backed task state.
- LLM, TTS, image, search, and media provider credentials used by your selected MoneyPrinterTurbo configuration.

Keep all API keys and Redis credentials in Railway variables. Never commit secrets to the repository or place them in frontend `NEXT_PUBLIC_*` variables.
