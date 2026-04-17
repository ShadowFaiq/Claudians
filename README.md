# Claudians

Monorepo with:

- Frontend: Next.js app in `frontend/`
- Backend: FastAPI app in `backend/`

## Linux Local Setup Guide

Use this section if you are running the project for the first time on a Linux PC.

### 0) Install Required Tools

You need:

- Git
- Python 3.10+ (with `venv` support)
- Node.js 20+ and npm

Choose your distro and run one of these blocks.

Ubuntu / Debian:

```bash
sudo apt update
sudo apt install -y git python3 python3-venv python3-pip curl
```

Fedora:

```bash
sudo dnf install -y git python3 python3-pip curl
```

Arch:

```bash
sudo pacman -S --noconfirm git python python-pip curl
```

Then install Node.js with `nvm` (recommended):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
source ~/.bashrc
nvm install 22
nvm use 22
```

Verify installs:

```bash
git --version
python3 --version
node --version
npm --version
```

### 1) Clone The Repository

```bash
git clone https://github.com/ShadowFaiq/Claudians.git
cd Claudians
```

## Prerequisites

- Node.js 20+ and npm
- Python 3.10+

## Run Everything (Development)

Use two terminals.

### 1) Backend (FastAPI)

```bash
cd backend

# First-time setup
python3 -m venv .venv
source .venv/bin/activate
pip install fastapi uvicorn

# Run API
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Backend health check:

```bash
curl http://127.0.0.1:8000/api/health
```

Expected response:

```json
{"status":"Backend is online and reachable","role":"AWS Cloud Club Captain API"}
```

### 2) Frontend (Next.js)

```bash
cd frontend

# First-time setup
npm install

# Run app
npm run dev
```

Frontend URL:

- http://localhost:3000

## Stop Services

- Press `Ctrl+C` in each terminal where the server is running.

## Notes

- Frontend dev server uses port `3000`.
- Backend API uses port `8000`.
- Current backend CORS is open (`*`) in `backend/main.py` for development.

## Troubleshooting

- If `python` is not found, use `python3`.
- If `source .venv/bin/activate` fails, make sure you are inside the `backend` folder.
- If port `8000` or `3000` is already in use, stop the existing process first.
- If `npm install` fails, run `npm cache clean --force` and try again.