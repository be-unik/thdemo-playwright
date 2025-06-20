import { test, expect } from '@playwright/test';
import HomePage from '../src/pages/homePage';
import ProductPage from '../src/pages/productPage';
import ProductDetailPage from '../src/pages/productDetailPage';
import CartPage from '../src/pages/cartPage';

test.describe('Cart:', () => {
    test('add single product to Cart', async ({ page }) => {
        const homePage = new HomePage(page);
        const productPage = new ProductPage(page);
        const productDetailPage = new ProductDetailPage(page);
        const cartPage = new CartPage(page);

        // Navigate to the home page
        await homePage.goto();

        // Accept cookies if the popup appears
        await homePage.acceptCookies();

        // Navigate to Product List Page
        await productPage.goToProductListPage(["Women", "Tops", "Jackets"]);
        await homePage.acceptCookies();
        await expect(page.getByLabel('Items').getByText('Jackets')).toBeVisible();

        // Filter products by different categories
        await productPage.filterByCategory("Size", "XS");
        await expect(page.getByText('Size XS')).toBeVisible();
        await productPage.filterByCategory("Color", "Blue");
        await expect(page.getByText('Color Blue')).toBeVisible();
        await productPage.filterByCategory("Eco Collection", "No");
        await expect(page.getByText('Eco Collection No')).toBeVisible();
        await productPage.filterByCategory("Price", "50-60");
        await expect(page.getByText('Price $50.00 - $59.99')).toBeVisible();
  
        // Navigate to Product Detail Page by clicking on the first product
        await productDetailPage.gotoProductDetailPage(1);
        await productDetailPage.setProductSize("XS");
        await productDetailPage.setProductColor("Blue");
        await productDetailPage.setProductQuantity(1);

        //Add the product to the cart
        await productDetailPage.addToCart();

        // Verify the product is added to the cart
        const cartQuantity = await cartPage.getCartQuantity();
        await expect(cartQuantity).toEqual(1); 

        //More checks can be added here if needed
    });
});
