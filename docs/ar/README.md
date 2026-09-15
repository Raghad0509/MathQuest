# توثيق MathQuest

هذا هو ملف التوثيق الرئيسي باللغة العربية للمشروع.
English version: [../en/README.md](../en/README.md)

## التشغيل السريع (الإعداد الأولي)

شغّل الـ backend أولاً:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
python manage.py runserver 0.0.0.0:8000
```

شغّل تطبيق الموبايل في نافذة طرفية جديدة:

```bash
cd mobile
npm install
npm run start
```

في محاكي Android استخدم عنوان API التالي:
`http://10.0.2.2:8000/api`

## التشغيل اليومي (بعد الإعداد الأول)

```bash
cd backend
source .venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

```bash
cd mobile
npm run start
```

## 1) الإعداد والتشغيل (تفصيلي)

اقرأ هذا الملف أولاً:
- [01-setup-and-run.md](./01-setup-and-run.md)

## 2) فكرة المشروع

لفهم فكرة المنتج ونطاقه:
- [02-project-idea.md](./02-project-idea.md)

## 3) شرح مفصل للكود

تم فصل الشرح بين الـ backend والـ frontend لتسهيل الفهم.

- [شرح كود الـ Backend](./backend-codebase-explained.md)
- [شرح كود الـ Frontend](./frontend-codebase-explained.md)

## 4) التحضير للمناقشة / أسئلة الدكتور

- [04-teacher-qa-prep.md](./04-teacher-qa-prep.md)

## ترتيب القراءة المقترح

1. `01-setup-and-run.md`
2. `02-project-idea.md`
3. `backend-codebase-explained.md`
4. `frontend-codebase-explained.md`
5. `04-teacher-qa-prep.md`
