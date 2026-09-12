'use client'
import { useTranslations } from 'next-intl'

import { useState, useCallback, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check } from 'lucide-react'
import { saveKit } from '@/hooks/use-kit'
import { useBrands } from '@/hooks/use-brands'
import { KitAnswers, BrandKit, KitStatus } from '@/types'
import { StepName } from './steps/step-name'
import { StepTagline } from './steps/step-tagline'
import { StepTone } from './steps/step-tone'
import { StepAudience } from './steps/step-audience'
import { StepColors } from './steps/step-colors'
import { StepAvoidWords } from './steps/step-avoid-words'
import { StepReview } from './steps/step-review'
import { KitStatusBadge } from './kit-status-badge'
import { isKitColor } from '@/components/brand/brand-workspace'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface KitWizardProps {
  brandId: string
  brandName: string
  initialKit: BrandKit
}

const STEPS = ['brandStep', 'taglineStep', 'toneStep', 'audienceStep', 'colorsStep', 'avoidStep', 'reviewStep']

export function KitWizard({ brandId, brandName, initialKit }: KitWizardProps) {
  const t = useTranslations()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<KitAnswers>(initialKit.answers)
  const [savedSummary, setSavedSummary] = useState<string | null>(initialKit.summary)
  const [savedStatus, setSavedStatus] = useState<KitStatus>(initialKit.status)
  const [isDirty, setIsDirty] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const router = useRouter()
  const { setAccent, updateBrand } = useBrands()
  const persistedColor = useRef(initialKit.answers.colors[0] ?? null)

  const handleChange = useCallback((partial: Partial<KitAnswers>) => {
    setAnswers(prev => ({ ...prev, ...partial }))
    setIsDirty(true)
  }, [])

  useEffect(() => {
    const next = answers.colors[0]
    if (next && isKitColor(next)) setAccent(brandId, next)
  }, [answers.colors, brandId, setAccent])

  useEffect(() => {
    return () => {
      setAccent(brandId, persistedColor.current)
    }
  }, [brandId, setAccent])

  const handleSave = async () => {
    if (saving) return
    setSaving(true)
    setSaveError(null)
    try {
      const saved = await saveKit(brandId, answers)
      setSavedSummary(saved.summary)
      setSavedStatus(saved.status)
      setIsDirty(false)
      persistedColor.current = saved.answers.colors[0] ?? null
      if (saved.answers.colors[0]) setAccent(brandId, saved.answers.colors[0])
      updateBrand({ id: brandId, kit_status: saved.status })
      router.refresh()
    } catch (e) {
      setSaveError(e instanceof Error ? e.message : t('remaining.saveFailed'))
    } finally {
      setSaving(false)
    }
  }

  useEffect(() => {
    if (!isDirty) return
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); e.returnValue = '' }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [isDirty])

  const isDirtyRef = useRef(isDirty)
  useEffect(() => { isDirtyRef.current = isDirty }, [isDirty])

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (!isDirtyRef.current) return
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      if (!(e.target instanceof Element)) return
      const target = e.target.closest('a') as HTMLAnchorElement | null
      if (!target) return
      const href = target.getAttribute('href')
      if (!href || href.startsWith('#') || target.target === '_blank' || target.hasAttribute('download')) return
      const url = new URL(target.href, window.location.href)
      if (
        url.origin === window.location.origin &&
        url.pathname === window.location.pathname &&
        url.search === window.location.search
      ) return
      const confirmed = window.confirm(t('internal.unsavedChanges'))
      if (!confirmed) {
        e.preventDefault()
        e.stopPropagation()
      }
    }
    document.addEventListener('click', handleClick, true)
    return () => document.removeEventListener('click', handleClick, true)
  }, [t])

  const last = step === STEPS.length - 1
  const colorsInvalid = answers.colors.some((color) => !isKitColor(color))

  return (
    <div className="mx-auto flex max-w-[780px] flex-col gap-8">
      <div>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-[30px] font-semibold leading-[1.16] tracking-tight">{t('internal.brandKit')}</h1>
          <KitStatusBadge status={isDirty ? 'in_progress' : savedStatus} />
        </div>
        <p className="mt-1 text-[14px] text-muted-foreground">
          {t('internal.interviewDescription', { brandName })}
        </p>
      </div>

      <ol className="grid grid-cols-7 gap-2">
        {STEPS.map((item, index) => {
          const current = index === step
          const done = index < step
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() => setStep(index)}
                className="flex w-full flex-col gap-1.5 text-left"
              >
                <span
                  className={cn(
                    'h-1 w-full rounded-full',
                    done || current ? 'bg-brand' : 'bg-surface-sunken',
                  )}
                />
                <span className="text-micro font-semibold uppercase tracking-[0.09em] text-muted-foreground">
                  {done && <Check className="mr-0.5 inline h-[11px] w-[11px] text-brand" />}
                  {t(`remaining.${item}`)}
                </span>
              </button>
            </li>
          )
        })}
      </ol>

      <div key={step} className="min-h-[300px] animate-[TRENDY AI-reveal_250ms_ease-out]">
        {step === 0 && <StepName answers={answers} onChange={handleChange} brandName={brandName} />}
        {step === 1 && <StepTagline answers={answers} onChange={handleChange} brandName={brandName} />}
        {step === 2 && <StepTone answers={answers} onChange={handleChange} brandName={brandName} />}
        {step === 3 && <StepAudience answers={answers} onChange={handleChange} brandName={brandName} />}
        {step === 4 && <StepColors answers={answers} onChange={handleChange} brandName={brandName} />}
        {step === 5 && <StepAvoidWords answers={answers} onChange={handleChange} brandName={brandName} />}
        {step === 6 && (
          <StepReview
            answers={answers}
            onChange={handleChange}
            brandName={brandName}
            savedSummary={savedSummary}
            savedStatus={savedStatus}
            isDirty={isDirty}
            onSave={handleSave}
            saving={saving}
            saveError={saveError}
          />
        )}
      </div>

      <div className="flex justify-between">
        <Button
          type="button"
          variant="ghost"
          onClick={() => setStep(step - 1)}
          disabled={step === 0}
        >
          <ArrowLeft className="h-4 w-4" />
          {t('historyKit.back')}
        </Button>
        {last ? (
          <Button type="button" onClick={handleSave} disabled={saving || colorsInvalid}>
            <Check className="h-4 w-4" />
            {saving ? t('remaining.saving') : t('remaining.saveBrandKit')}
          </Button>
        ) : (
          <Button type="button" onClick={() => setStep(step + 1)}>
            {t('historyKit.continue')}
          </Button>
        )}
      </div>
    </div>
  )
}