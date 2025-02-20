export const login = async (page, credentials) => {
    await page.fill("#user-name", credentials.username);
    await page.fill("#password", credentials.password);
    await page.click("#login-button");
};
