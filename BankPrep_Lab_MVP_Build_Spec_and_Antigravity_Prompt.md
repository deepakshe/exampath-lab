# BankPrep Lab — MVP Build Specification

**Version:** 1.0  
**Product direction:** Multi-exam government-exam learning library  
**Interface/content language:** Bilingual (English + Hindi explanations)  
**Access model:** Free core library + paid premium weekly packs  
**Budget ceiling:** ₹2,000  
**Initial hosting:** Cloudflare Pages Free + GitHub Free  
**Status:** Build specification; no payment gateway or domain should be purchased before validation.

---

## 1. Product definition

BankPrep Lab is a mobile-first learning and revision library for Indian government-exam aspirants. It helps learners choose what to study, understand concepts, remember facts, solve questions efficiently and revise systematically.

### Core promise

**What to study → How to understand → How to remember → How to solve → How to revise.**

The platform is not just a PDF dump. Every resource must be tagged by exam, subject, topic, difficulty, learning level and last-reviewed date.

### Audience and exam taxonomy

The architecture should support:

- Banking: SBI PO, SBI Clerk, IBPS PO, IBPS CSA/Clerk, RRB PO, RRB Office Assistant, RBI Assistant.
- SSC: CGL, CHSL, MTS, GD and other SSC exams.
- Railways: RRB NTPC, Group D and relevant railway exams.
- Defence: NDA, CDS, Agniveer and other relevant recruitment exams.
- State government: state-specific exams, only when the syllabus and facts have been verified.
- Other government exams: extensible category for later additions.

**Important scope rule:** The site navigation and data model may support all these exam families, but the launch must not claim that every exam syllabus is fully covered. Publish a resource only for the exams it has actually been checked against. Do not launch UPSC-specific claims or state-specific current affairs without dedicated verification.

### Subject taxonomy

1. English: vocabulary, roots, synonyms/antonyms, idioms, phrasal verbs, grammar, cloze test, error spotting, reading comprehension.
2. Quantitative Aptitude: number system, simplification, percentage, ratio, average, profit/loss, SI/CI, time/work, speed/distance, mixture, DI, number series.
3. Reasoning: inequality, syllogism, direction, blood relation, ranking, coding-decoding, alphanumeric series, seating arrangement, puzzles, input-output.
4. General Awareness: current affairs, static GK, history, geography, polity, economy, science, important days, awards, reports, appointments.
5. Banking & Financial Awareness: RBI, banking terms, financial institutions, schemes, monetary policy, payment systems.
6. Computer Awareness: fundamentals, hardware/software, internet, networking, cybersecurity, office tools.

Subjects can be enabled gradually. Do not fill empty categories with invented or low-quality material.

## 2. Learner modes

Every learning resource should support one or more of these modes:

- **Beginner:** zero-based explanation, prerequisite concepts, worked examples, simple language, guided practice.
- **Intermediate:** exam-level patterns, standard methods, alternate/short methods, traps and timed questions.
- **Revision:** quick notes, flashcards, mnemonics, mixed MCQs, spaced recall and mistake review.

For Quant and Reasoning, show the beginner method first. Show a shortcut only if it is mathematically valid and explain the condition under which it works. Never label a method “fastest” unless tested and appropriate for the question type.

For English vocabulary, each word should include meaning, pronunciation/helpful syllable break where appropriate, synonyms, antonyms, an original memory hook, one natural example and a recall question. Do not force a mnemonic where it makes recall worse.

For GA/current affairs, include source, source URL, event date (if relevant), publication date, date verified and last-reviewed date.

## 3. MVP boundaries (do not overbuild)

### Build now

- Responsive static website with fast navigation.
- Home page with exam selector, subject cards, latest resources and learning paths.
- Exam directory and exam detail pages.
- Subject directory and subject detail pages.
- Search and filters: exam, subject, topic, difficulty, learner mode, content type, free/paid.
- Resource detail pages with bilingual fields.
- Beginner, Intermediate and Revision learning-path pages.
- Weekly PDF library with free and premium labels.
- Resource cards, PDF preview/download for free files, product detail page for premium packs.
- Pricing/access page, About, Contact, Terms, Privacy and Refund Policy placeholders.
- SEO metadata, sitemap, robots.txt, Open Graph tags and accessible semantic HTML.
- Content managed through JSON/Markdown files in Git. No admin dashboard in v1.

### Do not build in v1

- User accounts, password login, social login or student dashboard.
- Subscription billing or recurring auto-renewals.
- Automated Razorpay order/webhook integration.
- Online PDF viewer that attempts to prevent copying.
- AI chatbot, live classes, mock-test engine, rank lists or community forum.
- Paid PDF files in the public website folder or Git repository.

