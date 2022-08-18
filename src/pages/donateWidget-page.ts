import { CommonElements } from './common-elements';
import { FrameLocator, Page } from '@playwright/test';

export class DonateWidgetPage extends CommonElements {
    readonly frame: FrameLocator;

    constructor(page: Page) {
        super(page);
        this.frame = page.frameLocator('[title="Donation Widget"]');
    }
}
