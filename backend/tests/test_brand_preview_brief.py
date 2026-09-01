from uuid import uuid4

from fastapi.testclient import TestClient

from app.core.auth import User
from app.main import app
from app.routers import brands as brands_router


def test_preview_brand_brief_returns_creative_direction(monkeypatch):
    brand_id = str(uuid4())
    fake_brand = {
        "id": brand_id,
        "name": "Acme",
        "logo_path": None,
        "updated_at": "2024-01-01T00:00:00Z",
    }

    class FakeQuery:
        def __init__(self, data):
            self.data = data

        def select(self, *args, **kwargs):
            return self

        def eq(self, *args, **kwargs):
            return self

        def maybe_single(self):
            return self

        def execute(self):
            return self

    class FakeClient:
        def table(self, table_name):
            if table_name == "brands":
                return FakeQuery(fake_brand)
            return FakeQuery([])

    monkeypatch.setattr(brands_router, "get_service_client", lambda: FakeClient())
    app.dependency_overrides[brands_router.get_current_user] = lambda: User(
        id="user-123",
        email="user@example.com",
        access_token="test-token",
    )

    with TestClient(app) as client:
        response = client.post(
            f"/brands/{brand_id}/preview-brief",
            json={
                "brief": {
                    "campaign_goal": "brand_awareness",
                    "content_type": "product_showcase",
                    "target_audience": {
                        "segments": ["startup founders"],
                        "location": "UAE",
                        "age_range": "25-40",
                        "gender_focus": "women",
                        "details": "tech-savvy shoppers",
                    },
                    "core_idea": "Show our premium coffee experience",
                    "voice_tone": "friendly",
                    "optional_notes": "Clean and premium",
                    "text_to_include": "Freshly brewed",
                },
                "platform_preset": "instagram_post",
            },
        )

    assert response.status_code == 200
    payload = response.json()
    assert payload["brand_name"] == "Acme"
    assert payload["creative_direction"]["campaign_goal"] == "brand_awareness"
    assert payload["creative_direction"]["platform"]["name"] == "instagram_post"
    assert "startup founders" in payload["creative_direction"]["target_audience"]

    app.dependency_overrides.pop(brands_router.get_current_user, None)
