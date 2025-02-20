export const customerInfo = async (page, customer) => {
    await page.fill("#first-name", customer.firstName);
    await page.fill("#last-name", customer.lastName);
    await page.fill("#postal-code", customer.zipCode);
    await page.click("#continue");
};

//cal total price
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

