const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const context = await browser.newContext();
    const page = await context.newPage();

    // Step 1: เข้าเว็บไซต์ saucedemo และทำการ login
    await page.goto('https://www.saucedemo.com/');
    await page.fill('#user-name', 'standard_user');
    await page.fill('#password', 'secret_sauce');
    await page.click('#login-button');

    // Step 2: เลือกซื้อสินค้า (T-Shirt, flashlight, Backpack)
    const products = [
        { name: 'Sauce Labs Bolt T-Shirt', selector: '[data-test="item-1-add-to-cart"]' },
        { name: 'Sauce Labs Flashlight', selector: '[data-test="item-2-add-to-cart"]' },
        { name: 'Sauce Labs Backpack', selector: '[data-test="item-4-add-to-cart"]' }
    ];

    let testResult = [];

    for (const product of products) {
        try {
            // Use specific data-test selectors for add to cart buttons
            await page.locator(product.selector).click();
            testResult.push(`${product.name} added to cart`);
        } catch (error) {
            testResult.push(`${product.name} not found or could not be added`);
            console.error(`Error adding ${product.name}:`, error);
        }
    }

    // Step 3: คืนสินค้า Backpack
    await page.click('.shopping_cart_link');
    const backpackRemoveButton = '[data-test="remove-sauce-labs-backpack"]';
    if (await page.locator(backpackRemoveButton).count() > 0) {
        await page.locator(backpackRemoveButton).click();
        testResult.push('Backpack removed from cart');
    }

    // ตรวจสอบสินค้าในตะกร้า
    const cartItems = await page.locator('.cart_item').allTextContents();
    testResult.push(`Cart contains: ${cartItems.join(', ')}`);

    // Step 4: กรอกข้อมูลผู้สั่งซื้อ
    await page.click('#checkout');
    await page.fill('#first-name', 'John');
    await page.fill('#last-name', 'Doe');
    await page.fill('#postal-code', '12345');
    await page.click('#continue');

    // Step 5: ตรวจสอบรายการสินค้าและราคารวม
    const itemTotalText = await page.locator('.summary_subtotal_label').textContent();
    const itemTotal = parseFloat(itemTotalText.match(/\d+\.\d+/)[0]);
    const tax = itemTotal * 0.08;
    const expectedTotal = itemTotal + tax;

    const totalText = await page.locator('.summary_total_label').textContent();
    const total = parseFloat(totalText.match(/\d+\.\d+/)[0]);

    if (total === expectedTotal) {
        testResult.push('Total and tax calculated correctly');
    } else {
        testResult.push('Total and tax mismatch');
    }

    // Step 6: ดำเนินการสั่งซื้อ
    await page.click('#finish');
    if (await page.locator('text="Thank you for your order!"').isVisible()) {
        testResult.push('Order completed successfully');
    } else {
        testResult.push('Order failed');
    }

    console.log('Test Result:', testResult);
    await browser.close();
})();