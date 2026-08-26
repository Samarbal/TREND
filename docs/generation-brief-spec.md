# S0-04 — خيارات Generation Brief

## القرار العام

التصميم الأفضل ليس أن تكون كل الحقول كتابة حرة، ولا أن نحول كل شيء إلى dropdown. نستخدم قاعدة بسيطة:

> **الشيء المتكرر والواضح يمكن تحويله إلى خيار جاهز، أما الشيء الذي يحتاج سياقًا أو خيالًا أو تفاصيل خاصة بالعميل فيبقى كتابة حرة.**

بهذا نكسب ثلاث فوائد في الوقت نفسه: المستخدم المبتدئ لا يبدأ من صفحة فارغة، والـBackend يستقبل قيمًا موحدة يمكن اختبارها، والمستخدم لا يشعر أن المنتج يحصره في قائمة محدودة.

## توصية v1 النهائية

| الحقل | طريقة الإدخال | إلزامي؟ | القرار |
|---|---|---:|---|
| Campaign Goal | Single select أو بطاقات اختيار | نعم | خيارات جاهزة + `custom` |
| Target Audience | Hybrid: خيارات مساعدة + حقول كتابة | نعم | لا تجعله dropdown واحدًا |
| Content Type | Single select أو بطاقات | نعم | خيارات جاهزة + `custom` |
| Core Idea | Textarea | نعم | كتابة حرة مع مثال واضح |
| Voice/Tone | Single select + خيار modifiers اختياري | نعم | نبرة أساسية واحدة، ويمكن إضافة صفة أو صفتين |
| Optional Notes | Textarea | لا | كتابة حرة بالكامل |
| Platform/Format | الموجود حاليًا `platform_preset` | نعم | يبقى منفصلًا عن `content_type` |
| Logo Mode | الموجود حاليًا `logo_mode` | نعم | يبقى منفصلًا |
| Provider | الموجود حاليًا `provider` | نعم | يبقى منفصلًا |

## 1. Campaign Goal

### طريقة الإدخال

استخدموا **single select**؛ لأن الحملة عادة لها هدف رئيسي واحد. في الواجهة يمكن عرضه كبطاقات صغيرة مع icon أو كـselect، لكن لا تستخدموا multi-select في النسخة الأولى حتى لا يرسل المستخدم خمسة أهداف متعارضة.

### الخيارات المقترحة

| Internal key | Label عربي مقترح | متى يستخدم؟ |
|---|---|---|
| `brand_awareness` | زيادة الوعي بالعلامة | تعريف الناس بالعلامة أو هويتها |
| `product_launch` | إطلاق منتج أو خدمة | منتج جديد أو تحديث مهم |
| `product_showcase` | إبراز منتج أو خدمة | إظهار المزايا بصريًا |
| `promotion_offer` | عرض أو خصم | حملة تحويلية أو سعرية |
| `sales_conversion` | زيادة المبيعات | توجيه المستخدم لاتخاذ إجراء شراء |
| `lead_generation` | جمع عملاء محتملين | نموذج تواصل أو طلب استشارة |
| `engagement` | زيادة التفاعل | سؤال، رأي، مشاركة، أو تفاعل اجتماعي |
| `education` | التوعية أو التعليم | شرح فكرة أو نصيحة أو معلومة |
| `announcement` | إعلان خبر أو تحديث | افتتاح، تغيير، إطلاق، أو خبر |
| `event_registration` | الترويج لفعالية | مؤتمر، ورشة، افتتاح، أو مناسبة |
| `seasonal_campaign` | حملة موسمية | رمضان، العيد، الصيف، العودة للمدارس |
| `social_proof` | إبراز الثقة وتجربة العملاء | testimonial أو review أو نتائج |
| `custom` | هدف آخر | يفتح حقلًا صغيرًا للكتابة |

### قواعد UX

اعرضوا أول 6–8 خيارات الأكثر استخدامًا، ثم خيار **المزيد** أو searchable select. لا تضعوا 13 خيارًا صغيرًا في شاشة الهاتف دفعة واحدة. عند اختيار `custom` يظهر:

```text
اكتب هدف الحملة بجملة قصيرة
```

ويُخزَّن النص في `campaign_goal_custom` أو يدمج في brief بعد التحقق. لا تستبدل قيمة enum نفسها بنص عشوائي.

