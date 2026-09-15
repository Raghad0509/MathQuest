# دليل الإعداد والتشغيل

هذا الملف هو أول ملف يجب قراءته.

## أ) المتطلبات المسبقة

ثبّت الأدوات التالية:
- Python 3.11+ (أو 3.12)
- Node.js 18+
- npm
- تطبيق Expo Go (إذا كنت تختبر على هاتف حقيقي)

## ب) الإعداد الأولي (مرة واحدة فقط)

### 1) إعداد الـ Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_data
```

### 2) تشغيل الـ Backend

```bash
cd backend
source .venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

سيعمل الـ API على:
- `http://127.0.0.1:8000`

### 3) إعداد تطبيق الموبايل

```bash
cd mobile
npm install
```

### 4) تشغيل تطبيق الموبايل

```bash
cd mobile
npm run start
```

## ج) إعداد عنوان API لتطبيق الموبايل

اضبط هذا المتغير فقط عند الحاجة:

```bash
export EXPO_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

استخدم القيم التالية حسب الجهاز:
- محاكي Android: `http://10.0.2.2:8000/api`
- هاتف حقيقي: `http://<your-lan-ip>:8000/api`

## د) خطوات التشغيل اليومية (بعد الإعداد الأول)

1. شغّل الـ backend
```bash
cd backend
source .venv/bin/activate
python manage.py runserver 0.0.0.0:8000
```

2. شغّل الموبايل
```bash
cd mobile
npm run start
```

## هـ) إعادة ضبط كل البيانات

```bash
cd backend
rm -f db.sqlite3
source .venv/bin/activate
python manage.py migrate
python manage.py seed_data
```

## و) مشاكل شائعة وحلولها

### 1) خطأ `Network Error` في الموبايل
- تأكد أن الـ backend يعمل.
- تأكد أن عنوان API يمكن الوصول له من الهاتف/المحاكي.
- في محاكي Android استخدم `10.0.2.2` وليس `127.0.0.1`.

### 2) خطأ `ModuleNotFoundError` (مثال: `corsheaders`)

```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
```

### 3) مشاكل كاش Expo

```bash
cd mobile
npm run start -- --clear
```
