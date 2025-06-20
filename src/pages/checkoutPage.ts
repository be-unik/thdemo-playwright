import { Locator, Page } from "@playwright/test";
import { CustomerDetails } from '../utils/dataTypes';

class CheckoutPage {
  // Locators
  private readonly urlString: string;
  readonly shippingMethodCost:  Locator;
  readonly countrySelector: Locator;
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
  
  constructor(private readonly page: Page) {
    this.page = page;
    this.urlString = '/checkout/#shipping';

    this.shippingMethodCost = this.page.locator('Shipping Methods').locator('tbody');
    this.countrySelector = this.page.getByLabel('Country');
    this.firstNameInput = this.page.getByRole('textbox', { name: 'First Name' });
    this.lastNameInput = this.page.getByRole('textbox', { name: 'Last Name' });
    this.streetAddressInput = this.page.getByRole('textbox', { name: 'Street Address: Line 1' });
    this.cityInput = this.page.getByRole('textbox', { name: 'City' });
    this.zipCodeInput = this.page.getByRole('textbox', { name: 'Zip/Postal Code' });
    this.phoneNumberInput = this.page.getByRole('textbox', { name: 'Phone Number' });    
 
    this.goToNextStep = this.page.getByRole('button', { name: 'Next' });

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
  }

  async getShippingCost() {
    const shippingMethodCost = await this.shippingMethodCost.textContent();
    return shippingMethodCost ?? '';
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
  }

  async getOrderTotal() {
    const orderTotal = await this.orderTotal.textContent();
    return orderTotal ?? '';
  }

  async placeOrder() {
    await this.placeOrderButton.click();
    await this.page.waitForLoadState('networkidle');
  }
}
export default CheckoutPage;