'use client'

import { useTranslations } from 'next-intl';
import { KitQuestion } from '@/components/kit/kit-question'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { KitAnswers } from '@/types'

interface StepProps {
  answers: KitAnswers
  onChange: (partial: Partial<KitAnswers>) => void
  brandName: string
}

export function StepAudience({ answers, onChange }: StepProps) {
  const t = useTranslations('components.kit.steps.step-audience');
  return (
    <div className="space-y-6">
      <KitQuestion
        before={t('who_is_it_prefix')}
        emphasis={t('for_word')}
        helper={t('audience_help')}
      />
      <div className="space-y-2">
        <Label htmlFor="kit-audience">{t('audience')}</Label>
        <Textarea
          id="kit-audience"
          value={answers.audience ?? ''}
          maxLength={500}
          onChange={(e) => onChange({ audience: e.target.value || null })}
          placeholder={t('describe_your_target_audience')}
          rows={4}
        />
        <p className="text-[12px] text-muted-foreground">
          {answers.audience?.length ?? 0}/500
        </p>
      </div>
    </div>
  )
}
