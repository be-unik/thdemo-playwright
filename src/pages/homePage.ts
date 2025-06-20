import { Locator, Page } from "@playwright/test";

class HomePage {

    //Locators
    readonly cookieButtonLocator : Locator;

    constructor(private readonly page: Page) {
        this.page = page;
        this.cookieButtonLocator = this.page.getByRole('button', { name: 'AGREE', exact: true });
    }

    async goto() {
        await this.page.goto('/');
      }

    async acceptCookies() {
        const cookieButton = this.cookieButtonLocator;
        if (await cookieButton.isVisible()) {
            await cookieButton.click();
            await this.page.waitForLoadState('networkidle');
            // console.log('Cookies accepted successfully.');
        } else {
            return 1;
            // console.log('Cookie button not found or already accepted.');
        }
    }
}

export default HomePage;