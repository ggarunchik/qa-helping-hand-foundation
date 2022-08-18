import { test } from '@playwright/test';
import { HomePage } from '../src/pages/home-page';
import { DonateWidgetPage } from '../src/pages/donateWidget-page';

test.describe('Donate widget page test suite', () => {
    let homePage: HomePage;
    let donateWidgetPage: DonateWidgetPage;

    test.beforeEach(async ({ context }) => {
        const page = await context.newPage();
        homePage = new HomePage(page);
        donateWidgetPage = new DonateWidgetPage(page);

        await homePage.goto();
    });

    test('should donate and get declined CC error', async () => {
        await homePage.clickDonateButton();
    });
});
