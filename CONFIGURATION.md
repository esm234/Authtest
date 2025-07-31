# دليل التخصيص والإعداد | Configuration Guide

## إعدادات الاختبار الأساسية

### تخصيص عدد الأسئلة
```javascript
// src/store/examStore.js
export const DEFAULT_COMPOSITION = {
  analogy: 4,      // التناظر اللفظي
  completion: 2,   // إكمال الجمل  
  error: 2,        // الخطأ السياقي
  rc: 5,          // استيعاب المقروء
  odd: 0          // المفردة الشاذة (اختياري)
};
```

### إضافة أنواع أسئلة جديدة
```javascript
// إضافة نوع جديد
export const QUESTION_TYPES = {
  analogy: 'التناظر اللفظي',
  completion: 'إكمال الجمل',
  error: 'الخطأ السياقي',
  rc: 'استيعاب المقروء',
  odd: 'المفردة الشاذة',
  newType: 'النوع الجديد'  // إضافة جديدة
};
```

## تنسيق ملفات البيانات

### تنسيق الأسئلة العامة
```json
{
  "questions": [
    {
      "question_number": 1,
      "category": "التناظر اللفظي",
      "question": "نور : عتمة",
      "choices": [
        "نور : عتمة",
        "جسم : ظل", 
        "وضوح : صورة",
        "مرآة : لمعان"
      ],
      "answer": "جسم : ظل",
      "explanation": "العلاقة هي التضاد"
    }
  ]
}
```

### تنسيق أسئلة استيعاب المقروء
```json
{
  "passages": [
    {
      "passage_id": 1,
      "title": "عنوان النص",
      "content": "محتوى النص الكامل...",
      "questions": [
        {
          "question_number": 1,
          "question": "ما الفكرة الرئيسية للنص؟",
          "choices": [
            "الخيار الأول",
            "الخيار الثاني",
            "الخيار الثالث",
            "الخيار الرابع"
          ],
          "answer": "الخيار الصحيح"
        }
      ]
    }
  ]
}
```

## تخصيص الواجهة

### تغيير الألوان
```css
/* src/App.css */
:root {
  --primary-color: #1e3a8a;      /* الأزرق الأساسي */
  --secondary-color: #3b82f6;    /* الأزرق الثانوي */
  --success-color: #10b981;      /* الأخضر */
  --warning-color: #f59e0b;      /* الأصفر */
  --danger-color: #ef4444;       /* الأحمر */
}
```

### تخصيص الخطوط
```css
/* إضافة خط جديد */
@import url('https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap');

body {
  font-family: 'Amiri', 'Cairo', sans-serif;
}
```

### تخصيص أحجام الشاشة
```css
/* نقاط التوقف المخصصة */
@media (max-width: 480px) {
  .question-text {
    font-size: 1rem;
  }
}

@media (min-width: 1200px) {
  .exam-container {
    max-width: 1400px;
  }
}
```

## إعدادات المؤقت

### تخصيص أوقات المؤقت
```javascript
// src/components/StartScreen.jsx
const timerOptions = [
  { value: 5, label: '5 دقائق' },
  { value: 10, label: '10 دقائق' },
  { value: 13, label: '13 دقيقة' },
  { value: 15, label: '15 دقيقة' },
  { value: 20, label: '20 دقيقة' },
  { value: 30, label: '30 دقيقة' },
  { value: 45, label: '45 دقيقة' },  // إضافة جديدة
  { value: 60, label: 'ساعة واحدة' }  // إضافة جديدة
];
```

### تخصيص تنبيهات المؤقت
```javascript
// تنبيه عند 5 دقائق متبقية
const checkTimeWarning = (timeRemaining) => {
  if (timeRemaining === 300) { // 5 دقائق
    showNotification('تبقى 5 دقائق فقط!');
  }
  if (timeRemaining === 60) { // دقيقة واحدة
    showNotification('تبقت دقيقة واحدة!');
  }
};
```

## إضافة لغات جديدة

