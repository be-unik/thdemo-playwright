import { test, expect } from '@playwright/test';
import HomePage from '../src/pages/homePage';
import ProductPage from '../src/pages/productPage';
import ProductDetailPage from '../src/pages/productDetailPage';
import CartPage from '../src/pages/cartPage';
import { getRandomInt } from '../src/utils/randomUtils';

test.describe('Cart: ', () => {
    test.beforeEach(async ({ page }) => {
        const homePage = new HomePage(page);
        const productPage = new ProductPage(page);
        

        // Navigate to the home page
        await homePage.goto();

        // Accept cookies if the popup appears
        await page.getByRole('button', { name: 'AGREE', exact: true }).click();

        // Navigate to Product List Page
        await productPage.goToProductListPage(["Gear", "Bags"]);
        await expect(page.getByLabel('Items').getByText('Bags')).toBeVisible();

        // Filter products by category
        await productPage.filterByCategory("Activity", "Yoga");
        await expect(page.getByText('Activity Yoga')).toBeVisible();
    });

    test('add random product to Cart', async ({ page }) => {
        const productDetailPage = new ProductDetailPage(page);
        const cartPage = new CartPage(page);

        // Navigate to Product Detail Page by clicking on a random product
        await productDetailPage.gotoProductDetailPage(getRandomInt(2, 6));
        await productDetailPage.setProductQuantity(1);

        //Add the product to the cart
        await productDetailPage.addToCart();

        // Verify the product is added to the cart
        const cartQuantity = await cartPage.getCartQuantity();
        await expect(cartQuantity).toEqual(1);

        //More checks can be added here if needed
    });
});
