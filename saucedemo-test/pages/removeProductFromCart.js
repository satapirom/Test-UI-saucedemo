export const removeProductFromCart = async (page, productName) => {
    await page.locator('#shopping_cart_container').click();

    const itemElement = page.locator(`div.cart_item:has(div.cart_item_label:has-text("${productName}"))`);
    const itemCount = await itemElement.count();

    if (itemCount > 0) {
        const removeButton = itemElement.locator('button:has-text("Remove")');
        await removeButton.click();
        console.log(`${productName} has been removed from the cart`);
    } else {
        console.log(`${productName} is not in the cart`);
    }

    await page.getByText('checkout').click();

    return itemElement;
};
