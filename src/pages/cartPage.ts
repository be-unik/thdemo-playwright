import { Locator, Page } from "@playwright/test";

class CartPage {

    //Locators and URL
    private readonly urlString: string;
    readonly miniCartQuantity: Locator;
    readonly miniCartPName: Locator;
    readonly miniCartPPrice: Locator;
    readonly miniCartPQuantity: Locator;
    readonly pName: Locator;
    readonly pPrice: Locator;
    readonly pDetails: Locator;
    readonly orderGrandTotal: Locator;
    readonly miniCartGrandTotal: Locator;
    readonly discountSectionExpandButton: Locator;
    readonly applyDiscountCodeInput: Locator;
    readonly applyDiscountCodeButton: Locator;
    readonly discountSuccessMessage: Locator;
    readonly proceedToCheckoutButton: Locator;
    readonly shoppingCart: Locator;
    readonly expandEstimateShippingCost: Locator; 
    readonly countryDropdown: Locator;
    readonly shippingCostEstimate: Locator;
    readonly shippingCostInOrderSummary: Locator;

    constructor(private readonly page: Page) {
        this.urlString = '/checkout/cart/';
        this.miniCartQuantity = this.page.locator('.showcart .counter-number');
        this.miniCartPName = this.page.locator('.minicart-items .product-item-name');
        this.miniCartPPrice = this.page.locator('.minicart-items .minicart-price');
        this.miniCartPQuantity = this.page.locator('.minicart-items .cart-item-qty');
        this.pName = this.page.locator('.product-item-name');
        this.pPrice = this.page.locator('.product-item-price');
        this.pDetails = this.page.locator('.product-item-details .item-options');
        this.orderGrandTotal = this.page.locator('.grand span.price');
        this.miniCartGrandTotal = this.page.locator('.minicart-items .price-container');
        this.discountSectionExpandButton = this.page.getByRole('heading', { name: 'Apply Discount Code' });
        this.applyDiscountCodeInput = this.page.getByRole('textbox', { name: 'Enter discount code' });
        this.applyDiscountCodeButton = this.page.getByRole('button', { name: 'Apply Discount' });
        this.discountSuccessMessage = this.page.locator('.message-success').locator('div');
        this.proceedToCheckoutButton = this.page.getByRole('button', { name: 'Proceed to Checkout' });
        this.shoppingCart = this.page.getByRole('heading', { name: 'Shopping Cart' });
        this.expandEstimateShippingCost = this.page.locator('#block-shipping-heading');
        this.countryDropdown = this.page.locator('[name="country_id"]');
        this.shippingCostEstimate = this.page.locator('#co-shipping-method-form span.price').last();
        this.shippingCostInOrderSummary = this.page.locator('.shipping .amount .price');
    }

    async gotoCart() {
        await this.page.goto(this.urlString);
        await this.page.waitForLoadState('networkidle');
    }

    async getCartQuantity() {
        // Get the cart quantity from minicart icon
        await this.miniCartQuantity.waitFor({ state: 'visible' });
        const cartQuantity = await this.miniCartQuantity.textContent();
        return parseInt(cartQuantity ?? '', 10) || 0;
    }

    async getLastProductAttributesInMiniCart() {
        const miniCartProductName = await this.miniCartPName.textContent();
        const miniCartProductPrice = await this.miniCartPPrice.textContent();
        const miniCartProductQuatity = parseInt(await this.miniCartPQuantity.getAttribute("data-item-qty") ?? '', 10);
        return [miniCartProductName, miniCartProductPrice, miniCartProductQuatity];
    }
    
    async getProductAttributesInCart(productSize: string = '', productColor: string = '') {
        const cartProductName = await this.pName.textContent();
        const cartProductPrice = await this.pPrice.textContent();
        let cartProductSize = ''
        let cartProductColor = '';
        if (productSize) {
            const cartProductSizeLocator = this.pDetails.getByText(productSize);
            await cartProductSizeLocator.waitFor({ state: 'visible' });
            cartProductSize = (await cartProductSizeLocator.textContent()) ?? '';
        }
        if (productColor) {
            cartProductColor = (await this.pDetails.getByText(productColor).textContent()) ?? '';
        }
        return [cartProductName, cartProductPrice, cartProductSize, cartProductColor];
    }

    async getOrderTotal() {
        // await this.page.waitForLoadState('domcontentloaded');
        const orderTotal = (await this.orderGrandTotal.textContent())?.replace('$', '');
        return parseFloat(orderTotal ?? '') || 0;
    }

    async getMiniCartSubtotal() {
        const miniCartSubtotal = (await this.miniCartGrandTotal.textContent())?.replace('$', '');
        return parseInt(miniCartSubtotal ?? '', 10) ?? 0;
    }

    async applyDiscountCode(code: string) {
        await this.discountSectionExpandButton.waitFor({ state: 'visible' });
        await this.discountSectionExpandButton.click();

        await this.applyDiscountCodeInput.waitFor({ state: 'visible' });
        await this.applyDiscountCodeInput.click();
        await this.applyDiscountCodeInput.fill(code);
        await this.applyDiscountCodeButton.click();
        await this.page.waitForTimeout(5000); // Hard wait to allow the discount to be applied
        await this.page.waitForLoadState('domcontentloaded');
    }

    async proceedToCheckout() {
        await this.proceedToCheckoutButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async getDiscountMessage() {
        await this.discountSuccessMessage.waitFor({ state: 'visible' });
        return await this.discountSuccessMessage.textContent();
    }

    async getShippingCostEstimate(country: string) {
        await this.expandEstimateShippingCost.waitFor({ state: 'visible' });
        await this.expandEstimateShippingCost.click();
        await this.countryDropdown.waitFor({ state: 'visible' });
        await this.countryDropdown.click();
        await this.countryDropdown.selectOption(country);
        await this.page.waitForLoadState('networkidle');
        // Extract the shipping cost from the estimate
        await this.shippingCostEstimate.waitFor({ state: 'visible' });
        const shippingCost = (await this.shippingCostEstimate.textContent())?.replace('$', '');
        return parseInt(shippingCost ?? '') || 0;
    }

    async getShippingCostInOrderSummary() {
        await this.page.waitForTimeout(5000); // Wait for any potential loading
        await this.shippingCostInOrderSummary.waitFor({ state: 'visible' });
        const shippingCostInSummary = (await this.shippingCostInOrderSummary.textContent())?.replace('$', '');
        return parseInt(shippingCostInSummary ?? '') || 0;
    }
}
export default CartPage;