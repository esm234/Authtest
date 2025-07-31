# دليل النشر | Deployment Guide

## نشر التطبيق على خدمات الاستضافة المختلفة

### 1. Vercel (الموصى به)

```bash
# تثبيت Vercel CLI
npm i -g vercel

# بناء المشروع
pnpm run build

# النشر
vercel --prod
```

**إعدادات Vercel**:
- Build Command: `pnpm run build`
- Output Directory: `dist`
- Install Command: `pnpm install`

### 2. Netlify

```bash
# بناء المشروع
pnpm run build

# رفع مجلد dist إلى Netlify
# أو ربط مستودع GitHub
```

**إعدادات Netlify**:
- Build command: `pnpm run build`
- Publish directory: `dist`

### 3. GitHub Pages

```bash
# تثبيت gh-pages
pnpm add -D gh-pages

# إضافة script في package.json
"deploy": "gh-pages -d dist"

# النشر
pnpm run build
pnpm run deploy
```

### 4. Docker

```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=0 /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```bash
# بناء وتشغيل Docker
docker build -t electronic-exam .
docker run -p 80:80 electronic-exam
```

### 5. Apache/Nginx

بعد بناء المشروع، انسخ محتويات مجلد `dist` إلى مجلد الويب:

**Apache (.htaccess)**:
```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QR,L]
```

**Nginx**:
```nginx
location / {
    try_files $uri $uri/ /index.html;
}
```

## متطلبات النشر

### المتطلبات الأساسية
- Node.js 18+
- دعم ES6+ في المتصفح
- HTTPS (موصى به للأمان)

### تحسينات الأداء
- تفعيل ضغط Gzip
- تخزين مؤقت للملفات الثابتة
- CDN للخطوط والموارد

### متغيرات البيئة
```bash
# .env.production
VITE_APP_TITLE="الاختبار الإلكتروني"
VITE_APP_VERSION="1.0.0"
VITE_APP_DESCRIPTION="تطبيق الاختبارات الإلكترونية"
```

## فحص ما قبل النشر

### قائمة التحقق
- [ ] اختبار جميع المسارات
- [ ] فحص الاستجابة على الأجهزة المختلفة
- [ ] اختبار RTL/LTR
- [ ] فحص الأداء (Lighthouse)
- [ ] اختبار إمكانية الوصول
- [ ] فحص الأمان

### أوامر الفحص
```bash
# فحص البناء
pnpm run build

# معاينة البناء
pnpm run preview

# فحص الأخطاء
pnpm run lint

# اختبار الوحدات (إذا توفرت)
pnpm run test
```

## مراقبة الأداء

### مؤشرات الأداء الرئيسية
- First Contentful Paint (FCP): < 1.5s
- Largest Contentful Paint (LCP): < 2.5s
- Cumulative Layout Shift (CLS): < 0.1
- First Input Delay (FID): < 100ms

### أدوات المراقبة
- Google Analytics
- Sentry للأخطاء
- Lighthouse CI
- Web Vitals

## الأمان

### إعدادات الأمان
```javascript
// vite.config.js
export default {
  server: {
    headers: {
      'X-Frame-Options': 'DENY',
      'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'strict-origin-when-cross-origin'
    }
  }
}
```

### نصائح الأمان
- استخدم HTTPS دائماً
- فعّل CSP headers
- راجع التبعيات بانتظام
- احدّث المكتبات للإصدارات الآمنة

## استكشاف أخطاء النشر

### مشاكل شائعة
1. **مسارات الملفات**: تأكد من صحة المسارات النسبية
2. **الخطوط**: تحقق من تحميل خط Cairo
3. **الصور**: فحص مسارات الصور والأيقونات
4. **JavaScript**: تأكد من دعم ES6+

### حلول سريعة
```bash
# مسح ذاكرة التخزين المؤقت
rm -rf node_modules/.cache
rm -rf dist

# إعادة البناء
pnpm install
pnpm run build
```

