# TRENDY AI

Multi-brand social image generator. Built with Next.js 14, FastAPI, and Supabase.

## Project overview

**TRENDY AI** is an Arabic-first brand studio for small businesses, creators, marketers, and agencies that need consistent, professional visual content for social media. Instead of asking users to write complex AI prompts from scratch, the product remembers each brand's identity and guides the user through a structured campaign brief. It then combines the brief, Brand Kit, platform requirements, logo rules, and selected AI provider to produce a platform-ready visual asset.

The product is designed around a simple idea: **the output should look like it belongs to the brand, not like a generic AI-generated image**. Each workspace can contain one or more brands, and every brand can have its own name, tagline, tone, audience, colors, logo, and visual directions to follow or avoid. This context is reused across generations so that the user does not have to repeat the same instructions for every campaign.

## The problem TRENDY AI solves

Many small businesses know what they want to communicate but do not have a designer, a prompt engineer, or a repeatable content-production process. Generic image-generation tools often produce inconsistent results because the prompt is incomplete, the brand identity is missing, and the final composition is not adapted to the target platform. TRENDY AI turns this open-ended task into a guided workflow that is easier to use, easier to repeat, and easier to scale.

## How the product works

1. The user signs in and creates or selects a brand workspace.
2. The user completes the Brand Kit with the brand identity, colors, logo, audience, tone, and visual rules.
3. The user starts a generation and answers a structured campaign questionnaire covering the campaign goal, target audience, content type, core idea, voice, platform format, and optional notes.
4. TRENDY AI validates the brief and shows the user a preview before generation.
5. The system compiles a provider-ready instruction that respects the campaign brief, Brand Kit, platform dimensions, safe areas, language, and logo mode.
6. The selected AI provider generates the visual, and TRENDY AI stores the result in the brand's history for later review and download.

## Main capabilities

| Capability | Description |
|---|---|
| Multi-brand workspaces | Manage several brands while keeping each brand's identity and generated assets separate. |
| Brand Kit | Store the brand name, tagline, tone, audience, colors, logo, and visual directions. |
| Structured generation brief | Guide the user through campaign goal, audience, content type, core idea, voice, and notes instead of relying on one vague prompt. |
| Platform-ready formats | Generate compositions for supported social platforms and aspect ratios, with dimensions and safe-area rules applied. |
| Logo controls | Choose whether the logo is omitted, included, or used as a watermark when a valid logo is available. |
| AI provider keys | Support provider credentials securely on the server side, with provider validation and key management. |
| Generation history | Keep generated assets associated with the correct brand for review and reuse. |
| Arabic-first experience | Prioritize Arabic content and RTL-friendly product behavior, with foundations for Arabic and English support. |
| Extensible architecture | Use a Next.js frontend, FastAPI backend, Supabase database/storage, and provider adapters that can grow over time. |

## Business model and API-key options

TRENDY AI is intended to become a commercial SaaS product. The cost of image generation is paid to the selected AI provider, so the product can offer two clear operating modes:

### 1. Managed generation credits

The customer pays TRENDY AI through a subscription or prepaid credit package. TRENDY AI manages the provider account, pays the provider usage cost, and deducts credits according to the model, resolution, and generation type. This is the simplest experience for customers who do not want to configure technical credentials.

Possible commercial tiers include a free trial with limited generations, a monthly plan for small businesses, a higher-volume plan for agencies, and a custom enterprise plan. Exact prices, limits, payment gateway, invoices, refunds, and tax handling are business decisions to be finalized before launch.

### 2. Bring Your Own API Key (BYOK)

Customers can connect their own supported provider API key from the Keys section. In this mode, the customer pays the AI provider directly, while TRENDY AI charges only for the product experience if the selected plan requires it. This option gives advanced users more control over provider billing, quotas, models, and usage limits.

API keys must never be exposed to the browser or stored as plain text. They should be validated server-side, encrypted or stored through Supabase Vault, and used only for authorized generations belonging to the customer's brand. The interface should clearly show which provider is connected, whether the key is valid, and that provider charges are paid by the key owner.

