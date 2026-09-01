import json
from pathlib import Path
import pytest

from app.services.prompt_composer import (
    BrandContext,
    PlatformContext,
    PLATFORM_NOTES,
    TONE_STYLE_MAP,
    build_generation_prompt,
    compose_full_prompt,
)
from app.models.generation import (
    AgeRangeEnum,
    AudienceSegmentEnum,
    CampaignGoalEnum,
    ContentTypeEnum,
    GenderFocusEnum,
    GenerationBrief,
    TargetAudience,
    VoiceToneEnum,
)
from app.services.presets import PLATFORM_PRESETS

USER_PROMPT = "A modern minimal office"

SAMPLE_BRAND = BrandContext(
    name="Acme",
    tagline="Build the future",
    tone="professional",
    audience="startup founders aged 25-40",
    colors=["#1E3A8A", "#3B82F6"],
    avoid_words="cheap, discount, budget",
)

SAMPLE_PLATFORM = PlatformContext(
    label="Instagram Post",
    width=1080,
    height=1080,
    aspect_ratio="1:1",
    note="Square 1:1 format. Design should work as a grid tile — keep key content centered.",
)


# --- Section ordering ---


def test_system_role_is_first():
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context=None,
        platform=SAMPLE_PLATFORM,
        logo_mode="none",
        brand_has_logo=False,
    )
    assert result.startswith("You are a professional social media image designer.")


def test_section_ordering_full():
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context=SAMPLE_BRAND,
        platform=SAMPLE_PLATFORM,
        logo_mode="prompt",
        brand_has_logo=True,
    )
    brand_idx = result.index("=== BRAND IDENTITY ===")
    composition_idx = result.index("=== COMPOSITION ===")
    logo_idx = result.index("=== LOGO ===")
    request_idx = result.index("=== IMAGE REQUEST ===")
    assert brand_idx < composition_idx < logo_idx < request_idx


def test_user_request_is_last():
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context=SAMPLE_BRAND,
        platform=SAMPLE_PLATFORM,
        logo_mode="none",
        brand_has_logo=False,
    )
    assert result.endswith(f"=== IMAGE REQUEST ===\n{USER_PROMPT}")


# --- Brand context ---


def test_no_brand_context_omits_brand_section():
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context=None,
        platform=SAMPLE_PLATFORM,
        logo_mode="none",
        brand_has_logo=False,
    )
    assert "BRAND IDENTITY" not in result


def test_full_brand_context_includes_all_fields():
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context=SAMPLE_BRAND,
        platform=SAMPLE_PLATFORM,
        logo_mode="none",
        brand_has_logo=False,
    )
    assert "Brand: Acme" in result
    assert 'Tagline: "Build the future"' in result
    assert "Visual style:" in result
    assert "Target audience: startup founders aged 25-40" in result
    assert "Brand colors: #1E3A8A, #3B82F6" in result
    assert "AVOID" in result
    assert "cheap, discount, budget" in result


def test_partial_brand_context_omits_null_fields():
    partial = BrandContext(name="MiniBrand", tone="casual", audience="teens", colors=["#FF0000"])
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context=partial,
        platform=SAMPLE_PLATFORM,
        logo_mode="none",
        brand_has_logo=False,
    )
    assert "Brand: MiniBrand" in result
    assert "Tagline" not in result
    assert "AVOID" not in result
    assert "Visual style:" in result
    assert "Target audience: teens" in result


def test_no_none_specified_in_output():
    partial = BrandContext(name="TestBrand")
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context=partial,
        platform=SAMPLE_PLATFORM,
        logo_mode="none",
        brand_has_logo=False,
    )
    assert "None specified" not in result
    assert "None" not in result.split("=== BRAND IDENTITY ===")[1].split("=== PLATFORM ===")[0]


# --- Tone mapping ---


def test_each_tone_maps_to_style():
    for tone, expected_style in TONE_STYLE_MAP.items():
        ctx = BrandContext(name="T", tone=tone, audience="x", colors=["#000"])
        result = compose_full_prompt(
            user_prompt=USER_PROMPT,
            brand_context=ctx,
            platform=SAMPLE_PLATFORM,
            logo_mode="none",
            brand_has_logo=False,
        )
        assert expected_style in result, f"tone={tone} style not found"


# --- Platform context ---


def test_platform_always_present():
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context=None,
        platform=SAMPLE_PLATFORM,
        logo_mode="none",
        brand_has_logo=False,
    )
    assert "=== COMPOSITION ===" in result
    assert "grid tile" in result


