
import { test as base, type BrowserContext, type Page } from '@playwright/test'
import path from 'path'

// STEP 1: Get the path of the saved login information file
const authFile = path.join(__dirname, '..', 'auth', 'storageState.json')

// STEP 2: Define the type of our custom fixture
// loggedInpage will provide a Playwright browser page
type AuthFixtures = {
    loggedInpage: Page
}

// STEP 3: Create a custom Playwright test fixture
export const test = base.extend<AuthFixtures>({

    // STEP 4: Start creating our loggedInpage fixture
    // browser is provided automatically by Playwright
    // use allows us to give the prepared page to the test
    loggedInpage: async ({ browser }, use) => {

        // STEP 5: Create a new browser session
        // Load saved login information from storageState.json
        const context: BrowserContext =  await browser.newContext({
            storageState: authFile
        })

        // STEP 6: Create a new browser tab inside that session
        const page: Page = await context.newPage()

        // STEP 7: Give this page to the test
        // The test can now use loggedInpage to interact with the website
        await use(page)

        // STEP 8: After the test finishes, close the browser session
        // This cleans up the context created by this fixture
        await context.close()
    }
})

// STEP 9: Export expect so other test files can import it from this fixture
export { expect } from '@playwright/test'
