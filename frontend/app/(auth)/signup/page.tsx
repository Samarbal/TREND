'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowLeft, Check, ImagePlus, KeyRound, Palette } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AuthShell } from '@/components/auth/auth-shell'
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
  const t = useTranslations('auth')
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
        setError('An account with this email already exists. Please log in instead.')
      } else {
        setError(error.message)
      }
      return
    }

    setSuccess(true)
  }

  const hero = success ? (
    <>
      {t('signupSuccessHeroBefore')} <em className="text-brand-accent">{t('signupSuccessHeroAccent')}</em>
    </>
  ) : (
    <>
      {t('signupHeroBefore')} <em className="text-brand-accent">{t('signupHeroAccent')}</em>
    </>
  )

  return (
    <AuthShell
      hero={hero}
      subcopy={t('signupSubcopy')}
      features={[
        { icon: Palette, label: t('signupFeatureInterview') },
        { icon: KeyRound, label: t('featureKeys') },
        { icon: ImagePlus, label: t('signupFeaturePreset') },
      ]}
    >
      {success ? (
        <Card className="shadow-sm">
          <CardHeader className="items-center text-center">
            <span className="mb-2 inline-flex h-[46px] w-[46px] items-center justify-center rounded-full bg-[color-mix(in_srgb,hsl(var(--success))_14%,white)] text-success">
              <Check className="h-5 w-5" />
            </span>
            <CardTitle className="text-[22px] font-semibold tracking-tight">{t('checkEmail')}</CardTitle>
            <CardDescription>
              {t('confirmationSent')} <strong className="text-foreground">{email}</strong>. {t('activateAccount')}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild variant="secondary" size="lg" className="w-full">
              <Link href="/login">
                <ArrowLeft className="h-4 w-4" />
                {t('backToLogin')}
              </Link>
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-[22px] font-semibold tracking-tight">{t('createAccount')}</CardTitle>
            <CardDescription>{t('signupDescription')}</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <div className="rounded-md bg-[color-mix(in_srgb,hsl(var(--destructive))_8%,white)] p-3 text-[13px] text-destructive">
                  {error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t('emailPlaceholder')}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
                <p className="text-[12px] text-muted-foreground">{t('passwordHint')}</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-4">
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? t('creatingAccount') : t('signUp')}
              </Button>
              <p className="text-center text-[12px] text-muted-foreground">
                {t('hasAccount')}{' '}
                <Link href="/login" className="font-medium text-brand underline underline-offset-[2px]">
                  {t('loginTitle')}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      )}
    </AuthShell>
  )
}