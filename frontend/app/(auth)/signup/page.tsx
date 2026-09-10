'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowLeft, Check, ImagePlus, KeyRound, Palette } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AuthShell } from '@/components/auth/auth-shell'
import { useLanguage } from '@/lib/i18n/LanguageContext'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function SignUpPage() {
<<<<<<< Updated upstream
  const t = useTranslations('auth')
=======
  const { t } = useLanguage()
>>>>>>> Stashed changes
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/confirm`,
      },
    })

    setLoading(false)

    if (error) {
      if (error.message.includes('User already registered')) {
        setError(t('.accountExists'))
      } else {
        setError(error.message)
      }
      return
    }

    setSuccess(true)
  }

<<<<<<< Updated upstream
  const hero = success ? (
    <>
      {t('signupSuccessHeroBefore')} <em className="text-brand-accent">{t('signupSuccessHeroAccent')}</em>
    </>
  ) : (
    <>
      {t('signupHeroBefore')} <em className="text-brand-accent">{t('signupHeroAccent')}</em>
    </>
  )
=======
  const hero = success ? t('.signupSuccessHero') : t('.signupHero')
>>>>>>> Stashed changes

  return (
    <AuthShell
      hero={hero}
<<<<<<< Updated upstream
      subcopy={t('signupSubcopy')}
      features={[
        { icon: Palette, label: t('signupFeatureInterview') },
        { icon: KeyRound, label: t('featureKeys') },
        { icon: ImagePlus, label: t('signupFeaturePreset') },
=======
      subcopy={t('.signupSubcopy')}
      features={[
        { icon: Palette, label: t('.warmInterview') },
        { icon: KeyRound, label: t('.bringYourKey') },
        { icon: ImagePlus, label: t('.everyPresetSized') },
>>>>>>> Stashed changes
      ]}
    >
      {success ? (
        <Card className="shadow-sm">
          <CardHeader className="items-center text-center">
            <span className="mb-2 inline-flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[color-mix(in_srgb,hsl(var(--success))_14%,white)] text-success">
              <Check className="h-5 w-5" />
            </span>
<<<<<<< Updated upstream
            <CardTitle className="text-[22px] font-semibold tracking-tight">{t('checkEmail')}</CardTitle>
            <CardDescription>
              {t('confirmationSent')} <strong className="text-foreground">{email}</strong>. {t('activateAccount')}
=======
            <CardTitle className="text-[22px] font-semibold tracking-tight">{t('.checkEmailTitle')}</CardTitle>
            <CardDescription>
              {t('.checkEmailDescription').split('{email}')[0]}
              <strong className="text-foreground">{email}</strong>
              {t('.checkEmailDescription').split('{email}')[1]}
>>>>>>> Stashed changes
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="secondary" size="lg" className="w-full">
              <Link href="/login">
                <ArrowLeft className="h-4 w-4" />
<<<<<<< Updated upstream
                {t('backToLogin')}
=======
                {t('.backToLogin')}
>>>>>>> Stashed changes
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardHeader>
<<<<<<< Updated upstream
            <CardTitle className="text-[22px] font-semibold tracking-tight">{t('createAccount')}</CardTitle>
            <CardDescription>{t('signupDescription')}</CardDescription>
=======
            <CardTitle className="text-[22px] font-semibold tracking-tight">{t('.signupTitle')}</CardTitle>
            <CardDescription>
              {t('.signupDescription')}
            </CardDescription>
>>>>>>> Stashed changes
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-[color-mix(in_srgb,hsl(var(--destructive))_8%,white)] p-3 text-[13px] text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-2">
<<<<<<< Updated upstream
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
=======
                <Label htmlFor="email">{t('.email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('.emailPlaceholder')}
>>>>>>> Stashed changes
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
<<<<<<< Updated upstream
                <Label htmlFor="password">{t('password')}</Label>
=======
                <Label htmlFor="password">{t('.password')}</Label>
>>>>>>> Stashed changes
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
<<<<<<< Updated upstream
                <p className="text-[12px] text-muted-foreground">{t('passwordHint')}</p>
=======
                <p className="text-[12px] text-muted-foreground">{t('.atLeastCharacters')}</p>
>>>>>>> Stashed changes
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
<<<<<<< Updated upstream
                {loading ? t('creatingAccount') : t('signUp')}
              </Button>
              <p className="text-center text-[12px] text-muted-foreground">
                {t('hasAccount')}{' '}
                <Link href="/login" className="font-medium text-brand underline underline-offset-[2px]">
                  {t('loginTitle')}
=======
                {loading ? t('.creatingAccount') : t('.signupLink')}
              </Button>
              <p className="text-center text-[12px] text-muted-foreground">
                {t('.alreadyAccount')}{' '}
                <Link href="/login" className="font-medium text-brand underline underline-offset-[2px]">
                  {t('.loginLink')}
>>>>>>> Stashed changes
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      )}
    </AuthShell>
  )
}