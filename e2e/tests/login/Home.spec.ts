import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { config } from '../../utils/config';

test('test', async ({ page }) => {
  const homePage = new HomePage(page);

  // await loginPage.login(config.users.tester.username, config.users.tester.password);
    await homePage.gotoUrl()
    await homePage.rfiButton()
    await homePage.fillStep1()
    await homePage.continueBtn()
    await homePage.fillStep2(config.users.firstname,config.users.lastname,config.users.email)
    await homePage.selectCountry(config.users.country,config.users.phoneNum)
    await homePage.submitBtn()
    await homePage.validationThanksMessages(config.users.validationMessage)
});