# حل مشكلة Firebase Permissions

## المشكلة
```
FirebaseError: Missing or insufficient permissions
```

## الحل السريع

### 1. افتح ملف `add-default-data.html` في المتصفح
- انقر نقراً مزدوجاً على الملف
- أو اسحبه إلى المتصفح

### 2. اضغط على "إضافة البيانات الافتراضية"
- سيتم إضافة فئة افتراضية ومنتج افتراضي
- هذا سيحل مشكلة الأخطاء

### 3. تحقق من Firebase Console
- اذهب إلى [Firebase Console](https://console.firebase.google.com/)
- اختر مشروع `sodfaa-8f702`
- اذهب إلى Firestore Database
- تأكد من وجود البيانات

## إذا لم يعمل الحل

### تحقق من قواعد Firestore:
1. اذهب إلى Firebase Console
2. اختر Firestore Database
3. اذهب إلى Rules
4. تأكد من وجود هذه القواعد:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

5. اضغط "Publish"

## البيانات الافتراضية المضافة

### الفئة:
- **الاسم:** فئة افتراضية
- **الوصف:** فئة افتراضية يمكن تعديلها أو حذفها

### المنتج:
- **الاسم:** منتج افتراضي
- **السعر:** 100 ج.م
- **الفئة:** فئة افتراضية
- **متوفر:** نعم

## بعد إضافة البيانات
- يمكنك حذف أو تعديل هذه البيانات من لوحة الإدارة
- يمكنك إضافة منتجات وفئات جديدة
- الموقع سيعمل بدون أخطاء






