# MathQuest Documentation

This is the single main documentation file for the project.
Arabic version: [../ar/README.md](../ar/README.md)

## Quick Start (Initial Setup)

Run backend first:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver 0.0.0.0:8000
```

Run mobile app in a new terminal:

```bash
cd mobile
npm install
npm run start
```

For Android emulator API URL use: `http://10.0.2.2:8000/api`

## Daily Run (After Initial Setup)

```bash
cd backend
source .venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

```bash
cd mobile
npm run start
```

## 1) Initial Setup and Run (Detailed)

Follow this document first:
- [01-setup-and-run.md](./01-setup-and-run.md)
- Arabic: [../ar/01-setup-and-run.md](../ar/01-setup-and-run.md)

## 2) Project Idea

Use this to explain product vision and scope:
- [02-project-idea.md](./02-project-idea.md)
- Arabic: [../ar/02-project-idea.md](../ar/02-project-idea.md)

## 3) Detailed Codebase Explanation

Backend and frontend are explained separately for easier understanding.

- [Backend Codebase Explained](./backend-codebase-explained.md)
- [Frontend Codebase Explained](./frontend-codebase-explained.md)
- Arabic backend: [../ar/backend-codebase-explained.md](../ar/backend-codebase-explained.md)
- Arabic frontend: [../ar/frontend-codebase-explained.md](../ar/frontend-codebase-explained.md)

## 4) Viva / Follow-up Preparation

Use this for teacher questions:
- [04-teacher-qa-prep.md](./04-teacher-qa-prep.md)
- Arabic: [../ar/04-teacher-qa-prep.md](../ar/04-teacher-qa-prep.md)

## Recommended Reading Order

1. `01-setup-and-run.md`
2. `02-project-idea.md`
3. `backend-codebase-explained.md`
4. `frontend-codebase-explained.md`
5. `04-teacher-qa-prep.md`
