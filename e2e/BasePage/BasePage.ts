import {test,expect} from '@playwright/test'

export default class BasePage{

    rfiButton="//a[text()='Request info']"
    degreeTypeBox="//div[@id='degree-type_typeahead__combobox']"
    graduateBtn="#degree-type_option_1"
    interestAreaBox='//span[text()="Select an interest area"]'


    constructor(){

    }

//       //click on RequestInfo
//   async rfiButtonClick() {
//     await this.page.click(this.rfiButton)
//   }
}