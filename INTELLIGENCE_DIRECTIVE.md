# TODAY DECODE: STRATEGIC MASTER DIRECTIVE
## Version 1.0 - Operational Standards

This document is the absolute source of truth for all development on the Today Decode platform. Any AI assistant working on this project must adhere to these rules without exception.

---

### 1. BRAND IDENTITY & TONALITIES
- **Identity:** Today Decode is a Geopolitical Intelligence Firm and Risk Advisory platform. 
- **Rule:** Never refer to it as a "blog" or "news site." Use "Intelligence Vault," "War Room," or "Analysis Desk."
- **Aesthetic:** High-end, institutional, and tactical.

### 2. DESIGN SYSTEM (THE "ANTI-GREY" SHIELD)
To prevent theme regressions, the following tokens are non-negotiable:

**DARK MODE (The Command Center):**
- Base Background: #0A0F1E (Deep Navy)
- Surface/Cards: #111827 (Navy Slate)
- Borders: #1E293B
- Accents: #FF4B4B (Risk), #22D3EE (Tech Cyan)

**LIGHT MODE (The Whitepaper):**
- Base Background: #F8FAFC (Clean Paper)
- Surface/Cards: #FFFFFF (White)
- Borders: #E2E8F0
- Primary Text: #0F172A (Deep Ink)

**THEME TOGGLE:**
- Must be persistent and switch between 'dark' and 'light' classes globally.
- Admin Panel must have high-contrast buttons (e.g., Deep Slate in light mode) to ensure visibility.

### 3. SEO & ROUTING SOVEREIGNTY (CRITICAL)
- **Trailing Slashes:** Every internal URL and canonical tag MUST end with a `/`.
- **Indexing:** Every public page must contain `<meta name="robots" content="index, follow">`.
- **Canonicals:** Every page must have a dynamic `<link rel="canonical" href="...">`.
- **URLs:** All URLs must be nested: `todaydecode.com/[category]/[slug]/`.

### 4. ARCHITECTURAL DECOUPLING
- **Admin vs. Frontend:** The Admin Workspace (`/admin/`) must be completely decoupled from the Frontend. 
- **Admin Design:** Professional, clean, and data-centric. NO tactical glows or red alerts unless it's a critical system error.
- **Frontend Design:** Tactical, high-contrast, featuring data-visualizations (Maps, Gauges).

### 5. TECHNICAL STANDARDS
- **Framework:** Next.js (App Router), TypeScript, Prisma, Neon (PostgreSQL), Tailwind CSS.
- **CRUD:** All management operations must use Next.js Server Actions with Zod validation.
- **AEO/GEO:** Every article must include structured FAQ data and AI-extractable summary blocks.

---

### 6. PRE-FLIGHT VERIFICATION CHECKLIST
Before suggesting any code, the AI must verify:
1. Does the URL logic enforce the trailing slash?
2. Does the design adhere to the #0A0F1E navy base or #F8FAFC paper base?
3. Is the Admin UI isolated from Frontend tactical elements?
4. Are all public routes set to 'index, follow'?
