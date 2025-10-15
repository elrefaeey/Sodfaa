# حل سريع لمشكلة Firebase

## المشكلة
```
FirebaseError: Missing or insufficient permissions
```

## الحل السريع (30 ثانية)

### 1. افتح `fix-firebase.html` في المتصفح
- انقر نقراً مزدوجاً على الملف

### 2. اضغط "إضافة البيانات"
- سيتم إضافة البيانات المطلوبة

### 3. إذا لم يعمل، اضغط "فحص القواعد"
- سيعطيك التعليمات الصحيحة

## إذا لم يعمل الحل

### اذهب إلى Firebase Console:
1. [Firebase Console](https://console.firebase.google.com/)
2. اختر مشروع `sodfaa-8f702`
3. Firestore Database > Rules
4. امسح كل شيء واكتب:

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

## النتيجة
- ✅ لا توجد أخطاء
- ✅ الموقع يعمل
- ✅ يمكن إضافة منتجات جديدة


