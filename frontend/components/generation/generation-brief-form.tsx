'use client'

import { useGenerationBrief } from '@/hooks/use-generation-brief'
import {
    AUDIENCE_SEGMENTS,
    CAMPAIGN_GOALS,
    CONTENT_TYPES,
    VOICE_TONES,
} from '@/lib/generation-options'
import type { GenerationBrief } from '@/types/generation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface GenerationBriefFormProps {
    onComplete: (brief: GenerationBrief) => void
    disabled?: boolean
}

export function GenerationBriefForm({
    onComplete,
    disabled = false,
}: GenerationBriefFormProps) {
    const {
        brief,
        updateBrief,
        step,
        setStep,
        errors,
        isValid,
        goNext,
        goBack,
    } = useGenerationBrief()

    return (
        <div className="space-y-5">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
                        Structured brief
                    </p>
                    <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                        Answer a few questions and TRENDY AI will shape the image for your brand.
                    </p>
                </div>

                <span className="shrink-0 font-mono text-[11px] text-muted-foreground">
                    Step {step + 1} of 6
                </span>
            </div>

            <div className="grid grid-cols-6 gap-1.5" aria-label="Questionnaire progress">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className={`h-1.5 rounded-full transition-colors ${index <= step ? 'bg-brand' : 'bg-border'
                            }`}
                    />
                ))}
            </div>

            {step === 0 && (
                <div className="space-y-3">
                    <div>
                        <Label>What is the campaign goal?</Label>
                        <p className="mt-1 text-[12px] text-muted-foreground">
                            Choose the main result you want this content to achieve.
                        </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        {CAMPAIGN_GOALS.map((goal) => {
                            const selected = brief.campaign_goal === goal.value

                            return (
                                <button
                                    key={goal.value}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() =>
                                        updateBrief({
                                            campaign_goal: goal.value,
                                            campaign_goal_custom:
                                                goal.value === 'custom'
                                                    ? brief.campaign_goal_custom
                                                    : null,
                                        })
                                    }
                                    className={`rounded-lg border px-3 py-3 text-left text-[13px] transition-colors ${selected
                                            ? 'border-brand bg-brand-weaker'
                                            : 'border-border bg-card hover:border-brand-border'
                                        }`}
                                >
                                    {goal.label}
                                </button>
                            )
                        })}
                    </div>

                    {errors.campaign_goal && (
                        <FieldError message={errors.campaign_goal} />
                    )}

                    {brief.campaign_goal === 'custom' && (
                        <div className="space-y-2">
                            <Label htmlFor="campaign-goal-custom">Describe your goal</Label>
                            <Input
                                id="campaign-goal-custom"
                                value={brief.campaign_goal_custom ?? ''}
                                onChange={(event) =>
                                    updateBrief({ campaign_goal_custom: event.target.value })
                                }
                                disabled={disabled}
                                placeholder="e.g. Build anticipation for a new collection"
                            />
                            {errors.campaign_goal_custom && (
                                <FieldError message={errors.campaign_goal_custom} />
                            )}
                        </div>
                    )}
                </div>
            )}

            {step === 1 && (
                <div className="space-y-3">
                    <div>
                        <Label>What do you want to create?</Label>
                        <p className="mt-1 text-[12px] text-muted-foreground">
                            Choose the type of content that best fits your idea.
                        </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        {CONTENT_TYPES.map((contentType) => {
                            const selected = brief.content_type === contentType.value

                            return (
                                <button
                                    key={contentType.value}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() =>
                                        updateBrief({
                                            content_type: contentType.value,
                                            content_type_custom:
                                                contentType.value === 'custom'
                                                    ? brief.content_type_custom
                                                    : null,
                                        })
                                    }
                                    className={`rounded-lg border px-3 py-3 text-left text-[13px] transition-colors ${selected
                                            ? 'border-brand bg-brand-weaker'
                                            : 'border-border bg-card hover:border-brand-border'
                                        }`}
                                >
                                    {contentType.label}
                                </button>
                            )
                        })}
                    </div>

                    {errors.content_type && (
                        <FieldError message={errors.content_type} />
                    )}

                    {brief.content_type === 'custom' && (
                        <div className="space-y-2">
                            <Label htmlFor="content-type-custom">
                                Describe your content type
                            </Label>
                            <Input
                                id="content-type-custom"
                                value={brief.content_type_custom ?? ''}
                                onChange={(event) =>
                                    updateBrief({ content_type_custom: event.target.value })
                                }
                                disabled={disabled}
                                placeholder="e.g. a behind-the-scenes post"
                            />
                            {errors.content_type_custom && (
                                <FieldError message={errors.content_type_custom} />
                            )}
                        </div>
                    )}
                </div>
            )}

            {step === 2 && (
                <div className="space-y-4">
                    <div>
                        <Label>Who is the target audience?</Label>
                        <p className="mt-1 text-[12px] text-muted-foreground">
                            Select one or two audience groups.
                        </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        {AUDIENCE_SEGMENTS.filter(
                            (audience) => audience.value !== 'custom',
                        ).map((audienceOption) => {
                            const selected = brief.target_audience.segments.includes(
                                audienceOption.value,
                            )

                            return (
                                <button
                                    key={audienceOption.value}
                                    type="button"
                                    disabled={
                                        disabled ||
                                        (!selected &&
                                            brief.target_audience.segments.length >= 2)
                                    }
                                    onClick={() => {
                                        const segments = selected
                                            ? brief.target_audience.segments.filter(
                                                (item) => item !== audienceOption.value,
                                            )
                                            : [
                                                ...brief.target_audience.segments,
                                                audienceOption.value,
                                            ]

                                        updateBrief({
                                            target_audience: {
                                                ...brief.target_audience,
                                                segments,
                                            },
                                        })
                                    }}
                                    className={`rounded-lg border px-3 py-3 text-left text-[13px] transition-colors ${selected
                                            ? 'border-brand bg-brand-weaker'
                                            : 'border-border bg-card hover:border-brand-border'
                                        }`}
                                >
                                    {audienceOption.label}
                                </button>
                            )
                        })}
                    </div>

                    {errors.audience_segments && (
                        <FieldError message={errors.audience_segments} />
                    )}

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label htmlFor="audience-location">Location (optional)</Label>
                            <Input
                                id="audience-location"
                                value={brief.target_audience.location ?? ''}
                                onChange={(event) =>
                                    updateBrief({
                                        target_audience: {
                                            ...brief.target_audience,
                                            location: event.target.value || null,
                                        },
                                    })
                                }
                                disabled={disabled}
                                placeholder="e.g. Amman, Jordan"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="audience-age">Age range (optional)</Label>
                            <Input
                                id="audience-age"
                                value={brief.target_audience.age_range ?? ''}
                                onChange={(event) =>
                                    updateBrief({
                                        target_audience: {
                                            ...brief.target_audience,
                                            age_range: event.target.value || null,
                                        },
                                    })
                                }
                                disabled={disabled}
                                placeholder="e.g. 25–34"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="audience-details">
                            Tell us more about them (optional)
                        </Label>
                        <Input
                            id="audience-details"
                            value={brief.target_audience.details ?? ''}
                            onChange={(event) =>
                                updateBrief({
                                    target_audience: {
                                        ...brief.target_audience,
                                        details: event.target.value || null,
                                    },
                                })
                            }
                            disabled={disabled}
                            placeholder="e.g. young professionals who value convenience"
                        />
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-3">
                    <div>
                        <Label htmlFor="core-idea">
                            What is the main idea you want the audience to understand? *
                        </Label>
                        <p className="mt-1 text-[12px] text-muted-foreground">
                            Write naturally. You do not need to write a professional prompt.
                        </p>
                    </div>

                    <Textarea
                        id="core-idea"
                        value={brief.core_idea}
                        onChange={(event) =>
                            updateBrief({ core_idea: event.target.value })
                        }
                        disabled={disabled}
                        maxLength={1000}
                        placeholder="e.g. Show how our iced coffee makes a busy summer morning feel more refreshing."
                        className="min-h-[140px]"
                    />

                    <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>
                            {errors.core_idea ?? 'Keep your idea clear and focused.'}
                        </span>
                        <span className="font-mono">
                            {brief.core_idea.length} / 1000
                        </span>
                    </div>
                </div>
            )}

            {step === 4 && (
                <div className="space-y-4">
                    <div>
                        <Label>How should the content feel?</Label>
                        <p className="mt-1 text-[12px] text-muted-foreground">
                            Choose the tone that best matches your brand.
                        </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        {VOICE_TONES.map((tone) => {
                            const selected = brief.voice_tone === tone.value

                            return (
                                <button
                                    key={tone.value}
                                    type="button"
                                    disabled={disabled}
                                    onClick={() =>
                                        updateBrief({
                                            voice_tone: tone.value,
                                            voice_tone_custom:
                                                tone.value === 'custom'
                                                    ? brief.voice_tone_custom
                                                    : null,
                                        })
                                    }
                                    className={`rounded-lg border px-3 py-3 text-left text-[13px] transition-colors ${selected
                                            ? 'border-brand bg-brand-weaker'
                                            : 'border-border bg-card hover:border-brand-border'
                                        }`}
                                >
                                    {tone.label}
                                </button>
                            )
                        })}
                    </div>

                    {errors.voice_tone && (
                        <FieldError message={errors.voice_tone} />
                    )}

                    {brief.voice_tone === 'custom' && (
                        <div className="space-y-2">
                            <Label htmlFor="voice-tone-custom">Describe your tone</Label>
                            <Input
                                id="voice-tone-custom"
                                value={brief.voice_tone_custom ?? ''}
                                onChange={(event) =>
                                    updateBrief({ voice_tone_custom: event.target.value })
                                }
                                disabled={disabled}
                                placeholder="e.g. calm, thoughtful, and encouraging"
                            />
                            {errors.voice_tone_custom && (
                                <FieldError message={errors.voice_tone_custom} />
                            )}
                        </div>
                    )}

                    <div className="space-y-2 border-t border-border-subtle pt-4">
                        <Label htmlFor="optional-notes">Additional notes (optional)</Label>
                        <Textarea
                            id="optional-notes"
                            value={brief.optional_notes ?? ''}
                            onChange={(event) =>
                                updateBrief({
                                    optional_notes: event.target.value || null,
                                })
                            }
                            disabled={disabled}
                            maxLength={2000}
                            placeholder="Add visual direction, things to avoid, or layout preferences."
                            className="min-h-[90px]"
                        />
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>{errors.optional_notes ?? ''}</span>
                            <span className="font-mono">
                                {(brief.optional_notes ?? '').length} / 2000
                            </span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="text-to-include">
                            Text to include in the image (optional)
                        </Label>
                        <Input
                            id="text-to-include"
                            value={brief.text_to_include ?? ''}
                            onChange={(event) =>
                                updateBrief({
                                    text_to_include: event.target.value || null,
                                })
                            }
                            disabled={disabled}
                            maxLength={500}
                            placeholder="e.g. 20% off this week"
                        />
                        <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                            <span>{errors.text_to_include ?? ''}</span>
                            <span className="font-mono">
                                {(brief.text_to_include ?? '').length} / 500
                            </span>
                        </div>
                    </div>
                </div>
            )}

            {step === 5 && (
                <BriefSummary brief={brief} onEdit={setStep} />
            )}

            <div className="flex items-center justify-between border-t border-border-subtle pt-3">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={goBack}
                    disabled={disabled || step === 0}
                >
                    Back
                </Button>

                {step < 5 ? (
                    <Button
                        type="button"
                        onClick={goNext}
                        disabled={disabled}
                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={() => onComplete(brief)}
                        disabled={disabled || !isValid}
                    >
                        Continue
                    </Button>
                )}
            </div>
        </div>
    )
}

