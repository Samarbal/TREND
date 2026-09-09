'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import { t as tFn, type Lang } from './translations'

const STORAGE_KEY = 'trendy-lang'
const DEFAULT_LANG: Lang = 'en'

export interface LanguageContextValue {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: string) => string
  dir: 'ltr' | 'rtl'
  isRTL: boolean
  mounted: boolean
}

const defaultContextValue: LanguageContextValue = {
  lang: DEFAULT_LANG,
  setLang: () => {},
  t: (key: string) => tFn(DEFAULT_LANG, key),
  dir: 'ltr',
  isRTL: false,
  mounted: false,
}

const LanguageContext = createContext<LanguageContextValue>(defaultContextValue)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(DEFAULT_LANG)
  const [mounted, setMounted] = useState<boolean>(false)

  // On mount: read persisted preference safely from localStorage
  useEffect(() => {
    setMounted(true)
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored === 'en' || stored === 'ar') {
        setLangState(stored)
      }
    } catch {
      // localStorage may be unavailable or restricted
    }
  }, [])

  // Apply dir + lang attributes to <html> whenever lang changes
  useEffect(() => {
    if (typeof document !== 'undefined') {
      const html = document.documentElement
      html.lang = lang
      html.dir = lang === 'ar' ? 'rtl' : 'ltr'
    }
  }, [lang])

  const setLang = useCallback((newLang: Lang) => {
    setLangState(newLang)
    try {
      localStorage.setItem(STORAGE_KEY, newLang)
    } catch {
      // ignore
    }
  }, [])

  const t = useCallback((key: string) => tFn(lang, key), [lang])

  const dir = lang === 'ar' ? 'rtl' : 'ltr'
  const isRTL = lang === 'ar'

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, dir, isRTL, mounted }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext)
  return context || defaultContextValue
}
