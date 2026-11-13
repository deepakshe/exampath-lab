# ExamPath Lab — The Learning Field Guide

> **Tagline:** LEARN · REMEMBER · SOLVE  
> **Mission:** A modern editorial-style study workspace, digital library, and learning dashboard for Indian government exams (Banking, SSC, Railways, Defence, State Exams).

[![Built with Astro](https://img.shields.io/badge/Built%20with-Astro%205-FF5D01.svg)](https://astro.build)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%20v4-38B2AC.svg)](https://tailwindcss.com)
[![Cloudflare Pages](https://img.shields.io/badge/Deployed%20to-Cloudflare%20Pages%20Free-F38020.svg)](https://pages.cloudflare.com)
[![Budget](https://img.shields.io/badge/Cost-₹0%20(Preserves%20₹2%2C000%20Reserve)-brightgreen.svg)](#budget--infrastructure)

---

## 1. Visual Identity & Editorial Direction

Unlike typical coaching portals with blue navbars and spammy countdown popups, **ExamPath Lab** is designed around **The Learning Field Guide** concept:

- **Background:** Warm Ivory (`#F5F2E9`)
- **Primary Text:** Deep Navy (`#172633`)
- **Secondary Accent:** Teal (`#147D78`)
- **Highlights:** Lime (`#D7EF72`)
- **Attention & Traps:** Warm Amber (`#D98D45`)
- **Typography:** Manrope (Headings), Plus Jakarta Sans (Body), Noto Sans Devanagari (Hindi)

### Distinct Visual Identities Per Subject:
- **English:** Vocabulary · Mnemonics · Grammar (Soft Blue/Navy)
- **Quant:** Concepts · Shortcuts · DI (Teal)
- **Reasoning:** Puzzles · Patterns · Practice (Plum/Indigo)
- **General Awareness:** Static GK · Current Affairs (Amber)
- **Banking Awareness:** RBI · Policy · Terms (Bronze Navy)
- **Computer Awareness:** Hardware · Cyber · Tools (Steel Cyan)

---

## 2. Core Pedagogical Modes

1. `01 — Beginner`: Zero-based foundations, prerequisites, bilingual explanations, and guided practice.
2. `02 — Intermediate`: Standard vs speed methods, mathematically verified shortcuts, and trap warnings.
3. `03 — Revision`: Desi mnemonics, active recall flashcards, and spaced repetition drills.

---

## 3. Project Structure

```
├── database/
│   └── schema-v2.sql                 # Phase 2 SQLite/D1 database schema
├── docs/
│   ├── CLOUDFLARE_DEPLOYMENT.md      # Step-by-step free Cloudflare Pages deployment
│   ├── CONTENT_WORKFLOW.md           # How to add exams, subjects, resources & MCQs
│   └── PAYMENT_FULFILMENT_SOP.md     # Pilot manual fulfillment SOP & security rules
├── public/
│   ├── downloads/
│   │   └── free/
│   │       └── Common-Foundation-Challenge-Day1-3.html  # Free printable study guide
│   ├── robots.txt                    # Search crawler directives
│   └── sitemap.xml                   # Complete static sitemap
├── src/
│   ├── components/
│   │   ├── InteractiveFlashcards.astro # 3D Flip flashcards with FSRS recall grading
│   │   ├── InteractiveQuiz.astro       # Verified MCQs with beginner/fast solutions
│   │   └── InteractiveSearch.astro     # Multi-facet live filtering library search
│   ├── data/
│   │   ├── exams.json                # Exam family taxonomies
│   │   ├── flashcards.json           # High-yield flashcards with desi mnemonics
│   │   ├── learning-paths.json       # 01/02/03 Learning mode curricula
│   │   ├── questions.json            # Verified original questions with traps
│   │   ├── resources.json            # Master bilingual study guides
│   │   ├── site-config.ts            # Brand, navigation, and pilot pricing config
│   │   ├── subjects.json             # Subject taxonomies and visual tokens
│   │   └── weekly-packs.json         # Weekly drops and table of contents
│   ├── layouts/
│   │   └── BaseLayout.astro          # Semantic layout with EN/HI switcher & bookmarks
│   ├── pages/
│   │   ├── 404.astro                 # Dignified not-found page
│   │   ├── about/index.astro         # Editorial manifesto & standards
│   │   ├── contact/index.astro       # Editorial desk contact & inquiry form
│   │   ├── exams/
│   │   │   ├── [slug].astro          # Dynamic exam pages (Banking, SSC, etc.)
│   │   │   └── index.astro           # Exam directory index
│   │   ├── index.astro               # The Learning Field Guide Homepage
│   │   ├── legal/
│   │   │   ├── privacy.astro         # Privacy policy draft
│   │   │   ├── refund.astro          # Refund policy draft
│   │   │   └── terms.astro           # Terms of service draft
│   │   ├── library/
│   │   │   ├── [slug].astro          # Single resource detail & practice page
│   │   │   └── index.astro           # Searchable multi-filter library
│   │   ├── paths/
│   │   │   ├── beginner.astro        # Mode 01 roadmap
│   │   │   ├── intermediate.astro    # Mode 02 roadmap
│   │   │   └── revision.astro        # Mode 03 roadmap
│   │   ├── practice/index.astro      # Interactive active recall drill room
│   │   ├── pricing/index.astro       # Pricing tiers & pilot fulfillment SOP
│   │   ├── subjects/
│   │   │   ├── [slug].astro          # Dynamic subject labs
│   │   │   └── index.astro           # Subject hub
│   │   └── weekly/
│   │       ├── [slug].astro          # Single weekly pack preview & ordering
│   │       └── index.astro           # Weekly drops archive
│   └── styles/
│       └── global.css                # Tailwind 4 + Editorial Design Variables
├── astro.config.mjs                  # Astro configuration
├── package.json
└── tsconfig.json
```

---

## 4. Local Development

Run the following commands in the workspace root:

```bash
# 1. Install dependencies
npm install

# 2. Start local development server
npm run dev

# 3. Build production static bundle (generates to dist/)
npm run build

# 4. Preview the production build locally
npm run preview
```

---

## 5. Deployment Instructions

This website is designed for **Cloudflare Pages Free**:

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: complete ExamPath Lab MVP"
   git remote add origin https://github.com/YOUR_USERNAME/exampath-lab.git
   git push -u origin main
   ```
2. Log in to [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create Application** → **Pages** → **Connect to Git**.
3. Select `exampath-lab`.
4. Build Settings:
   - **Framework preset:** `Astro`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
5. Click **Save and Deploy**. Your site will be globally live at `https://exampath-lab.pages.dev` with instant CDN delivery and zero server maintenance costs!

---

## 6. Budget & Commercial Integrity

- **Development Cost:** ₹0 (Astro, TypeScript, Tailwind CSS)
- **Hosting Cost:** ₹0 (Cloudflare Pages Free Tier)
- **Repository Cost:** ₹0 (GitHub Free)
- **Domain:** Free `*.pages.dev` subdomain initially (Custom domain deferred until validation)
- **Reserve Retained:** Full ₹2,000 budget is preserved intact for future targeted student feedback tests.
