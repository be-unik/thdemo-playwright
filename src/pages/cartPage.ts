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

    constructor(private readonly page: Page) {
        this.urlString = '/checkout/cart/';
        this.miniCartQuantity = this.page.locator('.showcart .counter-number');
        this.miniCartPName = this.page.locator('.minicart-items .product-item-name');
        this.miniCartPPrice = this.page.locator('.minicart-items .minicart-price');
        this.miniCartPQuantity = this.page.locator('.minicart-items .cart-item-qty');
        this.pName = this.page.locator('.product-item-name');
        this.pPrice = this.page.locator('.product-item-price');
        this.pDetails = this.page.locator('.product-item-details .item-options');
        this.orderGrandTotal = this.page.locator('.grand .price');
        this.miniCartGrandTotal = this.page.locator('.minicart-items .price-container');
        this.discountSectionExpandButton = this.page.getByRole('heading', { name: 'Apply Discount Code' });
        this.applyDiscountCodeInput = this.page.getByRole('textbox', { name: 'Enter discount code' });
        this.applyDiscountCodeButton = this.page.getByRole('button', { name: 'Apply Discount' });
        this.discountSuccessMessage = this.page.locator('.message-success').locator('div');
        this.proceedToCheckoutButton = this.page.getByRole('button', { name: 'Proceed to Checkout' });
    }

    async gotoCart() {
        await this.page.goto(this.urlString);
        await this.page.waitForLoadState('networkidle');
    }

    async getCartQuantity() {
        // Get the cart quantity from minicart icon
        const cartQuantity = await this.miniCartQuantity.textContent();
        return cartQuantity ? parseInt(cartQuantity, 10) : 0;
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
        const orderTotal = await this.orderGrandTotal.textContent();
        return parseInt(orderTotal ?? '', 10) ?? 0;
    }

    async getMiniCartSubtotal() {
        const miniCartSubtotal = await this.miniCartGrandTotal.textContent();
        return parseInt(miniCartSubtotal ?? '', 10) ?? 0;
    }

    async applyDiscountCode(code: string) {
        await this.discountSectionExpandButton.waitFor({ state: 'visible' });
        await this.discountSectionExpandButton.click();

        await this.applyDiscountCodeInput.waitFor({ state: 'visible' });
        await this.applyDiscountCodeInput.click();
        await this.applyDiscountCodeInput.fill(code);
        await this.applyDiscountCodeButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async proceedToCheckout() {
        await this.proceedToCheckoutButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async getDiscountMessage() {
        return this.discountSuccessMessage.textContent();
    }
}
export default CartPage;