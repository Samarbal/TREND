

## 8. API Error Codes and Frontend Translation

API error responses use a stable machine-readable `error.code` rather than a localized message as the integration contract. The backend returns the error code, the original diagnostic message, and, when available, a `request_id` for tracing. For example:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "language must be one of: ar, en",
    "request_id": "..."
  }
}
```

The backend must not select Arabic or English presentation text. It should preserve the appropriate error code for the condition, such as `VALIDATION_ERROR`, `NOT_FOUND`, or a provider-specific error code, and may include the raw message for logs and fallback behavior. The frontend parses the response in `frontend/lib/api.ts`, keeps the code on `ApiError.code`, and is responsible for resolving the user-facing localized message from the active language dictionary.

When adding a new API error, follow this sequence:

1. Add or reuse a stable uppercase error code in the backend response.
2. Keep the code independent of the user-facing language; never use translated text as the code.
3. Add the matching key to both `frontend/public/locales/en.json` and `frontend/public/locales/ar.json`.
4. Render the translated frontend message, while retaining `request_id` for support and debugging.

This separation keeps API behavior stable for clients and allows the frontend to switch between Arabic and English without requiring backend changes.
# Internationalization (i18n) & RTL/LTR Documentation

## 1. Overview & Architecture

The internationalization (i18n) system in **TRENDY AI** provides full bilingual support for **English (`en`)** and **Arabic (`ar`)**, including automatic layout flipping between **LTR (Left-to-Right)** and **RTL (Right-to-Left)**.

### Architectural Highlights
- **Zero Additional Dependencies**: Built directly on React Context and Next.js 14 App Router without third-party libraries (no `next-intl` or `react-i18next`).
- **No Route Mutation**: Avoids route prefixing (`/en/...`, `/ar/...`), preserving existing route structures, Supabase auth redirects, and dashboard routing.
- **Client Persistence**: Persists user choice in `localStorage` under the key `trendy-lang`, instantly restored upon revisit.
- **Dynamic DOM Sync**: Updates `document.documentElement.lang` and `document.documentElement.dir` synchronously.
- **Tailwind v3 Native RTL**: Leverages Tailwind's logical utilities (`start`, `end`, `border-e`, `text-start`) and `rtl:` variants without external CSS plugins.

---

## 2. Directory Structure

```text
frontend/
├── app/
│   ├── layout.tsx                    # Wraps tree in LanguageProvider; loads Arabic font
│   └── globals.css                   # RTL font and LTR input resets
├── lib/
│   └── i18n/
│       ├── LanguageContext.tsx       # React Context provider & useLanguage() hook
│       └── translations.ts           # Safe dot-notation translation resolver
├── public/
│   └── locales/
│       ├── en.json                   # English dictionary
│       └── ar.json                   # Arabic dictionary
└── components/
    ├── Header.tsx                    # Landing page header with language switcher
    ├── layout/
    │   ├── app-shell.tsx             # Responsive dashboard layout (LTR & RTL drawer)
    │   └── app-sidebar.tsx           # Dashboard sidebar with nav translations & toggle
    └── account/
        └── profile-form.tsx          # Account settings with language selection dropdown
