'use client'

import { useTranslations } from 'next-intl'
import { KitQuestion } from '@/components/kit/kit-question'
import { cn } from '@/lib/utils'
import { KitAnswers, ToneOption } from '@/types'

interface StepProps {
  answers: KitAnswers
  onChange: (partial: Partial<KitAnswers>) => void
  brandName: string
}

const TONE_OPTIONS: { value: ToneOption; label: string; descriptor: string }[] = [
  { value: 'formal', label: 'common.tone_formal', descriptor: 'common.tone_formal_desc' },
  { value: 'casual', label: 'common.tone_casual', descriptor: 'common.tone_casual_desc' },
  { value: 'playful', label: 'common.tone_playful', descriptor: 'common.tone_playful_desc' },
  { value: 'professional', label: 'common.tone_professional', descriptor: 'common.tone_professional_desc' },
  { value: 'friendly', label: 'common.tone_friendly', descriptor: 'common.tone_friendly_desc' },
]

export function StepTone({ answers, onChange }: StepProps) {
  const t = useTranslations()
  const selected = TONE_OPTIONS.find((o) => o.value === answers.tone)

  return (
    <div className="space-y-6">
      <KitQuestion
        before={t('common.how_should_it_prefix')}
        emphasis={t('historyKit.sound')}
        after="?"
        helper={t('common.pick_voice_for_trendy_ai')}
      />
      <div className="flex flex-wrap gap-3">
        {TONE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange({ tone: option.value })}
            aria-pressed={answers.tone === option.value}
            className={cn(
              'h-10 rounded-md border px-4 text-[13px] font-medium transition-colors duration-fast',
              answers.tone === option.value
                ? 'border-brand bg-brand-weak text-foreground'
                : 'border-border bg-card hover:bg-accent',
            )}
          >
            {t(option.label)}
          </button>
        ))}
      </div>
      {selected && (
        <p className="text-[14px] italic text-muted-foreground">{t(selected.descriptor)}</p>
      )}
    </div>
  )
}