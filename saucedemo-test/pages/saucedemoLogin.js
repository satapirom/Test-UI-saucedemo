export const login = async (page, loginInfo) => {
    await page.fill("#user-name", loginInfo.username);
    await page.fill("#password", loginInfo.password);
    await page.click("#login-button");
};
