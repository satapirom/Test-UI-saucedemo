import { expect, test } from "@playwright/test";
import fs from "fs";

import {
    login,
    addProductsToCart,
    removeProductFromCart,
    customerInfo,
    getOrderSummary

} from "../pages/saucedemoFN";


const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

test.describe('Saucedemo UI test', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await login(page, data.loginInfo);
    });
    test.afterEach(async ({ page }, testInfo) => {
        if (testInfo.status !== 'passed') {
            await page.screenshot({ path: `screenshots/${testInfo.title}.png`, fullPage: true });
        }

        // Save log file
        const logMessage = `Test: ${testInfo.title}\nStatus: ${testInfo.status}\nDuration: ${testInfo.duration}ms\n\n`;
        fs.appendFileSync('testResults.txt', logMessage);

        await page.close();
    });

    test('TC-001 Should be able to search for products and add them to the shopping cart.', async ({ page }) => {
        // Preparation
        const addedItems = await addProductsToCart(page, data.products);

        // Assertion
        await page.locator('#shopping_cart_container').click();
        const cartItems = page.locator('[data-test="inventory-item"]');
        const count = await cartItems.count();

        expect(count).toBeGreaterThan(1);

    });

    test('TC-002 Should be able to remove Backpack from the cart', async ({ page }) => {
        // Preparation
        await addProductsToCart(page, data.products);

        //Action
        const itemElement = await removeProductFromCart(page, 'Backpack');

        // Assertion
        await expect(itemElement).toHaveCount(0);
        await expect(page).toHaveURL(/.*checkout-step-one/);
    });

    test('TC-003 Should be able to enter customer Information', async ({ page }) => {
        // Preparation
        await addProductsToCart(page, data.products);
        await removeProductFromCart(page, 'Backpack');

        //Action
        await customerInfo(page, data.customer);

        // Assertion
        await expect(page).toHaveURL(/.*checkout-step-two.html/);
    });

    test('TC-004 should be able to verify product prices and tax', async ({ page }) => {
        // Preparation
        await addProductsToCart(page, data.products);
        await removeProductFromCart(page, 'Backpack');
        await customerInfo(page, data.customer);

        //Action
        const { itemTotal, tax, total } = await getOrderSummary(page);

        //Assertion 
        expect(tax).toBeCloseTo(itemTotal * 0.08, 2);
        expect(total).toBeCloseTo(itemTotal + tax, 2);
        console.log(`Verified: Item Total = ${itemTotal}, Tax (8%) = ${tax}, Total = ${total}`);
    });

    test('TC-005 Should be able to complete the purchase successfully', async ({ page }) => {
        // Preparation
        await addProductsToCart(page, data.products);
        await removeProductFromCart(page, 'Backpack');
        await customerInfo(page, data.customer);
        const { itemTotal, tax, total } = await getOrderSummary(page);

        //Action
        await page.getByRole('button', { name: 'Finish' }).click();

        // Assertion
        await expect(page.locator('.complete-header')).toHaveText('Thank you for your order!');
    });

});
