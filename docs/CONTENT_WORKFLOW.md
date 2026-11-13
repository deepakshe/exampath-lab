# ExamPath Lab — Content Management & Editorial Workflow

**Version:** 1.0.0 (MVP Git-Based CMS)  
**Philosophy:** Zero unverified content · Human editorial peer review · Git-backed transparency

---

## 1. Overview

In Version 1.0, ExamPath Lab uses structured JSON files inside `src/data/` as a lightweight, Git-backed content management system. Any change committed to the GitHub repository automatically triggers a static build and deployment on Cloudflare Pages.

There is no administrative backend or database password required. All resources are validated by TypeScript types at build time.

---

## 2. Content Data Architecture

All content lives under `src/data/`:

| File | Purpose | Key Attributes |
| :--- | :--- | :--- |
| `src/data/resources.json` | Master library of learning guides | `id`, `slug`, `title_en`, `title_hi`, `sections`, `questionIds`, `examTags`, `modes` |
| `src/data/questions.json` | Verified practice MCQs & shortcuts | `id`, `prompt_en`, `options`, `beginner_solution`, `fast_solution`, `common_trap` |
| `src/data/flashcards.json` | Active recall cards with mnemonics | `id`, `term`, `meaning_en`, `meaning_hi`, `mnemonic`, `example` |
| `src/data/weekly-packs.json` | Weekly learning drops (Free/Premium)| `id`, `slug`, `title_en`, `price_inr`, `access`, `table_of_contents` |
| `src/data/exams.json` | Supported exam families & taxonomy | `id`, `slug`, `name_en`, `family`, `exam_list`, `key_focus_areas` |
| `src/data/subjects.json` | Subject taxonomies & visual styling| `id`, `slug`, `name_en`, `tagline_en`, `topics`, `color` |

---

## 3. How to Add a New Learning Resource

To add a new study guide:

1. Open `src/data/resources.json`.
2. Append a new object following this exact schema:

```json
{
  "id": "res-quant-03",
  "slug": "ratio-proportion-foundation",
  "type": "Concept & Practice Guide",
  "title_en": "Ratio & Proportion: Balancing Ratios & Mental Multipliers",
  "title_hi": "अनुपात एवं समानुपात: अनुपातों का संतुलन और मेंटल गुणक",
  "summary_en": "Learn how to combine compound ratios (A:B and B:C) in under 5 seconds without cross multiplication.",
  "summary_hi": "क्रॉस गुणा किए बिना 5 सेकंड के भीतर संयुक्त अनुपातों (A:B और B:C) को संतुलित करना सीखें।",
  "subjectId": "quant",
  "subjectName": "Quantitative Aptitude",
  "topicIds": ["ratio", "arithmetic"],
  "examTags": ["Banking", "SSC", "Railways"],
  "level": "Beginner to Intermediate",
  "modes": ["Beginner", "Intermediate"],
  "languageMode": "Bilingual (English + Hindi)",
  "access": "Free",
  "status": "published",
  "estimatedMinutes": 15,
  "publishedAt": "2026-11-13",
  "updatedAt": "2026-11-13",
  "objectives_en": [
    "Combine multi-variable ratios into a single simplified chain.",
    "Solve coin and distribution word problems with zero algebra."
  ],
  "objectives_hi": [
    "बहु-चर अनुपातों को एक सरल श्रृंखला में संयोजित करना।",
    "बिना बीजगणित के सिक्कों और वितरण वाले प्रश्नों को हल करना।"
  ],
  "prerequisites_en": "Basic multiplication and fractions.",
  "prerequisites_hi": "बुनियादी गुणा और भिन्न।",
  "sections": [
    {
      "heading_en": "1. The Inverse N Multiplication Trick",
      "heading_hi": "1. उल्टा N गुणा ट्रिक",
      "content_en": "To combine A:B = 2:3 and B:C = 4:5:\nMultiply down (2×4=8), diagonal (4×3=12), and down (3×5=15).\nA:B:C = 8:12:15 immediately.",
      "content_hi": "A:B = 2:3 और B:C = 4:5 को मिलाने के लिए:\nसीधा गुणा (2×4=8), तिरछा गुणा (4×3=12), और अंतिम सीधा गुणा (3×5=15)।\nA:B:C = 8:12:15 तुरंत प्राप्त होता है।"
    }
  ],
  "questionIds": [],
  "sources": "Standard NCERT Arithmetic & Certified Exam Analytics",
  "reviewMetadata": "Verified by Quantitative Faculty on 2026-11-13"
}
```

3. Run `npm run build` locally to verify that Astro generates `/library/ratio-proportion-foundation/index.html` without errors.

---

## 4. How to Add a Verified Question (MCQ)

Every question must be verified mathematically and include an explanation of common traps:

1. Open `src/data/questions.json`.
2. Add a new verified question object:

```json
{
  "id": "q-quant-ratio-01",
  "subjectId": "quant",
  "topicId": "ratio",
  "examTags": ["banking", "ssc"],
  "level": "Beginner",
  "prompt_en": "If A:B = 2:3 and B:C = 4:5, what is A:B:C?",
  "prompt_hi": "यदि A:B = 2:3 और B:C = 4:5 है, तो A:B:C क्या होगा?",
  "options": [
    { "id": "A", "text": "8:12:15" },
    { "id": "B", "text": "6:12:15" },
    { "id": "C", "text": "8:10:15" },
    { "id": "D", "text": "2:12:5" }
  ],
  "correctOptionId": "A",
  "targetTimeSeconds": 15,
  "beginner_solution_en": "Equate B in both ratios: Multiply (2:3) by 4 → 8:12. Multiply (4:5) by 3 → 12:15. Hence A:B:C = 8:12:15.",
  "beginner_solution_hi": "दोनों अनुपातों में B को बराबर करें: (2:3) को 4 से गुणा करें → 8:12। (4:5) को 3 से गुणा करें → 12:15। अतः A:B:C = 8:12:15।",
  "fast_solution_en": "Inverse N trick: 2×4=8, 3×4=12, 3×5=15 → 8:12:15 in 3 seconds.",
  "fast_solution_hi": "उल्टा N नियम: 2×4=8, 3×4=12, 3×5=15 → 8:12:15।",
  "common_trap": "Adding or directly concatenating ratios without normalizing the shared middle term B.",
  "reviewStatus": "verified",
  "reviewedAt": "2026-11-13"
}
```

3. In `src/data/resources.json`, add `"q-quant-ratio-01"` to the target resource's `questionIds` array. The interactive drill widget will render it automatically!

---

## 5. Adding Free Printable PDF / HTML Guides

1. Place free printable documents in `public/downloads/free/`.
2. Ensure the document includes clean `@media print` CSS so users can print or save as PDF directly.
3. Update links in `src/data/site-config.ts` or `src/data/weekly-packs.json`.
4. **Never place premium, unreleased PDFs under `public/`!**
