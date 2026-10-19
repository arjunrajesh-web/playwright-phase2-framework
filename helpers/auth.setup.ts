
import { test as setup, expect } from '@playwright/test'
import fs from 'node:fs'
import path from 'node:path'
import { LOginPage } from '../pages/LoginPage'

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
    throw new Error(
        'BASE_URL, DEMO_USER, or DEMO_PASS is missing'
    )
}

setup('authenticate and save session', async ({ page, context }) => {
  
const LoginPage = new LOginPage(page)

    // Open the website
    await page.goto(baseUrl)

    await LoginPage.Login(username,password)

    // Enter username
    // await page.getByRole('textbox', {
    //     name: 'Username or email address'
    // }).fill(username)

    
    // Enter password
    // await page.getByRole('textbox', {
    //     name: 'Password  Required'
    // }).fill(password)

    // Click Log in
    await page.getByRole('button', {
        name: 'Log in'
    }).click()

    

    // Verify successful login
    await expect(
        page.getByLabel('Account pages')
            .getByRole('link', { name: 'Log out' })
    ).toBeVisible()

    // Save the authenticated browser session
    await context.storageState({
        path: authFile
    })
})
