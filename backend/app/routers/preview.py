<<<<<<< Updated upstream
from fastapi import APIRouter, Depends, HTTPException
from uuid import UUID

from app.core.auth import User, get_current_user
from app.core.supabase import get_service_client
from app.models.generation import GenerationBrief
from app.services.brief_preview import build_creative_direction

router = APIRouter(prefix="/brands/{brand_id}", tags=["preview"])
=======
import logging
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.config import settings
from app.core.auth import User, get_current_user
from app.core.supabase import get_service_client

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/preview", tags=["preview"])


def _error_response(status_code: int, code: str, message: str) -> HTTPException:
    return HTTPException(
        status_code=status_code,
        detail={"error": {"code": code, "message": message}},
    )


def _build_logo_url(logo_path: str | None) -> str | None:
    if not logo_path:
        return None
    return (
        f"{settings.SUPABASE_URL}/storage/v1/object/public/"
        f"{settings.STORAGE_BUCKET}/{logo_path}"
    )
>>>>>>> Stashed changes


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
<<<<<<< Updated upstream
        raise HTTPException(status_code=404, detail="Brand not found")
    return result.data


def _get_brand_kit_context(brand_id: UUID, brand_name: str) -> dict | None:
    client = get_service_client()
    result = (
        client.table("brand_kits")
        .select("tagline, tone, audience, colors, avoid_words, status")
        .eq("brand_id", str(brand_id))
=======
        raise _error_response(404, "BRAND_NOT_FOUND", "Brand not found")
    return result.data


def _get_kit_status(brand_id: str) -> str:
    client = get_service_client()
    result = (
        client.table("brand_kits")
        .select("status")
        .eq("brand_id", brand_id)
>>>>>>> Stashed changes
        .maybe_single()
        .execute()
    )
    if result is None or result.data is None:
<<<<<<< Updated upstream
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
=======
        return "not_started"
    return result.data.get("status", "not_started")


@router.get("/health")
async def preview_health():
    return {"status": "ok", "service": "preview"}


@router.get("/brands/{brand_id}")
async def get_brand_preview(
    brand_id: UUID,
    current_user: User = Depends(get_current_user),
):
    brand = _get_brand_or_404(brand_id, current_user.id)

    client = get_service_client()
    latest_generation = (
        client.table("generations")
        .select("id, image_path, status, created_at")
        .eq("brand_id", str(brand_id))
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    generation = (latest_generation.data or [{}])[0]
    latest_image_url = None
    if generation.get("image_path"):
        latest_image_url = (
            f"{settings.SUPABASE_URL}/storage/v1/object/public/"
            f"{settings.STORAGE_BUCKET}/{generation['image_path']}"
        )

    return {
        "brand_id": str(brand["id"]),
        "name": brand["name"],
        "logo_url": _build_logo_url(brand.get("logo_path")),
        "kit_status": _get_kit_status(str(brand_id)),
        "latest_generation": {
            "id": generation.get("id"),
            "status": generation.get("status"),
            "image_url": latest_image_url,
            "created_at": generation.get("created_at"),
        },
    }


@router.get("/brands/{brand_id}/latest-generation")
async def get_latest_generation_preview(
    brand_id: UUID,
    current_user: User = Depends(get_current_user),
):
    _get_brand_or_404(brand_id, current_user.id)

    client = get_service_client()
    result = (
        client.table("generations")
        .select("id, image_path, status, created_at, prompt")
        .eq("brand_id", str(brand_id))
        .order("created_at", desc=True)
        .limit(1)
        .execute()
    )

    if not result.data:
        raise _error_response(
            status.HTTP_404_NOT_FOUND,
            "GENERATION_NOT_FOUND",
            "No generation found for this brand",
        )

    row = result.data[0]
    image_url = None
    if row.get("image_path"):
        image_url = (
            f"{settings.SUPABASE_URL}/storage/v1/object/public/"
            f"{settings.STORAGE_BUCKET}/{row['image_path']}"
        )

    return {
        "id": row["id"],
        "status": row.get("status"),
        "prompt": row.get("prompt"),
        "image_url": image_url,
        "created_at": row.get("created_at"),
    }
>>>>>>> Stashed changes