## 2. Target Audience

### لا تستخدموا dropdown واحدًا

الجمهور ليس صفة واحدة. إذا وضعتم قائمة مثل «شباب / نساء / أصحاب أعمال» فقط، ستخسرون معلومات مهمة مثل الموقع، العمر، والسياق. الأفضل أن يكون الحقل **Hybrid**: خيارات منظمة صغيرة، مع مساحة كتابة تفصيلية.

### التصميم المقترح

| الجزء | طريقة الإدخال | إلزامي؟ |
|---|---|---:|
| Audience segment | single أو multi-select محدود | نعم |
| Location/market | searchable country/region select | لا، لكنه مفضل |
| Age range | single select | لا |
| Gender focus | single select | لا |
| Audience details | textarea | نعم |

### Audience segment

| Internal key | Label عربي |
|---|---|
| `general_consumers` | جمهور عام |
| `small_business_owners` | أصحاب المشاريع الصغيرة |
| `entrepreneurs` | رواد الأعمال |
| `b2b_decision_makers` | أصحاب القرار في الشركات |
| `marketers_creators` | المسوقون وصناع المحتوى |
| `professionals` | المهنيون والموظفون |
| `students` | الطلاب |
| `parents_families` | الأهل والعائلات |
| `online_shoppers` | المتسوقون عبر الإنترنت |
| `beauty_fashion_audience` | جمهور الموضة والجمال |
| `food_hospitality_audience` | جمهور الطعام والضيافة |
| `technology_users` | مستخدمو التقنية |
| `local_community` | المجتمع المحلي |
| `custom` | فئة أخرى |

يمكن السماح باختيار فئتين كحد أقصى. لا تجعلوا المستخدم يحدد صفات كثيرة لا يعرف معناها؛ الهدف مساعدة brief وليس بناء نظام إعلانات كامل.

### Age range

| Internal key | Label عربي |
|---|---|
| `under_18` | أقل من 18 |
| `18_24` | 18–24 |
| `25_34` | 25–34 |
| `35_44` | 35–44 |
| `45_54` | 45–54 |
| `55_plus` | 55 فأكثر |
| `mixed` | أعمار متنوعة |
| `unspecified` | غير محدد |

اجعلوا العمر اختياريًا؛ ليس كل محتوى يحتاج تحديدًا عمريًا.

### Gender focus

| Internal key | Label عربي |
|---|---|
| `all` | الجميع |
| `women` | النساء |
| `men` | الرجال |
| `gender_inclusive` | شامل للجميع |
| `custom` | تخصيص |
| `unspecified` | غير محدد |

هذا الحقل اختياري، ويجب أن يبدأ بقيمة `unspecified` أو `all` بدل إجبار المستخدم على الاختيار.

### Location/market

استخدموا searchable combobox بدل قائمة طويلة جدًا. يمكن أن تبدأوا بدول السوق المستهدف، ثم توسعوها لاحقًا. لا تربطوا الاسم الظاهر باللغة؛ خزنوا code ثابتًا مثل `JO` أو `SA` واعرضوا label مترجمًا.

### Audience details

هذا هو الجزء الحر والأهم:

```text
صف جمهورك بطريقة طبيعية: من هو؟ ماذا يحب؟ ما مشكلته؟ وما الذي تريد أن يشعر به عندما يرى المحتوى؟
```

مثال:

```text
أصحاب مشاريع صغيرة في عمّان، يهتمون بمظهر احترافي على Instagram، وليس لديهم فريق تصميم داخلي، ويفضلون أسلوبًا واضحًا وحديثًا وغير مبالغ فيه.
```

### الشكل البرمجي المقترح

```json
"target_audience": {
  "segments": ["small_business_owners"],
  "location": "JO",
  "age_range": "25_34",
  "gender_focus": "all",
  "details": "أصحاب مشاريع صغيرة في عمّان..."
}
```

إذا أردتم تبسيط Backend في أول إصدار، يستطيع Frontend aggregator تحويل هذه البيانات إلى string منظم مؤقتًا، لكن يجب أن تبقى الأجزاء الأصلية واضحة في state حتى لا تضيع المعلومات.

## 3. Content Type

### الفرق بين Content Goal وContent Type

`campaign_goal` يجيب: **لماذا نصنع المحتوى؟**  
`content_type` يجيب: **ما نوع القطعة التي نصنعها؟**

