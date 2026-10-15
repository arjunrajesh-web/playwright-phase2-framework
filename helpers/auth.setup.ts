
import { test as setup, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'

// Location where the login session will be saved
const authDir = path.join(__dirname, '..', 'auth')
const authFile = path.join(authDir, 'storageState.json')

// Create the auth folder if it does not exist
fs.mkdirSync(authDir, { recursive: true })

// Read login details from environment variables
const baseUrl = process.env.BASE_URL
const username = process.env.DEMO_USER
const password = process.env.DEMO_PASS

if (!baseUrl || !username || !password) {
    throw new Error('BASE_URL, DEMO_USER, or DEMO_PASS is missing')
}

// Log in and save the session
setup('authenticate and save session', async ({ page, context }) => {
    await page.goto(baseUrl)

    await page.getByRole('textbox', {
        name: 'Username or email address'
    }).fill(username)

    await page.getByRole('textbox', {
        name: 'Password  Required'
    }).fill(password)

    await page.getByRole('button', {
        name: 'Log in'
    }).click()

    await expect(
        page.getByLabel('Account pages')
            .getByRole('link', { name: 'Log out' })
    ).toBeVisible()

    await context.storageState({ path: authFile })
})
