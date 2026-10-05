این یک تغییر تستی است
# مأموریت ضرب — اپ اندروید و iOS

بازی تمرین جدول ضرب ۱ تا ۱۰ (فارسی / انگلیسی / عربی) به‌صورت اپ بومی با Capacitor.

## امکانات این نسخه
- حذف کامل صدای گوینده؛ به‌جای آن «تیک» کوتاه برای پاسخ درست و «بوق خطا» برای پاسخ نادرست
- کلید «صدا روشن/خاموش» در بالای صفحه و داخل صفحه بازی (تنظیم آن ذخیره می‌شود)
- تعداد پرسش‌ها تا ۵۰ (۵، ۱۰، ۱۵، ۲۰، ۲۵، ۳۰، ۴۰، ۵۰)
- دکمه‌های «همهٔ جدول‌ها» و «پاک کردن»؛ پرسش‌ها به‌صورت تصادفی از جدول‌های انتخاب‌شده (۱ تا ۱۰) می‌آیند
- با ۹۰٪ پاسخ درست یا بیشتر: پنجرهٔ جشن با صدای تشویق، استیکر مدال و فشفشه
- سه زبان کامل، حالت آرام و چالش ۱۵ ثانیه‌ای، مرور اشتباه‌ها و تمرین جدول‌های سخت

## ساختار پوشه‌ها
```
zarb-app/
├─ package.json                 وابستگی‌های Capacitor
├─ capacitor.config.json        شناسهٔ اپ: com.zarbmission.app
├─ www/                         نسخهٔ وب (index.html + آیکون‌ها + manifest + sw.js)
├─ android/                     پروژهٔ آمادهٔ Android Studio
└─ ios/                         پروژهٔ آمادهٔ Xcode (CocoaPods)
```

## پیش‌نیاز
- Node.js 18 یا بالاتر و npm
- برای اندروید: Android Studio (SDK 34، JDK 17)
- برای iOS: macOS با Xcode 15 و CocoaPods

## گام‌های ساخت (هر دو پلتفرم)
```bash
cd zarb-app
npm install          # نصب Capacitor
npx cap sync         # کپی www داخل android/app/src/main/assets و ios/App/public
```

### اندروید
```bash
npx cap open android          # باز کردن در Android Studio، سپس Run
# یا ساخت فایل نصبی از خط فرمان:
cd android && ./gradlew assembleDebug
# خروجی: android/app/build/outputs/apk/debug/app-debug.apk
```
برای نسخهٔ انتشار (release) در Android Studio از منوی Build → Generate Signed Bundle / APK استفاده کنید.

### iOS
```bash
cd ios && pod install --repo-update
cd .. && npx cap open ios     # باز کردن در Xcode، انتخاب Team و Run
```
در Xcode: تب Signing & Capabilities → Team را انتخاب کنید. سپس روی دستگاه یا شبیه‌ساز اجرا کنید. برای انتشار، Product → Archive.

## نکات مهم
- محتوای اپ کاملاً آفلاین است؛ همهٔ صداها و تصویر استیکر داخل خود `index.html` جای گرفته‌اند و به اینترنت نیازی نیست.
- صداها با Web Audio پخش می‌شوند؛ روی iOS و Android پس از نخستین لمس فعال می‌شوند (محدودیت خود سیستم‌عامل).
- اگر می‌خواهید نسخهٔ وب را بدون اپ هم منتشر کنید، پوشهٔ `www/` را روی هر هاست ثابتی بگذارید؛ سرویس‌ورکر برای کار آفلاین فعال است.
- نام و شناسهٔ اپ: `مأموریت ضرب` / `com.zarbmission.app` (برای تغییر، `capacitor.config.json` و فایل‌های بومی را ویرایش کنید).
