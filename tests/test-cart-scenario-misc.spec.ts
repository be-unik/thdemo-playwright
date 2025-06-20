import { test, expect } from '@playwright/test';
import HomePage from '../src/pages/homePage';
import ProductPage from '../src/pages/productPage';
import ProductDetailPage from '../src/pages/productDetailPage';
import CartPage from '../src/pages/cartPage';
import { customerData, discountCode } from '../src/data/testData';

test.describe('Cart:', () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        const productPage = new ProductPage(page);
        const productDetailPage = new ProductDetailPage(page);

        // Navigate to the home page
        await homePage.goto();
        await homePage.acceptCookies();

        // Navigate to Product List Page
        await productPage.goToProductListPage(["Men", "Tops", "Jackets"]);
        await homePage.acceptCookies();
        await expect(page.getByLabel('Items').getByText('Jackets')).toBeVisible();

        // Filter products by category
        await productPage.filterByCategory("Size", "S");
        await expect(page.getByText('Size S')).toBeVisible();
        await productPage.filterByCategory("Color", "Black");
        await expect(page.getByText('Color Black')).toBeVisible();

        // Navigate to Product Detail Page by clicking on the first product
        await productDetailPage.gotoProductDetailPage(1);
        await productDetailPage.setProductSize("S");
        await productDetailPage.setProductColor("Black");
        await productDetailPage.setProductQuantity(2);

        //Add the product to the cart
        await productDetailPage.addToCart();
 
    });

    test('add discount voucher to Cart', async ({ page }) => {
        const cartPage = new CartPage(page);

        // Navigate to the cart page
        await cartPage.gotoCart();
        await expect(cartPage.shoppingCart).toBeVisible();

        const cartTotalBeforeDiscount = await cartPage.getOrderTotal();

        // Apply discount code
        await cartPage.applyDiscountCode(discountCode);
        const discountMessage = await cartPage.getDiscountMessage();
        await expect(discountMessage).toContain(`${discountCode}`);

        // Verify the discount is applied
        const cartTotalAfterDiscount = await cartPage.getOrderTotal();
        await expect(cartTotalAfterDiscount).toBeLessThan(cartTotalBeforeDiscount);
    });

    test('calculate shipping cost for NL', async ({ page }) => {
        const cartPage = new CartPage(page);
        // Navigate to the cart page
        await cartPage.gotoCart();
        await expect(cartPage.shoppingCart).toBeVisible();
        // Set shipping country to Netherlands
        const shippingCostEstimate = await cartPage.getShippingCostEstimate(customerData.customer1.country);
        const shippingCostInOrderSummary = await cartPage.getShippingCostInOrderSummary();

        await expect(shippingCostEstimate).toEqual(shippingCostInOrderSummary);
    });
});
