export const login = async (page, loginInfo) => {
    await page.fill("#user-name", loginInfo.username);
    await page.fill("#password", loginInfo.password);
    await page.click("#login-button");
};

export const addProductsToCart = async (page, products) => {
    const addedItems = [];

    for (const productKey in products) {
        const productName = products[productKey];

        const productContainers = page.locator('.inventory_item', {
            has: page.locator('.inventory_item_name', {
                hasText: productName
            })
        });

        const productCount = await productContainers.count();

        for (let i = 0; i < productCount; i++) {
            try {
                const productContainer = productContainers.nth(i);
                await productContainer.getByRole('button', { name: 'Add to cart' }).click();
                const addedProductName = await productContainer.locator('.inventory_item_name').textContent();
                addedItems.push(addedProductName);
            } catch (error) {
                console.error(`Error adding product at index ${i}: ${error.message}`);
            }
        }

    }

    return addedItems;
};

export const removeProductFromCart = async (page, productName) => {
    await page.locator('#shopping_cart_container').click();

    const itemElement = page.locator(`div.cart_item:has(div.cart_item_label:has-text("${productName}"))`);
    const itemCount = await itemElement.count();

    if (itemCount > 0) {
        await itemElement.getByRole('button', { name: 'Remove' }).click();
    }
    await page.getByRole('button', { name: 'Checkout' }).click();
    return itemElement;
};

export const customerInfo = async (page, customer) => {
    await page.fill("#first-name", customer.firstName);
    await page.fill("#last-name", customer.lastName);
    await page.fill("#postal-code", customer.zipCode);
    await page.click("#continue");
};

export const getOrderSummary = async (page) => {
    let itemTotal = await page.locator('.summary_subtotal_label').textContent();
    let tax = await page.locator('.summary_tax_label').textContent();
    let totalText = await page.locator('.summary_total_label').textContent();

    return {
        itemTotal: parseFloat(itemTotal.split("$")[1]),
        tax: parseFloat(tax.split("$")[1]),
        total: parseFloat(totalText.split("$")[1])
    };
};


