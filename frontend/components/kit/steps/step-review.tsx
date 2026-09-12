'use client'

import { useTranslations } from 'next-intl';
import { KitQuestion } from '@/components/kit/kit-question'
import { Notice } from '@/components/ui/notice'
import { formatHex, normalizeHex } from '@/components/brand/brand-workspace'
import { KitAnswers, KitStatus } from '@/types'

interface StepReviewProps {
  answers: KitAnswers
  onChange: (partial: Partial<KitAnswers>) => void
  brandName: string
  savedSummary: string | null
  savedStatus: KitStatus
  isDirty: boolean
  onSave: () => void
  saving: boolean
  saveError: string | null
}

export function StepReview({
  answers,
  brandName,
  savedSummary,
  savedStatus,
  isDirty,
  saveError,
}: StepReviewProps) {
  const t = useTranslations('components.kit.steps.step-review');
  const tTone = useTranslations('components.kit.steps.step-tone');
  const none = t('none_value')

  const missingRequired: string[] = []
  if (!answers.tone) missingRequired.push(t('missing_tone'))
  if (!answers.audience || answers.audience.trim().length < 2) missingRequired.push(t('missing_audience'))
  if (!answers.colors || answers.colors.length === 0) missingRequired.push(t('missing_colors'))

  const hasSaved = !isDirty && saveError === null && savedStatus !== 'not_started'
  const toneLabel = answers.tone ? tTone(`tone_${answers.tone}`) : none

  return (
    <div className="space-y-6">
      <KitQuestion
        before={t('ready_to_prefix')}
        emphasis={t('save_word')}
        helper={t('review_help', { brandName })}
      />

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-[14px]">
          <tbody>
            <Row label={t('tagline')} value={answers.tagline || none} />
            <Row label={t('tone')} value={toneLabel} />
            <Row label={t('audience')} value={answers.audience || none} />
            <tr className="border-t border-border-subtle">
              <th className="w-32 px-4 py-3 text-left font-medium text-muted-foreground">{t('colors')}</th>
              <td className="px-4 py-3">
                {answers.colors.length > 0 ? (
                  <span className="flex flex-wrap items-center gap-2">
                    {answers.colors.map((c, i) => {
                      const hex = normalizeHex(c) ? formatHex(c) : c
                      return (
                        <span key={`${c}-${i}`} className="inline-flex items-center gap-1.5">
                          <span
                            className="inline-block h-[22px] w-[22px] rounded-md border border-border"
                            style={{ background: hex }}
                          />
                          <span className="font-mono text-[12px]">
                            {hex}{i === 0 ? t('primary_suffix') : ''}
                          </span>
                        </span>
                      )
                    })}
                  </span>
                ) : (
                  none
                )}
              </td>
            </tr>
            <Row label={t('avoid')} value={answers.avoid_words || none} />
          </tbody>
        </table>
      </div>

      {missingRequired.length > 0 && (
        <Notice variant="warning">
          <p className="font-medium">{t('still_missing', { items: missingRequired.join(', ') })}</p>
          <p className="mt-1">{t('you_can_save_now')}</p>
        </Notice>
      )}

      {hasSaved && savedStatus === 'complete' && (
        <Notice variant="success">{t('brand_kit_saved_complete')}</Notice>
      )}

      {hasSaved && savedStatus === 'in_progress' && (
        <Notice variant="warning">{t('brand_kit_saved_in')}</Notice>
      )}

      <div className="space-y-2">
        <h3 className="text-[13px] font-medium">{t('what_the_model_will')}</h3>
        {savedSummary ? (
          <>
            <pre className="whitespace-pre-wrap rounded-md bg-surface-sunken p-3 font-sans text-[13px] leading-relaxed">
              {savedSummary}
            </pre>
            {isDirty && (
              <p className="text-[12px] italic text-muted-foreground">{t('you_have_unsaved_changes')}</p>
            )}
          </>
        ) : (
          <p className="text-[13px] text-muted-foreground">{t('summary_is_generated_after')}</p>
        )}
      </div>

      {saveError && <p className="text-[13px] text-destructive">{saveError}</p>}
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-t border-border-subtle first:border-t-0">
      <th className="w-32 px-4 py-3 text-left font-medium text-muted-foreground">{label}</th>
      <td className="px-4 py-3">{value}</td>
    </tr>
  )
}
