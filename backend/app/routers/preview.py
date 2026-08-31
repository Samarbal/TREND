from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID

from app.core.auth import User, get_current_user
from app.core.supabase import get_service_client
from app.models.generation import GenerationBrief
from app.services.brief_preview import build_creative_direction

router = APIRouter(prefix="/brands/{brand_id}", tags=["preview"])


def _get_brand_or_404(brand_id: UUID, user_id: str) -> dict:
    client = get_service_client()
    result = (
        client.table("brands")
        .select("*")
        .eq("id", str(brand_id))
        .eq("owner_user_id", user_id)
        .maybe_single()
        .execute()
    )
    if result is None or result.data is None:
        raise HTTPException(status_code=404, detail="Brand not found")
    return result.data


def _get_brand_kit_context(brand_id: UUID, brand_name: str) -> dict | None:
    client = get_service_client()
    result = (
        client.table("brand_kits")
        .select("tagline, tone, audience, colors, avoid_words, status")
        .eq("brand_id", str(brand_id))
        .maybe_single()
        .execute()
    )
    if result is None or result.data is None:
        return None
    row = result.data
    if row.get("status") != "complete":
        return None
    return {
        "name": brand_name,
        "tagline": row.get("tagline"),
        "tone": row.get("tone"),
        "audience": row.get("audience"),
        "colors": row.get("colors") or [],
        "avoid_words": row.get("avoid_words"),
    }


class PreviewBriefRequest:
    """Request body for preview-brief endpoint."""
    def __init__(self, brief: GenerationBrief, platform_preset: str):
        self.brief = brief
        self.platform_preset = platform_preset


@router.post("/preview-brief")
async def preview_brief(
    brand_id: UUID,
    body: dict,  # We'll parse manually to avoid circular import issues
    current_user: User = Depends(get_current_user),
):
    """Return creative direction translation of a generation brief."""
    from app.models.generation import GenerationBrief, PlatformPresetEnum
    
    # Parse request body
    brief_data = body.get("brief")
    platform_preset = body.get("platform_preset")
    
    if not brief_data or not platform_preset:
        raise HTTPException(status_code=400, detail="brief and platform_preset are required")
    
    # Validate brief
    brief = GenerationBrief(**brief_data)
    
    # Validate platform preset
    try:
        PlatformPresetEnum(platform_preset)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid platform_preset")
    
    # Fetch brand and kit
    brand = _get_brand_or_404(brand_id, current_user.id)
    brand_context = _get_brand_kit_context(brand_id, brand["name"])
    
    # Build creative direction
    creative_direction = build_creative_direction(
        brief=brief,
        brand_name=brand["name"],
        platform_preset=platform_preset,
        brand_context=brand_context,
    )
    
    return {
        "creative_direction": creative_direction,
        "brand_name": brand["name"],
    }