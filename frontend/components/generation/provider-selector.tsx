'use client'

import { useTranslations } from 'next-intl';
import type { Provider } from '@/types'
import type { ActiveKeys } from '@/hooks/use-active-keys'
import { NoKeyNotice } from '@/components/generation/no-key-notice'
import { providerLabel } from '@/lib/providers'
import { Eyebrow } from '@/components/ui/eyebrow'
import { SegmentedControl } from '@/components/ui/segmented-control'

interface ProviderSelectorProps {
  value: Provider
  onChange: (value: Provider) => void
  activeKeys: ActiveKeys
  brandId: string
  disabled?: boolean
}

export function ProviderSelector({
  value, onChange, activeKeys, brandId, disabled,
}: ProviderSelectorProps) {
  const t = useTranslations('components.generation.provider-selector');
  const currentHasKey =
    (value === 'openai' && activeKeys.openaiActive) ||
    (value === 'gemini' && activeKeys.geminiActive)

  return (
    <div className="flex flex-col gap-2">
      <Eyebrow>{t('provider2')}</Eyebrow>
      <SegmentedControl
        aria-label={t('provider')}
        value={value}
        onChange={onChange}
        disabled={disabled}
        options={[
          { value: 'openai', label: providerLabel('openai') },
          { value: 'gemini', label: providerLabel('gemini') },
        ]}
      />
      {!currentHasKey && <NoKeyNotice provider={value} brandId={brandId} />}
    </div>
  )
}
