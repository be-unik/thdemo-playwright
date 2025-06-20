import { test, expect } from '@playwright/test';
import HomePage from '../src/pages/homePage';
import ProductPage from '../src/pages/productPage';
import ProductDetailPage from '../src/pages/productDetailPage';
import CartPage from '../src/pages/cartPage';
import { customerData, discountCode } from '../src/data/testData';
import CheckoutPage from '../src/pages/checkoutPage';

test.describe('Checkout :', () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        const productPage = new ProductPage(page);
        const productDetailPage = new ProductDetailPage(page);
        const cartPage = new CartPage(page);

        // Navigate to the home page
        await homePage.goto();
        await homePage.acceptCookies();

        // Navigate to Product List Page
        await productPage.goToProductListPage(["Men", "Tops", "Jackets"]);
        await homePage.acceptCookies();
        await expect(page.getByLabel('Items').getByText('Jackets')).toBeVisible();

        // Filter products by category
        await productPage.filterByCategory("Size", "L");
        await expect(page.getByText('Size L')).toBeVisible();
        await productPage.filterByCategory("Color", "Blue");
        await expect(page.getByText('Color Blue')).toBeVisible();

        // Navigate to Product Detail Page by clicking on the first product
        await productDetailPage.gotoProductDetailPage(1);
        await productDetailPage.setProductSize("L");
        await productDetailPage.setProductColor("Blue");
        await productDetailPage.setProductQuantity(2);

        //Add the product to the cart
        await productDetailPage.addToCart();
    });

    test('calculate shipping cost for NL', async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);

        await checkoutPage.goToCheckout();
        // Set shipping country to Netherlands
        await checkoutPage.fillShippingDetails(customerData.customer1);

        const shippingCost = await checkoutPage.getShippingCost();
        await expect(shippingCost).toBeGreaterThan(0);
    });

    test('add discount voucher', async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);

        await checkoutPage.goToCheckout();
        // Set shipping country to Netherlands
        await checkoutPage.fillShippingDetails(customerData.customer1);
        
        await checkoutPage.proceedToPaymentStep();
        await expect(page).toHaveURL('/checkout/#payment');

        const orderTotalBeforeDiscount = await checkoutPage.getOrderTotal()

        // Apply discount code
        await checkoutPage.applyDiscountCode(discountCode);
        const discountMessage = await checkoutPage.getDiscountMessage();
        await expect(discountMessage).toContain(`successfully applied`);

        // Verify the discount is applied
        const orderTotalAfterDiscount = await checkoutPage.getOrderTotal();
        await expect(orderTotalAfterDiscount).toBeLessThan(orderTotalBeforeDiscount);
    });

    
});