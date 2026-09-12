'use client'

import { useTranslations } from 'next-intl';
import { KitQuestion } from '@/components/kit/kit-question'
import { cn } from '@/lib/utils'
import { KitAnswers, ToneOption } from '@/types'

interface StepProps {
  answers: KitAnswers
  onChange: (partial: Partial<KitAnswers>) => void
  brandName: string
}

const TONE_VALUES: ToneOption[] = ['formal', 'casual', 'playful', 'professional', 'friendly']

export function StepTone({ answers, onChange }: StepProps) {
  const t = useTranslations('components.kit.steps.step-tone');
  const selected = TONE_VALUES.find((v) => v === answers.tone)

  return (
    <div className="space-y-6">
      <KitQuestion
        before={t('how_should_it_prefix')}
        emphasis={t('sound_word')}
        helper={t('tone_help')}
      />
      <div className="flex flex-wrap gap-3">
        {TONE_VALUES.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => onChange({ tone: value })}
            aria-pressed={answers.tone === value}
            className={cn(
              'h-10 rounded-md border px-4 text-[13px] font-medium transition-colors duration-fast',
              answers.tone === value
                ? 'border-brand bg-brand-weak text-foreground'
                : 'border-border bg-card hover:bg-accent',
            )}
          >
            {t(`tone_${value}`)}
          </button>
        ))}
      </div>
      {selected && (
        <p className="text-[14px] italic text-muted-foreground">{t(`tone_${selected}_desc`)}</p>
      )}
    </div>
  )
}