لا تخلطوا بينهما؛ مثلًا هدف الحملة قد يكون `brand_awareness`، لكن نوع المحتوى قد يكون `brand_story`.

### الخيارات المقترحة

| Internal key | Label عربي |
|---|---|
| `product_showcase` | عرض منتج |
| `service_showcase` | عرض خدمة |
| `promotional_ad` | إعلان ترويجي |
| `announcement` | إعلان أو خبر |
| `educational` | محتوى تعليمي |
| `testimonial` | شهادة أو تجربة عميل |
| `brand_story` | قصة العلامة |
| `event_promo` | ترويج فعالية |
| `seasonal_post` | منشور موسمي |
| `quote_or_tip` | اقتباس أو نصيحة |
| `infographic` | إنفوغراف أو شرح بصري |
| `recruitment` | توظيف أو ثقافة شركة |
| `social_proof` | دليل اجتماعي أو نتائج |
| `custom` | نوع آخر |

### UX المقترح

استخدموا cards أو radio group، لأن عدد الخيارات متوسط ويحتاج المستخدم إلى قراءة label. أضيفوا وصفًا صغيرًا تحت كل خيار بدل الاعتماد على الاسم وحده.

## 4. Core Idea

### طريقة الإدخال

هذا الحقل يجب أن يكون **textarea حرًا**، وليس dropdown. الفكرة الأساسية لا يمكن توقعها بقائمة شاملة؛ هنا تظهر قيمة المستخدم وإبداعه.

استخدموا placeholder إرشاديًا:

```text
ما الفكرة التي تريد أن يفهمها الجمهور من الصورة؟ اكتبها كما تخطر في بالك، حتى لو لم تكن prompt احترافيًا.
```

مثال:

```text
نريد إظهار أن قهوتنا الباردة هي الخيار المنعش لصباح صيفي مزدحم.
```

### التحقق

- الحد الأدنى: 3 أحرف.
- الحد الأقصى المقترح: 500 حرف.
- أظهروا counter مثل `86 / 500`.
- لا تحاولوا إعادة كتابة النص في Frontend؛ فقط trim ثم أرسلوه للخلفية.

## 5. Voice/Tone

### القرار المقترح

اجعلوا هناك **نبرة أساسية واحدة** من dropdown، ثم خيارًا اختياريًا لإضافة modifier أو اثنين. هذا أفضل من multi-select بلا حدود، لأن جمع `urgent + calm + playful + luxury` قد ينتج تعليمات متناقضة.

### النبرة الأساسية

| Internal key | Label عربي |
|---|---|
| `friendly` | ودود |
| `professional` | احترافي |
| `playful` | مرح |
| `bold` | جريء |
| `elegant` | أنيق وفاخر |
| `warm` | دافئ وإنساني |
| `educational` | تعليمي وواضح |
| `inspirational` | ملهم |
| `minimal` | هادئ وبسيط |
| `trustworthy` | موثوق |
| `youthful` | شبابي |
| `urgent` | عاجل ومحفز |
| `custom` | نبرة أخرى |

### modifiers اختيارية

| Internal key | Label عربي |
|---|---|
| `modern` | عصري |
| `premium` | راقٍ |
| `emotional` | عاطفي |
| `direct` | مباشر |
| `conversational` | حواري |
| `playful` | مرح |
| `culturally_local` | قريب من الثقافة المحلية |
| `minimalist` | شديد البساطة |

حدّ الاختيار في الواجهة هو modifier واحد أو اثنان. إذا اختار المستخدم `custom` يظهر textarea صغير، مثل:

```text
صف النبرة التي تريدها بكلماتك
```

في v1، إذا أردتم أقل تعقيدًا، ابدأوا بالنبرة الأساسية فقط وأجلوا modifiers إلى v1.1.

## 6. Optional Notes

### طريقة الإدخال

هذا الحقل **textarea حر واختياري**. لا تضعوا له dropdown؛ فهو مكان القيود والملاحظات التي لا تغطيها الخيارات الجاهزة.

أمثلة لما يمكن أن يكتبه المستخدم:

```text
تجنب الألوان الفاقعة.
لا تستخدم أشخاصًا في الصورة.
اترك مساحة فارغة أعلى التصميم لعنوان عربي.
استخدم إحساسًا صيفيًا لكن لا تجعل الصورة كرتونية.
```

