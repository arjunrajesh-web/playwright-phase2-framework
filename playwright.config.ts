import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config({ quiet: true });

if (!process.env.BASE_URL) throw new Error('BASE_URL is not set');
if (!process.env.DEMO_USER) throw new Error('DEMO_USER is not set');
if (!process.env.DEMO_PASS) throw new Error('DEMO_PASS is not set');

const isCI = !!process.env.CI;

export default defineConfig({
    testDir: './tests',
    timeout: 40 * 1000,
    expect: { timeout: 40 * 1000 },
    forbidOnly: isCI,
    retries: isCI ? 1 : 0,
    reporter: [['html', { open: 'never' }]],

    projects: [
        {
            name: 'setup',
            testDir: './helpers',
            testMatch: 'auth.setup.ts',
            use: {
                ...devices['Desktop Chrome'],
                headless: isCI,
                baseURL: process.env.BASE_URL,
            },
        },
        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
                headless: isCI,
                baseURL: process.env.BASE_URL,
            },
            dependencies: ['setup'],
        },
    ],
});