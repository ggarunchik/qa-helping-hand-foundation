import { CommonElements } from './common-elements';
import { expect, FrameLocator, Locator, Page, test } from '@playwright/test';
import { CreditCard } from '../types/creditCard';
import { PersonalData } from '../types/personalData';

export class DonateWidgetPage extends CommonElements {
    readonly frame: FrameLocator;

    // Secure donation locators
    readonly closeWidgetButton: Locator;
    readonly giveOnesButton: Locator;
    readonly monthlyButton: Locator;
    readonly donateButton: Locator;
    readonly amountInput: Locator;
    readonly currencySelector: Locator;
    readonly currencySelectorOption: Locator;
    readonly tributeCheckbox: Locator;
    readonly tributeText: Locator;
    readonly tributeName: Locator;
    readonly goalSelector: Locator;

    // Payment option locators
    readonly creditCardButton: Locator;
    readonly googlePlayButton: Locator;
    readonly clickToPayButton: Locator;
    readonly bankTransferPayButton: Locator;
    readonly continuePaymentButton: Locator;
    readonly coverTransactionCheckBox: Locator;
    readonly starIcon: Locator;
    readonly coverTable: Locator;
    readonly coverTooltip: Locator;

    // Credit card locators
    readonly privacyContinueButton: Locator;
    readonly paymentCreditTitle: Locator;
    readonly cardNumberInput: Locator;
    readonly cardExpDateInput: Locator;
    readonly cardCvcInput: Locator;
    readonly donationErrorTitle: Locator;
    readonly donationErrorBody: Locator;
    readonly errorDoneButton: Locator;

    // Personal info locators
    readonly paymentHeaderTitle: Locator;
    readonly personalInformation: Locator;
    readonly firstNameInput: Locator;
    readonly lastNameInput: Locator;
    readonly emailInput: Locator;

    readonly amountOption = (option) => this.frame.locator(`input[value='${option}']`);

    readonly DONATION_ERROR_TITLE_TEXT = 'Your card was declined.';
    readonly DONATION_ERROR_BODY_TEXT =
        'This could be due to any of several reasons: incorrect security code, insufficient funds, card limit, card disabled, etc.';

    constructor(page: Page) {
        super(page);

        const widgetFrame = (this.frame = page.frameLocator('[title="Donation Widget"]'));
        const cardNameFrame = widgetFrame.frameLocator('[title="Secure card number input frame"]');
        const cardExpDateFrame = widgetFrame.frameLocator('[title="Secure expiration date input frame"]');
        const cardCvcFrame = widgetFrame.frameLocator('[title="Secure CVC input frame"]');

        // Secure donation locators
        this.closeWidgetButton = widgetFrame.locator('[data-qa="global-close"]');
        this.giveOnesButton = widgetFrame.locator('[data-qa="give-once"]');
        this.monthlyButton = widgetFrame.locator('[data-qa="give-monthly"]');
        this.donateButton = widgetFrame.locator('[data-qa="donate-button"]');
        this.amountInput = widgetFrame.locator('[data-qa="amount"]');
        this.tributeCheckbox = widgetFrame.locator('[data-qa="tribute-give-checkbox"]');
        this.tributeText = widgetFrame.locator('[data-qa="tribute-label"]');
        this.tributeName = widgetFrame.locator('[data-qa="tribute-name"]');
        this.currencySelector = widgetFrame.locator('[data-qa="currency-selector"]');
        this.currencySelectorOption = widgetFrame.locator('[data-qa="currency-selector"] optgroup option');
        this.goalSelector = widgetFrame.locator('[data-qa="goal-selector"]');

        // Payment option locators
        this.creditCardButton = widgetFrame.locator('[data-qa="cc-button"]');
        this.googlePlayButton = widgetFrame.locator('[class*="btn-google-pay"]');
        this.clickToPayButton = widgetFrame.locator('[data-qa="click-to-pay-button"]');
        this.bankTransferPayButton = widgetFrame.locator('[data-qa="plaid-button"]');
        this.paymentHeaderTitle = widgetFrame.locator('text="Payment option"');
        this.coverTransactionCheckBox = widgetFrame.locator('[data-qa="cover-fee-checkbox"]');
        this.starIcon = widgetFrame.locator('[class="animated-stars-enter-done"]');
        this.coverTable = widgetFrame.locator('[data-qa="cover-fee-table"]');
        this.coverTooltip = widgetFrame.locator('[data-qa="cover-fee-tooltip"] div');

        // Credit card locators
        this.privacyContinueButton = widgetFrame.locator('[data-qa="privacy-continue"]');
        this.paymentCreditTitle = widgetFrame.locator('text="Credit card"').first();
        this.cardNumberInput = cardNameFrame.locator('[name="cardnumber"]');
        this.cardExpDateInput = cardExpDateFrame.locator('[name="exp-date"]');
        this.cardCvcInput = cardCvcFrame.locator('[name="cvc"]');
        this.continuePaymentButton = widgetFrame.locator('[data-qa="card-continue"]');
        this.donationErrorTitle = widgetFrame.locator('[data-qa="card-continue-error-title"]');
        this.donationErrorBody = widgetFrame.locator('[data-qa="card-continue-error-message"]');
        this.errorDoneButton = widgetFrame.locator(
            '[class="btn btn-payment processing error"]>span[class="done-mark"]',
        );

        // Personal info locators
        this.personalInformation = widgetFrame.locator('text="Personal information"').first();
        this.firstNameInput = widgetFrame.locator('[data-qa="personal-first-name"]').first();
        this.lastNameInput = widgetFrame.locator('[data-qa="personal-last-name"]').first();
        this.emailInput = widgetFrame.locator('[data-qa="personal-email"]').first();
    }

