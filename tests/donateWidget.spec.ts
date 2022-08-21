import { expect, test } from '@playwright/test';
import { HomePage } from '../src/pages/home-page';
import { DonateWidgetPage } from '../src/pages/donateWidget-page';
import { CreditCard } from '../src/types/creditCard';
import { PersonalData } from '../src/types/personalData';
import { Goal } from '../src/types/goal';

test.describe.parallel('Donate widget page test suite', () => {
    let homePage: HomePage;
    let donateWidgetPage: DonateWidgetPage;

    test.beforeEach(async ({ context }) => {
        const page = await context.newPage();
        homePage = new HomePage(page);
        donateWidgetPage = new DonateWidgetPage(page);

        await homePage.goto();
    });

    test('should donate and get declined CC error', async () => {
        const creditCard: CreditCard = {
            cardNumber: '4242 4242 4242 4242',
            cardExpDate: '0424',
            cardCvc: '000',
        };

        const personalData: PersonalData = {
            firstName: 'TestUser',
            lastName: 'Automation',
            email: 'garunchikgleb@gmail.com',
        };

        await homePage.clickDonateButton();
        await donateWidgetPage.selectRepeatTypeMonthly();
        await donateWidgetPage.inputAmountOfDonation('100');
        await donateWidgetPage.selectDonationGoal(Goal.HHP);
        await donateWidgetPage.clickDonateButton();
        await donateWidgetPage.setCoverCostsCheckBox(false);
        await donateWidgetPage.selectCreditCardPayment();
        await donateWidgetPage.enterCreditCardData(creditCard);
        await donateWidgetPage.clickContinueButton();
        await donateWidgetPage.enterPersonalData(personalData);
        await donateWidgetPage.clickPrivacyContinueButton();
        await expect(donateWidgetPage.donationErrorTitle).toHaveText(donateWidgetPage.DONATION_ERROR_TITLE_TEXT);
        await expect(donateWidgetPage.donationErrorBody).toHaveText(donateWidgetPage.DONATION_ERROR_BODY_TEXT);
        await expect(donateWidgetPage.errorDoneButton).toBeVisible();
    });

    test('should donate and get declined CC error parallel', async () => {
        const creditCard: CreditCard = {
            cardNumber: '4242 4242 4242 4242',
            cardExpDate: '0424',
            cardCvc: '000',
        };

        const personalData: PersonalData = {
            firstName: 'TestUser',
            lastName: 'Automation',
            email: 'garunchikgleb@gmail.com',
        };

        await homePage.clickDonateButton();
        await donateWidgetPage.selectRepeatTypeMonthly();
        await donateWidgetPage.inputAmountOfDonation('100');
        await donateWidgetPage.selectDonationGoal(Goal.HHP);
        await donateWidgetPage.clickDonateButton();
        await donateWidgetPage.setCoverCostsCheckBox(false);
        await donateWidgetPage.selectCreditCardPayment();
        await donateWidgetPage.enterCreditCardData(creditCard);
        await donateWidgetPage.clickContinueButton();
        await donateWidgetPage.enterPersonalData(personalData);
        await donateWidgetPage.clickPrivacyContinueButton();
        await expect(donateWidgetPage.donationErrorTitle).toHaveText(donateWidgetPage.DONATION_ERROR_TITLE_TEXT);
        await expect(donateWidgetPage.donationErrorBody).toHaveText(donateWidgetPage.DONATION_ERROR_BODY_TEXT);
        await expect(donateWidgetPage.errorDoneButton).toBeVisible();
    });
});