### التحقق

- اختياري ويمكن أن يكون `null`.
- الحد الأقصى المقترح: 1000 حرف.
- أضيفوا helper text يوضح أنه ليس مكانًا لإدخال API key أو معلومات سرية.

## 7. حقول إضافية أنصح بها، لكن لا تجعلوها شرطًا في S0-04

هذه الحقول ستزيد جودة المخرجات، لكنها قد توسع Sprint 2 و3. وثقوها كامتدادات مستقبلية:

| الحقل | نوعه | السبب |
|---|---|---|
| `visual_format` | single select | يفرق بين product hero وlifestyle وposter وflat lay |
| `style_tags` | multi-select بحد أقصى 3 | يضيف minimal/editorial/cinematic وغيرها |
| `output_language` | single select | مهم عند دعم العربية والإنجليزية |
| `cta_type` | single select + custom | يوجه التصميم نحو Shop Now أو Learn More |
| `season_or_context` | select + text | مفيد للمواسم وGoogle Trends لاحقًا |

إذا كان هدفكم تحسين الصور بسرعة، أضيفوا `visual_format` و`output_language` إلى تصميم Sprint 2، لكن لا تغيروا الحقول الأساسية الستة قبل موافقة الفريق.

## 8. Schema v1 الذي أنصح باعتماده

```json
{
  "brief": {
    "campaign_goal": "product_launch",
    "target_audience": {
      "segments": ["small_business_owners"],
      "location": "JO",
      "age_range": "25_34",
      "gender_focus": "all",
      "details": "أصحاب مشاريع صغيرة في عمّان يهتمون بمظهر احترافي..."
    },
    "content_type": "product_showcase",
    "core_idea": "إظهار أن القهوة الباردة خيار منعش لصباح صيفي مزدحم",
    "voice_tone": "friendly",
    "optional_notes": "اترك مساحة أعلى التصميم لعنوان عربي واضح",
    "visual_format": "product_hero",
    "output_language": "ar"
  },
  "provider": "openai",
  "platform_preset": "instagram_post",
  "logo_mode": "watermark"
}
```

إذا أردتم الالتزام الصارم بالحقول الستة في MVP، احذفوا `visual_format` و`output_language` من payload الآن، لكن احتفظوا بهما في قسم Future Fields داخل المواصفة حتى لا تنسوا سبب الحاجة إليهما.

## 9. قواعد مهمة لتجنب dropdown سيئ

لا تجعلوا القائمة تحتوي على عشرات الخيارات بلا بحث. استخدموا `Select` للمجموعات القصيرة، و`Combobox` للقوائم الطويلة، وchips للصفات المتعددة. يجب أن يكون لكل خيار label عربي مترجم وkey داخلي ثابت. أضيفوا دائمًا `custom` عندما تكون القائمة غير قادرة على تغطية كل الحالات.

لا تستخدموا كلمة `Other` وحدها من دون حقل نصي بعدها. ولا تضعوا الوصف الحقيقي داخل قيمة enum. القيمة يجب أن تكون مستقرة مثل `product_showcase`، بينما الترجمة والوصف يعيشان في قاموس الواجهة.

لا تملؤوا كل dropdown بخيارات “ذكية” كثيرة فقط لأنكم تستطيعون. السؤال الجيد هو الذي يساعد المستخدم على اتخاذ قرار، وليس الذي يجمع بيانات لا يستخدمها الـprompt builder.

## 10. التوصية النهائية للفريق

اعتمدوا في S0-04 هذه النسخة:

| المستوى | الحقول |
|---|---|
| Required dropdowns | `campaign_goal`, `content_type`, `voice_tone` |
| Hybrid structured + free text | `target_audience` |
| Required free text | `core_idea` |
| Optional free text | `optional_notes` |
| Existing generation controls | `provider`, `platform_preset`, `logo_mode` |
| Future optional fields | `visual_format`, `style_tags`, `output_language`, `cta_type` |

هذه النسخة شاملة بما يكفي لتقليل الفراغ أمام المبتدئ، ومرنة بما يكفي لعدم تقييد المستخدم. كما أنها مناسبة لفريق مبتدئ لأن كل field له سلوك واضح، ولا تحتاجون إلى بناء نظام توصية أو taxonomy ضخم في أول Sprint.
