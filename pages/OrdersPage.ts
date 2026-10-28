import { Page, expect } from '@playwright/test'

export class Orderpage {
    constructor(private page: Page) {

    }


    private get myAccountLink() {
        return this.page.getByRole('link', {
            name: /my account/i
        })
    }

    private get orderLink() {
        return this.page.getByRole('link', {
            name: 'Orders',
            exact: true
        })
    }

    private get ordersTable() {
        return this.page.getByRole('table');
    }


    
    async verifyOrderExists(orderId:string){

        
                    // Find the row for the specific order
                    const orderRow = this.ordersTable.getByRole('row')
                        .filter({
                            has: this.page.getByRole('link', {
                                name: `View order number ${orderId}`
                            })
                        });

                    // Verify view order link is visible
                    const viewOrderLink = orderRow.getByRole('link', {
                        name: `View order ${orderId}`
                    });
                    await expect(viewOrderLink).toBeVisible();

                    // Open order detail page
                    await Promise.all([
                        this.page.waitForURL(/view-order/),
                        viewOrderLink.click()
                    ]);

                    await this.page.waitForLoadState('domcontentloaded');

                    // Verify correct order page opened
                    await expect(
                        this.page.getByRole('heading', {
                            name: `Order #${orderId}`
                        })
                    ).toBeVisible();

    }

} 