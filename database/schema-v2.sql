-- ============================================================================
-- ExamPath Lab: Phase 2 Future Schema (Cloudflare D1 / SQLite)
-- This schema is designed for future automated entitlements, webhook verification,
-- and dynamic resource queries. The v1 MVP runs 100% statically without D1.
-- ============================================================================

PRAGMA foreign_keys = ON;

-- 1. EXAM TAXONOMY
CREATE TABLE IF NOT EXISTS exams (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_hi TEXT,
  family TEXT NOT NULL, -- 'Banking', 'SSC', 'Railways', 'Defence', 'State', etc.
  is_active INTEGER NOT NULL DEFAULT 1,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. SUBJECTS
CREATE TABLE IF NOT EXISTS subjects (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_hi TEXT,
  tagline_en TEXT,
  tagline_hi TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active INTEGER NOT NULL DEFAULT 1
);

-- 3. TOPICS
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

-- 4. BILINGUAL LEARNING RESOURCES
CREATE TABLE IF NOT EXISTS resources (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL, -- 'guide', 'flashcard', 'quiz', 'cheat_sheet'
  title_en TEXT NOT NULL,
  title_hi TEXT,
  summary_en TEXT,
  summary_hi TEXT,
  subject_id TEXT REFERENCES subjects(id),
  topic_id TEXT REFERENCES topics(id),
  level TEXT NOT NULL CHECK(level IN ('beginner','intermediate','advanced','revision')),
  access TEXT NOT NULL CHECK(access IN ('free','premium')),
  language_mode TEXT NOT NULL DEFAULT 'bilingual',
  content_json TEXT NOT NULL, -- Stored rich JSON sections & bilingual content
  public_file_path TEXT,
  private_object_key TEXT, -- Stored in Cloudflare R2 for premium downloads
  status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','review','published','archived')),
  published_at TEXT,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 5. RESOURCE TO EXAM MANY-TO-MANY MAPPING
CREATE TABLE IF NOT EXISTS resource_exam_tags (
  resource_id TEXT NOT NULL REFERENCES resources(id) ON DELETE CASCADE,
  exam_id TEXT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
  PRIMARY KEY(resource_id, exam_id)
);

-- 6. VERIFIED MCQS & QUESTIONS
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  resource_id TEXT REFERENCES resources(id) ON DELETE SET NULL,
  subject_id TEXT NOT NULL REFERENCES subjects(id),
  topic_id TEXT REFERENCES topics(id),
  level TEXT NOT NULL,
  question_type TEXT NOT NULL,
  prompt_json TEXT NOT NULL,
  options_json TEXT,
  correct_option_id TEXT,
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

-- 7. COMMERCIAL PRODUCTS & PASSES
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

-- 8. VERIFIED PURCHASES (Manual or Automated Webhook)
CREATE TABLE IF NOT EXISTS purchases (
  id TEXT PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id),
  buyer_email TEXT NOT NULL,
  buyer_name TEXT,
  buyer_phone TEXT,
  provider TEXT NOT NULL DEFAULT 'razorpay',
  provider_payment_id TEXT UNIQUE,
  provider_order_or_link_id TEXT,
  status TEXT NOT NULL CHECK(status IN ('pending','paid','failed','refunded','fulfilled')),
  amount_paise INTEGER NOT NULL,
  paid_at TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 9. USER ENTITLEMENTS (Future Phase)
CREATE TABLE IF NOT EXISTS entitlements (
  id TEXT PRIMARY KEY,
  purchase_id TEXT NOT NULL REFERENCES purchases(id) ON DELETE CASCADE,
  resource_id TEXT NOT NULL REFERENCES resources(id),
  expires_at TEXT,
  download_count INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(purchase_id, resource_id)
);

-- 10. IDEMPOTENT WEBHOOK LOG (Anti-Replay Protection)
CREATE TABLE IF NOT EXISTS webhook_events (
  provider_event_id TEXT PRIMARY KEY,
  event_type TEXT NOT NULL,
  signature_verified INTEGER NOT NULL DEFAULT 0,
  processed_at TEXT,
  received_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 11. FEEDBACK & REPORTING
CREATE TABLE IF NOT EXISTS feedback (
  id TEXT PRIMARY KEY,
  resource_id TEXT REFERENCES resources(id),
  rating INTEGER CHECK(rating BETWEEN 1 AND 5),
  message TEXT,
  email TEXT,
  consent_to_contact INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- INDEXES FOR SUB-MILLISECOND D1 PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_resources_status_access ON resources(status, access);
CREATE INDEX IF NOT EXISTS idx_resources_subject_level ON resources(subject_id, level);
CREATE INDEX IF NOT EXISTS idx_questions_subject_topic ON questions(subject_id, topic_id);
CREATE INDEX IF NOT EXISTS idx_purchases_email_status ON purchases(buyer_email, status);
CREATE INDEX IF NOT EXISTS idx_entitlements_purchase ON entitlements(purchase_id);