    async selectRepeatTypeOnce() {
        await test.step(`Select donation period type: Once`, async () => {
            await this.giveOnesButton.click();
            await expect(this.donateButton).toHaveText('Donate');
        });
    }

    async selectRepeatTypeMonthly() {
        await test.step(`Select donation period type: Monthly`, async () => {
            await this.monthlyButton.click();
            await expect(this.donateButton).toHaveText('Donate monthly');
        });
    }

    async selectAmountOfDonation(amount: string) {
        await test.step(`Select amount of donation radio button: ${amount}`, async () => {
            await this.amountOption(amount).click();
        });
    }

    async inputAmountOfDonation(amount: string) {
        await test.step(`Input amount of donation: ${amount}`, async () => {
            await this.amountInput.fill(amount);
            await expect(this.amountInput).toHaveValue(amount);
        });
    }

    async clickDonateButton() {
        await test.step('Click on donate button', async () => {
            await Promise.all([
                this.donateButton.click(),
                this.paymentHeaderTitle.isVisible(),
                this.creditCardButton.isVisible(),
            ]);
            await this.waitForLoad();
        });
    }

    async setCoverCostsCheckBox(mode: boolean) {
        await test.step(`Set covert transaction checkbox to: '${mode}'`, async () => {
            const isChecked = await this.coverTransactionCheckBox.getAttribute('aria-checked');
            if (JSON.parse(isChecked) !== mode) {
                await this.coverTransactionCheckBox.click();
                await expect(this.starIcon).toBeHidden();
                await expect(this.coverTable).toBeHidden();
            } else {
                await expect(this.starIcon).toBeVisible();
                await expect(this.coverTable).toBeVisible();
                await expect(this.coverTooltip).toBeVisible();
            }
        });
    }

    async selectCreditCardPayment() {
        await test.step(`Select credit card payment`, async () => {
            await Promise.all([this.creditCardButton.click(), this.paymentCreditTitle.isVisible()]);
        });
    }

    async enterCreditCardData(cardData: CreditCard) {
        await test.step(`Enter credit card data`, async () => {
            await this.cardNumberInput.fill(cardData.cardNumber);
            await this.cardExpDateInput.fill(cardData.cardExpDate);
            await this.cardCvcInput.fill(cardData.cardCvc);
        });
    }

    async clickContinueButton() {
        await test.step(`Click continue payment button`, async () => {
            await Promise.all([this.continuePaymentButton.click(), this.personalInformation.isVisible()]);
        });
    }

    async enterPersonalData(personalDetails: PersonalData) {
        await test.step(`Enter credit card data`, async () => {
            await this.firstNameInput.fill(personalDetails.firstName);
            await this.lastNameInput.fill(personalDetails.lastName);
            await this.emailInput.fill(personalDetails.email);
        });
    }

    async clickPrivacyContinueButton() {
        await test.step(`Click continue button`, async () => {
            await this.privacyContinueButton.click();
        });
    }

    async selectDonationGoal(goal: string) {
        await test.step(`Select donation goal: ${goal}`, async () => {
            await this.goalSelector.selectOption({ label: goal });
        });
    }
}
