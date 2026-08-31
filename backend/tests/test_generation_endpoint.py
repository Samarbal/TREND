import pytest
from uuid import UUID, uuid4
from unittest.mock import AsyncMock, MagicMock
from fastapi.testclient import TestClient

from app.main import app
from app.core.auth import User, get_current_user
from app.routers import generations
from app.models.generation import GenerateRequest, ProviderEnum, PlatformPresetEnum, LogoModeEnum

# Sample valid brief for the payload
VALID_BRIEF = {
    "campaign_goal": "product_launch",
    "content_type": "product_showcase",
    "target_audience": {
        "segments": ["small_business_owners"],
        "location": "Amman",
        "age_range": "25_34",
        "gender_focus": "all",
        "details": "أصحاب مشاريع صغيرة.",
    },
    "core_idea": "إطلاق قهوة باردة لصباح صيفي مزدحم.",
    "voice_tone": "friendly",
    "optional_notes": "اترك مساحة في الأعلى.",
    "text_to_include": "خصم 20%",
}

# Fake objects for Supabase mocking
class FakeStorageBucket:
    def __init__(self):
        self.uploaded_files = {}

    def upload(self, path, data, options=None):
        self.uploaded_files[path] = data
        return {"path": path}

    def download(self, path):
        return b"fake-logo-bytes"

class FakeStorage:
    def __init__(self):
        self.bucket = FakeStorageBucket()

    def from_(self, bucket_name):
        return self.bucket

class FakeQuery:
    def __init__(self, table_name, client):
        self.table_name = table_name
        self.client = client
        self._eq_filters = {}

    def insert(self, data):
        data = data.copy()
        if "created_at" not in data:
            from datetime import datetime, timezone
            data["created_at"] = datetime.now(timezone.utc).isoformat()
        self.client.inserted_rows[self.table_name].append(data)
        self.client.last_row = data
        return self

    def update(self, data):
        self.client.updated_rows[self.table_name].append(data)
        if self.client.last_row:
            self.client.last_row.update(data)
        return self

    def eq(self, field, value):
        self._eq_filters[field] = value
        return self

    def execute(self):
        # Return a response containing the mock row
        row = self.client.last_row or {}
        return MagicMock(data=[row])

class FakeSupabaseClient:
    def __init__(self):
        self.inserted_rows = {"generations": [], "provider_keys": []}
        self.updated_rows = {"generations": [], "provider_keys": []}
        self.storage = FakeStorage()
        self.last_row = None

    def table(self, table_name):
        return FakeQuery(table_name, self)

@pytest.fixture
def mock_supabase(monkeypatch):
    fake_client = FakeSupabaseClient()
    monkeypatch.setattr(generations, "get_service_client", lambda: fake_client)
    return fake_client

@pytest.fixture
def override_auth():
    # Override authentication dependency to bypass actual JWT validation
    app.dependency_overrides[get_current_user] = lambda: User(
        id="user-123", email="user@example.com", access_token="mock-token"
    )
    yield
    app.dependency_overrides.pop(get_current_user, None)

@pytest.fixture
def mock_helpers(monkeypatch):
    # Mock database helper calls
    monkeypatch.setattr(generations, "_get_brand_or_404", lambda brand_id, user_id: {
        "id": str(brand_id),
        "name": "Acme Brand",
        "logo_path": "brands/logo.png"
    })
    monkeypatch.setattr(generations, "_get_active_key_or_400", lambda brand_id, provider: {
        "id": "key-abc",
        "vault_secret_id": "secret-123"
    })
    monkeypatch.setattr(generations, "_get_brand_kit_context", lambda brand_id, brand_name: None)
    monkeypatch.setattr(generations, "read_secret", lambda secret_id: "fake-api-key")

@pytest.mark.asyncio
async def test_generate_endpoint_success_openai(override_auth, mock_supabase, mock_helpers, monkeypatch):
    # Mock OpenAI provider image generation
    from app.services.providers.base import ProviderResult
    mock_result = ProviderResult(image_bytes=b"fake-image-bytes", request_id="req-123")
    mock_openai = AsyncMock(return_value=mock_result)
    monkeypatch.setattr(generations, "openai_generate", mock_openai)
    monkeypatch.setattr(generations, "resize_to_preset", lambda image_bytes, preset_w, preset_h: image_bytes)

    # Trigger endpoint
    client = TestClient(app)
    brand_id = uuid4()
    payload = {
        "brief": VALID_BRIEF,
        "provider": "openai",
        "platform_preset": "instagram_post",
        "logo_mode": "none"
    }
    
    response = client.post(f"/brands/{brand_id}/generate", json=payload)
    
    assert response.status_code == 200
    res_data = response.json()
    assert res_data["status"] == "succeeded"
    assert res_data["provider"] == "openai"
    assert res_data["prompt"] == VALID_BRIEF["core_idea"]  # Verifies S2-BE-04: prompt column gets core_idea
    
    # Ensure insertion happened with core_idea under prompt
    assert len(mock_supabase.inserted_rows["generations"]) == 1
    inserted = mock_supabase.inserted_rows["generations"][0]
    assert inserted["prompt"] == VALID_BRIEF["core_idea"]
    assert inserted["logo_mode"] == "none"

@pytest.mark.asyncio
async def test_generate_endpoint_validation_error(override_auth, mock_helpers):
    client = TestClient(app)
    brand_id = uuid4()
    
    # Payload is missing required field 'brief'
    payload = {
        "provider": "openai",
        "platform_preset": "instagram_post",
    }
    
    response = client.post(f"/brands/{brand_id}/generate", json=payload)
    assert response.status_code == 400
    res_data = response.json()
    assert res_data["error"]["code"] == "VALIDATION_ERROR"

@pytest.mark.asyncio
async def test_generate_endpoint_logo_required_check(override_auth, mock_supabase, monkeypatch):
    # Mock brand has no logo
    monkeypatch.setattr(generations, "_get_brand_or_404", lambda brand_id, user_id: {
        "id": str(brand_id),
        "name": "No Logo Brand",
        "logo_path": None
    })
    
    client = TestClient(app)
    brand_id = uuid4()
    
    # Requesting a watermark logo mode when brand has no logo
    payload = {
        "brief": VALID_BRIEF,
        "provider": "openai",
        "platform_preset": "instagram_post",
        "logo_mode": "watermark"
    }
    
    response = client.post(f"/brands/{brand_id}/generate", json=payload)
    assert response.status_code == 400
    res_data = response.json()
    assert res_data["error"]["code"] == "LOGO_REQUIRED"
