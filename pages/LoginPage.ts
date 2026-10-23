import{ Page,expect } from '@playwright/test'

 export class LOginPage{


    constructor(private page:Page){

    }


    // Locators = private ,used only inside the class
   private usernameField=this.page.getByRole('textbox', {
        name: 'Username or email address'
    })

    private passwordField =this.page.getByRole('textbox', {
        name: 'Password  Required'
    })

    private loginbutton= this.page.getByRole('button', {
        name: 'Log in'
    })


    // Actions = Public ,called by test and setup
    async Login(user:string,password:string) {
        await this.usernameField.fill(user)
        await this.passwordField.fill(password)
        await this.loginbutton.click()
        
    }

}