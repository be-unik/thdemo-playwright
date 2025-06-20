import { Locator } from "@playwright/test";

class ProductPage {
    private urlString: string;
    
    //Locators
    readonly categoryFilter: (category: string) => Locator;
    readonly priceRangeFilter: (priceRange: string) => Locator;
    readonly ecoCollectionFilter: (ecoCollection: number) => Locator;
    readonly activityFilter: (activity: string) => Locator;
    readonly generalFilter: (filterValue: string) => Locator;

    constructor(private readonly page: any) {
        this.page = page;
        this.categoryFilter = (category) => this.page.getByRole('tab', { name: `${category} ` });
        this.priceRangeFilter = (priceRange) => this.page.locator(`a[href*="price=${priceRange}"]`);
        this.ecoCollectionFilter = (ecoCollection) => this.page.locator(`a[href*="eco_collection=${ecoCollection}"]`);
        this.activityFilter = (activity) => this.page.locator(`a[href*="activity"]`).getByText(activity);
        this.generalFilter = (filterValue) => this.page.getByRole('link', { name: filterValue }).locator('div');
    }

    async goToProductListPage(filterString: Array<string> = []) {
        // Navigate to the product page
        if (filterString[0].toLowerCase().includes('men')){
            this.urlString = filterString[0].toLowerCase();
            for (let i = 1; i < filterString.length; i++) {
                this.urlString += `/${filterString[i].toLowerCase()}-${filterString[0]}`;
            }
        } else {
            this.urlString = filterString.map(item => `${item.toLowerCase()}`).join('/');
        }
        this.urlString = `${this.urlString}.html`;
        await this.page.goto(`/${this.urlString}`);
        await this.page.waitForLoadState('networkidle');
    }

    async filterByCategory(category: string, categoryFilterValue: string) {
        const categoryFilters = this.categoryFilter(category);
        console.log(`Filtering by category: ${category} with locator ${this.categoryFilter(category)}`);
        await categoryFilters.waitFor({ state: 'visible' , timeout: 5000 });
        if (await categoryFilters.isVisible()) {
            // Filter products by category
            await categoryFilters.click();
            await this.page.waitForLoadState('networkidle');
        } else {
            throw new Error(`Category "${category}" not found`);
        }

        // Select the filter value
        let filterValueLocator: Locator;
        if (category === 'Price') {
            filterValueLocator = this.priceRangeFilter(categoryFilterValue);
        } else if (category === 'Eco Collection') {
            const ecoCollectionFil = (categoryFilterValue == "Yes") ? 1 : 0;
            filterValueLocator = this.ecoCollectionFilter(ecoCollectionFil);
        } else if (category === 'Activity') {
            filterValueLocator = this.activityFilter(categoryFilterValue); 
        } else {
            filterValueLocator = this.generalFilter(categoryFilterValue);
        }
        console.log(`Filtering by category: ${categoryFilterValue} with locator ${filterValueLocator}`);
        await filterValueLocator.waitFor({ state: 'visible' , timeout: 5000 });
        if (await filterValueLocator.isVisible()) {
            await filterValueLocator.click();
            await this.page.waitForLoadState('networkidle');
        } else {
            throw new Error(`Filter value "${categoryFilterValue}" not found in category "${category}"`);
        }
    }
}
export default ProductPage;