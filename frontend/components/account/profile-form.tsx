'use client'

import { useState } from 'react'
import { apiRequest } from '@/lib/api'
import { Profile } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import type { Lang } from '@/lib/i18n/translations'

interface ProfileFormProps {
  profile: Profile
  onUpdate: (profile: Profile) => void
}

export function ProfileForm({ profile, onUpdate }: ProfileFormProps) {
  const { toast } = useToast()
  const { t, lang, setLang } = useLanguage()
  const [fullName, setFullName] = useState(profile.full_name ?? '')
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url ?? '')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ full_name?: string; avatar_url?: string }>({})

  function validate(): boolean {
    const newErrors: typeof errors = {}

    if (fullName.trim() && (fullName.trim().length < 2 || fullName.trim().length > 120)) {
      newErrors.full_name = t('account.fullNameError')
    }

    if (avatarUrl.trim() && !/^https?:\/\/.+/.test(avatarUrl.trim())) {
      newErrors.avatar_url = t('account.avatarUrlError')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)
    try {
      const updated = await apiRequest<Profile>('/me', {
        method: 'PATCH',
        body: JSON.stringify({
          full_name: fullName.trim() || null,
          avatar_url: avatarUrl.trim() || null,
        }),
      })
      onUpdate(updated)
      toast({ title: t('account.profileUpdated'), description: t('account.changesSaved') })
    } catch (err) {
      toast({
        title: t('account.error'),
        description: err instanceof Error ? err.message : t('account.updateFailed'),
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Profile Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[16px]">{t('account.profileCardTitle')}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>{t('account.email')}</Label>
              <Input value={profile.email} disabled />
              <p className="text-[12px] text-muted-foreground">
                {t('account.emailHint')}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="full_name">{t('account.fullName')}</Label>
              <Input
                id="full_name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t('account.fullNamePlaceholder')}
              />
              {errors.full_name && (
                <p className="text-[13px] text-destructive">{errors.full_name}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="avatar_url">{t('account.avatarUrl')}</Label>
              <Input
                id="avatar_url"
                value={avatarUrl}
                onChange={(e) => setAvatarUrl(e.target.value)}
                placeholder={t('account.avatarUrlPlaceholder')}
              />
              {errors.avatar_url && (
                <p className="text-[13px] text-destructive">{errors.avatar_url}</p>
              )}
            </div>
            <Button type="submit" disabled={loading}>
              {loading ? t('account.saving') : t('account.saveChanges')}
            </Button>
          </CardContent>
        </form>
      </Card>

      {/* Language Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-[16px]">{t('account.languageCardTitle')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="language-select">{t('account.languageLabel')}</Label>
            <p className="text-[12px] text-muted-foreground">{t('account.languageHint')}</p>
          </div>
          <select
            id="language-select"
            value={lang}
            onChange={(e) => setLang(e.target.value as Lang)}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <option value="en">{t('account.languageEnglish')}</option>
            <option value="ar">{t('account.languageArabic')}</option>
          </select>
        </CardContent>
      </Card>
    </div>
  )
}
