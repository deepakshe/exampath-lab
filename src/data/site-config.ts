export interface NavLink {
  label_en: string;
  label_hi: string;
  href: string;
}

export interface ProductConfig {
  id: string;
  slug: string;
  name_en: string;
  name_hi: string;
  price_inr: number;
  is_free: boolean;
  payment_link_url: string; // If empty or placeholder, UI renders 'Payments opening soon'
  description_en: string;
  description_hi: string;
  deliverable_format: string;
  features_en: string[];
  features_hi: string[];
}

export const siteConfig = {
  brand: {
    name: 'ExamPath Lab',
    tagline_en: 'LEARN · REMEMBER · SOLVE',
    tagline_hi: 'सीखो · याद रखो · हल करो',
    motto_en: 'The Learning Field Guide for Indian Government Exams',
    motto_hi: 'भारतीय सरकारी परीक्षाओं के लिए आधुनिक शिक्षण फील्ड गाइड',
    description_en: 'Study less scattered. Learn with a system. Understand concepts, remember facts with memory hooks, and solve questions with exam-tested speed.',
    description_hi: 'बिना भटके व्यवस्थित तैयारी करें। अवधारणाओं को समझें, स्मरणीय ट्रिक्स से याद रखें और परीक्षा-परीक्षित गति से प्रश्नों को हल करें।',
    version: '1.0.0-MVP',
    license: 'Commercial Free-Core Educational Platform',
    hosting: 'Cloudflare Pages',
  },
  navigation: [
    { label_en: 'Home', label_hi: 'होम', href: '/' },
    { label_en: 'Exams', label_hi: 'परीक्षाएं', href: '/exams/' },
    { label_en: 'Subjects', label_hi: 'विषय', href: '/subjects/' },
    { label_en: 'Library', label_hi: 'लाइब्रेरी', href: '/library/' },
    { label_en: 'Study Paths', label_hi: 'अध्ययन मार्ग', href: '/paths/beginner/' },
    { label_en: 'Weekly Drops', label_hi: 'साप्ताहिक सामग्री', href: '/weekly/' },
    { label_en: 'Practice & Recall', label_hi: 'अभ्यास और रीकॉल', href: '/practice/' },
    { label_en: 'Pricing', label_hi: 'मूल्य / एक्सेस', href: '/pricing/' },
  ] as NavLink[],
  contact: {
    email: 'editorial@exampathlab.com',
    support_hours: 'Monday to Saturday, 10:00 AM – 6:00 PM IST',
    pilot_fulfillment_channel: 'Verified Email / WhatsApp manual fulfillment',
    pilot_fulfillment_tat: 'Delivery within 2 to 6 hours after manual verification',
    community_telegram: 'https://t.me/exampathlab_official',
  },
  editorial_standards: {
    rule_1: 'Zero Fabricated Content: No made-up current affairs or unverified shortcuts.',
    rule_2: 'Verified Answers: Every Quant and Reasoning answer is mathematically verified.',
    rule_3: 'Contextual Mnemonics: Memory hooks are used only when they genuinely aid retention.',
    rule_4: 'Transparent Boundaries: Clearly stated syllabus coverage with no exaggerated selection guarantees.',
  },
  products: [
    {
      id: 'free-foundation-challenge',
      slug: 'common-foundation-challenge',
      name_en: '3-Day Common Foundation Challenge',
      name_hi: '3-दिवसीय कॉमन फाउंडेशन चैलेंज',
      price_inr: 0,
      is_free: true,
      payment_link_url: '',
      description_en: 'Essential Percentages, High-Frequency Vocab, and Inequality Speed Rules for all competitive exams.',
      description_hi: 'सभी प्रतियोगी परीक्षाओं के लिए आवश्यक प्रतिशत, उच्च-आवृत्ति शब्दावली और असमानता नियम।',
      deliverable_format: 'Instant Free Download / Printable Field Guide',
      features_en: [
        'Bilingual breakdown (English + Hindi)',
        '30 Core high-frequency exam root words',
        'Standard vs Speed methods comparison',
        '5 Curated verified practice MCQs',
      ],
      features_hi: [
        'द्विभाषी व्याख्या (अंग्रेजी + हिंदी)',
        '30 महत्वपूर्ण परीक्षा रूट शब्द',
        'मानक विधि बनाम शॉर्टकट तुलना',
        '5 सत्यापित अभ्यास प्रश्न',
      ],
    },
    {
      id: 'pack-weekly-vocab-01',
      slug: 'vocab-mnemonic-pack-vol-1',
      name_en: 'Weekly Vocab & Mnemonic Master Pack (Vol. 1)',
      name_hi: 'साप्ताहिक शब्दावली और निमोनिक मास्टर पैक (भाग 1)',
      price_inr: 49,
      is_free: false,
      payment_link_url: '', // Empty = UI automatically disables button with "Payments opening soon"
      description_en: '30 Exam-tested editorial words with etymology, context sentences, memory hooks, and rapid-fire recall flashcards.',
      description_hi: '30 परीक्षा-उपयोगी शब्द, व्युत्पत्ति, संदर्भ वाक्य, स्मृति ट्रिक्स और रैपिड-फायर फ्लैशकार्ड के साथ।',
      deliverable_format: 'Digital Master PDF + Offline Print Cards',
      features_en: [
        '30 High-yield editorial words',
        'Desi mnemonic hooks for permanent recall',
        'Synonyms, antonyms and typical exam traps',
        'Delivered via verified email/WhatsApp',
      ],
      features_hi: [
        '30 उच्च-अंक वाले संपादकीय शब्द',
        'स्थायी स्मरण के लिए निमोनिक ट्रिक्स',
        'पर्यायवाची, विलोम और परीक्षा के सामान्य जाल',
        'ईमेल/व्हाट्सएप के माध्यम से सत्यापन के बाद वितरण',
      ],
    },
    {
      id: 'pack-quant-speed-01',
      slug: 'quant-percentage-speed-pack',
      name_en: 'Quant Speed & Mental Fraction Pack',
      name_hi: 'क्वांट स्पीड और मेंटल फ्रैक्शन पैक',
      price_inr: 49,
      is_free: false,
      payment_link_url: '',
      description_en: 'Fraction-to-percentage conversion tables, multiplying factors, successive percentage shortcuts, and 25 step-by-step verified questions.',
      description_hi: 'भिन्न-से-प्रतिशत रूपांतरण, गुणक कारक, क्रमिक प्रतिशत शॉर्टकट और 25 सत्यापित प्रश्न।',
      deliverable_format: 'Digital Master PDF + Interactive Formula Sheet',
      features_en: [
        'Fraction 1/1 to 1/25 memory charts',
        'Successive percentage calculation shortcuts',
        'Beginner solution + Exam speed method for every question',
        'Trap alert annotations on misleading options',
      ],
      features_hi: [
        '1/1 से 1/25 भिन्न स्मृति चार्ट',
        'क्रमिक प्रतिशत गणना शॉर्टकट',
        'शुरुआती विधि + परीक्षा गति तकनीक',
        'भ्रामक विकल्पों पर विशेष चेतावनी',
      ],
    },
    {
      id: 'pass-pilot-all-access',
      slug: 'pilot-quarterly-study-pass',
      name_en: 'All-Access Pilot Study Pass',
      name_hi: 'ऑल-एक्सेस पायलट स्टडी पास',
      price_inr: 199,
      is_free: false,
      payment_link_url: '',
      description_en: 'Full access to all upcoming weekly packs for 3 months, direct mentor doubt support via WhatsApp, and early access to revision decks.',
      description_hi: '3 महीने के लिए आगामी सभी साप्ताहिक पैक्स का पूरा एक्सेस, व्हाट्सएप पर सीधा मेंटर सहायता और नए रिवीज़न डेक।',
      deliverable_format: 'Full Digital Access Pass',
      features_en: [
        'All current & upcoming weekly drops (12+ packs)',
        'Priority email/WhatsApp query resolution',
        'Printable high-contrast revision summaries',
        'Pilot tester community membership',
      ],
      features_hi: [
        'सभी वर्तमान और आगामी साप्ताहिक पैक्स (12+ पैक)',
        'प्राथमिकता ईमेल/व्हाट्सएप सहायता',
        'प्रिंट-अनुकूल उच्च-कंट्रास्ट रिवीज़न सारांश',
        'पायलट टेस्टर कम्युनिटी सदस्यता',
      ],
    },
  ] as ProductConfig[],
};
