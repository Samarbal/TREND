'use client'

import { useState } from 'react'
import { apiRequest, ApiError } from '@/lib/api'
import type { CaptionRequest, CaptionResponse } from '@/types'

export type CaptionState =
    | { status: 'idle' }
    | { status: 'submitting' }
    | { status: 'success'; result: CaptionResponse }
    | { status: 'error'; code: string; message: string }

interface UseCaptionResult {
    state: CaptionState
    generateCaption: (body: CaptionRequest) => Promise<void>
    reset: () => void
}

export function useCaption(brandId: string, generationId: string): UseCaptionResult {
    const [state, setState] = useState<CaptionState>({ status: 'idle' })

    async function generateCaption(body: CaptionRequest) {
        setState({ status: 'submitting' })
        try {
            const result = await apiRequest<CaptionResponse>(
                `/brands/${brandId}/generations/${generationId}/caption`,
                { method: 'POST', body: JSON.stringify(body) },
            )
            setState({ status: 'success', result })
        } catch (err) {
            const code = err instanceof ApiError ? err.code : 'UNKNOWN'
            const message =
                err instanceof Error ? err.message : 'Something went wrong. Please try again.'
            setState({ status: 'error', code, message })
        }
    }

    function reset() {
        setState({ status: 'idle' })
    }

    return { state, generateCaption, reset }
}