# TRENDY AI Design System v1

## Design direction

TRENDY AI is Arabic-first and RTL-first. The visual language is editorial, premium, calm, warm, and practical. The interface uses cream as the main canvas, charcoal for strong contrast, and burgundy as the primary action color.

## Color tokens

| Token | Suggested value | Usage |
|---|---|---|
| `trendy-cream` | `#F7F0DF` | Main page background |
| `trendy-cream-dark` | `#EDE1C7` | Section separation and soft panels |
| `trendy-surface` | `#FFFDF7` | Cards and form surfaces |
| `trendy-charcoal` | `#171717` | Dark sections, navigation, strong contrast |
| `trendy-charcoal-soft` | `#252525` | Secondary dark surfaces |
| `trendy-burgundy` | `#9F1D20` | Primary CTA, active states, important emphasis |
| `trendy-burgundy-hover` | `#7F171A` | Hover and pressed state |
| `trendy-text` | `#1A1A1A` | Main text on light surfaces |
| `trendy-muted` | `#6B6257` | Secondary text |
| `trendy-border` | `#D8CDBB` | Borders and separators |

These values are a starting palette. Final contrast must be checked before production use.

## Typography

Use a readable Arabic sans-serif for normal interface text and an editorial display face for large headings. The display font should be used sparingly: hero headings, page headings, and selected emphasis only. Body text, labels, helper text, and validation messages must remain highly readable.

## Layout principles

The interface uses generous whitespace, clear cards, short sections, rounded controls, and a strong distinction between primary and secondary actions. Large dark sections are used for emphasis, not for every screen.

## RTL rules

Arabic is the default direction. Use logical CSS properties such as `margin-inline-start`, `padding-inline-end`, and `inset-inline-end` where possible. Do not solve RTL by duplicating every component. Icons that express direction, such as arrows, must be reviewed individually.

## Component rules

Primary buttons use burgundy. Secondary buttons use a light surface with a visible border. Destructive actions must not use the primary burgundy token. Error states need a semantic error color separate from the brand action color.

## Brand accent rule

A customer's Brand Kit color may appear as a workspace accent. It must not overwrite the TRENDY AI product palette globally. The application brand and the customer's brand are two different layers.

## Landing Page reference

The provided reference uses a cream hero, a dark feature section, cream content sections, dark footer, Arabic RTL copy, mockups, compact cards, and burgundy CTAs. The dashboard should borrow the visual language without copying the landing-page layout literally.

## Color layering decision

TRENDY AI has two visual layers:

1. Product theme: a stable Arabic editorial theme based on cream, charcoal, and burgundy. It is used for the global application background, navigation, primary actions, cards, and product-level sections.
2. Customer brand accent: the first valid color from the selected Brand Kit. It is used as a workspace accent for active states, focus rings, subtle fills, secondary highlights, and brand-aware controls.

The customer brand accent must not replace the global product background, body text, or large surfaces. This prevents low contrast and keeps TRENDY AI visually consistent across brands.

The existing `BrandWorkspace` mechanism remains responsible for dynamic accent variables. Product tokens remain static. Domain terms such as `brand`, `brand_id`, and `BrandKit` remain unchanged.

## Acceptance examples

- A brand with a dark navy color still sees the TRENDY AI cream application background.
- The selected navy color appears in workspace accents, focus rings, and selected states.
- A light brand color automatically receives a readable foreground color.
- A brand with no color uses the TRENDY AI default accent.

