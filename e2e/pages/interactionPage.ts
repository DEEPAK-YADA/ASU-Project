import { Page, expect } from '@playwright/test';
export class InteractionPage {
  // Selector Definitions
  private selectors = {
    navigationMenu: 'Show Navigation Menu',
    interactionsMenuItem: 'Interactions',
    interactionsLink: 'Interactions',
    newButton: 'New',
    firstNameInput: '*First Name',
    lastNameInput: '*Last Name',
    emailInput: '*Email',
    interactionSourceCombobox: 'Interaction Source',
    rfiOption: 'RFI',
    opportunityStageCombobox: 'Opportunity Stage',
    academicPlansPlaceholder: 'Search Academic Plans...',
    saveButton: 'Save',
    showAllLink: 'Show All (15)',
    workQueueItemsLink: 'Work Queue Items (1)',
    nlaContactMadeLink: 'NLA - Contact Made',
    newGridCell: 'New'
  };

  constructor(private page: Page) {}

  
  async createInteraction(user: { firstName: string; lastName: string; email: string }, opportunityStage: string, academicSearch: string): Promise<void> {
    // const stateProgramLocator = this.page.locator('[id="toastDescription16936\\:0"]').getByText('This program has state');
    // if (await stateProgramLocator.isVisible()) {
    //   await this.page.getByRole('button', { name: 'Close', exact: true }).first().click();
    // }
    // const leadProgramLocator = this.page.locator('span.toastMessage.forceActionsText:has-text("This program could lead to")');
    // if (await leadProgramLocator.isVisible()) {
    //   await this.page.getByRole('button', { name: 'Close', exact: true }).first().click();
    //   await this.page.waitForTimeout(3000);
    // }
    const permissionErrorLocator = this.page.locator('span.toastMessage.forceActionsText:has-text("You do not have permission to")');
    if (await permissionErrorLocator.isVisible()) {
      await this.page.locator('body > div.forceToastManager--default.forceToastManager.navexDesktopLayoutContainer.lafAppLayoutHost.forceAccess.forceStyle.oneOne > div.forceVisualMessageQueue > div > div > div > div.slds-notify__close > button').click();
    }


    // const permissionErrorLocator = this.page.locator('span.toastMessage.forceActionsText:has-text("You do not have permission to")');
    // if (await permissionErrorLocator.isVisible()) {
    //   await this.page.getByRole('button', { name: 'Close', exact: true }).first().click();
    // }
    await this.page.getByLabel(this.selectors.navigationMenu).click();
    await this.page.getByRole('menuitem', { name: this.selectors.interactionsMenuItem }).click();
    await this.page.getByRole('link', { name: this.selectors.interactionsLink }).click();
    //await this.page.getByRole('button', { name: this.selectors.newButton }).click();
    await this.page.locator('a[role="button"][title="New"]').click();


    await this.page.getByLabel(this.selectors.firstNameInput).fill(user.firstName);
    await this.page.getByLabel(this.selectors.lastNameInput).fill(user.lastName);
    await this.page.getByLabel(this.selectors.emailInput).fill(user.email);
    await this.page.getByRole('combobox', { name: this.selectors.interactionSourceCombobox }).click();
    await this.page.getByRole('option', { name: this.selectors.rfiOption, exact: true }).locator('span').nth(1).click();

    await this.page.getByRole('combobox', { name: this.selectors.opportunityStageCombobox }).click();
    await this.page.getByRole('option', { name: opportunityStage }).locator('span').nth(1).click();
    

    await this.page.getByPlaceholder(this.selectors.academicPlansPlaceholder).click();
    await this.page.getByPlaceholder(this.selectors.academicPlansPlaceholder).fill(academicSearch);
    await this.page.waitForTimeout(1000);
    await this.page.getByPlaceholder(this.selectors.academicPlansPlaceholder).press('ArrowDown');
    await this.page.getByPlaceholder(this.selectors.academicPlansPlaceholder).press('ArrowDown');
    await this.page.getByPlaceholder(this.selectors.academicPlansPlaceholder).press('ArrowDown');
    await this.page.getByPlaceholder(this.selectors.academicPlansPlaceholder).press('Enter');

    // one issue here is that it open another tab, to select the degree which can not be selected and the test fails
    
    
  
    

    // await this.page.getByPlaceholder(this.selectors.academicPlansPlaceholder).click();
    // await this.page.getByPlaceholder(this.selectors.academicPlansPlaceholder).fill(academicSearch);
    // await this.page.getByRole('option', { name: `Online Master of ${academicSearch}` }).click();

    await this.page.getByRole('button', { name: this.selectors.saveButton, exact: true }).click();

  

    // Wait for the interaction to be saved and the email link to appear
    await this.page.waitForTimeout(10000);
  }

  /**
   * Verifies interaction details based on expected values.
   * @param expectedValue - The expected NLA value.
   * @param email - The user's email.
   */
  async verifyInteractionDetails(expectedValue: string, email: string) {
    await expect(
      this.page.locator('forcegenerated-highlightspanel_interaction__c___012000000000000aaa___compact___view___recordlayout2')
        .getByRole('link', { name: email })
    ).toBeVisible();

    await expect(
      this.page.locator('records-record-layout-item')
        .filter({ hasText: expectedValue })
        .getByRole('definition')
        .locator('span')
    ).toBeVisible();
  }

  /**
   * Navigates through specific tabs in the interaction.
   * @param user - The current user object.
   */
  async navigateThroughTabs(user: { firstName: string; lastName: string; email: string }, expectedValue: string) {
    const fullName = `${user.firstName} ${user.lastName}`;

    // await this.page.locator('#tab-30')
    //   .getByRole('link', { name: fullName, exact: true })
    //   .click();

    await this.page.locator('forcegenerated-highlightspanel_interaction__c___012000000000000aaa___compact___view___recordlayout2')
      .getByRole('link', { name: fullName })
      .click();
  

    // await this.page.getByRole('link', { name: this.selectors.showAllLink }).click();
    // await this.page.getByRole('link', { name: this.selectors.workQueueItemsLink }).click();
    await this.page.getByRole('link', { name: 'Show All (15)' }).click();
    await this.page.getByRole('link', { name: 'Work Queue Items (1)' }).click();
  
    // await expect(this.page.getByRole('link', { name: expectedValue })).toBeVisible();
    await expect(this.page.getByRole('gridcell', { name: expectedValue })).toBeVisible();
    // await expect(this.page.getByRole('gridcell', { name: 'NLA - Contact Made' }).locator('lightning-primitive-custom-cell')).toBeVisible();
    await expect(this.page.getByRole('gridcell', { name: 'New' })).toBeVisible();
  }

}