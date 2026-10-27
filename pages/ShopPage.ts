
import { Page, expect } from '@playwright/test'

export class ShopPage {
    constructor(private page: Page) {

    }

    private get demoshopeHeading() {
        return this.page.getByRole('heading', { name: 'DemoShop' })

    }

    private get productList() {
        return this.page.locator('ul.products li')
    }

    private get searchBox() {
        return this.page.getByRole('searchbox', { name: 'Search' })
    }

    private get searchButton() {
        return this.page.getByRole('button', { name: 'Search' })
    }

    private get priceFilterInput() {
        return this.page.getByRole('textbox', {
            name: 'Filter products by maximum'
        })

    }

    private get cartLink() {
        return this.page.getByRole('link', {
            name: /View Shopping Cart/i
        })
    }


    // ----------------------------------
    // Action
    // ----------------------------------

    async navigate() {

        this.page.goto("demoshop/")

        // await page.getByRole('link', { name: 'DemoShop' }).click();

        await expect(
            this.demoshopeHeading
        ).toBeVisible();

        await this.productList
            .first()
            .waitFor({ state: 'visible' });


    }

    async search(keyword: string) {

        await this.searchBox
            .fill(keyword);

        await this.page.getByRole('button', { name: 'Search' }).click();

        await expect(
            this.searchButton
        ).toBeVisible();

        // Verify every result contains the search keyword

        await this.productList.first().waitFor({ state: 'visible' });
        const count = await this.productList.count();

        for (let i = 0; i < count; i++) {
            const title = await this.productList.nth(i)
                .getByRole('heading')
                .textContent();
            expect(title?.toLowerCase())
                .toContain(keyword.toLowerCase());
        }

    }

    async applyPriceFilter(maxPrice: string) {
        await this.priceFilterInput
            .fill(maxPrice);

        // Convert "$25" to numeric 25 for comparison
        const maxPriceNum = Number(
            maxPrice.replace('$', '')
        );

        await this.page.getByText(`Up to $${maxPriceNum}`)
            .waitFor({ state: 'visible' });

        // Verify every product is within the price range
        // const products = this.page.locator('ul.products li');
        await this.productList.first().waitFor({ state: 'visible' });
        const count = await this.productList.count();

        for (let i = 0; i < count; i++) {
            const priceText = await this.productList.nth(i)
                .locator('.price')
                .textContent();
            const price = Number(
                priceText?.replace(/[^0-9.]/g, '')
            );
            expect(price).toBeLessThanOrEqual(maxPriceNum);
        }
    }

    async addFirstProductToCart() {

        await this.productList.first().waitFor({ state: 'visible' });

        const firstProduct = this.productList.first();
        const productName = await firstProduct
            .getByRole('heading')
            .textContent();
        expect(productName).toBeTruthy();

        // Click Add to Cart and verify button state changes
        const addToCartButton = firstProduct.getByRole('button', {
            name: /Add to cart/i
        });
        await addToCartButton.click();
        await expect(addToCartButton).toHaveClass(/added/);

        // Navigate to cart and verify product is present
        // const cartLink = this.page.getByRole('link', {
        //     name: /View Shopping Cart/i
        // });
        await expect(this.cartLink).toBeVisible();
        await Promise.all([
            this.page.waitForURL(/mycart/),
            this.cartLink.click()
        ]);

        await this.page.waitForLoadState('domcontentloaded');

        await expect(
            this.page.getByText(productName!, { exact: true })
        ).toBeVisible();

        return productName

    }

    async openProductInNewTab(productname: string) {
        const productLink = this.page
            .getByRole('link', { name: productname })
            .first();

        // Verify the link is configured to open in a new tab
        await expect(productLink).toHaveAttribute('target', '_blank');

        // Listen for the new page event BEFORE clicking the link
        // Promise.all prevents a race condition where the tab opens
        // before Playwright starts listening for it.
        const [productTab] = await Promise.all([
            this.page.context().waitForEvent('page'),
            productLink.click()
        ]);

        // console.log(productTab)

        // Wait until the new page finishes loading
        await productTab.waitForLoadState();
        return productTab
    }

}

