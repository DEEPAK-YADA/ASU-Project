import { test, expect } from '@playwright/test';
import { HomePage } from '../../pages/HomePage';
import { config } from '../../utils/config';
import { faker } from '@faker-js/faker';
import { AboveTheFoldRFIElements } from '../../pages/AboveTheFoldRFIElements';
import { SalesforceValElements } from '../../pages/SalesforceValElements';

const urlsData = require("../../test-data/users.json");  // Assuming URLs are stored here

// Function to generate random data for the form
function generateIndianMobileNumber(): string {
  const firstDigit = ['6', '7', '8', '9'][Math.floor(Math.random() * 4)]; // Choose 6,7,8,9
  const remainingDigits = Math.floor(100000000 + Math.random() * 900000000); // Generate 9 random digits
  return firstDigit + remainingDigits.toString();
}

function generateRandomFirstName(): string {
  return `emb${faker.person.firstName()}`; // Generates a random first name
}

function generateRandomLastName(): string {
  return `emb${faker.person.lastName()}`; // Generates a random last name
}

function generateRandomEmail(): string {
  const randomNumber = Math.floor(Math.random() * 10000);
  return `embtest${randomNumber}@asu.edu`;
}


test.describe("Submit RFI for Multiple URLs", () => {

  var emails_array: string[] = [];
  // Array of below URLs to test
  const belowUrls = [
    "https://qa.asuonline.asu.edu/",
    "https://qa.asuonline.asu.edu/admission/",
    "https://qa.asuonline.asu.edu/online-degree-programs/",
    "https://qa.asuonline.asu.edu/online-degree-programs/undergraduate/",
    "https://qa.asuonline.asu.edu/online-degree-programs/graduate/",
    "https://qa.asuonline.asu.edu/online-degree-programs/certificates/",
    "https://qa.asuonline.asu.edu/study/",
    "https://qa.asuonline.asu.edu/students/",
    "https://qa.asuonline.asu.edu/about-us/contact-us/",
    "https://qa.asuonline.asu.edu/about-us/faq/",
    "https://qa.asuonline.asu.edu/about-us/accreditation/",
    "https://qa.asuonline.asu.edu/about-us/rankings/",
    "https://qa.asuonline.asu.edu/about-us/faculty/",
    "https://qa.asuonline.asu.edu/about-us/",
    "https://qa.asuonline.asu.edu/newsroom/",
    "https://qa.asuonline.asu.edu/students/tutoring/"
  ];

  // Loop through each URL in the array
  for (const baseUrl of belowUrls) {
    test(`Submit RFI for URL: ${baseUrl}`, async ({ page, context }) => {
      console.log(`Navigating to: ${baseUrl}`);
    
        // Create an instance of HomePage class
        const homePage = new HomePage(page);

        let newUrl = `${baseUrl}#asuo-rfi-section`;
        // Navigate to the base URL
        await page.goto(newUrl, { timeout: 60000, waitUntil: 'load' });

        // Clear cookies if needed
        await context.clearCookies();

        // Wait for the page to load completely
        await page.waitForTimeout(3000);  // Adjust the wait time if necessary

        // Start submitting the form
        console.log("Submitting RFI for URL:", newUrl);

        // Click on Degree Type dropdown
        const degreeElements = await page.locator("//div[@id='degree-type']/ul/li");
        // await page.waitForTimeout(3000)
        const degreeCount = await degreeElements.count();
        // await homePage.clickdegreeTypeBox();
        console.log("-------------------------" + degreeCount);

        for (let d = 0; d < degreeCount; d++) {
         //await page.waitForTimeout(4000)
          // await page.goto(newUrl, { timeout: 60000, waitUntil: 'load' });
          await page.goto(newUrl,{ timeout: 60000, waitUntil: 'load' })
          await page.setViewportSize({ width: 1920, height: 1080 });

          await homePage.clickdegreeTypeBox();
          const element = await degreeElements.nth(d);
          const text = await element.textContent({timeout:5000});
          console.log("d==" + d)
          console.log("url:- " + newUrl + "    " + text)
          await element.click();
          console.log("Degree Type --> ", text?.trim());


          // Click on Interest Area dropdown
          await homePage.clickInterestAreaTextBox();
          const areaElements = await page.locator("[data-cy='rfi-interest-area-filter'] ul li");
          let ia_count=await areaElements.count()
          console.log("ia_count "+ia_count)
          let random_ia = Math.floor(Math.random() * ia_count);
          const selectRandom_iaBelow = areaElements.nth(random_ia);
          await page.waitForTimeout(2000)
          await selectRandom_iaBelow.waitFor({ state: 'attached', timeout: 30000 });
          await selectRandom_iaBelow.waitFor({ state: 'visible', timeout: 15000 });

          const ia_text = await selectRandom_iaBelow.textContent({timeout:6000});
          await selectRandom_iaBelow.click({ force: true, timeout:8000 });

          console.log("Area of interest -->", ia_text?.trim());
          // }

          // Click on Program dropdown
          await homePage.clickProgramTextBox();
          // const programElements = await page.locator("//ul[@id='program_typeahead__listbox']/li");
          const programElements = page.locator("ul#program_typeahead__listbox > li");
          let program_count=await areaElements.count()
          console.log("program_count "+program_count)
          let random_program = Math.floor(Math.random() * ia_count);
          
          // for (let k = 0; k < await programElements.count(); k++) {
          const selectRandom_ProgramBelow= programElements.nth(random_program);
          await page.waitForTimeout(3000)
          await selectRandom_ProgramBelow.waitFor({ state: 'attached', timeout: 60000 });

    
        // Wait for the element to be attached and visible
        //  await page.waitForSelector(`//ul[@id="program_typeahead__listbox"]/li${random_program}`, { state: 'attached', timeout: 30000 });
        //  await page.waitForSelector(`ul#program_typeahead__listbox > li:nth-child(${random_program + 1})`, { state: 'attached', timeout: 30000 });

          const program_text = await selectRandom_ProgramBelow.textContent({timeout:60000});
          await selectRandom_ProgramBelow.click(({ force: true, timeout:8000 }));

          console.log("Program -->", program_text?.trim());
          // }

          // Fill the rest of the form and submit
          await homePage.continueBtn();
          await homePage.firstName(generateRandomFirstName());
          await homePage.lastName(generateRandomLastName());
          let email=generateRandomEmail();
          await homePage.email(email);
          emails_array.push(email)
          await homePage.selectCountry(config.users.country, generateIndianMobileNumber());
          await homePage.submitBtn();

          // After processing, wait for the expected URL or message
          await homePage.validationThanksMessages();
        }
      
    });
  }

  // Array of above URLs to test
  const aFHUrls= [
    // "https://qa.asuonline.asu.edu/admission/nondegree/",
    // "https://qa.asuonline.asu.edu/what-it-costs/financial-aid/",
    // "https://qa.asuonline.asu.edu/what-it-costs/scholarship-opportunities/",
    // "https://qa.asuonline.asu.edu/students/reviews/",
    // "https://qa.asuonline.asu.edu/students/courses/",
    // "https://qa.asuonline.asu.edu/students/services/",
    // "https://qa.asuonline.asu.edu/students/community/",
    // "https://qa.asuonline.asu.edu/students/study-abroad/",
    // "https://qa.asuonline.asu.edu/students/graduation-beyond/",
    // "https://qa.asuonline.asu.edu/about-us/why-asu-online/"
  ]

  // Loop through each URL in the array
  for (const baseUrl of aFHUrls) {
    test.skip(`Submit RFI for URL: ${baseUrl}`, async ({ page, context }) => {
      console.log(`Navigating to: ${baseUrl}`);
    
        // Create an instance of HomePage class
        const aboveRFI = new AboveTheFoldRFIElements(page);

        let newUrl = `${baseUrl}#asuo-rfi-section`;
        // Navigate to the base URL
        await page.goto(newUrl, { timeout: 60000, waitUntil: 'load' });

        // Clear cookies if needed
        await context.clearCookies();

        // Wait for the page to load completely
        await page.waitForTimeout(3000);  // Adjust the wait time if necessary

        // Start submitting the form
        console.log("Submitting RFI for URL:", newUrl);

        // Click on Degree Type dropdown
        // await aboveRFI.clickdegreeTypeBox();
        const degreeElements = await page.locator("//ul[@id='hero-rfi-degree-type_typeahead__listbox']/li");
        const degreeCount = await degreeElements.count();
        console.log("-------------------------" + degreeCount);

        for (let d = 0; d < degreeCount; d++) {
          await page.goto(newUrl,{timeout: 60000, waitUntil: 'load' });
         // const degreeElements = await page.locator("//div[@id='degree-type']/ul/li");
          await aboveRFI.clickdegreeTypeBox();
          const element = await degreeElements.nth(d);
          const text = await element.textContent();
          console.log("d==" + d)
          console.log("url:- " + newUrl + "    " + text)
          console.log("element:---"+element)
          await page.waitForTimeout(3000)
          await element.click({timeout:8000});

          console.log("Degree Type --> ", text?.trim());

          // Click on Interest Area dropdown
          await aboveRFI.clickInterestAreaTextBox();
          
          const areaElements = await page.locator("//ul[@id='hero-rfi-interest-area_typeahead__listbox']/li");
          let ia_count=await areaElements.count()
          console.log("ia_count "+ia_count)
          let random_ia = Math.floor(Math.random() * ia_count);
          const selectRandom_iaAbove = areaElements.nth(random_ia);
          await selectRandom_iaAbove.waitFor({ state: 'attached', timeout: 15000 });
          await selectRandom_iaAbove.waitFor({ state: 'visible', timeout: 5000 });

          const ia_text = await selectRandom_iaAbove.textContent({timeout:6000});
          await selectRandom_iaAbove.click({ force: true });

          console.log("Area of interest -->", ia_text?.trim());
          // }

          // Click on Program dropdown
          await aboveRFI.clickProgramTextBox();
          const programElements = await page.locator("//ul[@id='hero-rfi-program_typeahead__listbox']/li");

          let program_count=await programElements.count()
          console.log("program_count "+program_count)
          let random_program = Math.floor(Math.random() * ia_count);
          const selectRandom_ProgramAbove = programElements.nth(random_program);
          await selectRandom_ProgramAbove.waitFor({ state: 'attached', timeout: 30000 });
          // await selectRandom_ProgramAbove.waitFor({ state: 'visible', timeout: 15000 });

          const program_text = await selectRandom_ProgramAbove.textContent({timeout:6000});
          await selectRandom_ProgramAbove.click({ force: true, timeout:8000 });

          console.log("Program -->", program_text?.trim());

          // Fill the rest of the form and submit
          await aboveRFI.continueBtn();
          await aboveRFI.firstName(generateRandomFirstName());
          await aboveRFI.lastName(generateRandomLastName());
          let email=generateRandomEmail();
          await aboveRFI.email(email);
          emails_array.push(email)
          await aboveRFI.email(email);
          await aboveRFI.selectCountry(config.users.country, generateIndianMobileNumber());
          await aboveRFI.submitBtn();

          // After processing, wait for the expected URL or message
          await aboveRFI.validationThanksMessages(); // Replace with actual expected message

        }
      
    });
  }
console.log(emails_array)
  test.skip("SalesForce Validation",async({page})=>{
    
    const salesVal=new SalesforceValElements(page);
    await salesVal.gotoUrl();
    await salesVal.typeUsername(config.users.salesForceUsername);
    await salesVal.typePassword(config.users.salesForcePassword);
    await salesVal.loginButton();
    
  })
});
