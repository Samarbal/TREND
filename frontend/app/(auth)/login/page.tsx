'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, ImagePlus, KeyRound, Palette } from 'lucide-react'
import { useTranslations } from 'next-intl'
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

export default function LoginPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const t = useTranslations('auth')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    router.push('/brands')
    router.refresh()
  }

  return (
    <AuthShell
      hero={
<<<<<<< Updated upstream
        <>
          {t('loginHeroBefore')} <em className="text-brand-accent">{t('loginHeroAccent')}</em>
        </>
      }
      subcopy={t('loginSubcopy')}
      features={[
        { icon: Palette, label: t('featureKit') },
        { icon: ImagePlus, label: t('featureImages') },
        { icon: KeyRound, label: t('featureKeys') },
=======
        t('.loginHero')
      }
      subcopy={t('.loginSubcopy')}
      features={[
        { icon: Palette, label: t('.kitRemembered') },
        { icon: ImagePlus, label: t('.everyImageSized') },
        { icon: KeyRound, label: t('.bringYourKey') },
>>>>>>> Stashed changes
      ]}
    >
      <Card className="shadow-sm">
        <CardHeader>
<<<<<<< Updated upstream
          <CardTitle className="text-[22px] font-semibold tracking-tight">{t('loginTitle')}</CardTitle>
          <CardDescription>{t('loginDescription')}</CardDescription>
=======
          <CardTitle className="text-[22px] font-semibold tracking-tight">{t('.loginTitle')}</CardTitle>
          <CardDescription>
            {t('.loginDescription')}
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
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? t('hidePassword') : t('showPassword')}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" size="lg" className="w-full" disabled={loading}>
<<<<<<< Updated upstream
              {loading ? t('loggingIn') : t('loginTitle')}
            </Button>
            <p className="text-center text-[12px] text-muted-foreground">
              {t('noAccount')}{' '}
              <Link href="/signup" className="font-medium text-brand underline underline-offset-[2px]">
                {t('signUp')}
=======
              {loading ? t('.loggingIn') : t('.loginTitle')}
            </Button>
            <p className="text-center text-[12px] text-muted-foreground">
              {t('.noAccount')}{' '}
              <Link href="/signup" className="font-medium text-brand underline underline-offset-[2px]">
                {t('.signupLink')}
>>>>>>> Stashed changes
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </AuthShell>
  )
}