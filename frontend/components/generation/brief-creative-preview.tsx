
'use client'

import type { ReactNode } from 'react'
import {
    Sparkles,
    Target,
    Users,
    Lightbulb,
    Palette,
    Monitor,
    FileText,
    AlertCircle,
    Pencil,
    RefreshCw,
} from 'lucide-react'
import {
    AUDIENCE_SEGMENTS,
    CAMPAIGN_GOALS,
    CONTENT_TYPES,
    VOICE_TONES,
} from '@/lib/generation-options'
import type { CreativeDirection } from '@/types'

interface BriefCreativePreviewProps {
    preview: CreativeDirection | null
    loading: boolean
    error: string | null
    brandName: string
    onEdit?: (step: number) => void
    retryPreview?: () => void | Promise<void>
}

function labelFromOptions(
    value: string | undefined,
    options: ReadonlyArray<{ value: string; label: string }>,
) {
    if (!value) return 'Not selected'
    const match = options.find((option) => option.value === value)
    return match?.label ?? humanizeLabel(value)
}

function humanizeLabel(value: string) {
    return value
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
        .trim()
}

function formatAudience(value: string | undefined) {
    if (!value) return 'General audience'

    const options = AUDIENCE_SEGMENTS.filter((option) => value.includes(option.value))
    if (options.length > 0) {
        return options.map((option) => option.label).join(', ')
    }

    return humanizeLabel(value)
}

function formatPlatform(value: string | undefined) {
    if (!value) return 'Selected platform'
    return humanizeLabel(value).replace('Instagram ', 'Instagram ')
}

