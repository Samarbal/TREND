"use client"

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { Globe } from 'lucide-react'

export default function LanguageSwitcher() {
  const locale = useLocale() as 'ar' | 'en'
  const t = useTranslations('langToggle')
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const next = locale === 'ar' ? 'en' : 'ar'

  function switchLanguage() {
    document.cookie = `NEXT_LOCALE=${next};path=/;max-age=31536000;sameSite=lax`
    startTransition(() => router.refresh())
  }

  return (
    <button type="button" onClick={switchLanguage} disabled={pending}
      aria-label={t('ariaLabel')}
      className="inline-flex items-center gap-1.5 text-sm font-semibold border rounded-full px-3 py-1 transition-colors">
      <Globe className="h-3.5 w-3.5" />
      <span>{t('switchTo')}</span>
    </button>
  )
}
