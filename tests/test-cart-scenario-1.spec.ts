import { test, expect } from '@playwright/test';
import HomePage from '../src/pages/homePage';
import ProductPage from '../src/pages/productPage';
import ProductDetailPage from '../src/pages/productDetailPage';
import CartPage from '../src/pages/cartPage';

test.describe('Cart:', () => {
    test('add multiple products to Cart', async ({ page }) => {
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
        await productPage.filterByCategory("Size", "XS");
        await expect(page.getByText('Size XS')).toBeVisible();
        await productPage.filterByCategory("Color", "Blue");
        await expect(page.getByText('Color Blue')).toBeVisible();

        // Navigate to Product Detail Page by clicking on the first product
        await productDetailPage.gotoProductDetailPage(1);
        await productDetailPage.setProductSize("XS");
        await productDetailPage.setProductColor("Blue");
        await productDetailPage.setProductQuantity(2);

        const productName = await productDetailPage.getProductName();
        const productPrice = await productDetailPage.getProductPrice();

        //Add the product to the cart
        await productDetailPage.addToCart();

        // Verify the product is added to the cart
        const cartQuantity = await cartPage.getCartQuantity();
        await expect(cartQuantity).toEqual(2); 
        await expect(cartQuantity).not.toEqual(4);

        // Verify product details in the cart (more checks can be added here)
        const [cartMiniProductName, cartMiniProductPrice, cartMiniProductQty] = await cartPage.getLastProductAttributesInMiniCart();
        await expect(cartMiniProductName).toMatch(productName);
        await expect(cartMiniProductPrice).toMatch(productPrice);
        await expect(cartMiniProductQty).toEqual(2);
    });
});
