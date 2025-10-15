# 🔥 إعداد Firebase للمشروع الجديد

## المشكلة
المشروع الجديد `sodfaa-8f702` يحتاج إلى:
1. ✅ قواعد Firestore محدثة
2. ✅ البيانات الأولية
3. ✅ إعداد المصادقة

## الحلول المطبقة

### 1. قواعد Firestore المحدثة
تم تحديث `firestore.rules` لتسمح بالوصول الكامل للتطوير:
- ✅ قراءة وكتابة عامة لجميع المجموعات
- ✅ إضافة قواعد خاصة لكل مجموعة
- ⚠️ **مهم**: هذه القواعد للتطوير فقط، يجب تحديثها للإنتاج

### 2. سكريبت إضافة البيانات
تم إنشاء `src/scripts/seedAllData.ts` لإضافة:
- 📁 الفئات (Categories)
- 🛍️ المنتجات (Products)  
- 🎯 العروض (Offers)
- 🖼️ صور البانر (Hero Images)
- 📢 نصوص البانر (Banner Text)
- 🎫 أكواد الخصم (Discount Codes)
- 🚚 مناطق التوصيل (Delivery Areas)

### 3. صفحة إعداد البيانات
تم إنشاء `seed-data.html` لتشغيل السكريبت بسهولة

## خطوات الإعداد

### الخطوة 1: رفع قواعد Firestore
```bash
# في Firebase Console
1. اذهب إلى Firestore Database
2. اذهب إلى Rules
3. انسخ محتوى firestore.rules
4. احفظ القواعد
```

### الخطوة 2: إضافة البيانات الأولية
```bash
# افتح seed-data.html في المتصفح
1. افتح الملف في المتصفح
2. اضغط "فحص الاتصال" للتأكد من الاتصال
3. اضغط "إضافة البيانات الأولية"
```

### الخطوة 3: إنشاء حساب إداري
```bash
# في Firebase Console
1. اذهب إلى Authentication
2. اذهب إلى Users
3. اضغط "Add user"
4. أدخل email و password
5. استخدم هذه البيانات للدخول للإدارة
```

## اختبار الإعداد

### 1. فحص الاتصال
```javascript
// في console المتصفح
window.checkConnection()
```

### 2. إضافة البيانات
```javascript
// في console المتصفح
window.seedAllData()
```

### 3. فحص البيانات في Firebase Console
- اذهب إلى Firestore Database
- تأكد من وجود المجموعات: products, categories, offers, etc.

## الأمان للإنتاج

### قواعد Firestore للإنتاج
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // المنتجات والفئات - قراءة عامة
    match /products/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /categories/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // الطلبات - إنشاء عام، قراءة/تحديث للمصادقين
    match /orders/{document} {
      allow create: if true;
      allow read, update, delete: if request.auth != null;
    }
    
    // باقي المجموعات - للمصادقين فقط
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## استكشاف الأخطاء

### خطأ "Missing or insufficient permissions"
1. تأكد من رفع قواعد Firestore الجديدة
2. تأكد من أن المشروع نشط
3. جرب إعادة تحميل الصفحة

### خطأ "Failed to fetch"
1. تأكد من اتصال الإنترنت
2. تأكد من أن Firebase متصل
3. تحقق من console المتصفح للأخطاء

### لا تظهر البيانات
1. تأكد من تشغيل سكريبت إضافة البيانات
2. تحقق من Firebase Console
3. تأكد من أن البيانات نشطة (isActive: true)

## الدعم
إذا واجهت مشاكل:
1. تحقق من console المتصفح
2. تأكد من إعدادات Firebase
3. جرب إعادة تشغيل السكريبت