### إضافة اللغة الفرنسية
```javascript
// src/i18n/index.js
const fr = {
  translation: {
    exam: {
      title: 'Examen Électronique',
      startExam: 'Commencer l\'examen',
      // ... باقي الترجمات
    }
  }
};

i18n.init({
  resources: {
    ar, en, fr  // إضافة الفرنسية
  }
});
```

## تخصيص النتائج

### إضافة تقديرات مخصصة
```javascript
const getGrade = (percentage) => {
  if (percentage >= 95) return { grade: 'ممتاز+', color: 'gold' };
  if (percentage >= 90) return { grade: 'ممتاز', color: 'green' };
  if (percentage >= 85) return { grade: 'جيد جداً+', color: 'blue' };
  if (percentage >= 80) return { grade: 'جيد جداً', color: 'blue' };
  if (percentage >= 75) return { grade: 'جيد+', color: 'orange' };
  if (percentage >= 70) return { grade: 'جيد', color: 'orange' };
  if (percentage >= 60) return { grade: 'مقبول', color: 'yellow' };
  return { grade: 'ضعيف', color: 'red' };
};
```

### تخصيص تصدير النتائج
```javascript
const exportResults = (results) => {
  const csvContent = [
    ['التاريخ', 'النتيجة', 'النسبة', 'النمط'],
    ...results.map(r => [r.date, r.score, r.percentage, r.mode])
  ].map(row => row.join(',')).join('\n');
  
  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'exam-results.csv';
  a.click();
};
```

## إعدادات متقدمة

### تفعيل وضع التطوير
```javascript
// src/config/development.js
export const DEV_CONFIG = {
  showAnswers: false,        // إظهار الإجابات الصحيحة
  skipTimer: false,          // تخطي المؤقت
  debugMode: false,          // وضع التصحيح
  autoAnswer: false,         // إجابة تلقائية للاختبار
  questionLimit: null        // حد عدد الأسئلة للاختبار
};
```

### إعدادات الأداء
```javascript
// src/config/performance.js
export const PERFORMANCE_CONFIG = {
  lazyLoadQuestions: true,   // تحميل الأسئلة عند الحاجة
  cacheQuestions: true,      // تخزين الأسئلة مؤقتاً
  preloadImages: false,      // تحميل الصور مسبقاً
  enableVirtualization: false // التمثيل الافتراضي للقوائم الطويلة
};
```

### إعدادات إمكانية الوصول
```javascript
// src/config/accessibility.js
export const A11Y_CONFIG = {
  highContrast: false,       // تباين عالي
  largeText: false,          // نص كبير
  screenReader: true,        // دعم قارئ الشاشة
  keyboardNavigation: true,  // تنقل بلوحة المفاتيح
  focusIndicators: true      // مؤشرات التركيز
};
```

## أمثلة التخصيص الشائعة

### 1. اختبار قصير (20 سؤال)
```javascript
export const SHORT_EXAM_COMPOSITION = {
  analogy: 8,
  completion: 4,
  error: 4,
  rc: 4,
  odd: 0
};
```

### 2. اختبار استيعاب المقروء فقط
```javascript
export const READING_ONLY_COMPOSITION = {
  analogy: 0,
  completion: 0,
  error: 0,
  rc: 25,
  odd: 0
};
```

### 3. وضع التدريب السريع
```javascript
export const PRACTICE_MODE = {
  showAnswersImmediately: true,
  allowRetry: true,
  noTimeLimit: true,
  showExplanations: true
};
```

## نصائح التخصيص

### أفضل الممارسات
1. **احتفظ بنسخة احتياطية** من الإعدادات الأصلية
2. **اختبر التغييرات** على بيانات تجريبية أولاً
3. **وثّق التخصيصات** للرجوع إليها لاحقاً
4. **راجع الأداء** بعد التخصيصات الكبيرة

### تجنب المشاكل الشائعة
- لا تغيّر تنسيق البيانات الأساسي
- تأكد من توافق الألوان مع إمكانية الوصول
- اختبر على أجهزة مختلفة بعد التخصيص
- احرص على دعم RTL في التخصيصات الجديدة

