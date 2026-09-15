# شرح كود الـ Backend (Django + DRF)

هذا الدليل يشرح كود الـ backend بلغة بسيطة تساعد الطالب في العرض.

## 1) مسؤولية الـ Backend

الـ backend يقوم بأربع مهام رئيسية:
- تخزين البيانات (profiles, levels, questions, sessions, stats, achievements)
- تطبيق قواعد اللعبة (التقدم، النقاط، تكلفة التلميح، مكافأة السلسلة)
- توفير REST APIs للموبايل
- توليد بيانات تجريبية للتشغيل السريع

## 2) هيكل مجلد الـ Backend

داخل `backend/`:
- `manage.py`: نقطة تشغيل أوامر Django
- `mathquest/`: إعدادات المشروع والروابط
- `users/`: إدارة بروفايلات اللاعبين
- `game/`: منطق اللعبة الأساسي وواجهات اللعب
- `achievements/`: نظام الإنجازات
- `stats/`: الإحصائيات وسلسلة الأيام

## 3) ملفات المشروع الأساسية

## `backend/mathquest/settings.py`
- تعريف التطبيقات في `INSTALLED_APPS`
- إعداد middleware
- إعداد قاعدة البيانات (SQLite افتراضياً)
- دعم PostgreSQL عبر متغيرات البيئة

## `backend/mathquest/urls.py`
- تجميع جميع routes من التطبيقات تحت `/api/`

## 4) شرح كل تطبيق

## A) تطبيق `users`

أهم الملفات:
- `users/models.py`: يحتوي `UserProfile`
- `users/serializers.py`: تحويل البيانات JSON
- `users/views.py`: list/create/retrieve
- `users/urls.py`: endpoints الخاصة بالبروفايل

الهدف:
- اختيار/إنشاء بروفايل لاعب بدون نظام تسجيل معقد

## B) تطبيق `game`

هذا أهم تطبيق في المشروع.

### Models (`game/models.py`)
- `Level`: بيانات العالم وصعوبة المستوى
- `Obstacle`: العقبات داخل المستوى
- `Question`: أسئلة الرياضيات متعددة الاختيارات
- `GameSession`: جلسة لعب واحدة لمستخدم في مستوى
- `SessionQuestion`: كل سؤال تم حله داخل الجلسة

### Services (`game/services.py`)
الخدمات تحتوي منطق اللعبة الحقيقي.

أهم الدوال:
- `start_game_session(...)`: بدء جلسة
- `get_next_obstacle(...)`: تحديد العقبة الحالية
- `get_question_for_obstacle(...)`: اختيار سؤال مناسب
- `submit_answer(...)`: تقييم الإجابة وتحديث النقاط
- `get_hint_for_question(...)`: خصم 5 نقاط وحذف خيار خاطئ
- `complete_session(...)`: إنهاء المستوى وتحديث streak/stats/achievements

### Views (`game/views.py`)
تستقبل الطلبات وتعيد الاستجابات:
- بدء اللعب
- العقبة التالية
- السؤال
- التلميح
- الإجابة
- إنهاء المستوى

### URLs (`game/urls.py`)
- `/api/game/start/`
- `/api/game/next-obstacle/{session_id}/`
- `/api/game/question/{session_id}/{obstacle_id}/`
- `/api/game/hint/`
- `/api/game/answer/`
- `/api/game/complete/`

### Seed Command (`game/management/commands/seed_data.py`)
ينشئ بيانات جاهزة:
- بروفايلات تجريبية
- 5 مستويات
- عقبات لكل مستوى مع mini boss نهائي
- بنك أسئلة
- إنجازات

## C) تطبيق `achievements`

أهم الملفات:
- `achievements/models.py`: `Achievement`, `UserAchievement`
- `achievements/services.py`: شروط منح الإنجازات
- `achievements/views.py`: API لجلب الإنجازات

الهدف:
- مكافأة اللاعب على التقدم

## D) تطبيق `stats`

أهم الملفات:
- `stats/models.py`: إجمالي اللعب + حقول السلسلة
- `stats/services.py`: تحديث الإحصائيات + streak bonus
- `stats/views.py`: API الإحصائيات

حقول السلسلة المهمة:
- `current_streak`
- `longest_streak`
- `last_played_date`

## 5) تدفق الـ API في الـ Backend

1. اختيار بروفايل (`/api/profiles/`)
2. جلب المستويات (`/api/levels/`)
3. بدء جلسة (`/api/game/start/`)
4. جلب العقبة الحالية (`/api/game/next-obstacle/{id}/`)
5. جلب سؤال (`/api/game/question/{session}/{obstacle}/`)
6. تلميح اختياري (`/api/game/hint/`)
7. إرسال إجابة (`/api/game/answer/`)
8. إنهاء المستوى (`/api/game/complete/`)

## 6) لماذا هذا التصميم جيد للطلاب

- فصل واضح بين التطبيقات
- منطق اللعبة داخل services وليس داخل views
- APIs بسيطة وقابلة للشرح
- سهولة التوسعة مستقبلاً

## 7) أسئلة شائعة في المناقشة (Backend)

س: لماذا وضعتم المنطق في services؟
ج: حتى تكون views خفيفة، والمنطق المركزي أسهل في الاختبار والصيانة.

س: كيف تعمل السلسلة اليومية؟
ج: تتم مقارنة `last_played_date` بتاريخ اليوم/أمس وتحديث `current_streak` و`longest_streak`.

س: كيف تعمل تكلفة التلميح؟
ج: إذا كانت النقاط >= 5 يتم خصم 5 نقاط وإرجاع خيار خاطئ ليتم حذفه من الواجهة.
