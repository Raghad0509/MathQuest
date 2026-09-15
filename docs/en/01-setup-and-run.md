# Setup and Run Guide

This guide is the first thing to follow.
Arabic version: [../ar/01-setup-and-run.md](../ar/01-setup-and-run.md)

## A. Prerequisites

Install these tools:
- Python 3.11+ (or 3.12)
- Node.js 18+
- npm
- Expo Go app (if testing on physical phone)

## B. Initial Setup (First Time Only)

### 1) Backend setup

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
```

### 2) Start backend

```bash
cd backend
source .venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

Backend API will run on:
- `http://127.0.0.1:8000`

### 3) Mobile setup

```bash
cd mobile
npm install
```

### 4) Start mobile app

```bash
cd mobile
npm run start
```

## C. API Base URL Setup for Mobile

Set this only if needed:

```bash
export EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

Use these values depending on device:
- Android emulator: `http://10.0.2.2:8000/api`
- Physical phone: `http://<your-lan-ip>:8000/api`

## D. Daily Run Steps (After Initial Setup)

Each time you work:

1. Start backend
```bash
cd backend
source .venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

2. Start mobile
```bash
cd mobile
npm run start
```

## E. If You Need to Reset All Data

```bash
cd backend
rm -f db.sqlite3
source .venv/bin/activate
python manage.py migrate
python manage.py seed_data
```

## F. Common Errors and Fixes

### 1) `Network Error` in mobile
- Ensure backend is running.
- Ensure API URL is reachable from emulator/phone.
- For Android emulator use `10.0.2.2`, not `127.0.0.1`.

### 2) `ModuleNotFoundError` (example: `corsheaders`)

```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
```

### 3) Mobile cache issues

```bash
cd mobile
npm run start -- --clear
```
