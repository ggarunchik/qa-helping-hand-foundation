import { expect, Locator, Page, test } from '@playwright/test';

export class CommonElements {
    readonly page: Page;
    readonly loaderIcon: Locator;

    constructor(page: Page) {
        this.page = page;
        this.loaderIcon = page.locator('[class="fun-widget-backdrop"]');
    }

    async waitForLoad() {
        await test.step(`Wait for page to load`, async () => {
            await this.page.waitForTimeout(1000);
            await Promise.all([
                this.page.waitForLoadState(),
                this.page.waitForLoadState('networkidle'),
                this.page.waitForLoadState('domcontentloaded'),
                await expect(this.loaderIcon).toBeHidden(),
            ]);
        });
    }
}
