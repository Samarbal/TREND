# TRENDY AI — Product Brief

## Product name

The official product name is **TRENDY AI**. The name is written in uppercase in the logo and headings. In normal sentences, the team may write “TRENDY AI”. Do not rename domain concepts such as `brand`, `brand_id`, `BrandKit`, or `Generation`; those describe the business model and are not the product name.

## One-line description

TRENDY AI helps Arabic-speaking creators and small businesses turn a structured campaign brief and brand identity into platform-ready visual content.

## Problem

Users often know what they want to communicate but do not know how to write a strong image-generation prompt. A single open-text prompt creates inconsistent results and places too much responsibility on the user.

## Product promise

TRENDY AI asks a few clear questions, remembers the selected brand identity, and turns the answers into a detailed provider-ready prompt while keeping the user in control of the final brief.

## Primary users

The first target users are Arabic-speaking small-business owners, creators, marketers, and teams that need consistent social-media visuals without becoming prompt-engineering experts.

## Product personality

TRENDY AI is Arabic-first, editorial, calm, practical, premium, and friendly. It should feel like a creative studio, not like a technical dashboard.

## Primary user journey

1. The user signs in.
2. The user creates or selects a brand.
3. The user completes enough of the Brand Kit to establish identity.
4. The user answers the campaign questionnaire.
5. The user reviews the brief that will be sent to the AI provider.
6. The user chooses platform, provider, and logo mode.
7. TRENDY AI generates and stores the result.

## MVP for the next three sprints

The MVP includes rebranding the application to TRENDY AI, a structured generation questionnaire, backend prompt compilation, a shorter onboarding path, Arabic/English translation foundations, and regression tests.

## Out of scope for Sprint 0–3

Google Trends automation, scheduled publishing, social-media account integrations, payments, team collaboration, advanced image editing, and a complete redesign of the existing generation provider adapters are outside the current scope.

## Success signals

The team should be able to explain the generation flow in one diagram, a new user should know what to do next, the backend should receive a predictable JSON brief, and the same brief should produce a reproducible prompt version.

## Naming rules

Use `TRENDY AI` for product-facing text. Keep `brand` for a customer brand inside the domain model. Use `campaign_goal`, `target_audience`, `content_type`, `core_idea`, `voice_tone`, and `optional_notes` for the new generation brief.