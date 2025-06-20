# Playwright Test Automation Project

This repository contains automated end-to-end tests for an e-commerce website using [Playwright](https://playwright.dev/). The tests are written in TypeScript and cover various user scenarios, such as navigating product pages, filtering products, and adding items to the cart.

---

## Project Structure

# Page Object for the different pages
    /src/pages/*

# Test files
    /tests/*

---

## Pre-requisites

Before running the tests, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v16 or later)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Playwright](https://playwright.dev/)

---

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
2. Install dependencies:
    ```bash
    npm install
3. Install Playwright browsers:
    ```bash
    npx playwright install

## Running Tests

To execute the tests, use the following commands:

1. Run all tests:
    ```bash
    npx playwright test

2. Run a specific test file:
    ```bash
    npx playwright test tests/test-scenario-1.spec.ts

3. Run tests in headed mode (with a visible browser):
    ```bash
    npx playwright test --headed

4. View the test report:
    ```bash
    npx playwright show-report

## Key Features
 - **Page Object Model (POM)**: The project uses the POM design pattern to organize page-specific actions and locators.
 - **TypeScript**: Ensures type safety and better code maintainability.
 - **Playwright Test Runner**: Provides powerful testing capabilities with built-in assertions and reporting.

## Troubleshooting
1. **Playwright not installed**: Ensure you have installed Playwright and its required browsers:
    ```bash
    npx playwright install

2. **Test failures**:
    - Check if the website under test is accessible.
    - Verify that the locators in the page objects match the current website structure.
3. **Debugging**: Run tests in headed mode to visually debug:
    ```bash
    npx playwright test --headed


## Acknowledgments
 - [Playwright Documentation](https://playwright.dev/docs/intro)