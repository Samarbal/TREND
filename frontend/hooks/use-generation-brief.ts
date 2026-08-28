'use client'

import { useMemo, useState } from 'react'
import type { GenerationBrief } from '@/types/generation'

export const EMPTY_GENERATION_BRIEF: GenerationBrief = {
    campaign_goal: '',
    campaign_goal_custom: null,
    content_type: '',
    content_type_custom: null,
    target_audience: {
        segments: [],
        location: null,
        age_range: null,
        gender_focus: null,
        details: null,
    },
    core_idea: '',
    voice_tone: '',
    voice_tone_custom: null,
    optional_notes: null,
    text_to_include: null,
}

export function isGenerationBriefValid(brief: GenerationBrief): boolean {
    const audience = brief.target_audience

    return Boolean(
        brief.campaign_goal &&
        brief.content_type &&
        brief.voice_tone &&
        brief.core_idea.trim().length >= 3 &&
        brief.core_idea.trim().length <= 1000 &&
        audience.segments.length >= 1 &&
        audience.segments.length <= 2 &&
        (brief.campaign_goal !== 'custom' || brief.campaign_goal_custom?.trim()) &&
        (brief.content_type !== 'custom' || brief.content_type_custom?.trim()) &&
        (brief.voice_tone !== 'custom' || brief.voice_tone_custom?.trim()) &&
        (brief.optional_notes ?? '').length <= 2000 &&
        (brief.text_to_include ?? '').length <= 500,
    )
}

export function useGenerationBrief(initialValue: GenerationBrief = EMPTY_GENERATION_BRIEF) {
    const [brief, setBrief] = useState<GenerationBrief>(initialValue)
    const [step, setStep] = useState(0)

    const valid = useMemo(() => isGenerationBriefValid(brief), [brief])

    function updateBrief(next: Partial<GenerationBrief>) {
        setBrief((current) => ({ ...current, ...next }))
    }

    function resetBrief() {
        setBrief(EMPTY_GENERATION_BRIEF)
        setStep(0)
    }

    return {
        brief,
        setBrief,
        updateBrief,
        step,
        setStep,
        valid,
        resetBrief,
    }
}