### Payment/delivery for v1

- Product pages use an external Razorpay Payment Link placeholder configured in one file.
- Never invent a real payment URL. Until the owner adds a verified live link, the Buy button must show “Payments opening soon” and must not point to `#`.
- For the first small batch, payment is manually checked in the payment gateway dashboard. The owner then sends the premium PDF/link to the buyer's supplied email/WhatsApp.
- A payment success redirect or query parameter is not proof of payment.
- Do not publish premium PDFs in `/public`, `/dist`, GitHub or a publicly readable R2 bucket.
- Add clear copy that delivery is manual during the pilot (e.g. “After payment verification, the pack is delivered to your registered email/WhatsApp. Pilot delivery may take up to one business day.”). Owner must change this to a truthful service promise before launch.

### Future payment automation (document only; not active in v1)

When sales justify automation, use a server-side payment flow and Cloudflare Pages Function/Worker. Verify Razorpay webhook signatures with HMAC-SHA256 over the **raw request body**, validate `X-Razorpay-Signature`, deduplicate events by `x-razorpay-event-id`, and grant access only after a verified paid/captured event. Never trust a browser redirect as proof of payment. Store API secrets only as Cloudflare encrypted secrets, never in frontend code or Git. Use a private R2 bucket and short-lived authenticated downloads if automated premium delivery is implemented.

## 4. Technical architecture

### Recommended v1 stack

- Astro + TypeScript (static output) for SEO-friendly pages.
- Minimal vanilla TypeScript for search/filter/language toggle and interactive question reveal; avoid a large client-side framework unless necessary.
- Plain CSS or Tailwind CSS; keep dependencies lean.
- GitHub Free repository as source of truth.
- Cloudflare Pages Free with Git integration for deployment.
- Content catalog as JSON files in `src/content/library/`.
- Free PDF files in `public/downloads/free/` only.
- Premium PDFs stored offline/private during pilot and delivered manually after payment verification.
- Optional Cloudflare Pages Functions and D1 are Phase 2, not required for v1.

If the Antigravity environment generates a React/Vite app more reliably, it may use React + Vite + TypeScript, but preserve static generation/SEO requirements and keep the API/backend out of the first release. Do not switch frameworks repeatedly.

### Cloudflare setup

- Create the Pages project using **Git integration** from the beginning. Cloudflare documents that Direct Upload projects cannot later be switched to Git integration.
- Build command for Astro: `npm run build`.
- Build output directory: `dist`.
- Deploy to the free `*.pages.dev` subdomain first; buy a custom domain only after validation.
- Do not use Vercel Hobby or GitHub Pages as the commercial site host; use Cloudflare Pages for this plan.
- Keep the static site independent of D1/R2 so it can launch without payment/backend complexity.

### Optional Phase 2 infrastructure

- Cloudflare Pages Functions (or Workers) for server-side API endpoints.
- Cloudflare D1 for resource/product/purchase/entitlement metadata.
- Private Cloudflare R2 bucket for premium PDF objects.
- Cloudflare encrypted secrets for payment keys/webhook secret.
- Email delivery provider only after checking its free tier and privacy terms. Manual email delivery is acceptable at low order volume.

## 5. Page architecture and routes

- `/` — Home: value proposition, exam-family selector, subjects, learning modes, latest packs, free sample CTA.
- `/exams/` — Exam family directory.
- `/exams/[exam-slug]/` — Exam detail: overview, relevant subjects and verified resources.
- `/subjects/` — Subject directory.
- `/subjects/[subject-slug]/` — Subject overview, topics and filters.
- `/library/` — Searchable resource library.
- `/library/[resource-slug]/` — Resource detail page.
- `/learn/[subject]/[topic]/` — Topic learning page.
- `/paths/beginner/` — Beginner roadmap.
- `/paths/intermediate/` — Intermediate roadmap.
- `/paths/revision/` — Revision roadmap.
- `/weekly/` — Weekly release archive.
- `/weekly/[pack-slug]/` — Weekly pack details and price/access.
- `/pricing/` — Free vs premium access explanation.
- `/about/` — Mission and editorial standards.
- `/contact/` — Contact details placeholder/contact form if securely configured.
- `/legal/terms/`, `/legal/privacy/`, `/legal/refund/` — Owner-reviewed policy pages.
- `/404/` — Helpful not-found page.

Use clean lowercase slugs. Include breadcrumbs and related resources on detail pages.

## 6. Visual and UX requirements

