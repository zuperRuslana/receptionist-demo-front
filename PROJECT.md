# PROJECT.md

## What this is
AI-powered business receptionist — an agent that handles customer 
communication via chat and voice 24/7 for service businesses.
Acts as both support and sales representative.

## Current stage
Prototype. Solo founder. No paying customers yet.

## Architecture
SYSTEM PROMPT (cached on settings save)
├── platformCore        — hard rules (formatting, truthfulness, escalation)
├── salesServiceCore    — sales logic + conversation skills + style toggle
└── buildIdentity       — agent name, business info, tone, greeting
PER MESSAGE (dynamic)
└── selectRelevantKnowledge — services, FAQs, promos from DB

## Tech stack
- Backend: Node.js + Express
- LLM: Claude (Anthropic SDK)
- DB: Supabase (Postgres)
- Frontend: React + Vite + Tailwind
- Hosting: Vercel (frontend), Railway/Render (backend)

## Key files
- `prompts/platformCore.js` — platform-wide rules, never changes per business
- `prompts/salesServiceCore.js` — sales behavior + skills (qualify, book, upsell, escalate, fallback)
- `prompts/buildIdentity.js` — per-business agent identity
- `prompts/selectRelevantKnowledge.js` — per-message knowledge retrieval from DB
- `prompts/generateSystemPrompt.js` — assembles all layers

## Prompt layers explained
Layer 1 (platformCore): formatting rules, truthfulness, escalation, boundaries.
Layer 2 (salesServiceCore): sales logic, needs discovery, style toggle 
  (chill_receptionist / sales_receptionist), conversation skills as XML tags.
Layer 3 (buildIdentity): agent name, business name, contact info, description.
Layer 4 (dynamic): selectRelevantKnowledge pulls relevant services, FAQs, 
  promos per message. Single source of truth = services table in DB.

## Design decisions
- No generateRefinedKnowledge — removed to avoid dual source of truth
- Services come ONLY from selectRelevantKnowledge (per message, from DB)
- Skills are inline in salesServiceCore for now, will modularize into 
  skills/registry.js when adding verticals
- Style toggle is two presets, not free-form — keeps quality consistent
- business.description is a manual field, not LLM-generated

## Current verticals
- Beauty/salon (primary, prototype)
- Home services (planned, week 6-8)
- Accountants (plannes, week 6-8)

## What NOT to do
- Don't add services/prices into system_prompt — they go through selectRelevantKnowledge only
- Don't use markdown formatting in agent responses — plain text only
- Don't create separate prompt files per business — one universal prompt, business data injected