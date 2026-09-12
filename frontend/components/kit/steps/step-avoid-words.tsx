'use client'
import { useTranslations } from 'next-intl'

import { KitQuestion } from '@/components/kit/kit-question'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { KitAnswers } from '@/types'

interface StepProps {
  answers: KitAnswers
  onChange: (partial: Partial<KitAnswers>) => void
  brandName: string
}

export function StepAvoidWords({ answers, onChange }: StepProps) {
  const t = useTranslations()
  return (
    <div className="space-y-6">
      <KitQuestion
        before={t('common.anything_to_prefix')}
        emphasis={t('historyKit.avoid')}
        after="?"
        helper={t('common.optional_avoid_words_or_themes')}
      />
      <div className="space-y-2">
        <Label htmlFor="kit-avoid">{t('common.common_avoid')}</Label>
        <Textarea
          id="kit-avoid"
          value={answers.avoid_words ?? ''}
          maxLength={500}
          onChange={(e) => onChange({ avoid_words: e.target.value || null })}
          placeholder={t('internal.avoidPlaceholder')}
          rows={4}
        />
        <p className="text-[12px] text-muted-foreground">
          {answers.avoid_words?.length ?? 0}/500
        </p>
      </div>
    </div>
  )
}