- Mobile-first; most students will visit on phones.
- Professional, readable, exam-focused design. Suggested palette: deep navy, off-white, one teal/green accent. Do not overload with gradients or animations.
- Main navigation: Home, Exams, Subjects, Library, Weekly Packs, Study Paths.
- Prominent bilingual toggle: English / हिंदी. UI language can toggle; content must gracefully fall back if a translation is missing.
- Search box should search title, keywords, topic and exam tags.
- Filter chips: Exam, Subject, Difficulty, Mode, Free/Premium.
- Each resource card shows title, subject, exam tags, level, content type, free/paid status and last-updated date.
- Resource page has sections: What you will learn, prerequisites, explanation, examples, practice, answers/solutions, revision box, sources/review date.
- PDF cards show preview thumbnail/cover, file size, pages if known, language and download or purchase CTA.
- Never use fake testimonials, fake sales counts, countdown timers, guaranteed results or unsupported claims.
- Respect reduced-motion preference, keyboard navigation, visible focus states, sufficient contrast and semantic headings.

## 7. Content file structure

Use a simple folder structure:

```text
bankprep-lab/
├── public/
│   ├── downloads/free/
│   ├── images/covers/
│   ├── favicon.svg
│   ├── robots.txt
│   └── _headers
├── src/
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── SearchBar.astro
│   │   ├── FilterPanel.astro
│   │   ├── ResourceCard.astro
│   │   ├── ExamCard.astro
│   │   ├── SubjectCard.astro
│   │   ├── LearningModeTabs.astro
│   │   ├── QuestionCard.astro
│   │   └── PdfPackCard.astro
│   ├── content/
│   │   ├── exams.json
│   │   ├── subjects.json
│   │   ├── learning-paths.json
│   │   └── library/
│   │       ├── english-vocabulary-sample.json
│   │       ├── quant-percentage-foundation.json
│   │       └── reasoning-inequality-sample.json
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── pages/ (routes listed above)
│   ├── styles/global.css
│   ├── data/site-config.ts
│   └── utils/
│       ├── content.ts
│       ├── search.ts
│       ├── i18n.ts
│       └── validation.ts
├── database/
│   └── schema-v2.sql
├── docs/
│   ├── CONTENT_WORKFLOW.md
│   ├── CLOUDFLARE_DEPLOYMENT.md
│   └── PAYMENT_FULFILMENT_SOP.md
├── .env.example
├── .gitignore
├── astro.config.mjs
├── package.json
└── README.md
```

## 8. Content schema (JSON)

A resource record should follow this shape. Use TypeScript types and runtime validation (Zod or a small validator) so malformed records do not break the site.

```json
{
  "id": "res-eng-vocab-001",
  "slug": "english-vocabulary-memory-pack-01",
  "type": "vocabulary_set",
  "title": { "en": "Vocabulary Memory Pack 01", "hi": "Vocabulary Memory Pack 01" },
  "summary": {
    "en": "A short vocabulary set with meanings, usage and recall practice.",
    "hi": "Meaning, usage aur recall practice ke saath short vocabulary set."
  },
  "subjectId": "english",
  "topicIds": ["vocabulary", "synonyms-antonyms"],
  "examTags": ["banking", "ssc", "railways"],
  "level": "beginner",
  "modes": ["beginner", "revision"],
  "languageMode": "bilingual",
  "access": "free",
  "status": "published",
  "keywords": ["vocabulary", "mnemonics", "synonyms", "antonyms"],
  "estimatedMinutes": 15,
  "publishedAt": "2026-11-13",
  "updatedAt": "2026-11-13",
  "version": "1.0",
  "objectives": [
    { "en": "Understand each word in context.", "hi": "Har word ko context mein samajhna." }
  ],
  "sections": [
    {
      "id": "word-1",
      "kind": "vocabulary_item",
      "term": "abundant",
      "meaning": { "en": "Existing in large quantities; plentiful.", "hi": "Bahut adhik matra mein; prachur." },
      "synonyms": ["plentiful", "ample"],
      "antonyms": ["scarce"],
      "mnemonic": { "en": "Use a simple original memory hook; explain its limitation if needed.", "hi": "Ek simple original memory hook." },
      "example": { "en": "The region has abundant rainfall.", "hi": "Is region mein bahut adhik rainfall hoti hai." },
      "questionIds": ["q-eng-001"]
    }
  ],
  "questionIds": ["q-eng-001"],
  "pdf": {
    "isAvailable": false,
    "publicPath": null,
    "pageCount": null,
    "fileSizeLabel": null
  },
  "sources": [
    {
      "label": "Dictionary or official reference name",
      "url": "https://example.org/reference",
      "accessedAt": "2026-11-13"
    }
  ],
  "review": {
    "status": "reviewed",
    "reviewedAt": "2026-11-13",
    "reviewer": "editorial-team",
    "notes": "Check meanings, examples and answer key before release."
  }
}
```

