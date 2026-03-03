# TODAY DECODE: STRATEGIC MASTER DIRECTIVE
## Version 1.0 - Operational Standards

This document is the absolute source of truth for all development on the Today Decode platform. Any AI assistant working on this project must adhere to these rules without exception.

---

### 1. BRAND IDENTITY & TONALITIES
- **Identity:** Today Decode is a Global Think Tank and Strategic Risk Advisory. 
- **Rule:** Never refer to it as a "blog" or "spy agency." Use "Strategic Archive," "Analysis Desk," or "Executive Overview."
- **Aesthetic:** High-end, institutional, academic, and professional. NO "tactical glows" in the Admin Workspace.

### 1.1. INSTITUTIONAL IDENTITY & LINGUISTICS
- **Positioning:** Today Decode is a Global Think Tank and Strategic Risk Advisory.
- **Forbidden Vocabulary:** Never use "Intelligence," "Mission Control," "Covert," or "Tactical Agency" jargon.
- **Authorized Vocabulary:** Use "Strategic Analysis," "Research Desk," "Institutional Insight," "Risk Assessment," "Academic Oversight," and "Strategic Archive."
- **Tone:** Academic, clinical, authoritative, and professional.

### 1.2. TERMINOLOGY PIVOT:
- 'Strategic Archive' (formerly Intelligence Vault)
- 'Analysis Desk' (formerly Intelligence Hub)
- 'Strategic Oversight' (formerly Mission Control)
- 'Publish Analysis' (formerly Commit Manifest)
- 'Create Report' (formerly Initialize Node)
- 'Strategic Silo' (formerly Intelligence Sector)
- 'Analyst Profile' (formerly Identity Nexus)
- 'Strategic Parameters' (formerly Operational Metrics)
- 'Global Risk Analysis' (formerly Intelligence Briefing)
- 'Strategic Assessment' (formerly Intel Scan)

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

### 2.2. THE ZERO-BLEED THEME POLICY (HARDENED)
- **Dark Mode Purity:** All sections must use #0A0F1E (Base) or #111827 (Surface). Any #FFFFFF (White) in dark mode is a critical error.
- **Light Mode Purity:** All sections must transition to #F8FAFC (Paper) or #FFFFFF (White). No dark navy blocks are permitted unless they are high-contrast primary buttons.
- **Contrast Ratios:**
  - Dark Mode: Primary Text #F1F5F9 (Slate-100), Secondary Text #94A3B8.
  - Light Mode: Primary Text #0F172A (Ink), Secondary Text #475569.
- **Hero-Map Integration:** The Global Risk Map must sit within the Top Hero section as a contextual visual for the "Global Risk Assessment."

### 2.3. THEME TOGGLE:
- Must be persistent and switch between 'dark' and 'light' classes globally.
- Admin Panel must have high-contrast buttons (e.g., Deep Slate in light mode) to ensure visibility.

### 2.1. THE SOVEREIGN UI CONTRAST STANDARD (HARDENED)
- **No Ghost UI:** All interactive elements (Inputs, Selects, Modals) must have a clearly defined 1px border. 
- **No Block Highlights:** Headers must never use background color blocks behind text. Use two-tone typography for emphasis to ensure 100% readability in both themes.
- **Light Mode Labels:** Primary labels must use #1E293B (Slate-800) or #0F172A (Ink) for absolute readability.
- **Input Surfaces:**
  - **Light Mode:** White background (#FFFFFF), #CBD5E1 borders, and #0F172A text.
  - **Dark Mode:** Deepest Navy (#020617) background, #1E293B borders, and #F1F5F9 text.
- **Action Footers:** Every modal/form must have a high-contrast 'Commit' button (e.g., solid Black/Navy in light mode) and a distinct 'Abort' action.
- **Accessibility:** Ensure a minimum 4.5:1 contrast ratio for all descriptive text. No "pale grey" on white.

### 3. SEO & ROUTING SOVEREIGNTY (CRITICAL)
- **Trailing Slashes:** Every internal URL and canonical tag MUST end with a `/`.
- **Slug Automation:** All slugs must be generated automatically from the Primary Headline. 
- **Formatting:** Slugs must be lowercase, hyphenated, and stripped of special characters.
- **Enforcement:** The system must automatically append the trailing slash `/` before saving to the database.
- **Indexing:** Every public page must contain `<meta name="robots" content="index, follow">`.
- **Canonicals:** Every page must have a dynamic `<link rel="canonical" href="...">`.
- **URLs:** All URLs must be nested: `todaydecode.com/[category]/[slug]/`.

### 4. ARCHITECTURAL DECOUPLING
- **Admin vs. Frontend:** The Admin Workspace (`/admin/`) must be completely decoupled from the Frontend. 
- **Admin Design:** Professional, clean, and data-centric. NO tactical glows or red alerts unless it's a critical system error.
- **Frontend Design:** Tactical, high-contrast, featuring data-visualizations (Maps, Gauges).

### 4.1. COMPONENT ARCHITECTURE & DATA INTEGRITY
- **Footer Sovereignty:** The Footer component must reside EXCLUSIVELY in the Root Layout (`src/app/layout.tsx`). It must never be called individually within page-level components to prevent duplication.
- **Content Resilience:** Homepage sections (Featured Analysis, Scenario Modeling) must gracefully handle "No Data" states without breaking the theme.
- **Section Transitions:** Every section on the homepage must use CSS variables for backgrounds to ensure zero "white-space bleed" in Dark Mode.

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
