'use client'

import { useTranslations } from 'next-intl';
import Link from 'next/link'
import type { Provider } from '@/types'
import { Notice } from '@/components/ui/notice'
import { providerLabel } from '@/lib/providers'

interface NoKeyNoticeProps {
  provider: Provider
  brandId: string
}

export function NoKeyNotice({ provider, brandId }: NoKeyNoticeProps) {
  const t = useTranslations('components.generation.no-key-notice');
  const label = providerLabel(provider)
  return (
    <Notice variant="warning">
      {t('no_provider_key_yet', { provider: label })}{' '}
      <Link
        href={`/${brandId}/keys`}
        className="font-medium underline underline-offset-2"
      >
        {t('add_one')}
      </Link>{' '}
      {t('to_generate_with_provider')}
    </Notice>
  )
}
