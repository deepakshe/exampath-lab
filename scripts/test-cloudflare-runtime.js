import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');

console.log('========================================================');
console.log('ExamPath Lab — Cloudflare Workers Runtime & Header Tests');
console.log('========================================================\n');

if (!fs.existsSync(distDir)) {
  console.error('✗ ERROR: dist/ directory not found. Please run "npm run build" first.');
  process.exit(1);
}

const PORT = 8787;
const BASE_URL = `http://127.0.0.1:${PORT}`;

// Find a hashed asset in dist/_astro
const astroDir = path.join(distDir, '_astro');
let sampleHashedAsset = null;
if (fs.existsSync(astroDir)) {
  const files = fs.readdirSync(astroDir);
  if (files.length > 0) {
    sampleHashedAsset = files[0];
  }
}

async function waitForServer(url, timeoutMs = 25000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status === 200) return true;
    } catch {
      // Server not ready yet
    }
    await new Promise((r) => setTimeout(r, 600));
  }
  return false;
}

async function runTests() {
  console.log(`Starting local Cloudflare Workers runtime (wrangler dev on port ${PORT})...`);

  const startupLogs = [];
  const isWindows = process.platform === 'win32';
  const child = isWindows
    ? spawn('cmd.exe', ['/c', 'npx', 'wrangler', 'dev', '--port', String(PORT), '--ip', '127.0.0.1'], {
        cwd: rootDir,
        env: { ...process.env, CI: 'true' },
        stdio: ['ignore', 'pipe', 'pipe'],
      })
    : spawn('npx', ['wrangler', 'dev', '--port', String(PORT), '--ip', '127.0.0.1'], {
        cwd: rootDir,
        env: { ...process.env, CI: 'true' },
        stdio: ['ignore', 'pipe', 'pipe'],
      });

  child.stdout.on('data', (d) => {
    const text = d.toString();
    startupLogs.push(text);
    if (text.includes('[wrangler:error]') || text.includes('ERROR')) {
      console.error(`[wrangler] ${text.trim()}`);
    }
  });

  child.stderr.on('data', (d) => {
    const text = d.toString();
    startupLogs.push(text);
    if (text.includes('Error')) {
      console.error(`[wrangler stderr] ${text.trim()}`);
    }
  });

  let testsPassed = 0;
  let testsFailed = 0;

  function pass(msg) {
    testsPassed++;
    console.log(`  ✓ ${msg}`);
  }

  function fail(msg) {
    testsFailed++;
    console.error(`  ✗ FAIL: ${msg}`);
  }

  try {
    const isReady = await waitForServer(BASE_URL);
    if (!isReady) {
      if (startupLogs.length > 0) {
        console.error('Captured Wrangler Startup Logs:\n' + startupLogs.join(''));
      }
      throw new Error(`Wrangler server failed to become ready at ${BASE_URL} within timeout.`);
    }
    console.log('Cloudflare Workers runtime successfully started.\n');

    // TEST 1: Valid Page Resolution (HTTP 200)
    console.log('1. Valid Route Resolution:');
    const resHome = await fetch(BASE_URL + '/');
    if (resHome.status === 200) {
      const homeText = await resHome.text();
      if (homeText.includes('EXAMPATH LAB') || homeText.includes('ExamPath Lab')) {
        pass('Homepage (/) returns HTTP 200 with verified ExamPath Lab DOM');
      } else {
        fail('Homepage (/) returned 200 but content did not match expected HTML');
      }
    } else {
      fail(`Homepage (/) returned HTTP ${resHome.status}, expected 200`);
    }

    // TEST 2: Custom 404 Resolution (HTTP 404, NOT 200 or SPA fallback)
    console.log('\n2. Nonexistent Route Handling (No SPA Fallback):');
    const res404 = await fetch(BASE_URL + '/random-nonexistent-path-for-testing-404/');
    if (res404.status === 404) {
      const text404 = await res404.text();
      if (text404.includes('404 — Study Guide Not Found') || text404.includes('Study Guide Not Found')) {
        pass('Unknown path returns true HTTP 404 with custom 404.html template (not redirected to /)');
      } else {
        fail('Unknown path returned HTTP 404 but body did not match custom 404.html');
      }
    } else {
      fail(`Unknown path returned HTTP ${res404.status}, expected 404`);
    }

    // TEST 3: Edge Security Headers from public/_headers
    console.log('\n3. Security Headers Verification (from _headers):');
    const nosniff = resHome.headers.get('x-content-type-options');
    const referrer = resHome.headers.get('referrer-policy');
    if (nosniff === 'nosniff') {
      pass('X-Content-Type-Options: nosniff header verified');
    } else {
      fail(`Expected X-Content-Type-Options: nosniff, got: "${nosniff}"`);
    }

    if (referrer === 'strict-origin-when-cross-origin') {
      pass('Referrer-Policy: strict-origin-when-cross-origin header verified');
    } else {
      fail(`Expected Referrer-Policy: strict-origin-when-cross-origin, got: "${referrer}"`);
    }

    // TEST 4: Hashed Asset Immutable Caching Headers
    console.log('\n4. Static Asset Immutable Cache Headers:');
    if (sampleHashedAsset) {
      const assetUrl = `${BASE_URL}/_astro/${sampleHashedAsset}`;
      const resAsset = await fetch(assetUrl);
      const cacheControl = resAsset.headers.get('cache-control') || '';
      if (resAsset.status === 200 && cacheControl.includes('immutable') && cacheControl.includes('max-age=31536000')) {
        pass(`Hashed asset "/_astro/${sampleHashedAsset}" returns Cache-Control: "${cacheControl}"`);
      } else {
        fail(`Hashed asset cache-control invalid: HTTP ${resAsset.status}, Cache-Control: "${cacheControl}"`);
      }
    } else {
      fail('No hashed asset found in dist/_astro/ to verify');
    }

    // TEST 5: HTML Responses Retain Safe Revalidation
    console.log('\n5. HTML Response Cache Revalidation:');
    const homeCacheControl = resHome.headers.get('cache-control') || '';
    if (!homeCacheControl.includes('immutable')) {
      pass(`HTML responses do not contain "immutable" (Cache-Control: "${homeCacheControl || 'default'}")`);
    } else {
      fail(`HTML response incorrectly marked immutable: "${homeCacheControl}"`);
    }

  } catch (err) {
    fail(`Runtime test execution exception: ${err.message}`);
  } finally {
    console.log('\nShutting down Cloudflare Workers runtime process...');
    if (isWindows && child.pid) {
      try {
        execSync(`taskkill /pid ${child.pid} /f /t`, { stdio: 'ignore' });
      } catch {}
    } else {
      child.kill('SIGTERM');
    }
  }

  console.log('\n========================================================');
  console.log(`Cloudflare Runtime Audit: ${testsPassed} Passed | ${testsFailed} Failed`);
  console.log('========================================================\n');

  if (testsFailed > 0) {
    process.exit(1);
  } else {
    console.log('✨ ALL CLOUDFLARE RUNTIME & CACHE ASSERTIONS VERIFIED!\n');
    process.exit(0);
  }
}

runTests();
