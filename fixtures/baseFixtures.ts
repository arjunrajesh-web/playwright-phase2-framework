import { test as base, BrowserContext, expect } from '@playwright/test'
import path from 'path'

const authFile = path.join(__dirname, '..', 'auth', "storageState.json")


type AuthFixtures = {
    loggedInpage: page
}

export const test = base.extend<AuthFixtures>({
    loggedInpage: async ({ browser }, use) => {

        const context: BrowserContext = await browser.newContext({
            storageState: authFile
        })

        const page: page = await context.newPage()
        await use(page)

       await  context.close()

    }
})