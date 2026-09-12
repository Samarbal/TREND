'use client'

import { useProfile } from '@/hooks/use-profile'
import { ProfileForm } from '@/components/account/profile-form'
import { useTranslations } from 'next-intl'

export default function AccountPage() {
  const { profile, loading, error, mutate } = useProfile()
  const t = useTranslations()

  if (loading) {
    return (
      <div className="mx-auto max-w-[620px]">
        <h1 className="text-[30px] font-semibold leading-[1.16] tracking-tight">{t('account.title')}</h1>
        <p className="mt-4 text-muted-foreground">{t('account.loadingProfile')}</p>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-[620px]">
        <h1 className="text-[30px] font-semibold leading-[1.16] tracking-tight">{t('account.title')}</h1>
        <p className="mt-4 text-destructive">{error || t('account.failedToLoad')}</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-[620px]">
      <h1 className="mb-6 text-[30px] font-semibold leading-[1.16] tracking-tight">{t('account.title')}</h1>
      <ProfileForm profile={profile} onUpdate={mutate} />
    </div>
  )
}
