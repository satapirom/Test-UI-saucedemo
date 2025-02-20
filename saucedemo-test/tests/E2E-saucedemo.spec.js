import { expect, test } from "@playwright/test";
import fs from "fs";
import { login } from "../pages/saucedemoLogin";
import { addProductsToCart } from "../pages/addProductsToCart";

const data = JSON.parse(fs.readFileSync("data.json", "utf8"));

test.describe('Saucedemo UI test', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        await login(page, data.credentials);
    });

    test('TC-002 Should be able to search for products and add them to the shopping cart.', async ({ page }) => {
        // Preparation
        await page.waitForSelector('[data-test="inventory-item-name"]');

        // Use the products from data.json
        const addedItems = await addProductsToCart(page, data.products);

        // Assertion
        await page.locator('#shopping_cart_container').click();

        for (const item of addedItems) {
            const cartItem = page.locator(`div.cart_item:has(div.cart_item_label:has-text("${item}"))`);
            await expect(cartItem).toHaveCount(1);
        }
    });

    test('TC-003 Should be able to remove Backpack from the cart', async ({ page }) => {
        // Preparation
        await addProductsToCart(page, data.products);

        // Go to the cart page
        await page.locator('#shopping_cart_container').click();

        // Find "Backpack" item in the cart
        const itemElement = page.locator('div.cart_item:has(div.cart_item_label:has-text("Backpack"))');
        const itemCount = await itemElement.count();

        if (itemCount > 0) {
            // Click "Remove" button in `cart_item`
            const removeButton = itemElement.locator('button:has-text("Remove")');
            await removeButton.click();
            console.log("Backpack has been removed from the cart");
        } else {
            console.log("Backpack is not in the cart");
        }

        // Assertion: Check that removal was successful
        await expect(itemElement).toHaveCount(0);
    });
});
