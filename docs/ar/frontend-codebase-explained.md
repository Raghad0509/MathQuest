# شرح كود الـ Frontend (React Native + Expo)

هذا الدليل يشرح هيكل تطبيق الموبايل بطريقة بسيطة.

## 1) مسؤولية الـ Frontend

الـ frontend يقوم بالمهام التالية:
- عرض واجهات اللعبة
- التنقل بين الشاشات
- استدعاء APIs من الـ backend
- حفظ حالة اللعب المؤقتة أثناء الجلسة

## 2) هيكل مجلد الـ Frontend

داخل `mobile/`:
- `App.js`: نقطة بدء التطبيق
- `navigation/`: إعداد التنقل
- `screens/`: شاشات التطبيق
- `components/`: مكونات قابلة لإعادة الاستخدام
- `services/`: دوال استدعاء API
- `constants/`: ألوان وثيم وأيقونات
- `context/`: حالة مشتركة عبر الشاشات

## 3) نقطة البداية

## `mobile/App.js`
- يلف التطبيق داخل `GameProvider`
- يحمل `NavigationContainer`
- يستخدم `AppNavigator` لتحديد مسار الشاشات

## `mobile/navigation/AppNavigator.js`
- تعريف stack screens
- إعداد الهيدر والانتقالات
- التحكم في خيارات الرجوع/الانتقال

## 4) الحالة المشتركة (Context)

## `mobile/context/GameContext.js`
يحفظ:
- البروفايل المختار
- المستوى المختار
- الجلسة الحالية
- آخر نتيجة
- الإحصائيات الحالية

لماذا؟
- شاشات كثيرة تحتاج نفس البيانات
- يقلل تمرير props بين عدد كبير من المكونات

## 5) طبقة API في الموبايل

## `mobile/services/api.js`
- إنشاء axios instance
- تحديد base URL
- معالجة أخطاء الاستجابة بشكل موحد

## ملفات الخدمات
- `profileService.js`: APIs البروفايل
- `gameService.js`: APIs اللعب (`start`, `question`, `hint`, `answer`, `complete`)
- `achievementService.js`: API الإنجازات
- `statisticsService.js`: API الإحصائيات

## 6) شرح الشاشات

## `SplashScreen`
- شاشة البداية والتحميل

## `ProfileSelectionScreen`
- اختيار بروفايل موجود
- إنشاء بروفايل جديد (الاسم + الجنس)

## `HomeScreen`
- ملخص اللاعب
- أزرار: الخريطة، الإنجازات، الإحصائيات، الإعدادات
- زر تغيير البروفايل

## `AdventureMapScreen`
- خريطة المراحل
- عرض حالة كل مرحلة (مقفلة/مفتوحة/مكتملة)

## `LevelScreen`
- عرض العقبة الحالية وتقدم المستوى
- عرض mini boss عند الوصول له
- الانتقال إلى شاشة اللغز

## `MathPuzzleScreen`
- عرض السؤال والاختيارات
- إرسال الإجابة
- نظام التلميح:
  - خصم 5 نقاط
  - حذف خيار خاطئ واحد من الشاشة

## `FeedbackScreen`
- عرض نتيجة الإجابة (صحيحة/خاطئة)
- متابعة التقدم

## `LevelCompleteScreen`
- ملخص نتيجة المستوى
- عرض مكافأة السلسلة اليومية

## `AchievementsScreen`
- عرض الإنجازات المفتوحة والمقفلة

## `StatisticsScreen`
- عرض إحصائيات اللعب
- عرض `current_streak`, `longest_streak`, `last_played_date`

## `SettingsScreen`
- مفاتيح الصوت والموسيقى

## 7) المكونات القابلة لإعادة الاستخدام

أمثلة:
- `PrimaryButton`
- `AvatarCard`
- `LevelNode`
- `PuzzleCard`
- `AnswerButton`
- `ProgressBar`
- `StatCard`
- `AchievementBadge`
- `RewardStars`

الفائدة:
- شكل موحد للشاشات
- تقليل تكرار الكود
- سهولة الصيانة

## 8) الثيم والستايل

ملفات مهمة:
- `constants/colors.js`
- `constants/theme.js`
- `constants/gameData.js`

الهدف:
- جعل التصميم ثابت ومنظم
- تعديل الألوان/الأيقونات من مكان واحد

## 9) تدفق اللعب في الـ Frontend

1. اختيار بروفايل
2. فتح الخريطة
3. دخول المستوى
4. جلب العقبة من backend
5. جلب السؤال
6. تلميح اختياري
7. إرسال الإجابة
8. شاشة Feedback
9. شاشة إكمال المستوى

## 10) أسئلة شائعة في المناقشة (Frontend)

س: لماذا استخدمتم Context؟
ج: لأن بيانات الجلسة والبروفايل مستخدمة في عدة شاشات، وContext يقلل التعقيد.

س: لماذا وضعتم API calls داخل services؟
ج: حتى تبقى الشاشات مركزة على UI والمنطق العرضي فقط.

س: كيف يظهر تأثير التلميح للمستخدم؟
ج: بعد طلب التلميح يتم تحديث النقاط في الشاشة وإخفاء خيار خاطئ واحد.
