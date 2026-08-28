export type CampaignGoal =
    | 'brand_awareness'
    | 'product_launch'
    | 'product_showcase'
    | 'promotion_offer'
    | 'sales_conversion'
    | 'lead_generation'
    | 'engagement'
    | 'education'
    | 'announcement'
    | 'event_registration'
    | 'seasonal_campaign'
    | 'social_proof'
    | 'custom'

export type ContentType =
    | 'product_showcase'
    | 'service_showcase'
    | 'promotional_ad'
    | 'announcement'
    | 'educational'
    | 'testimonial'
    | 'brand_story'
    | 'event_promo'
    | 'seasonal_post'
    | 'quote_or_tip'
    | 'infographic'
    | 'social_proof'
    | 'custom'

export type VoiceTone =
    | 'friendly'
    | 'professional'
    | 'playful'
    | 'bold'
    | 'elegant'
    | 'warm'
    | 'educational'
    | 'inspirational'
    | 'minimal'
    | 'trustworthy'
    | 'youthful'
    | 'urgent'
    | 'custom'

export interface TargetAudienceBrief {
    segments: string[]
    location?: string | null
    age_range?: string | null
    gender_focus?: string | null
    details?: string | null
}

export interface GenerationBrief {
    campaign_goal: CampaignGoal | ''
    campaign_goal_custom?: string | null
    content_type: ContentType | ''
    content_type_custom?: string | null
    target_audience: TargetAudienceBrief
    core_idea: string
    voice_tone: VoiceTone | ''
    voice_tone_custom?: string | null
    optional_notes?: string | null
    text_to_include?: string | null
}
