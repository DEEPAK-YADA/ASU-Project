import { expect, Page,test } from '@playwright/test';

export class AboveTheFoldRFIElements {
  
    constructor(private page: Page) {}


  async rfiButton() {
 
    const element=await this.page.locator("//a[text()='Request info']")
    const rfiText=element.innerText()
    if((await rfiText).includes("Request info")){
    await this.page.click("//a[text()='Request info']",({force:true}))
    }  
    else {
    const contactUs=await this.page.locator("//div[contains(text(),'Contact us')]")
    const contactUsText=contactUs.innerText()
    if((await contactUsText).includes("Contact us")){
    await this.page.click("//div[contains(text(),'Contact us')]",({force:true}))
    }
  }
  }

  //click on degreeType
  async clickdegreeTypeBox(){
    await this.page.locator("//div[@id='hero-rfi-degree-type_typeahead__combobox']").click({timeout:2000})
  }

  //click on InterestArea
  async clickInterestAreaTextBox(){
    await this.page.locator("//div[@id='hero-rfi-interest-area_typeahead__combobox']").click({timeout:2000})
    // await this.page.locator("//span[text()='Select an interest area']").click({timeout:2000})
  }

   //click on InterestArea
   async clickProgramTextBox(){
    await this.page.waitForSelector('//div[@id="hero-rfi-program_typeahead__combobox"]', { state: 'visible' })
    await this.page.click('//div[@id="hero-rfi-program_typeahead__combobox"]',{timeout:5000})
  }
  //fill the step1 form
  async fillStep1(){
    await this.page.locator("//div[@id='degree-type_typeahead__combobox']").click()
    await this.page.click("#degree-type_option_1")
    await this.page.click('//span[text()="Select an interest area"]')
    await this.page.click("#interest-area_option_6")
    await this.page.click('//span[@class="is-placeholder typeahead__selected"]')
    await this.page.waitForSelector("//li[text()='Computer Science (MCS)']")
    await this.page.click("//li[text()='Computer Science (MCS)']")
  }

  //click on the continue button
  async continueBtn(){
    await this.page.click('(//button[@data-cy="rfi-continue-button"])[1]',{timeout:8000})
  }
  
  //fill the step2 form
  async fillStep2(firstname: string, lastname: string,email: string) { 
    await this.page.locator('//input[@placeholder="Enter your first name"]').fill(firstname);
    await this.page.locator('#last-name').fill(lastname);
    await this.page.locator('#email').fill(email)
  }
  async firstName(firstname: string){
    await this.page.locator("#hero-rfi-first-name").fill(firstname);
  }

  async lastName(lastname: string){
    await this.page.locator("#hero-rfi-last-name").fill(lastname);
  }

  async email(email: string){
    await this.page.locator("#hero-rfi-email").fill(email)
  }
  
  //select country code +91
  async selectCountry(countryCode: string, mobileNum:string){
    await this.page.locator("#country-selector-hero-rfi-asuonline").click()
    await this.page.getByPlaceholder("Search the country").fill(countryCode)
    await this.page.locator("//span[text()='India']").click({timeout:5000})
    await this.page.locator("#hero-rfi-asuonline").fill(mobileNum)
  }



  
  //click on submit button
  async submitBtn(){
    await this.page.locator("(//button[@data-cy='rfi-submit-button'])[1]").click({ timeout: 5000 })
  }



async validationThanksMessages() {
  // Wait for the page to navigate to the expected URL after form submission
  await this.page.waitForTimeout(2000)
  await this.page.waitForURL('https://qa.asuonline.asu.edu/degree-program-request-info-thank-you',{ timeout: 50000});
  
  
  // check Current URL
  const currentUrl = await this.page.url();
  console.log('Current URL:', currentUrl);
  
  // Validate expected URL  
  expect(currentUrl).toBe('https://qa.asuonline.asu.edu/degree-program-request-info-thank-you');
  
  // Optional: Wait for any expected element to appear on the page to ensure it's fully loaded
  await this.page.waitForSelector("//h2[@class='h2-small bg-secondary px-space-xxs mb-space-lg w-auto']");
  console.log("validate sucessfully")
}

  }


