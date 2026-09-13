'use client'

import { useTranslations } from 'next-intl';
import { SegmentedControl } from '@/components/ui/segmented-control'
import { PRESETS_BY_PLATFORM } from '@/lib/presets'

interface HistoryFiltersProps {
  provider: string | undefined
  status: string | undefined
  preset: string | undefined
  onProviderChange: (value: string | undefined) => void
  onStatusChange: (value: string | undefined) => void
  onPresetChange: (value: string | undefined) => void
}

export function HistoryFilters({
  provider,
  status,
  preset,
  onProviderChange,
  onStatusChange,
  onPresetChange,
}: HistoryFiltersProps) {
  const t = useTranslations('components.history.history-filters');
  const tOpt = useTranslations('options');
  const statusValue = status === 'succeeded' || status === 'failed' ? status : 'all'

  return (
    <div className="flex flex-wrap items-center gap-3">
      <SegmentedControl
        aria-label={t('status')}
        value={statusValue}
        onChange={(v) => onStatusChange(v === 'all' ? undefined : v)}
        options={[
          { value: 'all', label: t('all') },
          { value: 'succeeded', label: t('succeeded') },
          { value: 'failed', label: t('failed') },
        ]}
      />
      <label htmlFor="history-provider" className="sr-only">{t('filter_by_provider')}</label>
      <select
        id="history-provider"
        value={provider ?? ''}
        onChange={(e) => onProviderChange(e.target.value || undefined)}
        className="h-10 rounded-md border border-input bg-background px-3 text-[13px] shadow-xs focus-visible:border-brand focus-visible:shadow-[0_0_0_3px_var(--brand-ring)] focus-visible:outline-none"
      >
        <option value="">{t('all_providers')}</option>
        <option value="openai">OpenAI</option>
        <option value="gemini">{t('gemini')}</option>
      </select>
      <label htmlFor="history-preset" className="sr-only">{t('filter_by_preset')}</label>
      <select
        id="history-preset"
        value={preset ?? ''}
        onChange={(e) => onPresetChange(e.target.value || undefined)}
        className="h-10 rounded-md border border-input bg-background px-3 text-[13px] shadow-xs focus-visible:border-brand focus-visible:shadow-[0_0_0_3px_var(--brand-ring)] focus-visible:outline-none"
      >
        <option value="">{t('all_presets')}</option>
        {Object.entries(PRESETS_BY_PLATFORM).map(([platform, presets]) => (
          <optgroup key={platform} label={platform}>
            {presets.map((id) => (
              <option key={id} value={id}>
                {tOpt(`preset_${id}`)}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  )
}
