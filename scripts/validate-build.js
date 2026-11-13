import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const dataDir = path.join(rootDir, 'src', 'data');

let errors = [];
let warnings = [];
let passCount = 0;

function logPass(msg) {
  passCount++;
  console.log(`  ✓ ${msg}`);
}

function logError(msg) {
  errors.push(msg);
  console.error(`  ✗ ERROR: ${msg}`);
}

function logWarning(msg) {
  warnings.push(msg);
  console.warn(`  ! WARNING: ${msg}`);
}

console.log('====================================================');
console.log('ExamPath Lab — Automated Build & Link Quality Audit');
console.log('====================================================\n');

// ----------------------------------------------------
// 1. DATA INTEGRITY & DUPLICATE ID CHECK
// ----------------------------------------------------
console.log('1. Checking Content Data Integrity & Duplicate IDs:');

function checkUniqueIds(filePath, collectionName, idKey = 'id', slugKey = 'slug') {
  if (!fs.existsSync(filePath)) {
    logError(`Missing data file: ${filePath}`);
    return [];
  }
  const raw = fs.readFileSync(filePath, 'utf-8');
  let items = [];
  try {
    items = JSON.parse(raw);
  } catch (err) {
    logError(`JSON syntax error in ${filePath}: ${err.message}`);
    return [];
  }

  const ids = new Set();
  const slugs = new Set();

  for (const item of items) {
    const id = item[idKey];
    if (!id) {
      logError(`Missing ${idKey} in item in ${collectionName}`);
    } else if (ids.has(id)) {
      logError(`Duplicate ${idKey} found in ${collectionName}: "${id}"`);
    } else {
      ids.add(id);
    }

    if (slugKey && item[slugKey] !== undefined) {
      const slug = item[slugKey];
      if (!slug) {
        logError(`Empty ${slugKey} in item ${id} in ${collectionName}`);
      } else if (slugs.has(slug)) {
        logError(`Duplicate ${slugKey} found in ${collectionName}: "${slug}"`);
      } else {
        slugs.add(slug);
      }
    }
  }

  logPass(`${collectionName}: ${items.length} records verified (all ${idKey}s and slugs unique)`);
  return items;
}

const exams = checkUniqueIds(path.join(dataDir, 'exams.json'), 'Exams');
const subjects = checkUniqueIds(path.join(dataDir, 'subjects.json'), 'Subjects');
const resources = checkUniqueIds(path.join(dataDir, 'resources.json'), 'Resources');
const questions = checkUniqueIds(path.join(dataDir, 'questions.json'), 'Questions', 'id', null);
const flashcards = checkUniqueIds(path.join(dataDir, 'flashcards.json'), 'Flashcards', 'id', null);
const weeklyPacks = checkUniqueIds(path.join(dataDir, 'weekly-packs.json'), 'Weekly Packs');
const learningPaths = checkUniqueIds(path.join(dataDir, 'learning-paths.json'), 'Learning Paths');

// Cross-reference checks
const questionIdSet = new Set(questions.map((q) => q.id));
for (const res of resources) {
  if (Array.isArray(res.questionIds)) {
    for (const qid of res.questionIds) {
      if (!questionIdSet.has(qid)) {
        logError(`Resource "${res.id}" references non-existent questionId: "${qid}"`);
      }
    }
  }
}
logPass('Resource-to-Question foreign-key consistency verified');

const resourceSlugSet = new Set(resources.map((r) => r.slug));
for (const p of learningPaths) {
  if (Array.isArray(p.curated_resources)) {
    for (const rslug of p.curated_resources) {
      if (!resourceSlugSet.has(rslug)) {
        logError(`Learning path "${p.slug}" references non-existent resource: "${rslug}"`);
      }
    }
  }
}
logPass('Learning Path resource references verified');

// ----------------------------------------------------
// 2. SITEMAP & ROUTE RESOLUTION CHECK
// ----------------------------------------------------
console.log('\n2. Verifying Sitemap Routes Against Static dist/ Directory:');

if (!fs.existsSync(distDir)) {
  logError(`Dist directory does not exist: ${distDir}. Run "npm run build" first.`);
  process.exit(1);
}

