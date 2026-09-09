import en from '../../public/locales/en.json'
import ar from '../../public/locales/ar.json'

export type Lang = 'en' | 'ar'

type DeepRecord = { [key: string]: string | DeepRecord }

const translations: Record<Lang, DeepRecord> = { en, ar }

/**
 * Resolves a dot-separated key like "hero.cta" against the active locale dict.
 * Falls back to the English value if the key is missing in the target locale.
 * Always returns a string, never undefined or null.
 */
export function t(lang: Lang = 'en', key: string): string {
  if (!key || typeof key !== 'string') {
    return ''
  }

  const safeLang: Lang = lang === 'ar' ? 'ar' : 'en'
  const parts = key.split('.')

  // Safely traverse an object by dot-separated keys
  const resolve = (dict: DeepRecord | undefined): string | null => {
    if (!dict || typeof dict !== 'object') return null
    let curr: any = dict
    for (const p of parts) {
      if (!curr || typeof curr !== 'object' || !(p in curr)) {
        return null
      }
      curr = curr[p]
    }
    return typeof curr === 'string' ? curr : null
  }

  // 1. Try selected language
  const val = resolve(translations[safeLang])
  if (val !== null) return val

  // 2. Fallback to English if selected language is not English
  if (safeLang !== 'en') {
    const fallbackVal = resolve(translations['en'])
    if (fallbackVal !== null) return fallbackVal
  }

  // 3. Safe fallback to the key itself
  return key
}
