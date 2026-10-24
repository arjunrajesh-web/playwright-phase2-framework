import { Page, expect } from "@playwright/test";

export class AddressPage {

    constructor(private page: Page) {

    }
    private get editBillingLink() {
        return this.page.getByRole(
            'link',
            { name: 'Edit Billing address' }
        );

    }
    private get firstname() {
        return this.page.getByLabel('First name')
    }
    private get lastname() {
        return this.page.getByLabel('Last name')
    }
    private get streetaddress() {
        return this.page.getByLabel('Street address')
    }

    private get town
}