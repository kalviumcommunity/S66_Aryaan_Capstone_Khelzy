import { test } from '@playwright/test';
test.setTimeout(900000);
import fs from 'node:fs/promises';

const baseURL = process.env.KHELZY_BASE_URL || 'http://localhost:5173';
const email = process.env.KHELZY_TEST_EMAIL;
const password = process.env.KHELZY_TEST_PASSWORD;
const googleEmail = process.env.KHELZY_GOOGLE_EMAIL || 'aryaanpanwar@gmail.com';
const googleName = process.env.KHELZY_GOOGLE_NAME || 'Aryaan Panwar';
const statePath = process.env.KHELZY_GOOGLE_STORAGE_STATE || 'playwright/.auth/google-user.json';
const trials = Number(process.env.KHELZY_TRIALS || 30);
const warmups = Number(process.env.KHELZY_WARMUPS || 10);
const flow = process.env.KHELZY_AUTH_FLOW || 'all';
const outputDir = 'artifacts/auth-performance';

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const average = (values) => values.reduce((sum, value) => sum + value, 0) / values.length;
const median = (values) => {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};
const standardDeviation = (values) => {
  const mean = average(values);
  return Math.sqrt(average(values.map((value) => (value - mean) ** 2)));
};

async function measure(browser, authFlow, trial, warmup) {
  const contextOptions = authFlow === 'google' ? { storageState: statePath } : {};
  const context = await browser.newContext(contextOptions);
  const page = await context.newPage();
  const startedAt = new Date().toISOString();
  const start = Date.now();
  let result = 'success';
  let error = null;

  try {
    await page.goto(baseURL + '/landing', { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.getByRole('button', { name: 'Browse Games', exact: true }).first().click();
    await page.getByPlaceholder('Enter your email').first().waitFor({ state: 'visible', timeout: 15000 });
    if (authFlow === 'password') {
      await page.getByPlaceholder('Enter your email').first().fill(email);
      await page.getByPlaceholder('••••••••').first().fill(password);
      await page.getByRole('button', { name: 'Sign in', exact: true }).click();
    } else {
      await page.getByRole('button', { name: /google/i }).click();
    }
    await page.waitForURL(/\/home(?:\/|$)/, { timeout: 30000 });
  } catch (cause) {
    result = 'failure';
    error = cause.message;
  }

  const end = Date.now();
  await context.close();
  return { flow: authFlow, trial, warmup, startedAt, durationMs: Number((end - start).toFixed(2)), result, error };
}

async function runFlow(browser, authFlow) {
  const results = [];
  for (let trial = 1; trial <= warmups + trials; trial += 1) {
    results.push(await measure(browser, authFlow, trial, trial <= warmups));
  }
  const measured = results.filter((item) => !item.warmup);
  const successful = measured.filter((item) => item.result === 'success').map((item) => item.durationMs);
  const summary = {
    flow: authFlow,
    totalMeasuredTrials: measured.length,
    successfulTrials: successful.length,
    failedTrials: measured.length - successful.length,
    averageMs: successful.length ? Number(average(successful).toFixed(2)) : null,
    medianMs: successful.length ? Number(median(successful).toFixed(2)) : null,
    minMs: successful.length ? Math.min(...successful) : null,
    maxMs: successful.length ? Math.max(...successful) : null,
    standardDeviationMs: successful.length ? Number(standardDeviation(successful).toFixed(2)) : null,
    googleAccountReference: authFlow === 'google' ? { email: googleEmail, name: googleName } : undefined,
  };
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(`${outputDir}/${authFlow}-raw.json`, JSON.stringify({ summary, results }, null, 2));
  if (!successful.length) throw new Error(`No successful ${authFlow} trials were recorded`);
  return summary;
}

test('measure password and Google OAuth authentication performance', async ({ browser }) => {
  if (!email || !password) throw new Error('KHELZY_TEST_EMAIL and KHELZY_TEST_PASSWORD are required');
  if (flow !== 'password') {
    try { await fs.access(statePath); } catch { throw new Error(`Missing Google OAuth storage state: ${statePath}`); }
  }
  const summaries = [];
  if (flow === 'password' || flow === 'all') summaries.push(await runFlow(browser, 'password'));
  if (flow === 'google' || flow === 'all') summaries.push(await runFlow(browser, 'google'));
  await fs.writeFile(`${outputDir}/summary.json`, JSON.stringify({ baseURL, trials, warmups, summaries }, null, 2));
});
