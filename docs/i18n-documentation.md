

## 8. API Error Codes and Frontend Translation

API error responses use a stable machine-readable `error.code` rather than a localized message as the integration contract. The backend returns the error code, the original diagnostic message, and, when available, a `request_id` for tracing. For example:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "language must be one of: ar, en",
    "request_id": "..."
  }
}
```

The backend must not select Arabic or English presentation text. It should preserve the appropriate error code for the condition, such as `VALIDATION_ERROR`, `NOT_FOUND`, or a provider-specific error code, and may include the raw message for logs and fallback behavior. The frontend parses the response in `frontend/lib/api.ts`, keeps the code on `ApiError.code`, and is responsible for resolving the user-facing localized message from the active language dictionary.

When adding a new API error, follow this sequence:

1. Add or reuse a stable uppercase error code in the backend response.
2. Keep the code independent of the user-facing language; never use translated text as the code.
3. Add the matching key to both `frontend/public/locales/en.json` and `frontend/public/locales/ar.json`.
4. Render the translated frontend message, while retaining `request_id` for support and debugging.

This separation keeps API behavior stable for clients and allows the frontend to switch between Arabic and English without requiring backend changes.