Do not use `example.org` as a live source. It is a placeholder to replace. If a resource has no source requirement (e.g. original arithmetic practice), explicitly use an original-content source type rather than inventing a citation.

### Question schema

```json
{
  "id": "q-quant-percentage-001",
  "subjectId": "quant",
  "topicId": "percentage",
  "examTags": ["banking", "ssc", "railways"],
  "level": "beginner",
  "questionType": "mcq",
  "prompt": {
    "en": "A number is increased by 20% and then decreased by 20%. Find the net percentage change.",
    "hi": "Ek sankhya ko pehle 20% badhaya aur phir 20% ghataya jata hai. Net percentage change nikaaliye."
  },
  "options": [
    { "id": "A", "text": { "en": "No change", "hi": "Koi badlav nahi" } },
    { "id": "B", "text": { "en": "4% decrease", "hi": "4% ki kami" } },
    { "id": "C", "text": { "en": "4% increase", "hi": "4% ki vriddhi" } },
    { "id": "D", "text": { "en": "2% decrease", "hi": "2% ki kami" } }
  ],
  "correctOptionId": "B",
  "solutionBeginner": {
    "en": "Assume the original number is 100. After the increase it is 120. After a 20% decrease it becomes 96. Net change = 4% decrease.",
    "hi": "Original sankhya 100 maan lo. 20% badhne par 120. Ab 120 ka 20% ghatane par 96. Isliye 4% ki kami."
  },
  "solutionFast": {
    "en": "For equal successive changes of x% in opposite directions, net decrease = x²/100 = 4%.",
    "hi": "Equal successive increase/decrease ke liye net decrease = x²/100 = 4%."
  },
  "commonTrap": {
    "en": "The second 20% is calculated on 120, not on the original 100.",
    "hi": "Doosra 20%, 120 par lagega, original 100 par nahi."
  },
  "targetTimeSeconds": 35,
  "sourceType": "original",
  "reviewStatus": "verified",
  "reviewedAt": "2026-11-13"
}
```

Never copy proprietary coaching PDFs or paid question banks. Questions must be original, public-domain where applicable, or used under an appropriate licence. If adapting a publicly available exam question, record the source and permitted use. Verify every answer key independently.

## 9. Future D1 database schema (Phase 2)

