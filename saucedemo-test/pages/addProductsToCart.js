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

        if (productCount > 0) {
            for (let i = 0; i < productCount; i++) {
                const productContainer = productContainers.nth(i);
                const addToCartButton = productContainer.locator('button[data-test^="add-to-cart-"]');

                try {
                    await addToCartButton.waitFor({ state: 'visible', timeout: 5000 });
                    await addToCartButton.click();

                    const addedProductName = await productContainer.locator('.inventory_item_name').textContent();
                    console.log(` Added ${addedProductName} to cart`);
                    addedItems.push(addedProductName);
                } catch (error) {
                    console.log(`Failed to add ${productName} to cart: ${error.message}`);
                }
            }
        } else {
            console.log(`No products found with name: "${productName}"`);
        }
    }

    return addedItems;
};
