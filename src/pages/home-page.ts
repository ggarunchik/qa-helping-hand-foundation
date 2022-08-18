import { FrameLocator, Locator, Page, test } from '@playwright/test';
import { CommonElements } from './common-elements';

export class HomePage extends CommonElements {
    readonly frame: FrameLocator;
    readonly titleText: Locator;
    readonly donateButton: Locator;

    constructor(page: Page) {
        super(page);
        this.frame = page.frameLocator('[title="Donate Button"]');
        this.titleText = this.page.locator('text="Click me"');
        this.donateButton = this.frame.locator('[qa*="fun-element"]');
    }

    async goto() {
        await test.step('Go to the home page ', async () => {
            await this.page.goto('/qa-test-7R58U3/');
            let test = process.env.BASE_URL;
            console.log(test);
            await this.waitForLoad();
        });
    }

    async clickDonateButton() {
        await test.step('Click on donate button', async () => {
            await this.donateButton.click();
            await this.waitForLoad();
        });
    }
}