| Mode | Who pays the AI provider? | Best for | TRENDY AI revenue |
|---|---|---|---|
| Managed credits | TRENDY AI | Beginners and customers who want a ready-to-use experience | Subscription and/or credit margin |
| BYOK | The customer | Technical users, agencies, and customers with an existing provider account | Product subscription, workspace fee, or optional usage fee |

The future billing layer can support both modes without changing the core generation flow. The generation record should retain the selected provider, billing mode, model, and usage metadata so that limits, reporting, and customer support can be implemented safely.

## Target customers and use cases

The initial market is Arabic-speaking small businesses and creators, especially brands in perfumes, clothing, abayas, cosmetics, retail, food, hospitality, and local services. Agencies can use the multi-brand workflow to manage several customer brands from one account. Typical use cases include product launches, promotional offers, seasonal campaigns, brand-awareness posts, lead-generation creatives, and social-proof content.

## Product status and roadmap boundary

The current project focuses on the brand workspace, Brand Kit, structured generation flow, provider-key management, image generation, storage, and history. Payments, subscriptions, invoices, credit accounting, and a production billing gateway are commercial roadmap items and should be implemented as a separate billing layer. The product description therefore treats managed credits and BYOK as the intended business model, not as a claim that a complete payment system is already enabled in this repository.

## Quick Start (Docker)

Get the app running in 5 steps. You need **Docker**, **Node.js/npm** (for the Supabase CLI in step 4), and a **Supabase project**.

### 1. Clone and enter the repo

```bash
git clone <repo-url> && cd TREND
```

### 2. Get your Supabase credentials

From the [Supabase Dashboard](https://supabase.com/dashboard) → your project → **Settings → API**, grab:

| Value | Where to find it |
|-------|-----------------|
| **Project URL** | Settings → API (e.g. `https://xxxxx.supabase.co`) |
| **Publishable key** | Settings → API → Project API keys |
| **Secret key** | Settings → API → Project API keys (reveal) |

### 3. Create your env files

```bash
# Backend
cp backend/.env.example backend/.env

# Frontend
cp frontend/.env.local.example frontend/.env.local
```

Edit **`backend/.env`** — fill in Supabase values:

```bash
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
```

Edit **`frontend/.env.local`** — fill in URL and publishable key:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
```

### 4. Set up the database

Install the [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started), then log in and push migrations:

```bash
supabase login
supabase link --project-ref <your-project-ref>
supabase db push
```

> **Where is my project ref?** It's in your Supabase Dashboard URL: `supabase.com/dashboard/project/<project-ref>`

Then create the **`brand-assets`** storage bucket in the Dashboard → **Storage → New bucket**:
- **Public bucket**: Yes
- **File size limit**: 5 MB
- **Allowed MIME types**: `image/png, image/jpeg, image/webp`

Finally, configure auth redirects in the Dashboard → **Authentication → URL Configuration**:
- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: add `http://localhost:3000/auth/confirm`

### 5. Build and run

```bash
make up
```

The app is now running at **http://localhost:3001**.

Check health: `make health` | View logs: `make logs`

> **Port**: The app is mapped to host port `3001` by default. Override with `make up APP_PORT=<port>`. If you change the port, also update `CORS_ORIGINS` in `backend/.env` to match.

---

## Local Development (without Docker)

For active development with hot-reload, run the backend and frontend directly.

### Prerequisites

- Node.js 18+
- Python 3.13+
- [Supabase CLI](https://supabase.com/docs/guides/cli/getting-started)

### Backend

```bash
cd backend
cp .env.example .env   # fill in Supabase credentials (see step 2 above)
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend

```bash
cd frontend
cp .env.local.example .env.local   # fill in Supabase credentials (see step 2 above)
npm install
npm run dev
```

## Makefile Commands

| Command | Description |
|---------|-------------|
| `make build` | Build Docker image |
| `make up` | Build and run container |
| `make down` | Stop and remove container |
| `make logs` | Tail container logs |
| `make restart` | Restart container |
| `make shell` | Shell into running container |
| `make health` | Check container health |
| `make clean` | Remove container and image |
| `make dev` | Show local dev instructions |
| `make dev-backend` | Run backend locally |
| `make dev-frontend` | Run frontend locally |
| `make lint` | Lint backend + frontend |
| `make test` | Run backend tests |

See [docs/docker.md](docs/docker.md) for full Docker/deployment details.