function FieldError({ message }: { message?: string }) {
    if (!message) return null

    return (
        <p className="text-[12px] text-destructive" role="alert">
            {message}
        </p>
    )
}

function BriefSummary({
    brief,
    onEdit,
}: {
    brief: GenerationBrief
    onEdit: (step: number) => void
}) {
    return (
        <div className="space-y-3">
            <div>
                <h3 className="text-[16px] font-semibold text-foreground">
                    Review your brief
                </h3>
                <p className="mt-1 text-[12px] text-muted-foreground">
                    Check your answers before generating the image.
                </p>
            </div>

            <SummaryRow
                label="Campaign goal"
                value={brief.campaign_goal_custom || brief.campaign_goal || 'Not selected'}
                onEdit={() => onEdit(0)}
            />
            <SummaryRow
                label="Content type"
                value={brief.content_type_custom || brief.content_type || 'Not selected'}
                onEdit={() => onEdit(1)}
            />
            <SummaryRow
                label="Target audience"
                value={brief.target_audience.segments.join(', ') || 'Not selected'}
                onEdit={() => onEdit(2)}
            />
            <SummaryRow
                label="Core idea"
                value={brief.core_idea || 'Not provided'}
                onEdit={() => onEdit(3)}
            />
            <SummaryRow
                label="Voice and tone"
                value={brief.voice_tone_custom || brief.voice_tone || 'Not selected'}
                onEdit={() => onEdit(4)}
            />

            {brief.optional_notes && (
                <SummaryRow
                    label="Additional notes"
                    value={brief.optional_notes}
                    onEdit={() => onEdit(4)}
                />
            )}

            {brief.text_to_include && (
                <SummaryRow
                    label="Text to include"
                    value={brief.text_to_include}
                    onEdit={() => onEdit(4)}
                />
            )}
        </div>
    )
}

function SummaryRow({
    label,
    value,
    onEdit,
}: {
    label: string
    value: string
    onEdit: () => void
}) {
    return (
        <div className="rounded-lg border border-border-subtle bg-card px-3 py-3">
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                        {label}
                    </p>
                    <p className="mt-1 break-words text-[13px] text-foreground">
                        {value}
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onEdit}
                    className="shrink-0 text-[12px] font-medium text-brand-accent underline-offset-2 hover:underline"
                >
                    Edit
                </button>
            </div>
        </div>
    )
}
