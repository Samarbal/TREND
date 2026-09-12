'use client'

import { useTranslations } from 'next-intl'
import { KitQuestion } from '@/components/kit/kit-question'
import { KitAnswers } from '@/types'

interface StepProps {
  answers: KitAnswers
  onChange: (partial: Partial<KitAnswers>) => void
  brandName: string
}

export function StepName({ brandName }: StepProps) {
  const t = useTranslations()
  return (
    <div className="space-y-6">
      <KitQuestion
        before={t('common.this_is_prefix')}
        emphasis={brandName}
        after="."
        helper={t('common.registered_name_help')}
      />
      <p className="text-[16px] font-semibold">{brandName}</p>
    </div>
  )
}