export function BriefCreativePreview({
    preview,
    loading,
    error,
    brandName,
    onEdit,
    retryPreview,
}: BriefCreativePreviewProps) {
    if (loading) {
        return (
            <div
                data-testid="brief-creative-preview"
                className="flex items-center justify-center rounded-xl border border-brand/20 bg-brand-weaker/20 py-8 text-[13px] text-muted-foreground"
            >
                <Sparkles className="mr-2 h-4 w-4 animate-pulse text-brand" />
                Translating your brief into creative direction...
            </div>
        )
    }

    if (error) {
        return (
            <div
                data-testid="brief-creative-preview"
                className="flex items-start gap-2 rounded-xl border border-destructive/20 bg-destructive/5 p-3 text-[12px] text-destructive"
                role="alert"
            >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="flex-1">{error}</span>
                {retryPreview && (
                    <button
                        type="button"
                        onClick={retryPreview}
                        className="inline-flex shrink-0 items-center gap-1.5 font-medium text-destructive underline-offset-2 hover:underline"
                    >
                        <RefreshCw className="h-3.5 w-3.5" />
                        Retry
                    </button>
                )}
            </div>
        )
    }

    if (!preview) return null

    const campaignGoal = labelFromOptions(preview.campaign_goal, CAMPAIGN_GOALS)
    const contentType = labelFromOptions(preview.content_type, CONTENT_TYPES)
    const voiceTone = labelFromOptions(preview.voice_tone, VOICE_TONES)
    const targetAudience = formatAudience(preview.target_audience)
    const platformName = formatPlatform(preview.platform?.name)

    return (
        <div
            data-testid="brief-creative-preview"
            className="space-y-3 rounded-2xl border border-brand/20 bg-brand-weaker/30 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.03)]"
        >
            <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div>
                    <h4 className="text-[13px] font-semibold text-foreground">Creative Direction</h4>
                    <p className="text-[11px] text-muted-foreground">
                        Here is how {brandName}&apos;s brief will guide the AI:
                    </p>
                </div>
            </div>

            <div className="grid gap-2.5 md:grid-cols-2">
                <DirectionCard icon={<Target className="h-3.5 w-3.5" />} label="Campaign goal" value={campaignGoal} onEdit={onEdit ? () => onEdit(0) : undefined} />
                <DirectionCard icon={<FileText className="h-3.5 w-3.5" />} label="Content type" value={contentType} onEdit={onEdit ? () => onEdit(1) : undefined} />
                <DirectionCard icon={<Users className="h-3.5 w-3.5" />} label="Target audience" value={targetAudience} onEdit={onEdit ? () => onEdit(2) : undefined} />
                <DirectionCard icon={<Lightbulb className="h-3.5 w-3.5" />} label="Core idea" value={preview.core_idea || 'Ideas are being refined'} onEdit={onEdit ? () => onEdit(3) : undefined} />
                <DirectionCard icon={<Palette className="h-3.5 w-3.5" />} label="Voice & tone" value={voiceTone} onEdit={onEdit ? () => onEdit(4) : undefined} />
                <DirectionCard
                    icon={<Monitor className="h-3.5 w-3.5" />}
                    label="Platform"
                    value={platformName}
                    detail={preview.platform?.note}
                />
            </div>

            {(preview.text_to_include || preview.optional_notes || preview.brand_identity) && (
                <div className="rounded-xl border border-border-subtle bg-card/40 p-3">
                    <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                        Brand identity applied
                    </p>

                    <div className="space-y-2 text-[12px] text-foreground">
                        {preview.text_to_include && (
                            <InfoLine
                                label="Text to include"
                                value={`"${preview.text_to_include}"`}
                                onEdit={onEdit ? () => onEdit(4) : undefined}
                            />
                        )}
                        {preview.optional_notes && (
                            <InfoLine
                                label="Design notes"
                                value={preview.optional_notes}
                                onEdit={onEdit ? () => onEdit(4) : undefined}
                            />
                        )}
                        {preview.brand_identity && (
                            <>
                                {preview.brand_identity.tone && (
                                    <InfoLine label="Tone" value={preview.brand_identity.tone} />
                                )}
                                {preview.brand_identity.colors && preview.brand_identity.colors.length > 0 && (
                                    <div className="flex items-center gap-2">
                                        <span className="min-w-[52px] text-muted-foreground">Colors</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {preview.brand_identity.colors.map((color) => (
                                                <span
                                                    key={color}
                                                    className="inline-block h-4 w-4 rounded-full border border-border"
                                                    style={{ backgroundColor: color }}
                                                    title={color}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {preview.brand_identity.avoid_words && (
                                    <InfoLine label="Avoid" value={preview.brand_identity.avoid_words} tone="danger" />
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

function DirectionCard({
    icon,
    label,
    value,
    detail,
    onEdit,
}: {
    icon: ReactNode
    label: string
    value: string
    detail?: string
    onEdit?: () => void
}) {
    return (
        <div className="rounded-xl border border-border-subtle bg-card/50 p-2.5">
            <div className="mb-1 flex items-center justify-between gap-1.5">
                <div className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">
                    <span className="text-brand">{icon}</span>
                    {label}
                </div>
                {onEdit && (
                    <button
                        type="button"
                        onClick={onEdit}
                        className="shrink-0 text-brand-accent underline-offset-2 hover:underline"
                        aria-label={`Edit ${label}`}
                    >
                        <Pencil className="h-3 w-3" />
                    </button>
                )}
            </div>
            <p className="text-[12px] font-medium text-foreground">{value}</p>
            {detail && <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{detail}</p>}
        </div>
    )
}

function InfoLine({
    label,
    value,
    tone = 'default',
    onEdit,
}: {
    label: string
    value: string
    tone?: 'default' | 'danger'
    onEdit?: () => void
}) {
    return (
        <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
                <span className="min-w-[72px] text-muted-foreground">{label}</span>
                <span className={tone === 'danger' ? 'text-destructive' : 'text-foreground'}>{value}</span>
            </div>
            {onEdit && (
                <button
                    type="button"
                    onClick={onEdit}
                    className="shrink-0 text-brand-accent underline-offset-2 hover:underline"
                    aria-label={`Edit ${label}`}
                >
                    <Pencil className="h-3 w-3" />
                </button>
            )}
        </div>
    )
}