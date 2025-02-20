export const addProductsToCart = async (page, products) => {
    const addedItems = [];

    for (const productKey in products) {
        const productName = products[productKey];
        // Find all product containers matching the product name
        const productContainers = page.locator('.inventory_item', {
            has: page.locator('.inventory_item_name', {
                hasText: productName // Match products by name
            })
        });

        const productCount = await productContainers.count();

        if (productCount > 0) {
            // Loop through all matching products
            for (let i = 0; i < productCount; i++) {
                const productContainer = productContainers.nth(i);
                const addToCartButton = productContainer.locator('button[data-test^="add-to-cart-"]');

                try {
                    // Wait for the "Add to Cart" button to be visible and click it
                    await addToCartButton.waitFor({ state: 'visible', timeout: 5000 });
                    await addToCartButton.click();

                    // Get the exact name of the added product
                    const addedProductName = await productContainer.locator('.inventory_item_name').textContent();
                    console.log(`✓ Added ${addedProductName} to cart`);
                    addedItems.push(addedProductName);
                } catch (error) {
                    console.log(`✗ Failed to add ${productName} to cart: ${error.message}`);
                }
            }
        } else {
            console.log(`✗ No products found with name: "${productName}"`);
        }
    }

    return addedItems;
};