```

---

## 3. Translation Dictionaries (`en.json` & `ar.json`)

Translations are organized hierarchically by domain and component:

| Namespace | Description | Keys Covered |
|---|---|---|
| `nav` | Landing page navbar | `about`, `studio`, `trial`, `audiences`, `contact`, `signIn`, `signUp` |
| `hero` | Landing page hero & mockup | `badge`, headlines, CTAs, mockup workflow steps, form inputs |
| `why` | Value proposition section | `badge`, headings, feature cards (01, 02, 03) |
| `studio` | Content Studio showcase | Workflow steps, feature items, interactive post preview |
| `trial` | Free trial section | Steps, form headings, placeholders, submit states |
| `audiences` | Target customer segments | Founders, Small Businesses, Established Brands |
| `cta` | Call-to-Action banner | Headline, description, action button |
| `footer` | Global footer | Brand description, product/company/legal navigation, copyright |
| `dashboard` | Workspace & sidebar chrome | `generate`, `history`, `brandKit`, `keys`, `settings`, `admin`, `allBrands`, `logout` |
| `account` | Profile & settings | Field labels, validation error messages, language selection card |
| `langToggle` | Switcher button text | Target language label (`"العربية"` when EN, `"English"` when AR) |

---

## 4. Core Implementation

### 4.1 Safe Translation Resolver (`lib/i18n/translations.ts`)
The `t(lang, key)` function safely navigates nested objects using dot-separated paths (e.g., `'hero.badge'`):

- **Null Safety**: Handles invalid keys, non-strings, or missing sub-trees without throwing runtime errors.
- **Fallback Cascade**: If a key is missing in Arabic, it gracefully falls back to the English dictionary. If missing in English, it returns the key name itself.
- **Guaranteed String Return**: Never returns `null` or `undefined`.

```typescript
export function t(lang: Lang = 'en', key: string): string {
  if (!key || typeof key !== 'string') return ''
  const safeLang: Lang = lang === 'ar' ? 'ar' : 'en'
  const parts = key.split('.')

  const resolve = (dict: DeepRecord | undefined): string | null => {
    if (!dict || typeof dict !== 'object') return null
    let curr: any = dict
    for (const p of parts) {
      if (!curr || typeof curr !== 'object' || !(p in curr)) return null
      curr = curr[p]
    }
    return typeof curr === 'string' ? curr : null
  }

  const val = resolve(translations[safeLang])
  if (val !== null) return val

  if (safeLang !== 'en') {
    const fallbackVal = resolve(translations['en'])
    if (fallbackVal !== null) return fallbackVal
  }

  return key
}
```

### 4.2 State & Provider (`lib/i18n/LanguageContext.tsx`)
Exposes state and helper methods via the `useLanguage()` hook:

```typescript
export interface LanguageContextValue {
  lang: 'en' | 'ar'
  setLang: (lang: 'en' | 'ar') => void
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
  isRTL: boolean
  mounted: boolean
}
```

- **Hydration Safe**: Initializes with `'en'`, reads `localStorage` inside `useEffect`, and updates `document.documentElement` attributes (`lang` and `dir`).
- **Default Context**: Context provides a working `t()` fallback even if accessed outside the provider, preventing pre-hydration rendering crashes.

---

## 5. Direction & RTL Styling System

### 5.1 Document-Level Attributes
When switching languages:
- **English**: `<html lang="en" dir="ltr">`
- **Arabic**: `<html lang="ar" dir="rtl">`

### 5.2 Typography Integration
Google Fonts' `Noto_Naskh_Arabic` was integrated into [`app/layout.tsx`](file:///d:/Level4/TREND/frontend/app/layout.tsx):
```typescript
const arabic = Noto_Naskh_Arabic({
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});
```
In [`app/globals.css`](file:///d:/Level4/TREND/frontend/app/globals.css), body font family automatically switches in RTL mode:
```css
[dir="rtl"] body {
  font-family: var(--font-arabic), var(--font-sans), ui-sans-serif, system-ui, sans-serif;
}
```

### 5.3 Logical Properties & Responsive Layout
To prevent RTL layout bugs (like sidebars being translated off-screen):
1. **Drawer Container ([`app-shell.tsx`](file:///d:/Level4/TREND/frontend/components/layout/app-shell.tsx))**:
   - Mobile: `max-md:start-0` with `max-md:-translate-x-full` in LTR and `rtl:max-md:translate-x-full` in RTL.
   - Desktop: Explicitly set `md:static md:translate-x-0 md:transform-none` so the desktop sidebar always stays in column 1 of the grid regardless of direction.
2. **Borders & Dividers ([`app-sidebar.tsx`](file:///d:/Level4/TREND/frontend/components/layout/app-sidebar.tsx))**:
   - Uses `border-e` (border-inline-end) instead of `border-r`, ensuring the separator faces the main content in both LTR (right) and RTL (left).
3. **Icons & Arrows**:
   - Chevron icons flip automatically using `rtl:rotate-180`.
4. **Input Direction**:
   - Text inputs adhere to document direction, while `type="email"` and `type="url"` explicitly stay `direction: ltr` for correct symbol entry (`@`, `.`, `https://`).

---

## 6. Language Switchers

Three access points are provided for toggling language:

1. **Landing Page Header ([`Header.tsx`](file:///d:/Level4/TREND/frontend/components/Header.tsx))**:
   - A pill toggle button in the desktop navbar and mobile drawer:
   ```tsx
   <button onClick={() => setLang(lang === 'en' ? 'ar' : 'en')}>
     <Globe className="h-3.5 w-3.5" />
     <span>{t("langToggle.switchTo")}</span>
   </button>
   ```
2. **Dashboard Sidebar ([`app-sidebar.tsx`](file:///d:/Level4/TREND/frontend/components/layout/app-sidebar.tsx))**:
   - A dedicated button in the sidebar footer alongside Account and Logout.
3. **User Settings ([`profile-form.tsx`](file:///d:/Level4/TREND/frontend/components/account/profile-form.tsx))**:
   - A settings card with an HTML `<select>` dropdown for selecting between English and العربية.

---

## 7. Developer Usage Guide

### How to use translations in any component

```tsx
'use client'

import { useLanguage } from '@/lib/i18n/LanguageContext'

export function MyComponent() {
  const { t, lang, setLang, isRTL } = useLanguage()

  return (
    <div>
      <h1>{t('mySection.title')}</h1>
      <p>{t('mySection.description')}</p>
      {isRTL && <span>(Arabic mode active)</span>}
    </div>
  )
}
```

### Adding new translation keys
1. Open `frontend/public/locales/en.json` and add your key:
   ```json
   "mySection": {
     "title": "Welcome",
     "description": "Here is your content"
   }
   ```
2. Open `frontend/public/locales/ar.json` and add the corresponding Arabic text:
   ```json
   "mySection": {
     "title": "مرحبًا",
     "description": "إليك المحتوى الخاص بك"
   }
   ```
3. Use it in code via `t('mySection.title')`.
