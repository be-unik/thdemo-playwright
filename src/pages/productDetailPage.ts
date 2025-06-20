import { Page, Locator } from "@playwright/test";

class ProductDetailPage {
    // Locators
    readonly addToCartButton: Locator;
    readonly firstProductSelector: (randomProductIndex: number) => Locator;
    readonly sizeSelector: Locator;
    readonly colorSelector: (color: string) => Locator;
    readonly quantitySelector: Locator;

    constructor(private readonly page: Page) {
        this.page = page;
        this.addToCartButton = page.locator('#product-addtocart-button');
        this.firstProductSelector = (randomProductIndex) => this.page.locator(`.product-item:nth-child(${randomProductIndex}) .product-image-container`);
        this.sizeSelector = page.locator('.size');
        this.colorSelector = (color) => page.getByRole('option', { name: color });
        this.quantitySelector = page.getByRole('spinbutton', { name: 'Qty' });
    }

    async gotoProductDetailPage(randomProductIndex: number = 1) {
        await this.firstProductSelector(randomProductIndex).waitFor({ state: 'visible' });
        await this.firstProductSelector(randomProductIndex).click();
        await this.page.waitForLoadState('networkidle');
    }

    async addToCart() {
        await this.addToCartButton.waitFor({ state: 'visible' });
        await this.addToCartButton.click();
        await this.page.waitForLoadState('networkidle');
    }

    async getProductName() {
        return await this.page.textContent('.product-info-main .base') ?? '';
    }

    async getProductPrice() {
        return await this.page.textContent('.product-info-main .normal-price .price') ?? '';
    }

    async setProductSize(size: string) {
        await this.sizeSelector.waitFor({ state: 'visible' });
        await this.sizeSelector.getByText(size, {exact: true}).click();
        await this.page.waitForLoadState('networkidle');
    }

    async setProductColor(color: string) {
        await this.colorSelector(color).waitFor({ state: 'visible' });
        await this.colorSelector(color).click();
        await this.page.waitForLoadState('networkidle');
    }

    async setProductQuantity(quantity: number) {
        await this.quantitySelector.waitFor({ state: 'visible' });
        await this.quantitySelector.fill(quantity.toString());
        await this.page.waitForLoadState('networkidle');
    }

}
export default ProductDetailPage;