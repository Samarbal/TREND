'use client'

import { useCallback, useState } from 'react'
import { apiRequest, ApiError } from '@/lib/api'
import type { CreativeDirection, GenerationBrief, PlatformPreset } from '@/types'

interface UsePreviewBriefResult {
    preview: CreativeDirection | null
    loading: boolean
    error: string | null
    fetchPreview: (brief: GenerationBrief, platformPreset: PlatformPreset) => Promise<void>
}

export function usePreviewBrief(brandId: string): UsePreviewBriefResult {
    const [preview, setPreview] = useState<CreativeDirection | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const fetchPreview = useCallback(
        async (brief: GenerationBrief, platformPreset: PlatformPreset) => {
            setLoading(true)
            setError(null)
            try {
                const result = await apiRequest<{ creative_direction: CreativeDirection; brand_name: string }>(
                    `/brands/${brandId}/preview-brief`,
                    {
                        method: 'POST',
                        body: JSON.stringify({ brief, platform_preset: platformPreset }),
                    },
                )
                setPreview(result.creative_direction)
            } catch (err) {
                const message =
                    err instanceof ApiError
                        ? err.message
                        : err instanceof Error
                            ? err.message
                            : 'Failed to load preview'
                setError(message)
            } finally {
                setLoading(false)
            }
        },
        [brandId],
    )

    return { preview, loading, error, fetchPreview }
}