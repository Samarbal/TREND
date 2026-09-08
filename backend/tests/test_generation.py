# D:\Level4\Trend\backend\tests\test_generation.py
import pytest
from pydantic import ValidationError

from app.models.generation import (
    AgeRangeEnum,
    AudienceSegmentEnum,
    CampaignGoalEnum,
    ContentTypeEnum,
    GenerationBrief,
    GenerateRequest,
    PlatformPresetEnum,
    ProviderEnum,
    TextLanguageEnum,
    VoiceToneEnum,
)

VALID_BRIEF = {
    "campaign_goal": "product_launch",
    "content_type": "product_showcase",
    "target_audience": {
        "segments": ["small_business_owners"],
        "location": "JO",
        "age_range": "25_34",
        "gender_focus": "all",
        "details": "أصحاب مشاريع صغيرة في عمّان.",
    },
    "core_idea": "إطلاق قهوة باردة لصباح صيفي مزدحم.",
    "voice_tone": "friendly",
    "optional_notes": "اترك مساحة أعلى التصميم لعنوان عربي.",
    "text_to_include": "خصم 20% لفترة محدودة",
}


def test_generation_brief_accepts_valid_payload():
    brief = GenerationBrief.model_validate(VALID_BRIEF)

    assert brief.campaign_goal is CampaignGoalEnum.product_launch
    assert brief.content_type is ContentTypeEnum.product_showcase
    assert brief.target_audience.segments == [
        AudienceSegmentEnum.small_business_owners
    ]
    assert brief.target_audience.age_range is AgeRangeEnum.age_25_34
    assert brief.voice_tone is VoiceToneEnum.friendly
    assert brief.text_to_include == "خصم 20% لفترة محدودة"


def test_generation_brief_serializes_to_json_compatible_values():
    brief = GenerationBrief.model_validate(VALID_BRIEF)
    data = brief.model_dump(mode="json")

    assert data["campaign_goal"] == "product_launch"
    assert data["content_type"] == "product_showcase"
    assert data["target_audience"]["age_range"] == "25_34"


def test_generation_brief_rejects_unknown_campaign_goal():
    payload = {**VALID_BRIEF, "campaign_goal": "not_a_real_goal"}

    with pytest.raises(ValidationError):
        GenerationBrief.model_validate(payload)


def test_generation_brief_rejects_more_than_two_audience_segments():
    payload = {
        **VALID_BRIEF,
        "target_audience": {
            **VALID_BRIEF["target_audience"],
            "segments": [
                "small_business_owners",
                "entrepreneurs",
                "professionals",
            ],
        },
    }

    with pytest.raises(ValidationError):
        GenerationBrief.model_validate(payload)


def test_generation_brief_rejects_short_core_idea():
    payload = {**VALID_BRIEF, "core_idea": "Hi"}

    with pytest.raises(ValidationError):
        GenerationBrief.model_validate(payload)


def test_generate_request_accepts_valid_payload():
    request = GenerateRequest.model_validate(
        {
            "brief": VALID_BRIEF,
            "provider": "openai",
            "platform_preset": "instagram_post",
            "logo_mode": "none",
        }
    )

    assert request.brief.campaign_goal is CampaignGoalEnum.product_launch
    assert request.provider is ProviderEnum.openai
    assert request.platform_preset is PlatformPresetEnum.instagram_post
    assert request.logo_mode.value == "none"


def test_generate_request_rejects_missing_brief():
    with pytest.raises(ValidationError):
        GenerateRequest.model_validate(
            {
                "provider": "openai",
                "platform_preset": "instagram_post",
            }
        )



def test_generation_brief_requires_custom_campaign_goal_text():
    payload = {**VALID_BRIEF, "campaign_goal": "custom"}

    with pytest.raises(ValidationError):
        GenerationBrief.model_validate(payload)


def test_generation_brief_accepts_custom_campaign_goal_text():
    payload = {
        **VALID_BRIEF,
        "campaign_goal": "custom",
        "campaign_goal_custom": "إطلاق حملة لزيادة الوعي بالعلامة",
    }

    brief = GenerationBrief.model_validate(payload)

    assert brief.campaign_goal is CampaignGoalEnum.custom
    assert brief.campaign_goal_custom == "إطلاق حملة لزيادة الوعي بالعلامة"


def test_generation_brief_rejects_custom_text_for_non_custom_goal():
    payload = {
        **VALID_BRIEF,
        "campaign_goal_custom": "هدف مخصص لا يجب إرساله هنا",
    }

    with pytest.raises(ValidationError):
        GenerationBrief.model_validate(payload)


