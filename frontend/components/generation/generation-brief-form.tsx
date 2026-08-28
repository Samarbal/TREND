'use client'

import { useGenerationBrief } from '@/hooks/use-generation-brief'
import { CAMPAIGN_GOALS, CONTENT_TYPES, VOICE_TONES, } from '@/lib/generation-options'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface GenerationBriefFormProps {
    onComplete: (brief: ReturnType<typeof useGenerationBrief>['brief']) => void
    disabled?: boolean
}

export function GenerationBriefForm({ onComplete, disabled }: GenerationBriefFormProps) {
    const { brief, updateBrief, step, setStep, valid } = useGenerationBrief()

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-accent">
                        Structured brief
                    </p>
                    <p className="mt-1 text-[13px] text-muted-foreground">
                        Answer a few questions to shape your image.
                    </p>
                </div>
                <span className="font-mono text-[11px] text-muted-foreground">
                    Step {step + 1} of 6
                </span>
            </div>

            <div className="grid grid-cols-6 gap-1">
                {Array.from({ length: 6 }).map((_, index) => (
                    <div
                        key={index}
                        className={`h-1.5 rounded-full ${index <= step ? 'bg-brand' : 'bg-border'}`}
                    />
                ))}
            </div>

            {step === 0 && (
                <div className="space-y-3">
                    <Label>What is the campaign goal?</Label>
                    <div className="grid gap-2 sm:grid-cols-2">
                        {CAMPAIGN_GOALS.map((goal) => (
                            <button
                                key={goal.value}
                                type="button"
                                disabled={disabled}
                                onClick={() => updateBrief({ campaign_goal: goal.value })}
                                className={`rounded-lg border px-3 py-3 text-left text-[13px] transition-colors ${brief.campaign_goal === goal.value
                                    ? 'border-brand bg-brand-weaker'
                                    : 'border-border bg-card hover:border-brand-border'
                                    }`}
                            >
                                {goal.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
            {step === 1 && (
                <div className="space-y-3">
                    <Label>What do you want to create?</Label>

                    <div className="grid gap-2 sm:grid-cols-2">
                        {CONTENT_TYPES.map((type) => (
                            <button
                                key={type.value}
                                type="button"
                                disabled={disabled}
                                onClick={() => updateBrief({ content_type: type.value })}
                                className={`rounded-lg border px-3 py-3 text-left text-[13px] transition-colors ${brief.content_type === type.value
                                    ? 'border-brand bg-brand-weaker'
                                    : 'border-border bg-card hover:border-brand-border'
                                    }`}
                            >
                                {type.label}
                            </button>
                        ))}
                    </div>

                    {brief.content_type === 'custom' && (
                        <div className="space-y-2">
                            <Label htmlFor="content-type-custom">Describe your content type</Label>
                            <Input
                                id="content-type-custom"
                                value={brief.content_type_custom ?? ''}
                                onChange={(event) =>
                                    updateBrief({ content_type_custom: event.target.value })
                                }
                                disabled={disabled}
                                placeholder="e.g. a behind-the-scenes post"
                            />
                        </div>
                    )}
                </div>
            )
            }
            {step === 2 && (
                <div className="space-y-4">
                    <div>
                        <Label>Who is the target audience?</Label>
                        <p className="mt-1 text-[12px] text-muted-foreground">
                            Select one or two audience groups.
                        </p>
                    </div>

                    <div className="grid gap-2 sm:grid-cols-2">
                        {[
                            { value: 'general_consumers', label: 'General consumers' },
                            { value: 'small_business_owners', label: 'Small business owners' },
                            { value: 'entrepreneurs', label: 'Entrepreneurs' },
                            { value: 'marketers_creators', label: 'Marketers and content creators' },
                            { value: 'professionals', label: 'Professionals and employees' },
                            { value: 'students', label: 'Students' },
                            { value: 'online_shoppers', label: 'Online shoppers' },
                            { value: 'local_community', label: 'Local community' },
                        ].map((audienceOption) => {
                            const selected = brief.target_audience.segments.includes(audienceOption.value)

                            return (
                                <button
                                    key={audienceOption.value}
                                    type="button"
                                    disabled={
                                        disabled ||
                                        (!selected && brief.target_audience.segments.length >= 2)
                                    }
                                    onClick={() => {
                                        const segments = selected
                                            ? brief.target_audience.segments.filter(
                                                (item) => item !== audienceOption.value,
                                            )
                                            : [...brief.target_audience.segments, audienceOption.value]

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

                    <div className="space-y-2">
                        <Label htmlFor="audience-details">Tell us more about them (optional)</Label>
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
                            placeholder="e.g. young professionals in Amman"
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
                            Write your idea naturally. You do not need to write a professional prompt.
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
                            {brief.core_idea.trim().length < 3 && brief.core_idea.length > 0
                                ? 'Please write at least 3 characters.'
                                : 'Keep it clear and focused.'}
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
                        {VOICE_TONES.map((tone) => (
                            <button
                                key={tone.value}
                                type="button"
                                disabled={disabled}
                                onClick={() => updateBrief({ voice_tone: tone.value })}
                                className={`rounded-lg border px-3 py-3 text-left text-[13px] transition-colors ${brief.voice_tone === tone.value
                                    ? 'border-brand bg-brand-weaker'
                                    : 'border-border bg-card hover:border-brand-border'
                                    }`}
                            >
                                {tone.label}
                            </button>
                        ))}
                    </div>

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
                        </div>
                    )}

                    <div className="space-y-2 border-t border-border-subtle pt-4">
                        <Label htmlFor="optional-notes">Additional notes (optional)</Label>
                        <Textarea
                            id="optional-notes"
                            value={brief.optional_notes ?? ''}
                            onChange={(event) =>
                                updateBrief({ optional_notes: event.target.value || null })
                            }
                            disabled={disabled}
                            maxLength={2000}
                            placeholder="Add visual direction, things to avoid, or layout preferences."
                            className="min-h-[90px]"
                        />
                        <p className="text-right font-mono text-[11px] text-muted-foreground">
                            {(brief.optional_notes ?? '').length} / 2000
                        </p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="text-to-include">Text to include in the image (optional)</Label>
                        <Input
                            id="text-to-include"
                            value={brief.text_to_include ?? ''}
                            onChange={(event) =>
                                updateBrief({ text_to_include: event.target.value || null })
                            }
                            disabled={disabled}
                            maxLength={500}
                            placeholder="e.g. 20% off this week"
                        />
                    </div>
                </div>
            )}

            <div className="flex items-center justify-between border-t border-border-subtle pt-3">
                <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setStep(Math.max(0, step - 1))}
                    disabled={disabled || step === 0}
                >
                    Back
                </Button>

                {step < 5 ? (
                    <Button
                        type="button"
                        onClick={() => setStep(step + 1)}
                        disabled={
                            disabled ||
                            (step === 0 && !brief.campaign_goal) ||
                            (step === 1 && !brief.content_type) ||
                            (step === 2 && brief.target_audience.segments.length === 0) ||
                            (step === 3 && brief.core_idea.trim().length < 3) ||
                            (step === 4 &&
                                (!brief.voice_tone ||
                                    (brief.voice_tone === 'custom' && !brief.voice_tone_custom?.trim())))
                        }


                    >
                        Next
                    </Button>
                ) : (
                    <Button
                        type="button"
                        onClick={() => onComplete(brief)}
                        disabled={disabled || !valid}
                    >
                        Continue
                    </Button>
                )}
            </div>

        </div>
    )
}

