'use client'

import { useMemo, useState } from 'react'
import type { GenerationBrief } from '@/types/generation'
import {
    isGenerationBriefValid,
    validateGenerationBrief,
    type BriefFieldErrors,
} from '@/lib/validation'

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

export function useGenerationBrief(
    initialValue: GenerationBrief = EMPTY_GENERATION_BRIEF,
) {
    const [brief, setBrief] = useState<GenerationBrief>(initialValue)
    const [step, setStep] = useState(0)
    const [errors, setErrors] = useState<BriefFieldErrors>({})
    const [hasAttemptedNext, setHasAttemptedNext] = useState(false)

    const isValid = useMemo(
        () => isGenerationBriefValid(brief),
        [brief],
    )

    function updateBrief(next: Partial<GenerationBrief>) {
        setBrief((current) => ({
            ...current,
            ...next,
        }))
    }

    function validateCurrentStep(): boolean {
        const allErrors = validateGenerationBrief(brief)
        const stepErrors: BriefFieldErrors = {}

        if (step === 0) {
            stepErrors.campaign_goal = allErrors.campaign_goal
            stepErrors.campaign_goal_custom = allErrors.campaign_goal_custom
        }

        if (step === 1) {
            stepErrors.content_type = allErrors.content_type
            stepErrors.content_type_custom = allErrors.content_type_custom
        }

        if (step === 2) {
            stepErrors.audience_segments = allErrors.audience_segments
        }

        if (step === 3) {
            stepErrors.core_idea = allErrors.core_idea
        }

        if (step === 4) {
            stepErrors.voice_tone = allErrors.voice_tone
            stepErrors.voice_tone_custom = allErrors.voice_tone_custom
            stepErrors.optional_notes = allErrors.optional_notes
            stepErrors.text_to_include = allErrors.text_to_include
        }

        const cleanErrors = Object.fromEntries(
            Object.entries(stepErrors).filter(([, message]) => Boolean(message)),
        ) as BriefFieldErrors

        setErrors(cleanErrors)
        setHasAttemptedNext(true)

        return Object.keys(cleanErrors).length === 0
    }

    function goNext() {
        if (!validateCurrentStep()) return

        setStep((current) => Math.min(5, current + 1))
        setErrors({})
        setHasAttemptedNext(false)
    }

    function goBack() {
        setStep((current) => Math.max(0, current - 1))
        setErrors({})
        setHasAttemptedNext(false)
    }

    function resetBrief() {
        setBrief(EMPTY_GENERATION_BRIEF)
        setStep(0)
        setErrors({})
        setHasAttemptedNext(false)
    }

    return {
        brief,
        setBrief,
        updateBrief,
        step,
        setStep,
        errors,
        isValid,
        valid: isValid,
        hasAttemptedNext,
        validateCurrentStep,
        goNext,
        goBack,
        resetBrief,
    }
}