def test_platform_label_and_dimensions_not_leaked_to_prompt():
    # Prevents Gemini from rendering platform metadata as on-canvas text.
    # See: regression where "Facebook Post" + "1200x630 landscape" appeared
    # as a header/subtitle on generated images.
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context=None,
        platform=SAMPLE_PLATFORM,
        logo_mode="none",
        brand_has_logo=False,
    )
    assert "Instagram Post" not in result
    assert "1080x1080" not in result
    assert "Platform:" not in result


def test_platform_notes_cover_all_presets():
    for preset_id in PLATFORM_PRESETS:
        assert preset_id in PLATFORM_NOTES, f"Missing PLATFORM_NOTES entry for {preset_id}"


# --- Logo mode ---


def test_logo_prompt_mode_with_logo():
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context=None,
        platform=SAMPLE_PLATFORM,
        logo_mode="prompt",
        brand_has_logo=True,
    )
    assert "=== LOGO ===" in result
    assert "corner" in result


def test_logo_prompt_mode_without_logo():
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context=None,
        platform=SAMPLE_PLATFORM,
        logo_mode="prompt",
        brand_has_logo=False,
    )
    assert "LOGO" not in result


def test_logo_watermark_mode_never_in_prompt():
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context=None,
        platform=SAMPLE_PLATFORM,
        logo_mode="watermark",
        brand_has_logo=True,
    )
    assert "LOGO" not in result


def test_logo_both_mode_with_logo():
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context=None,
        platform=SAMPLE_PLATFORM,
        logo_mode="both",
        brand_has_logo=True,
    )
    assert "=== LOGO ===" in result


def test_logo_both_mode_without_logo():
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context=None,
        platform=SAMPLE_PLATFORM,
        logo_mode="both",
        brand_has_logo=False,
    )
    assert "LOGO" not in result


def test_logo_none_mode():
    result = compose_full_prompt(
        user_prompt=USER_PROMPT,
        brand_context=None,
        platform=SAMPLE_PLATFORM,
        logo_mode="none",
        brand_has_logo=True,
    )
    assert "LOGO" not in result


# --- build_generation_prompt tests (Sprint 2 Structured Generation) ---

SAMPLE_BRIEF = GenerationBrief(
    campaign_goal=CampaignGoalEnum.product_launch,
    content_type=ContentTypeEnum.product_showcase,
    target_audience=TargetAudience(
        segments=[AudienceSegmentEnum.small_business_owners],
        location="Amman, Jordan",
        age_range=AgeRangeEnum.age_25_34,
        gender_focus=GenderFocusEnum.all,
        details="Local café and bakery owners looking to upgrade their summer menu.",
    ),
    core_idea="إطلاق مشروب قهوة بارد جديد ومنعش لصباح صيفي مزدحم.",
    voice_tone=VoiceToneEnum.friendly,
    optional_notes="اترك مساحة في الأعلى لكتابة نص عربي واضح.",
    text_to_include="خصم 20% لفترة محدودة",
)


def test_build_generation_prompt_section_ordering_full():
    result = build_generation_prompt(
        brief=SAMPLE_BRIEF,
        brand_context=SAMPLE_BRAND,
        platform=SAMPLE_PLATFORM,
        logo_mode="prompt",
        brand_has_logo=True,
    )
    system_idx = result.index("You are a professional social media image designer.")
    brief_idx = result.index("=== CAMPAIGN BRIEF ===")
    brand_idx = result.index("=== BRAND IDENTITY ===")
    composition_idx = result.index("=== COMPOSITION ===")
    logo_idx = result.index("=== LOGO ===")
    output_idx = result.index("=== OUTPUT RULES ===")

    assert system_idx < brief_idx < brand_idx < composition_idx < logo_idx < output_idx


def test_build_generation_prompt_maps_enums_to_readable_instructions():
    result = build_generation_prompt(
        brief=SAMPLE_BRIEF,
        brand_context=None,
        platform=SAMPLE_PLATFORM,
        logo_mode="none",
        brand_has_logo=False,
    )
    assert "Campaign Goal: Communicate a product or service launch." in result
    assert "Content Type: Visual product showcase focusing on aesthetic product presentation." in result
    assert "Tone & Style: Friendly, warm, and approachable." in result
    assert "Demographic: small business owners" in result
    assert "Location/Market: Amman, Jordan" in result
    assert "Age group: 25–34 years old" in result
    assert "Gender focus: all genders" in result
    assert "Details: Local café and bakery owners looking to upgrade their summer menu." in result


