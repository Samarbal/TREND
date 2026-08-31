# AI Prompt Pipeline Specifications (v1)

This document specifies the structured prompt template layers and formatting rules used to compile the complete visual instruction prompt for generating brand images.

## Structure Layers

The prompt is composed of six distinct, sequential sections, each demarcated by clear section headers (e.g., `=== SECTION NAME ===`).

### 1. SYSTEM ROLE
Defines the persona and basic layout constraints for the AI image generator:
```text
You are a professional social media image designer.
Create a high-quality image following these specifications.
The bracketed section headers (lines wrapped in === ===) are instructions for you only — never reproduce them, the section names, or any of this metadata as visible text inside the image.
```

### 2. CAMPAIGN BRIEF
Translates the structured `GenerationBrief` inputs into readable, human-like instructions for the model:
- **Campaign Goal**: Mapped from the campaign goal key to a clear statement (e.g., `"Communicate a product or service launch."`).
- **Content Type**: Mapped to describe the nature of the image (e.g., `"Design a product showcase image."`).
- **Target Audience**: Descriptive sentence summarizing the segments, location, age range, gender focus, and additional details.
- **Core Idea**: Mapped directly from the user's `core_idea` text (preserved in its original language).
- **Text to Include**: Explicit instruction specifying text that should be rendered on the image, if provided.
- **Optional Notes**: Extra design notes or styling constraints (e.g., `"Avoid bright colors."`).

### 3. BRAND IDENTITY
Applies the context of the brand kit (if available):
- **Brand Name**: `"Brand: [Name]"`
- **Tagline**: `"Tagline: [Tagline]"`
- **Visual Style**: Derived from the brand kit tone (mapped to visual descriptions).
- **Target Audience Guidelines**: Dominant brand guidelines based on demographic profile.
- **Brand Colors**: Mapped colors (e.g. `"Brand colors: #1E3A8A, #3B82F6 — incorporate these as the dominant palette."`).
- **Avoid Words**: Words or concepts to exclude from visual elements.

### 4. COMPOSITION / PLATFORM
Layout guidelines specific to the requested social media platform preset (e.g., safe zones, aspect ratio notes, grid tile behavior):
```text
=== COMPOSITION ===
[Platform-specific composition note, e.g., "Square 1:1 format. Design should work as a grid tile — keep key content centered."]
```

### 5. LOGO RULES
Logical positioning and watermark instructions if the brand has an uploaded logo and logo mode requires placing it:
```text
=== LOGO ===
Include the brand logo in the design — place it in a corner or integrate it naturally into the composition. Ensure it is clearly visible but does not dominate the scene.
```

### 6. OUTPUT RULES
Strict instruction reminding the model not to write headers or section titles inside the image:
```text
=== OUTPUT RULES ===
- Do NOT render the section headers (like === SYSTEM ROLE ===, === CAMPAIGN BRIEF ===, etc.) in the image.
- Avoid rendering any metadata, variable names, or prompt instructions as visible text on the image canvas.
- Only render textual elements explicitly requested in the "Text to Include" section.
```
