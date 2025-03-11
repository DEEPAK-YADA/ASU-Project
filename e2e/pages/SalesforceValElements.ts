import { expect, Page,test } from '@playwright/test';

export class SalesforceValElements {

    constructor(private page: Page) {}

    async gotoUrl(){
        await this.page.goto("https://edplus-asu--qa.sandbox.my.salesforce.com/")
    }

    async typeUsername(user:string){
        await this.page.locator("#username").fill(user)
    }

    async typePassword(password:string){
        await this.page.locator("#password").fill(password)
    }

    async loginButton(){
        await this.page.locator("#Login").click()
    }

}