const sitemapPath = path.join(distDir, 'sitemap.xml');
if (!fs.existsSync(sitemapPath)) {
  logError('Missing sitemap.xml in dist/');
} else {
  const sitemapXml = fs.readFileSync(sitemapPath, 'utf-8');
  const locRegex = /<loc>(https?:\/\/[^<]+)<\/loc>/g;
  let match;
  let sitemapCount = 0;

  while ((match = locRegex.exec(sitemapXml)) !== null) {
    sitemapCount++;
    const fullUrl = match[1];
    const urlObj = new URL(fullUrl);
    let pathname = urlObj.pathname;
    if (pathname.endsWith('/')) {
      pathname = pathname + 'index.html';
    } else if (!path.extname(pathname)) {
      pathname = pathname + '/index.html';
    }

    const localFilePath = path.join(distDir, pathname.replace(/^\//, ''));
    if (!fs.existsSync(localFilePath)) {
      logError(`Sitemap route does not resolve to static file: ${fullUrl} -> ${localFilePath}`);
    }
  }
  logPass(`All ${sitemapCount} sitemap routes resolve to verified static HTML files in dist/`);
}

// ----------------------------------------------------
// 3. INTERNAL LINK & ASSET RESOLUTION AUDIT
// ----------------------------------------------------
console.log('\n3. Auditing Internal Links, Stylesheets, Scripts & Assets in Rendered DOM:');

function getAllHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  }
  return results;
}

const allHtmlFiles = getAllHtmlFiles(distDir);
logPass(`Located ${allHtmlFiles.length} generated HTML pages in dist/ to inspect`);

let totalLinksChecked = 0;
let externalLinksSkipped = 0;

for (const htmlFile of allHtmlFiles) {
  let content = fs.readFileSync(htmlFile, 'utf-8');
  const relPath = path.relative(distDir, htmlFile);

  // Strip <script> and <style> tags to avoid auditing JS template strings
  content = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  content = content.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // Match href and src attributes in HTML markup
  const attrRegex = /(?:href|src)=["']([^"']+)["']/g;
  let attrMatch;

  while ((attrMatch = attrRegex.exec(content)) !== null) {
    let target = attrMatch[1].trim();

    // Skip empty, anchors, mailto, tel, javascript, data URIs
    if (!target || target.startsWith('#') || target.startsWith('mailto:') || target.startsWith('tel:') || target.startsWith('javascript:') || target.startsWith('data:')) {
      continue;
    }

    // External URLs (Google Fonts, Telegram, etc.)
    if (target.startsWith('http://') || target.startsWith('https://')) {
      externalLinksSkipped++;
      continue;
    }

    totalLinksChecked++;

    // Remove query params or hash fragments from local link
    target = target.split('?')[0].split('#')[0];
    if (!target) continue;

    let resolvedPath;
    if (target.startsWith('/')) {
      const cleanTarget = target.replace(/^\//, '');
      if (cleanTarget === '') {
        resolvedPath = path.join(distDir, 'index.html');
      } else if (cleanTarget.endsWith('/')) {
        resolvedPath = path.join(distDir, cleanTarget, 'index.html');
      } else if (path.extname(cleanTarget)) {
        resolvedPath = path.join(distDir, cleanTarget);
      } else {
        // Could be /exams/banking -> dist/exams/banking/index.html or dist/exams/banking.html
        resolvedPath = path.join(distDir, cleanTarget, 'index.html');
        if (!fs.existsSync(resolvedPath)) {
          const alt = path.join(distDir, cleanTarget + '.html');
          if (fs.existsSync(alt)) resolvedPath = alt;
        }
      }
    } else {
      // Relative path
      const currentDir = path.dirname(htmlFile);
      resolvedPath = path.resolve(currentDir, target);
      if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isDirectory()) {
        resolvedPath = path.join(resolvedPath, 'index.html');
      }
    }

    if (!fs.existsSync(resolvedPath)) {
      logError(`Broken local link in "${relPath}": target "${attrMatch[1]}" cannot be resolved to ${resolvedPath}`);
    }
  }
}

logPass(`Checked ${totalLinksChecked} internal link/asset references (${externalLinksSkipped} external links skipped)`);

// ----------------------------------------------------
// 4. ESSENTIAL ASSETS EXISTENCE
// ----------------------------------------------------
console.log('\n4. Checking Mandatory Configuration & Security Assets:');

const essentialAssets = [
  '404.html',
  'robots.txt',
  'sitemap.xml',
  '_headers',
  'downloads/free/Common-Foundation-Challenge-Day1-3.html'
];

for (const asset of essentialAssets) {
  const assetPath = path.join(distDir, asset);
  if (!fs.existsSync(assetPath)) {
    logError(`Missing critical asset in dist/: ${asset}`);
  } else {
    const size = fs.statSync(assetPath).size;
    logPass(`Verified ${asset} exists in dist/ (${size} bytes)`);
  }
}

// ----------------------------------------------------
// FINAL VERDICT
// ----------------------------------------------------
console.log('\n====================================================');
console.log(`Quality Audit Completed: ${passCount} Passed | ${warnings.length} Warnings | ${errors.length} Errors`);
console.log('====================================================');

if (errors.length > 0) {
  console.error('\nAudit Failed with the following errors:');
  errors.forEach((err, idx) => console.error(`  [${idx + 1}] ${err}`));
  process.exit(1);
} else {
  console.log('\n✨ ALL INTEGRITY AND LINK CHECKS PASSED WITH 100% FIDELITY!\n');
  process.exit(0);
}
