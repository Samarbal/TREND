# Caption Generation Contract — S3-13

S3-13 defines the validated request and response boundary for caption
generation.

It does not call a text provider, persist captions, or expose an HTTP endpoint
yet. Those concerns belong to the following implementation stories.

## Request

```json
{
  "language": "ar",
  "platform_preset": "instagram_post",
  "preferences": {
    "tone": "friendly",
    "include_cta": true,
    "include_emojis": false,
    "max_hashtags": 5,
    "extra_notes": "ركز على العرض الحالي"
  }
}