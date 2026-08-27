import { chromium } from '@playwright/test';
import fs from 'node:fs/promises';

const baseURL = process.env.KHELZY_BASE_URL || 'http://localhost:5173';
const statePath = process.env.KHELZY_GOOGLE_STORAGE_STATE || 'playwright/.auth/google-user.json';

await fs.mkdir('playwright/.auth', { recursive: true });
const browser = await chromium.launch({ headless: false });
const context = await browser.newContext();
const page = await context.newPage();

console.log(`Open ${baseURL}/login and complete Google sign-in manually.`);
console.log('Use the authorized Google account, then close this browser window.');
await page.goto(`${baseURL}/login`);
await page.waitForURL(/\/home(?:\/|$)/, { timeout: 300000 });
await context.storageState({ path: statePath });
await browser.close();
console.log(`Saved OAuth storage state to ${statePath}`);
