'use client'

import { AUDIENCE_SEGMENTS } from '@/lib/generation-options'
import type { BriefFieldErrors } from '@/lib/validation'
import type { TargetAudienceBrief } from '@/types/generation'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'

interface BriefAudienceStepProps {
    audience: TargetAudienceBrief
    onChange: (audience: TargetAudienceBrief) => void
    errors?: Pick<BriefFieldErrors, 'audience_segments'>
    disabled?: boolean
}

const LOCATION_SUGGESTIONS = [
    'Amman, Jordan',
    'Irbid, Jordan',
    'Zarqa, Jordan',
    'Dubai, UAE',
    'Riyadh, Saudi Arabia',
    'Jeddah, Saudi Arabia',
    'Doha, Qatar',
    'Cairo, Egypt',
    'Beirut, Lebanon',
    'Remote / online',
]

const AGE_RANGES = [
    'Under 18',
    '18–24',
    '25–34',
    '35–44',
    '45–54',
    '55+',
]

const GENDER_OPTIONS = [
    { value: 'all', label: 'Everyone' },
    { value: 'women', label: 'Women' },
    { value: 'men', label: 'Men' },
    { value: 'non_binary', label: 'Non-binary people' },
]

export function BriefAudienceStep({
    audience,
    onChange,
    errors,
    disabled = false,
}: BriefAudienceStepProps) {
    const availableSegments = AUDIENCE_SEGMENTS.filter(
        (segment) => segment.value !== 'custom',
    )
    const hasReachedLimit = audience.segments.length >= 2

    function update(next: Partial<TargetAudienceBrief>) {
        onChange({ ...audience, ...next })
    }

    function toggleSegment(segment: string) {
        const selected = audience.segments.includes(segment)

        if (selected) {
            update({
                segments: audience.segments.filter((item) => item !== segment),
            })
            return
        }

        if (audience.segments.length >= 2) return

        update({
            segments: [...audience.segments, segment],
        })
    }

    return (
        <div className="space-y-4">
            <div>
                <Label>Who is the target audience?</Label>
                <p className="mt-1 text-[12px] text-muted-foreground">
                    Select up to two groups. The remaining details are optional.
                </p>
            </div>

            <div className="grid gap-2 sm:grid-cols-2">
                {availableSegments.map((segment) => {
                    const selected = audience.segments.includes(segment.value)
                    const unavailable = hasReachedLimit && !selected

                    return (
                        <button
                            key={segment.value}
                            type="button"
                            aria-pressed={selected}
                            disabled={disabled || unavailable}
                            onClick={() => toggleSegment(segment.value)}
                            className={`rounded-lg border px-3 py-3 text-left text-[13px] transition-colors ${selected
                                    ? 'border-brand bg-brand-weaker'
                                    : unavailable
                                        ? 'cursor-not-allowed border-border bg-muted/40 opacity-50'
                                        : 'border-border bg-card hover:border-brand-border'
                                }`}
                        >
                            {segment.label}
                        </button>
                    )
                })}
            </div>

            {errors?.audience_segments && (
                <p className="text-[12px] text-destructive" role="alert">
                    {errors.audience_segments}
                </p>
            )}

            {hasReachedLimit && !errors?.audience_segments && (
                <p className="text-[12px] text-muted-foreground">
                    You can select up to two audience groups.
                </p>
            )}

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="audience-location">Location (optional)</Label>
                    <Input
                        id="audience-location"
                        role="combobox"
                        list="audience-location-suggestions"
                        value={audience.location ?? ''}
                        onChange={(event) =>
                            update({ location: event.target.value || null })
                        }
                        disabled={disabled}
                        placeholder="e.g. Amman, Jordan"
                    />
                    <datalist id="audience-location-suggestions">
                        {LOCATION_SUGGESTIONS.map((location) => (
                            <option key={location} value={location} />
                        ))}
                    </datalist>
                </div>

                <div className="space-y-2">
                    <Label htmlFor="audience-age">Age range (optional)</Label>
                    <select
                        id="audience-age"
                        value={audience.age_range ?? ''}
                        onChange={(event) =>
                            update({ age_range: event.target.value || null })
                        }
                        disabled={disabled}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20"
                    >
                        <option value="">Select an age range</option>
                        {AGE_RANGES.map((range) => (
                            <option key={range} value={range}>
                                {range}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="audience-gender">Gender focus (optional)</Label>
                <select
                    id="audience-gender"
                    value={audience.gender_focus ?? ''}
                    onChange={(event) =>
                        update({ gender_focus: event.target.value || null })
                    }
                    disabled={disabled}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground outline-none focus-visible:border-brand focus-visible:ring-2 focus-visible:ring-brand/20"
                >
                    <option value="">No specific focus</option>
                    {GENDER_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="audience-details">
                    Tell us more about this audience (optional)
                </Label>
                <Textarea
                    id="audience-details"
                    value={audience.details ?? ''}
                    onChange={(event) =>
                        update({ details: event.target.value || null })
                    }
                    disabled={disabled}
                    maxLength={500}
                    placeholder="Share context, needs, preferences, or buying motivations."
                    className="min-h-[110px]"
                />
                <p className="text-right font-mono text-[11px] text-muted-foreground">
                    {(audience.details ?? '').length} / 500
                </p>
            </div>
        </div>
    )
}
