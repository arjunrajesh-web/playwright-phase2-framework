import {test as setup,expect} from '@playwright/test'
import path from 'path'


// auth state output path
const authFile = path.join(__dirname, '..', 'auth', 'storageState.json')

// login credations
const loginData = {
    user: process.env.DEMO_USER!,
    password: process.env.DEMO_PASS!,
    baseUrl:process.env.BASE_URL!
};

// setup :authentaion once and save session

setup("authenticate and save session",async({page,context})=>{
    await page.goto(loginData.baseUrl);

    await page.getByRole('textbox', {
        name: 'Username or email address'
    }).fill(loginData.user);

    await page.getByRole('textbox', {
        name: 'Password  Required'
    }).fill(loginData.password);

    await page.getByRole('button', {
        name: 'Log in'
    }).click();

    await expect(
        page.getByLabel('Account pages')
            .getByRole('link', { name: 'Log out' })
    ).toBeVisible();

    await context.storageState({path:authFile})
})