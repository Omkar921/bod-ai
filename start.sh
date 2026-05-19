#!/usr/bin/env bash
# Bod AI — macOS/Linux startup script
set -e

ROOT="$(cd "$(dirname "$0")" && pwd)"
BACKEND="$ROOT/backend"
FRONTEND="$ROOT/frontend"

echo ""
echo "=============================="
echo "  Bod AI — AI Boardroom"
echo "=============================="
echo ""

# Backend venv
if [[ ! -d "$BACKEND/venv" ]]; then
  echo "[setup] Creating Python venv..."
  python3 -m venv "$BACKEND/venv"
fi

echo "[setup] Installing backend dependencies..."
"$BACKEND/venv/bin/pip" install -q -r "$BACKEND/requirements.txt"

if [[ ! -f "$BACKEND/.env" ]]; then
  echo "ERROR: Missing $BACKEND/.env"
  echo "Copy .env.example and set OPENAI_API_KEY=sk-..."
  exit 1
fi

# Frontend deps
if [[ ! -d "$FRONTEND/node_modules" ]]; then
  echo "[setup] Installing frontend dependencies..."
  (cd "$FRONTEND" && npm install)
fi

if [[ ! -f "$FRONTEND/.env.local" ]]; then
  echo "NEXT_PUBLIC_API_URL=http://127.0.0.1:8000" > "$FRONTEND/.env.local"
fi

# Fix execute bits if project was copied from Windows
chmod +x "$FRONTEND/node_modules/.bin/"* 2>/dev/null || true

echo "[1/2] Starting backend on http://127.0.0.1:8000 ..."
(cd "$BACKEND" && "$BACKEND/venv/bin/uvicorn" main:app --reload --port 8000 --reload-exclude 'venv/*') &
BACKEND_PID=$!

sleep 2

echo "[2/2] Starting frontend on http://localhost:3000 ..."
(cd "$FRONTEND" && npm run dev) &
FRONTEND_PID=$!

sleep 3

echo ""
echo "Bod AI is running!"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://127.0.0.1:8000/docs"
echo ""
echo "Press Ctrl+C to stop both servers."

cleanup() {
  echo ""
  echo "Stopping servers..."
  kill "$BACKEND_PID" "$FRONTEND_PID" 2>/dev/null || true
  exit 0
}
trap cleanup INT TERM

wait
