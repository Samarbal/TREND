# Landing Page Integration — TRENDY AI

## الهدف

نقل كود الـLanding Page الموجود في مشروع/ملفات Next.js مستقلة إلى مشروع TRENDY AI، بحيث تصبح الصفحة العامة الأولى عند فتح `/`، مع إبقاء صفحات تسجيل الدخول والتطبيق المحمي كما هي.

## الحالة الحالية

في النسخة الحالية من TREND، الملف `frontend/app/page.tsx` لا يرسم Landing Page؛ بل يوجه المستخدم إلى `/brands` إذا كان مسجلًا، وإلى `/login` إذا لم يكن مسجلًا.[1]

كود الـLanding Page موجود خارج النسخة الحالية، لذلك لا ينبغي نسخ مشروع Next.js كاملًا فوق المشروع. المطلوب هو نقل الصفحة والمكونات والأصول اللازمة فقط، ثم ربطها مع بنية TRENDY AI الحالية.

## سلوك المسارات المطلوب

| المسار | السلوك |
| --- | --- |
| `/` | Landing Page عامة لـTRENDY AI |
| `/login` | صفحة تسجيل الدخول الحالية |
| `/brands` | Dashboard للمستخدم المسجل |
| `/brands/[brandId]` | مساحة عمل العلامة التجارية |

زر CTA في الـLanding Page يوجه الزائر إلى `/login`. إذا كان المستخدم مسجلًا، يمكن أن يوجهه إلى `/brands` بدل إجباره على تسجيل الدخول مرة أخرى.

## الملفات المتوقعة

| الملف/المجلد | التعديل |
| --- | --- |
| `frontend/app/page.tsx` | استبدال redirect بصفحة Landing Page العامة |
| `frontend/components/landing/` | إضافة مكونات الـHero والـfeatures والـCTA والـfooter |
| `frontend/public/landing/` | وضع الصور والـmockups والأيقونات الخاصة بالصفحة |
| `frontend/app/globals.css` | إضافة أو ربط ألوان Cream وCharcoal وBurgundy بدون كسر dashboard |
| `frontend/app/layout.tsx` | تحديث metadata إلى TRENDY AI ومراجعة الخطوط |
| `frontend/package.json` | إضافة dependency فقط إذا كانت Landing Page تحتاج مكتبة غير موجودة |
| `frontend/middleware.ts` | التأكد من أن `/` عامة وأن المسارات الخاصة ما زالت محمية |

## طريقة النقل

1. افحص المشروع المستقل وحدد نقطة الدخول، مثل `app/page.tsx`، والمكونات، والصور، والخطوط، والـdependencies.

1. لا تنقل `app/layout.tsx` أو `next.config.*` أو `package.json` كاملًا فوق المشروع الحالي. قارنها يدويًا وانقل الجزء المطلوب فقط.

1. انسخ مكونات الـLanding Page إلى `frontend/components/landing/`، ثم عدّل imports حتى تستخدم مكونات وألوان TRENDY AI الحالية.

1. انسخ الصور إلى `frontend/public/landing/` وعدّل مساراتها لتستخدم `/landing/...`.

1. عدّل `frontend/app/page.tsx` ليعرض مكوّن Landing Page بدل redirect.

1. أبقِ `frontend/app/(dashboard)/` و`frontend/app/(auth)/` كما هي، ولا تغيّر منطق تسجيل الدخول في هذه المهمة.

1. اختبر المسارات الأربعة السابقة على سطح المكتب والهاتف.

## القرار البصري

تستخدم الـLanding Page هوية TRENDY AI الرسمية: خلفية Cream، أسطح Charcoal داكنة، Burgundy كلون CTA، وتخطيط عربي RTL. يجب أن تتطابق tokens الصفحة مع `docs/trendy-ai-design-system.md`. لون الـPrimary Color الخاص بـBrand المستخدم يبقى accent داخل workspace، ولا يصبح لون خلفية الـLanding Page.

## تقسيم المهمة على Board

| ID | المهمة | النتيجة المتوقعة |
| --- | --- | --- |
| LP-01 | Inventory Landing Page source | قائمة بالمكونات والأصول والـdependencies والمسار الرئيسي |
| LP-02 | Create landing components folder | نقل المكونات إلى `frontend/components/landing/` |
| LP-03 | Move landing assets | وضع الصور والخطوط المطلوبة داخل `frontend/public/landing/` أو مسار مناسب |
| LP-04 | Replace root page | جعل `frontend/app/page.tsx` يعرض Landing Page على `/` |
| LP-05 | Preserve auth routes | التأكد أن `/login` و`/brands` تعملان دون تغيير غير مقصود |
| LP-06 | Responsive and RTL review | مراجعة الهاتف، RTL، الأزرار، الصور، والمسافات |
| LP-07 | Open PR and visual demo | PR مستقل مع screenshots أو رابط preview |

## معايير القبول

تعتبر المهمة مكتملة عندما تفتح `/` وتظهر Landing Page كاملة، وتعمل أزرار CTA، ولا يحدث redirect تلقائي إلى `/login` للزائر العام. يجب أن تبقى `/login` و`/brands` تعملان، ولا تظهر أخطاء console أو صور مفقودة، وتعمل الصفحة على الهاتف والعربية RTL. يجب أيضًا ألا تُضاف dependencies غير ضرورية أو تُستبدل إعدادات المشروع الحالية بالكامل.

## Branch المقترح

نفذوا الدمج في فرع مستقل:

```bash
git switch -c feat/landing-page-integration
```

لا تدمجوا هذه المهمة داخل branch الـquestionnaire أو prompt builder؛ فصلها يجعل مراجعة التصميم أسهل ويقلل احتمال كسر منطق التطبيق.

## ملاحظة تنفيذية

إذا كانت Landing Page تحتوي على نصوص ثابتة بالعربية فقط، يمكن دمجها أولًا ثم نقل نصوصها إلى نظام الترجمة عند تنفيذ i18n. أما إذا كانت تحتوي أصلًا على نظام ترجمة، فيجب مقارنة أسماء المفاتيح والـproviders قبل النسخ.