The MVP does not need D1 to render the library. Keep this migration file ready for the point when dynamic purchases, user access or admin tools become worthwhile.

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS exams (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_hi TEXT,
  family TEXT NOT NULL,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_hi TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE IF NOT EXISTS topics (
  id TEXT PRIMARY KEY,
  subject_id TEXT NOT NULL REFERENCES subjects(id),
  parent_id TEXT REFERENCES topics(id),
  slug TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_hi TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  UNIQUE(subject_id, slug)
);

CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  title_en TEXT NOT NULL,
  title_hi TEXT,
  summary_en TEXT,
  summary_hi TEXT,
  subject_id TEXT REFERENCES subjects(id),
  topic_id TEXT REFERENCES topics(id),
  level TEXT NOT NULL CHECK(level IN ('beginner','intermediate','advanced','revision')),
  access TEXT NOT NULL CHECK(access IN ('free','premium')),
  language_mode TEXT NOT NULL DEFAULT 'bilingual',
  content_json TEXT NOT NULL,
  public_file_path TEXT,
  private_object_key TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','review','published','archived')),
  published_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS resource_exam_tags (
  resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  exam_id TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  PRIMARY KEY(resource_id, exam_id)
);

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  resource_id TEXT REFERENCES resources(id) ON DELETE SET NULL,
  subject_id TEXT NOT NULL REFERENCES subjects(id),
  topic_id TEXT REFERENCES topics(id),
  level TEXT NOT NULL,
  question_type TEXT NOT NULL,
  prompt_json TEXT NOT NULL,
  options_json TEXT,
  answer_key TEXT,
  solution_beginner_json TEXT,
  solution_fast_json TEXT,
  common_trap_json TEXT,
  target_time_seconds INTEGER,
  source_type TEXT NOT NULL CHECK(source_type IN ('original','licensed','public_domain','adapted_with_permission')),
  source_reference TEXT,
  review_status TEXT NOT NULL DEFAULT 'draft',
  reviewed_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title_en TEXT NOT NULL,
  title_hi TEXT,
  description_en TEXT,
  description_hi TEXT,
  price_paise INTEGER NOT NULL CHECK(price_paise >= 0),
  currency TEXT NOT NULL DEFAULT 'INR',
  payment_url TEXT,
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS product_resources (
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  PRIMARY KEY(product_id, resource_id)
);

CREATE TABLE IF NOT EXISTS purchases (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  buyer_email TEXT NOT NULL,
  buyer_name TEXT,
  provider TEXT NOT NULL DEFAULT 'razorpay',
  provider_payment_id TEXT UNIQUE,
  provider_order_or_link_id TEXT,
  status TEXT NOT NULL CHECK(status IN ('pending','paid','failed','refunded','fulfilled')),
  amount_paise INTEGER NOT NULL,
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS entitlements (
  id TEXT PRIMARY KEY,
  purchase_id TEXT NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  resource_id TEXT NOT NULL REFERENCES resources(id),
  expires_at TEXT,
  download_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(purchase_id, resource_id)
);

CREATE TABLE IF NOT EXISTS webhook_events (
  provider_event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  signature_verified INTEGER NOT NULL DEFAULT 0,
  processed_at TEXT,
  received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  resource_id TEXT REFERENCES resources(id),
  rating INTEGER CHECK(rating BETWEEN 1 AND 5),
  message TEXT,
  email TEXT,
  consent_to_contact INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_resources_status_access ON resources(status, access);
CREATE INDEX IF NOT EXISTS idx_resources_subject_level ON resources(subject_id, level);
CREATE INDEX IF NOT EXISTS idx_questions_subject_topic ON questions(subject_id, topic_id);
CREATE INDEX IF NOT EXISTS idx_purchases_email_status ON purchases(buyer_email, status);
CREATE INDEX IF NOT EXISTS idx_entitlements_purchase ON entitlements(purchase_id);
```

Do not create a user account table in v1. Collect as little personal information as possible. Add authentication only when there is a clear need and a safe implementation plan.

## 10. Content production and QA workflow

For every new weekly pack:

1. Define the exam(s), subject, topic, level and intended learner outcome.
2. Research from primary/official sources where applicable. Record source URL and access date for GA/current affairs.
3. Use AI tools only for drafts, alternate explanations, question variants and language simplification.
4. Independently verify every date, scheme detail, factual claim, formula, calculation and answer key.
5. Check that beginner explanations do not skip prerequisite steps.
6. Check that shortcuts are valid, not overgeneralised, and actually useful under exam conditions.
7. Proofread English and Hindi. Hindi should clarify, not mistranslate technical terms.
8. Add exam tags only after syllabus relevance is checked.
9. Add a last-reviewed date and version number.
10. Publish the free sample first; release paid pack only after QA passes.

Use statuses: `draft → review → verified → published`. A resource with unresolved answers or unverified current facts must not be published.

## 11. Initial launch content (do not fabricate completeness)

Create a small but polished starter library, not a huge empty catalogue:

- English: 15-word bilingual vocabulary recall sample with definitions, synonyms/antonyms, examples and original memory hooks.
- Quant: Percentage foundation lesson with 5 original MCQs, beginner explanations and one valid short method.
- Reasoning: Inequality foundation with 5 original MCQs and step-by-step solutions.
- General Awareness: one static-GK sample only after facts and sources are verified. Do not generate current-affairs facts without reliable current sources.
- Free download: a compact 3-day common-foundation challenge PDF. If the project cannot generate PDFs, create print-friendly HTML pages and provide a documented PDF-export workflow rather than leaving a broken download button.

The starter content must be marked honestly as a sample, not a complete course.

## 12. Analytics and success metrics

Do not add invasive tracking or collect unnecessary personal data. Start with manual weekly tracking:

- Unique visitors (where available through privacy-friendly analytics).
- Free sample downloads.
- Resource page views.
- Checkout/payment-link clicks.
- Paid orders confirmed in gateway dashboard.
- Refunds/support requests.
- Returning visitors or repeat buyers where measurable.

First validation milestone: 100 relevant visitors, 30 sample downloads, 10 useful feedback responses and 5 genuine paid orders. These are test goals, not forecasts or guarantees.

## 13. ₹2,000 budget rules

- Hosting: ₹0 on Cloudflare Pages Free within current limits.
- Repository: ₹0 on GitHub Free.
- Domain: ₹0 initially; use the Pages subdomain.
- Database: ₹0 in the MVP because D1 is not needed yet.
- PDF storage: free PDFs in Pages assets within per-file/site limits; premium files delivered manually, not hosted publicly.
- Payment fees: only when a payment is processed; check gateway terms and applicable taxes before accepting money.
- Advertising: do not spend until the free sample and offer have been tested organically.
- First controlled ad test: ₹500 only after validation; second ₹500 only if the first test produces useful evidence. Keep ₹1,000 untouched as reserve.
- Never spend the full amount just because it was budgeted.

## 14. Definition of done

The MVP is ready for a public pilot only when:

- All required pages load on mobile and desktop.
- No broken links, dead buttons, placeholder URLs or lorem ipsum remain.
- Search and filters work together and show a proper empty state.
- Language toggle works; missing translations fall back gracefully.
- Every published item has subject, exam tags, level, access status, update date and QA status.
- All MCQ answers have been independently checked.
- Free PDFs download correctly.
- No premium PDF is publicly accessible through the static asset folder or Git repository.
- Payment buttons either point to a real owner-configured link or are safely disabled with clear copy.
- Terms, privacy and refund pages contain owner-reviewed policy text before live sales.
- Sitemap, robots.txt, canonical URLs, page titles and meta descriptions exist.
- Keyboard navigation, visible focus, contrast and responsive layouts are checked.
- README explains local development, adding content, adding a free PDF and Cloudflare deployment.

---

# Ready-to-paste Antigravity IDE development prompt

Copy everything inside the code block into Antigravity IDE after opening an empty project folder.

```text
You are a senior product engineer and UX designer. Build a production-quality MVP website named “BankPrep Lab” from the following specification. Do not merely describe the solution—create the complete working project files in the current workspace, run the build, fix errors and provide exact deployment instructions.

PRODUCT
BankPrep Lab is a bilingual (English + Hindi) learning and revision library for Indian government-exam aspirants. It is designed around: What to study → How to understand → How to remember → How to solve → How to revise.

AUDIENCE
The data model and navigation must support Banking (SBI PO/Clerk, IBPS PO/CSA, RRB PO/Office Assistant, RBI Assistant), SSC (CGL/CHSL/MTS/GD), Railways (NTPC/Group D), Defence and State Government exams. This is an extensible exam taxonomy, NOT a claim that all exam syllabi are fully covered at launch. Only display an exam tag on a resource after its relevance has been checked. Do not invent UPSC/state-specific coverage.

SUBJECTS
English; Quantitative Aptitude; Reasoning; General Awareness; Banking & Financial Awareness; Computer Awareness. Build the subject architecture so sections can be activated gradually. Do not fill empty areas with fake content.

LEARNING MODES
1. Beginner: zero-based concepts, prerequisites, simple bilingual explanations, worked examples and guided practice.
2. Intermediate: exam-level patterns, standard method, valid alternate/short method, traps and timed practice.
3. Revision: concise notes, flashcards, memory hooks, MCQs, spaced recall and mistake review.
Show a shortcut only when valid for that question type and explain its conditions. Do not claim guaranteed marks, guaranteed selection or guaranteed speed improvement.

TECH STACK
Use Astro + TypeScript with static output and lightweight vanilla TypeScript interactions. Use clean CSS or Tailwind, but avoid unnecessary dependencies. The website should be SEO-friendly and mobile-first. If there is a concrete technical blocker with Astro, use React + Vite + TypeScript while preserving static SEO requirements; do not change stacks repeatedly.
Deploy target: Cloudflare Pages Free using Git integration, build command `npm run build`, output directory `dist`. Use a free `*.pages.dev` subdomain initially. Do NOT select Direct Upload because the project should connect to GitHub for automatic deploys. Do not use Vercel Hobby or GitHub Pages for this commercial project.

V1 SCOPE — BUILD NOW
- Responsive static site.
- Home page with exam selector, subject cards, latest resources, study paths and free sample CTA.
- Exam directory and exam detail pages.
- Subject directory and subject pages.
- Searchable library with filters for exam, subject, topic, difficulty, learner mode, type and free/premium.
- Resource detail pages.
- Beginner, Intermediate and Revision path pages.
- Weekly pack archive and weekly pack detail pages.
- Pricing/access, About, Contact, Terms, Privacy, Refund Policy and 404 pages.
- Bilingual UI toggle English / हिंदी. Resource content has separate English and Hindi fields. If a translation is missing, use a graceful fallback and visually indicate if appropriate; do not render `undefined`.
- SEO: unique title/meta description, canonical URL, Open Graph, sitemap.xml, robots.txt, semantic HTML, breadcrumbs and internal links.
- Accessible keyboard navigation, visible focus state, appropriate contrast, reduced motion support and useful empty/error states.
- Add a README with local setup, content editing, free PDF upload and Cloudflare Pages deployment steps.

DO NOT BUILD IN V1
No user accounts, passwords, subscriptions, recurring payments, admin dashboard, AI chatbot, live class system, rank list, mock-test engine, forum or automated payment webhook. Keep the MVP static and easy to maintain.

PAYMENT AND PREMIUM CONTENT RULES
- Put product names, INR prices and optional Razorpay Payment Link URLs in `src/data/site-config.ts` or a single products JSON file.
- Never invent a live payment URL. If the owner has not added a real link, disable the Buy button and show “Payments opening soon”. Never link to `#` as a fake checkout.
- For pilot orders, explain that payment is checked manually and premium material is delivered by email/WhatsApp after verification. Use honest owner-editable delivery wording.
- A return URL/query string is NOT proof of payment. Never unlock premium content based only on a browser redirect.
- Do not put premium PDF files under `public/`, `src/`, `dist/`, or in the Git repository. Premium content is delivered manually during the pilot. Free sample PDFs may be stored in `public/downloads/free/` if within Cloudflare Pages asset limits.
- Do not place secret keys, payment gateway secrets, personal customer data or real buyer records in frontend code or Git.
- Include a `docs/PAYMENT_FULFILMENT_SOP.md` describing manual payment verification and delivery.
- Document automated Razorpay webhook delivery as a future phase only. Any future webhook must verify HMAC-SHA256 against the raw body using `X-Razorpay-Signature`, deduplicate using `x-razorpay-event-id`, and grant entitlements only after verified payment. Store secrets as Cloudflare encrypted secrets. Do not implement this now.

CONTENT MANAGEMENT
Use JSON files in `src/content/` as a lightweight Git-based CMS. The owner will add/edit JSON and commit changes. There is no content admin dashboard in v1.
Create TypeScript types plus runtime validation (Astro content collections/Zod or another lightweight validator) for:
- exam: id, slug, name_en, name_hi, family, is_active
- subject: id, slug, name_en, name_hi, sort_order, is_active
- resource: id, slug, type, bilingual title and summary, subjectId, topicIds, examTags, level, modes, languageMode, access, status, keywords, estimatedMinutes, publishedAt, updatedAt, version, objectives, sections, questionIds, pdf metadata, sources and review metadata
- question: id, subjectId, topicId, examTags, level, questionType, bilingual prompt, options, correctOptionId, beginner solution, fast solution, common trap, targetTimeSeconds, sourceType, source reference, reviewStatus and reviewedAt
Use statuses `draft`, `review`, `verified`, `published`. Only `published` and `verified` content should appear publicly. Current-affairs resources must show sources, event date (if applicable), publication date and last-verified date. Do not fabricate citations.

STARTER CONTENT
Create a small but polished initial library; these are samples, not complete courses:
1. English: a bilingual 15-word vocabulary recall sample. Each word has correct meaning, synonyms, antonyms, a natural example, an original memory hook only when useful, and one recall question. Clearly mark it as a sample.
2. Quant: a Percentage Foundation lesson with 5 original MCQs, accurate beginner explanations and one valid short method.
3. Reasoning: an Inequality Foundation lesson with 5 original MCQs and step-by-step explanations.
4. General Awareness: create only a structure/sample placeholder that says “Verified content coming soon” unless you can provide properly sourced, current, verified facts. Never make up current affairs.
5. A free 3-day Common Foundation Challenge. If you can create a downloadable PDF reliably, include it in `public/downloads/free/`; otherwise create print-friendly HTML plus instructions to export it as PDF. Never leave a broken download link.
All questions must be original or appropriately licensed. Do not copy proprietary coaching PDFs or paid question banks. Check every answer independently before marking verified.

PAGES/ROUTES
/ ; /exams/ ; /exams/[exam-slug]/ ; /subjects/ ; /subjects/[subject-slug]/ ; /library/ ; /library/[resource-slug]/ ; /learn/[subject]/[topic]/ ; /paths/beginner/ ; /paths/intermediate/ ; /paths/revision/ ; /weekly/ ; /weekly/[pack-slug]/ ; /pricing/ ; /about/ ; /contact/ ; /legal/terms/ ; /legal/privacy/ ; /legal/refund/ ; /404/.
Use clean lowercase slugs. Include breadcrumbs and related resources.

DESIGN
Use a premium but restrained exam-preparation design: deep navy, off-white, teal/green accent, readable typography, high contrast, plenty of whitespace. Mobile first. Avoid excessive gradients, animation, fake urgency, fake testimonials, fake sales numbers or fabricated student results. Main nav: Home, Exams, Subjects, Library, Weekly Packs, Study Paths. Homepage hierarchy: hero promise + free sample CTA; exam selector; subject grid; three learning modes; latest free resources; featured premium pack; how to use the library; editorial standards; footer.
Each resource card must show title, subject, exam tags, level, type, Free/Premium status and last-updated date. Resource pages must show objectives, prerequisites, explanation, worked example, practice, answer/solution, revision box, sources and review status where relevant.

SEARCH/FILTER
Search title, summary, keywords, subject/topic and exam tags. Filters should combine, be clearable and update the result count. Add an empty state with “Clear filters”. Make search/filter work on mobile. No backend search is needed; use the static JSON index.

DATABASE PLAN
The MVP must work without D1. Create `database/schema-v2.sql` as a future migration file with SQLite/D1 tables for exams, subjects, topics, resources, resource_exam_tags, questions, products, product_resources, purchases, entitlements, webhook_events and feedback. Use parameterised query guidance in docs. Do not activate D1 bindings or write backend purchase endpoints in v1. Do not create user accounts.

CONTENT FILES / PROJECT STRUCTURE
Create a maintainable structure similar to:
public/downloads/free/, public/images/covers/, src/components/, src/content/exams.json, src/content/subjects.json, src/content/learning-paths.json, src/content/library/*.json, src/layouts/, src/pages/, src/styles/, src/data/site-config.ts, src/utils/, database/schema-v2.sql, docs/, README.md, .env.example, .gitignore, astro.config.mjs, package.json.
Split large components sensibly. Keep content separate from UI. Never place secrets in `.env.example`; include names only with placeholder values.

BUDGET / INFRASTRUCTURE
Target total cash spend ₹0 until validation. Cloudflare Pages Free + GitHub Free. No custom domain at launch. D1 and R2 are future options only; static MVP does not need them. Keep ₹2,000 unspent except a ₹500 first ad test after organic validation and a further ₹500 test only if first results justify it; preserve ₹1,000 reserve. Do not recommend purchasing templates, plugins or paid AI subscriptions.

QUALITY CHECKS BEFORE FINISHING
1. Run install and production build; fix all type/build errors.
2. Check every page and route.
3. Check mobile layout at narrow width and desktop layout.
4. Check language toggle and fallback behavior.
5. Check search plus combined filters and clear-filter behavior.
6. Verify all sample MCQ answers mathematically/factually; show answer explanations only after interaction if appropriate.
7. Check free download paths and file existence.
8. Check no premium file appears in public/static output.
9. Check all Buy buttons are disabled unless a real configured Payment Link is present.
10. Search repository for placeholder links, lorem ipsum, fake testimonials, fake sales claims, exposed secrets and TODOs that break the UX.
11. Verify title/meta/OG/canonical/sitemap/robots output.
12. Ensure legal page text is clearly an owner-review draft and not a false claim of legal compliance.

DELIVERABLES
- Complete working source code in the current workspace.
- `README.md` with exact local run/build/deploy commands.
- `docs/CONTENT_WORKFLOW.md` explaining how to add a new exam, subject, bilingual resource, question and free PDF.
- `docs/CLOUDFLARE_DEPLOYMENT.md` with GitHub + Cloudflare Pages Free setup steps, build command and output directory.
- `docs/PAYMENT_FULFILMENT_SOP.md` for manual pilot payment verification/delivery and future webhook security requirements.
- `database/schema-v2.sql` for future D1 use.
- A build/test report listing what passed, known limitations and any owner action still required.

WORKING RULES
- First inspect the workspace. If it contains existing code, preserve useful work and avoid destructive rewrites.
- Do not ask the user to choose libraries or design details; make sensible low-cost decisions.
- Do not claim deployment has happened unless you actually deploy using authorized tools. Prepare deployment instructions if credentials are unavailable.
- Do not fabricate payment URLs, company registration, GST status, user testimonials, market demand or official endorsements.
- Prefer a small, finished, verified MVP over an oversized feature list.
Now create the project, run the build and report the exact files created and steps still requiring the owner.
```

---

## Official platform references checked on 13 November 2026

- Cloudflare Pages overview: https://developers.cloudflare.com/pages/
- Pages Git integration: https://developers.cloudflare.com/pages/configuration/git-integration/
- Pages Functions and bindings: https://developers.cloudflare.com/pages/functions/ and https://developers.cloudflare.com/pages/functions/bindings/
- Pages free limits: https://developers.cloudflare.com/pages/platform/limits/
- Workers / Pages Functions pricing: https://developers.cloudflare.com/workers/platform/pricing/
- D1 pricing and limits: https://developers.cloudflare.com/d1/platform/pricing/ and https://developers.cloudflare.com/d1/platform/limits/
- R2 pricing: https://developers.cloudflare.com/r2/pricing/
- Razorpay pricing: https://razorpay.com/pricing/
- Razorpay webhook validation overview: https://razorpay.com/docs/webhooks/validate-test/

Platform free tiers and payment terms can change. Recheck official pricing immediately before enabling paid services.