def test_build_generation_prompt_preserves_arabic_and_user_text():
    result = build_generation_prompt(
        brief=SAMPLE_BRIEF,
        brand_context=None,
        platform=SAMPLE_PLATFORM,
        logo_mode="none",
        brand_has_logo=False,
    )
    assert "Core Idea: إطلاق مشروب قهوة بارد جديد ومنعش لصباح صيفي مزدحم." in result
    assert 'Text to Include: "خصم 20% لفترة محدودة"' in result
    assert "Design Notes: اترك مساحة في الأعلى لكتابة نص عربي واضح." in result


def test_build_generation_prompt_custom_fields():
    custom_brief = GenerationBrief(
        campaign_goal=CampaignGoalEnum.custom,
        campaign_goal_custom="احتفال بالذكرى السنوية الخامسة",
        content_type=ContentTypeEnum.custom,
        content_type_custom="بطاقة شكر مخصصة للعملاء",
        target_audience=TargetAudience(
            segments=[AudienceSegmentEnum.custom],
            details="عملاء المتجر الأوفياء في كافة الفروع.",
        ),
        core_idea="التعبير عن الامتنان للعملاء مع تقديم مفاجأة خاصة.",
        voice_tone=VoiceToneEnum.custom,
        voice_tone_custom="دافئ جدًا ومفعم بالتقدير",
    )
    result = build_generation_prompt(
        brief=custom_brief,
        brand_context=None,
        platform=SAMPLE_PLATFORM,
        logo_mode="none",
        brand_has_logo=False,
    )
    assert "Campaign Goal: احتفال بالذكرى السنوية الخامسة" in result
    assert "Content Type: بطاقة شكر مخصصة للعملاء" in result
    assert "Tone & Style: دافئ جدًا ومفعم بالتقدير" in result
    assert "Demographic: custom audience" in result
    assert "Details: عملاء المتجر الأوفياء في كافة الفروع." in result


def test_build_generation_prompt_output_rules_always_present():
    result = build_generation_prompt(
        brief=SAMPLE_BRIEF,
        brand_context=None,
        platform=SAMPLE_PLATFORM,
        logo_mode="none",
        brand_has_logo=False,
    )
    assert "=== OUTPUT RULES ===" in result
    assert "Do NOT render section headers" in result

FIXTURES_PATH = (
    Path(__file__).parent / "fixtures" / "generation_briefs.json"
)


@pytest.fixture
def generation_briefs():
    with FIXTURES_PATH.open(encoding="utf-8") as file:
        return json.load(file)

def test_generation_brief_fixtures_have_required_fields(generation_briefs):
    required_fields = {
        "campaign_goal",
        "content_type",
        "target_audience",
        "core_idea",
        "voice_tone",
    }

    for fixture in generation_briefs:
        brief_data = fixture["brief"]
        assert required_fields.issubset(brief_data)
        assert brief_data["core_idea"]
        assert brief_data["target_audience"]["segments"]

TEST_PLATFORM = PlatformContext(
    label="Instagram Post",
    width=1080,
    height=1080,
    aspect_ratio="1:1",
    note=(
        "Square 1:1 format. Design should work as a grid tile "
        "— keep key content centered."
    ),
)
def test_prompt_fixtures_match_expected_outputs(generation_briefs):
    for fixture in generation_briefs:
        brief = GenerationBrief.model_validate(fixture["brief"])
        result = build_generation_prompt(
            brief=brief,
            brand_context=None,
            platform=TEST_PLATFORM,
            logo_mode="none",
            brand_has_logo=False,
        )
        expected = fixture["expected"]

        assert expected["campaign_goal"] in result
        assert expected["content_type"] in result
        assert expected["audience_segment"] in result
        assert expected["core_idea"] in result

        if "age_range" in expected:
            assert expected["age_range"] in result
        if "gender_focus" in expected:
            assert expected["gender_focus"] in result
        if "notes" in expected:
            assert expected["notes"] in result
        if "text_to_include" in expected:
            assert expected["text_to_include"] in result
        if "tone" in expected:
            assert expected["tone"] in result

def test_prompt_headers_are_instructions_not_requested_canvas_text(
    generation_briefs,
):
    brief = GenerationBrief.model_validate(
        generation_briefs[0]["brief"]
    )

    result = build_generation_prompt(
        brief=brief,
        brand_context=None,
        platform=TEST_PLATFORM,
        logo_mode="none",
        brand_has_logo=False,
    )

    assert "=== SYSTEM ROLE ===" in result
    assert "=== CAMPAIGN BRIEF ===" in result
    assert "=== OUTPUT RULES ===" in result
    assert "Do NOT render section headers" in result
    assert "Avoid rendering metadata" in result


