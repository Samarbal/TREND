'use client'
import { useTranslations } from 'next-intl'

import { KitQuestion } from '@/components/kit/kit-question'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'
import { KitAnswers } from '@/types'

interface StepProps {
  answers: KitAnswers
  onChange: (partial: Partial<KitAnswers>) => void
  brandName: string
}

export function StepTagline({ answers, onChange, brandName }: StepProps) {
  const t = useTranslations()
  const examples = [
    `${brandName}. Seen clearly.`,
    'Made to be remembered.',
    'Quietly distinctive.',
  ]

  return (
    <div className="space-y-6">
      <KitQuestion
        before={t('historyKit.whats')}
        emphasis={`${brandName}'s`}
        after=" tagline?"
        helper={t('common.optional_short_line_for_image_brief')}
      />
      <div className="space-y-2">
        <Label htmlFor="kit-tagline">{t('common.common_tagline')}</Label>
        <Input
          id="kit-tagline"
          type="text"
          value={answers.tagline ?? ''}
          maxLength={160}
          onChange={(e) => onChange({ tagline: e.target.value || null })}
          placeholder={t('internal.taglinePlaceholder')}
        />
        <p className="text-[12px] text-muted-foreground">
          {answers.tagline?.length ?? 0}/160
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => onChange({ tagline: example })}
            className={cn(
              'rounded-full border px-3 py-1.5 text-[13px] transition-colors duration-fast',
              answers.tagline === example
                ? 'border-brand bg-brand-weak text-foreground'
                : 'border-border hover:border-brand-border',
            )}
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  )
}