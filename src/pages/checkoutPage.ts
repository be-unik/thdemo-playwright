import { Locator, Page } from "@playwright/test";
import { CustomerDetails } from '../utils/dataTypes';

class CheckoutPage {
  // Locators
  private readonly urlString: string;
  readonly shippingMethodCost:  Locator;
  readonly countrySelector: Locator;
  readonly emailInput: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly streetAddressInput: Locator;
  readonly cityInput: Locator;
  readonly zipCodeInput: Locator;
  readonly phoneNumberInput: Locator;
  readonly goToNextStep: Locator; 
  readonly applyDiscountCodeExpandButton: Locator;
  readonly applyDiscountCodeInput: Locator;
  readonly applyDiscountCodeButton: Locator;
  readonly orderTotal: Locator;
  readonly placeOrderButton: Locator;
  readonly discountSuccessMessage: Locator;
  
  constructor(private readonly page: Page) {
    this.page = page;
    this.urlString = '/checkout/#shipping';

    this.shippingMethodCost = this.page.locator('#co-shipping-method-form span.price').last();
    this.emailInput = this.page.locator('#customer-email-fieldset #customer-email');
    this.countrySelector = this.page.getByLabel('Country');
    this.firstNameInput = this.page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = this.page.getByRole('textbox', { name: 'Last Name' });
    this.streetAddressInput = this.page.getByRole('textbox', { name: 'Street Address: Line 1' });
    this.cityInput = this.page.getByRole('textbox', { name: 'City' });
    this.zipCodeInput = this.page.getByRole('textbox', { name: 'Zip/Postal Code' });
    this.phoneNumberInput = this.page.getByRole('textbox', { name: 'Phone Number' });    
 
    this.goToNextStep = this.page.getByRole('button', { name: 'Next' });
    this.discountSuccessMessage = this.page.locator('.message-success').locator('div');

    this.applyDiscountCodeExpandButton = this.page.getByRole('heading', { name: 'Apply Discount Code' });
    this.applyDiscountCodeInput = this.page.getByRole('textbox', { name: 'Enter discount code' });
    this.applyDiscountCodeButton = this.page.getByRole('button', { name: 'Apply Discount' });
    this.orderTotal = this.page.locator('.grand .price');
    this.placeOrderButton = this.page.getByRole('button', { name: 'Place Order' });
  }

  async goToCheckout() {
    await this.page.goto(this.urlString);
    await this.page.waitForLoadState('networkidle');
  }

  async fillShippingDetails(cData: CustomerDetails) {
    await this.countrySelector.selectOption(cData.country);
    await this.page.waitForTimeout(2000);

    await this.emailInput.click();
    await this.emailInput.fill(cData.email);
    await this.firstNameInput.click();
    await this.firstNameInput.fill(cData.firstName);
    await this.lastNameInput.click();
    await this.lastNameInput.fill(cData.lastName);
    await this.streetAddressInput.click();
    await this.streetAddressInput.fill(cData.streetAddress);
    await this.cityInput.click();
    await this.cityInput.fill(cData.city);
    await this.zipCodeInput.click();
    await this.zipCodeInput.fill(cData.zipCode);
    await this.phoneNumberInput.click();
    await this.phoneNumberInput.fill(cData.phoneNumber);  
    await this.page.waitForLoadState('networkidle');
  }

  async getShippingCost() {
    await this.shippingMethodCost.waitFor({ state: 'visible' });
    const shippingMethodCost = (await this.shippingMethodCost.textContent())?.replace('$', '');
    return parseInt(shippingMethodCost ?? '', 10) || 0;
  }

  async proceedToPaymentStep() {
    await this.goToNextStep.click();
    await this.page.waitForLoadState('networkidle');
  }

  async applyDiscountCode(code: string) {
    await this.applyDiscountCodeExpandButton.click();
    await this.applyDiscountCodeInput.click();
    await this.applyDiscountCodeInput.fill(code);
    await this.applyDiscountCodeButton.click();
    await this.page.waitForTimeout(5000); // Hard wait for the discount to be applied
    await this.page.waitForLoadState('domcontentloaded');
  }

  async getOrderTotal() {
    const orderTotal = (await this.orderTotal.textContent())?.replace('$', '');
    return parseInt(orderTotal ?? '', 10) || 0;
  }

  async getDiscountMessage() {
    await this.discountSuccessMessage.waitFor({ state: 'visible' });
    return await this.discountSuccessMessage.textContent();
}

  async placeOrder() {
    await this.placeOrderButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
export default CheckoutPage;