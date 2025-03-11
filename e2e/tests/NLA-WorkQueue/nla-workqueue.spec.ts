import { test, expect, Page, Browser } from '@playwright/test';
import { URI } from 'otpauth';
import { LoginPage } from '../../pages/loginPage';
import { InteractionPage } from '../../pages/interactionPage';
import { config } from '../../utils/config';

// Helper function to generate a random number
function getRandomNumber() {
  return Math.floor(Math.random() * 1000);
}

test.describe('Interaction Flow Tests', () => {
  test.setTimeout(250000);
  let loginPage: LoginPage;
  let interactionPage: InteractionPage;
  let page;
  let context;
  let browser;

  test.beforeAll(async ({ browser: browserInstance }) => {
    browser = browserInstance;
    const context = await browser.newContext();
    //  const context = await browser.newContext({ recordVideo: { dir: 'videos/' } });
    page = await context.newPage();
    loginPage = new LoginPage(page);
    interactionPage = new InteractionPage(page);

    await loginPage.login(config.users.tester.username, config.users.tester.password);

    const otp = URI.parse(config.otp.uri);
    const token = otp.generate();
    await loginPage.verify(token);

    await expect(page.getByTitle('Recruitment Console')).toBeVisible();
  });

  // Define the main test
  test('should create interactions for all opportunity stages', async () => {
    // Loop through each opportunity stage
    for (const [index, opportunityStage] of config.interaction.opportunityStages.entries()) {
      const randomNum1 = getRandomNumber();
      const randomNum2 = getRandomNumber();
      const user = {
        firstName: `wqFirst${randomNum1}`,
        lastName: `wqLast${randomNum2}`,
        email: `wqFirst${randomNum1}.wqLast${randomNum2}@asu.edu`
      };

      console.log(`User at index ${index}:`, user);

      // Define a test step for creating an interaction
      await test.step(`Create interaction for ${user.email} with ${opportunityStage}`, async () => {
        try {
          // Select a random academic search
          const academicSearch = config.interaction.academicSearches[Math.floor(Math.random() * config.interaction.academicSearches.length)];
          const expectedValue = config.interaction.expectedValues[opportunityStage];

          // Create Interaction
          await interactionPage.createInteraction(user, opportunityStage, academicSearch);

          // Verify Interaction Details
          await interactionPage.verifyInteractionDetails(opportunityStage, user.email);

          // Conditionally navigate through Interaction Tabs and perform final assertions
          if (opportunityStage !== 'Prospect - New RFI') {
            await interactionPage.navigateThroughTabs(user, expectedValue);
          }

        } catch (error) {
          // Log the error and mark the test step as failed
          console.error(`Error while creating interaction for ${user.email} with ${opportunityStage}:`, error);
        }
      });
    }
  });
});