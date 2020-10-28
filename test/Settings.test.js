import VueSelector from 'testcafe-vue-selectors'
import { ClientFunction } from 'testcafe'
const BASE_URL = 'http://localhost:8080'
const getLocation = ClientFunction(() => document.location.href.toString())

const login = async (controller) => {
  const emailInput = await VueSelector('v-text-field').nth(0)
  const passwordInput = await VueSelector('v-text-field').nth(1)
  const loginButton = await VueSelector('v-btn').nth(0)
  
  await controller
    .typeText(emailInput, 'regular1@gmail.com')
    .typeText(passwordInput, 'password')
    .click(loginButton)
    .expect(getLocation()).eql(`${BASE_URL}/`)
}

fixture('Settings')
  .page(`${BASE_URL}/settings`)
  .beforeEach(async controller => await login(controller))

test('user can update settings', async controller => {
  await controller.navigateTo(`${BASE_URL}/settings`)
  const nameInput = await VueSelector('v-text-field').nth(0)
  const preferredHoursInput = await VueSelector('v-text-field').nth(1)
  const saveButton = await VueSelector('v-btn').nth(2)
  
  await controller
    .typeText(nameInput, 'Regular Test')
    .typeText(preferredHoursInput, '5')
    .click(saveButton)
  
  const snackBar = await VueSelector('v-snackbar').nth(0)
  await controller
    .expect(snackBar.innerText).eql('Settings updated successfully.')
})