def test_generation_brief_rejects_empty_audience_segments():
    payload = {
        **VALID_BRIEF,
        "target_audience": {
            **VALID_BRIEF["target_audience"],
            "segments": [],
        },
    }

    with pytest.raises(ValidationError):
        GenerationBrief.model_validate(payload)


def test_generation_brief_rejects_duplicate_audience_segments():
    payload = {
        **VALID_BRIEF,
        "target_audience": {
            **VALID_BRIEF["target_audience"],
            "segments": ["entrepreneurs", "entrepreneurs"],
        },
    }

    with pytest.raises(ValidationError):
        GenerationBrief.model_validate(payload)


def test_generation_brief_requires_details_for_custom_audience():
    payload = {
        **VALID_BRIEF,
        "target_audience": {
            **VALID_BRIEF["target_audience"],
            "segments": ["custom"],
            "details": None,
        },
    }

    with pytest.raises(ValidationError):
        GenerationBrief.model_validate(payload)


def test_generation_brief_strips_text_and_converts_empty_optional_to_none():
    payload = {
        **VALID_BRIEF,
        "core_idea": "  فكرة إطلاق واضحة  ",
        "optional_notes": "   ",
    }

    brief = GenerationBrief.model_validate(payload)

    assert brief.core_idea == "فكرة إطلاق واضحة"
    assert brief.optional_notes is None



def test_generation_brief_defaults_to_english():
    brief = GenerationBrief.model_validate(VALID_BRIEF)

    assert brief.language is TextLanguageEnum.ar
  


def test_generation_brief_accepts_arabic_language():
    payload = {
        **VALID_BRIEF,
        "language": "ar",
    }

    brief = GenerationBrief.model_validate(payload)

    assert brief.language is TextLanguageEnum.ar

def test_generation_brief_accepts_english_language():
    payload = {
        **VALID_BRIEF,
        "language": "en",
    }

    brief = GenerationBrief.model_validate(payload)

    assert brief.language is TextLanguageEnum.en

def test_generation_brief_rejects_invalid_language():
    payload = {
        **VALID_BRIEF,
        "language": "fr",
    }

    with pytest.raises(ValidationError):
        GenerationBrief.model_validate(payload)

def test_generation_brief_serializes_language_as_string():
    payload = {
        **VALID_BRIEF,
        "language": "ar",
    }

    brief = GenerationBrief.model_validate(payload)
    data = brief.model_dump(mode="json")

    assert data["language"] == "ar"

def test_generate_request_passes_language_inside_brief():
    request = GenerateRequest.model_validate(
        {
            "brief": {
                **VALID_BRIEF,
                "language": "ar",
            },
            "provider": "openai",
            "platform_preset": "instagram_post",
            "logo_mode": "none",
        }
    )

    assert request.brief.language is TextLanguageEnum.ar

@pytest.mark.parametrize(
    "value",
    [
        "إطلاق مشروب قهوة بارد جديد",
        "Launch a new cold coffee drink",
        "إطلاق TREND AI 2026",
        "خصم 20% على Cold Brew! #قهوة",
        "مرحباً! العرض يبدأ اليوم؟",
        "السعر 15.50 دينار — العرض حتى 2026",
    ],
)
def test_generation_brief_preserves_core_idea(value):
    brief_data = dict(VALID_BRIEF)
    brief_data["core_idea"] = value

    brief = GenerationBrief.model_validate(brief_data)

    assert brief.core_idea == value

def test_generation_brief_preserves_all_user_text_fields():
    brief_data = dict(VALID_BRIEF)
    brief_data.update(
        {
            "core_idea": "إطلاق TREND AI 2026 — خصم 20% #قهوة",
            "text_to_include": "خصم 20% لفترة محدودة",
            "optional_notes": "استخدم النص العربي كما هو! Keep this phrase exactly.",
        }
    )

    brief = GenerationBrief.model_validate(brief_data)

    assert brief.core_idea == brief_data["core_idea"]
    assert brief.text_to_include == brief_data["text_to_include"]
    assert brief.optional_notes == brief_data["optional_notes"]


@pytest.mark.parametrize("invalid_lang", ["", "   ", "fr", "es", "123", None])
def test_generation_brief_rejects_invalid_or_empty_language(invalid_lang):
    payload = {
        **VALID_BRIEF,
        "language": invalid_lang,
    }

    with pytest.raises(ValidationError):
        GenerationBrief.model_validate(payload)

