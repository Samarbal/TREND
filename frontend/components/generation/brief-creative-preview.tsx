// D:\Level4\TREND\frontend\components\generation\brief-creative-preview.tsx
'use client'

import type { ReactNode } from 'react'
import { Sparkles, Target, Users, Lightbulb, Palette, Monitor, Type, FileText, AlertCircle } from 'lucide-react'
import type { CreativeDirection } from '@/types'

interface BriefCreativePreviewProps {
    preview: CreativeDirection | null
    loading: boolean
    error: string | null
    brandName: string
}

export function BriefCreativePreview({ preview, loading, error, brandName }: BriefCreativePreviewProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-8 text-muted-foreground">
                <Sparkles className="mr-2 h-4 w-4 animate-pulse" />
                Translating your brief into creative direction...
            </div>
        )
    }

    if (error) {
        return (
            <div className="flex items-start gap-2 rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-[12px] text-destructive">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                {error}
            </div>
        )
    }

    if (!preview) return null

    return (
        <div className="space-y-3 rounded-lg border border-brand/20 bg-brand-weaker/30 p-4">
            <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand" />
                <h4 className="text-[13px] font-semibold">Creative Direction</h4>
            </div>
            <p className="text-[12px] text-muted-foreground">
                Here is how {brandName}&apos;s brief will guide the AI:
            </p>

            <div className="space-y-2.5">
                <DirectionRow icon={<Target className="h-3.5 w-3.5" />} label="Campaign Goal" value={preview.campaign_goal} />
                <DirectionRow icon={<FileText className="h-3.5 w-3.5" />} label="Content Type" value={preview.content_type} />
                <DirectionRow icon={<Users className="h-3.5 w-3.5" />} label="Target Audience" value={preview.target_audience} />
                <DirectionRow icon={<Lightbulb className="h-3.5 w-3.5" />} label="Core Idea" value={preview.core_idea} />
                <DirectionRow icon={<Palette className="h-3.5 w-3.5" />} label="Voice & Tone" value={preview.voice_tone} />
                <DirectionRow icon={<Monitor className="h-3.5 w-3.5" />} label={`Platform: ${preview.platform.name}`} value={preview.platform.note} />

                {preview.text_to_include && (
                    <DirectionRow icon={<Type className="h-3.5 w-3.5" />} label="Text to Include" value={`"${preview.text_to_include}"`} />
                )}

                {preview.optional_notes && (
                    <DirectionRow icon={<FileText className="h-3.5 w-3.5" />} label="Design Notes" value={preview.optional_notes} />
                )}

                {preview.brand_identity && (
                    <div className="rounded-md border border-border-subtle bg-card/50 p-2.5">
                        <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            Brand Identity Applied
                        </p>
                        {preview.brand_identity.tagline && (
                            <p className="text-[12px] text-foreground">
                                <span className="text-muted-foreground">Tagline:</span> {preview.brand_identity.tagline}
                            </p>
                        )}
                        {preview.brand_identity.tone && (
                            <p className="text-[12px] text-foreground">
                                <span className="text-muted-foreground">Tone:</span> {preview.brand_identity.tone}
                            </p>
                        )}
                        {preview.brand_identity.colors && preview.brand_identity.colors.length > 0 && (
                            <div className="mt-1 flex items-center gap-1.5">
                                <span className="text-[12px] text-muted-foreground">Colors:</span>
                                <div className="flex gap-1">
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
                            <p className="text-[12px] text-destructive/80">
                                <span className="text-muted-foreground">Avoid:</span> {preview.brand_identity.avoid_words}
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

function DirectionRow({
    icon,
    label,
    value,
}: {
    icon: ReactNode
    label: string
    value: string
}) {
    return (
        <div className="flex items-start gap-2.5">
            <div className="mt-0.5 shrink-0 text-muted-foreground">{icon}</div>
            <div className="min-w-0">
                <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
                <p className="mt-0.5 text-[12px] leading-relaxed text-foreground">{value}</p>
            </div>
        </div>
    )
}