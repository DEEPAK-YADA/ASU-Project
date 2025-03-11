import {test,expect} from '@playwright/test'
import { HomePage } from '../../pages/HomePage';
import { config } from '../../utils/config';
import {faker} from '@faker-js/faker'
const urlsData = require("../../test-data/users.json");
// const urlsData=JSON.parse(JSON.stringify(require("../../test-data/users.json")))
// import urlsData from '../../test-data/users.json'; 
// import { homedir } from 'os';
// import { helper } from '../../utils/helpers';

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

  function generateRandomNumberUsingTimestamp() {
    const timestamp = new Date().getTime(); // Get the current timestamp in milliseconds
    return `embtest${timestamp}@asu.edu`;// Generate a random number by taking the modulus of the timestamp
    
}
  
  console.log("==========="+"FirstName:-"+generateRandomFirstName()+"==========="+" LastName:- "+generateRandomLastName()+"==========="+" MobileNum:- "+generateIndianMobileNumber())



// test('Automation Testing on ASUOnline', async({page})=>{
//       const homePage = new HomePage(page);   
//       await homePage.gotoUrl()
//       await homePage.rfiButton()
//       await homePage.fillStep1()
//       await homePage.continueBtn()
//       await homePage.fillStep2(generateRandomFirstName(),generateRandomLastName(),generateRandomNumberUsingTimestamp())
//       await homePage.selectCountry(config.users.country,generateIndianMobileNumber())
//       await homePage.submitBtn()
//       await homePage.validationThanksMessages(config.users.validationMessage)
// })  

// Below the Fold RFI

test.describe("Submit RFI for Multiple URLs with Degree Types",()=>{
  const allurls = [
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
  
  for(const data of allurls){
    let newUrls=data+"#asuo-rfi-section";

  // test("Below the Fold RFI1", async({context,page})=>{
    
   test(`Below the Fold RFI1 ${data}`,async({context,page})=>{

   //test(`Below the Fold RFI for ${data}`, async ({ context, page }) => {

    
  //urlsData.BFH_urls.forEach((url)=>{
  
  console.log("Submitting BFH RFIs on the url : ", data)
  console.log("------------------------------------------------------------")

  for(let i=0;i<=await urlsData.BFH_urls.length;i++){
    let newUrls=data+"#asuo-rfi-section";
    await page.goto(newUrls)
    await context.clearCookies();

    await page.waitForTimeout(3000)

    console.log("Submitting BFH RFI #", i+1);
     // first page
     // click on Degree Type dropdown
     const homePage = new HomePage(page);
     await homePage.clickdegreeTypeBox()

     const degreeElements=await page.locator("[data-cy=rfi-degree-type-filter] ul li")

    for(let d=0;d<await degreeElements.count();d++){
      const element=degreeElements.nth(d)

      //Get Text content
      const text=await element.textContent()
      await element.click({force:true})
      
      console.log("Degree Type --> ", text?.trim())
    //} end of K

    //click on Interest Area dropdown
    await homePage.clickInterestAreaTextBox()
    const areaElements=await page.locator("[data-cy='rfi-interest-area-filter'] ul li")

    for(let j=0;j<await areaElements.count();j++){

      const element=areaElements.nth(j)

      //Get text content
      const text=await element.textContent()
      await element.click({force:true})
      console.log("Area of interest -->", text?.trim())
    //}//end of k

    // click on Program dropdown
    await homePage.clickProgramTextBox()
    //const programElements= await page.locator("[data-cy='rfi-program-filter'] ul li")
    const programElements= await page.locator("//ul[@id='program_typeahead__listbox']/li")
    // li[id='program_option_"++"']
    for(let k=0;k<await programElements.count();k++){
      const elements=programElements.nth(k)

      //Get Text content
      const text=await elements.textContent()
      await elements.click({force:true})
      console.log("Program -->", text?.trim())
    
      //}//end of

    await homePage.continueBtn()
    await homePage.firstName(generateRandomFirstName())
    await homePage.lastName(generateRandomLastName())
    await homePage.email(generateRandomEmail())
    await homePage.selectCountry(config.users.country,generateIndianMobileNumber())
    await homePage.submitBtn()
    // const currentUrl= await page.url()
    // console.log("current url:-"+currentUrl)
    // await homePage.validationThanksMessages(currentUrl)
    await homePage.validationThanksMessages()

    if (i + 1 < urlsData.BFH_urls.length) {
      // Fetch a new URL for the next round from the array
      let nextUrl = urlsData.BFH_urls[i + 1] + "#asuo-rfi-section";  // Switch to the next URL in the list
      console.log("Moving to the next URL:", nextUrl);

      // Navigate to the new URL
      await page.goto(nextUrl, { timeout: 60000, waitUntil: 'load' });
      await context.clearCookies(); // Optional: Clear cookies if needed
      await page.waitForTimeout(3000); // Wait before the next round
        }
       } 
      }
     }
    } 
  })
  
}
 })