# Internationalization (i18n) and RTL/LTR

## 1. Overview

TREND supports English (`en`) and Arabic (`ar`) through [`next-intl`](https://next-intl.dev/). The application uses the same message dictionaries for server and client rendering, and sets the document language and direction from the active locale.

The canonical dictionaries are:

- `frontend/messages/en.json`
- `frontend/messages/ar.json`

`frontend/public/locales` is not used by the current application and must not be treated as a second source of translations.

## 2. Locale resolution

Locale resolution is implemented in `frontend/i18n/request.ts`.

- Supported locales: `ar` and `en`.
- Default locale: `ar` (Arabic-first, as specified for Sprint 3).
- User selection is persisted in the `NEXT_LOCALE` cookie.
- If the cookie is absent or unsupported, the application uses Arabic.
- Messages are loaded from `frontend/messages/{locale}.json`.

The settings language selector writes the cookie and calls `router.refresh()` so the server-rendered messages and document attributes are refreshed.

## 3. Provider and document direction

`frontend/app/layout.tsx` loads the active locale and messages using `next-intl/server`, then wraps the application with `NextIntlClientProvider`.

The root document is rendered with:

```tsx
<html lang={locale} dir={locale === 'ar' ? 'rtl' : 'ltr'}>
```

Therefore:

- English uses `lang="en"` and `dir="ltr"`.
- Arabic uses `lang="ar"` and `dir="rtl"`.

The Arabic font is loaded through `Noto_Naskh_Arabic`. RTL-specific body styling is defined in `frontend/app/globals.css`.

## 4. Using translations in components

Client components should import the hooks from `next-intl`:

```tsx
'use client'

import { useLocale, useTranslations } from 'next-intl'

export function MyComponent() {
  const locale = useLocale()
  const t = useTranslations('mySection')
  const isRTL = locale === 'ar'

  return (
    <section>
      <h1>{t('title')}</h1>
      <p>{t('description')}</p>
      {isRTL && <span>Arabic layout</span>}
    </section>
  )
}
```

Use a component-specific namespace when possible. For example:

```tsx
const t = useTranslations('components.keys.key-card')
```

Then access keys below that namespace with `t('validate')`, `t('delete')`, and so on.

## 5. Adding or changing messages

Every new key must be added to both dictionaries with the same structure:

```json
{
  "mySection": {
    "title": "Welcome",
    "description": "Here is the content"
  }
}
```

The Arabic dictionary must contain the corresponding Arabic values:

```json
{
  "mySection": {
    "title": "مرحبًا",
    "description": "إليك المحتوى"
  }
}
```

Product and provider names such as `OpenAI`, `Gemini`, and `TRENDY AI` may remain unchanged when they are proper names. User-facing actions, status labels, errors, placeholders, and accessibility labels must be translated.

Do not add messages to `frontend/public/locales`; it is not the runtime source.

## 6. RTL implementation rules

Prefer CSS logical properties and Tailwind logical utilities so the same component works in both directions:

- Use `start` and `end` instead of `left` and `right`.
- Use `border-s` and `border-e` instead of directional border classes where appropriate.
- Use `text-start` and `text-end` for text alignment.
- Use `rtl:` variants when an icon or drawer must flip direction.
- Keep email and URL inputs LTR for reliable entry of symbols such as `@`, `.`, and `/`.

The dashboard shell explicitly handles the mobile drawer transition in RTL and LTR. Direction-sensitive changes should be checked at both desktop and mobile breakpoints.

## 7. Testing localized components

A component that calls `useTranslations` must be rendered below `NextIntlClientProvider` in tests:

```tsx
import { NextIntlClientProvider } from 'next-intl'
import messages from '@/messages/en.json'

render(
  <NextIntlClientProvider locale="en" messages={messages}>
    <MyComponent />
  </NextIntlClientProvider>,
)
```

Tests should assert behavior and accessible roles. When an accessible name is translated, use the message for the test locale rather than assuming the English text is always present.

At minimum, localization changes should be checked with:

```bash
cd frontend
npx tsc --noEmit
npm test -- --run
npm run build
```

## 8. Review checklist

Before merging an i18n change, verify that:

1. Both `en.json` and `ar.json` contain the same keys.
2. No user-facing hardcoded English or Arabic text remains in the changed component.
3. Interactive elements have translated accessible labels.
4. Tests provide `NextIntlClientProvider` where required.
5. `lang` and `dir` change correctly when the locale changes.
6. The layout remains usable in both LTR and RTL.
7. The production build and the full test suite pass.

This implementation replaces the former `LanguageContext`/`useLanguage` approach. New code must use `next-intl` rather than the obsolete API described in earlier documentation.
