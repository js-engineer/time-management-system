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

fixture('MyRecords')
  .page(`${BASE_URL}/`)
  .beforeEach(async controller => await login(controller))

test('user can export record sheet', async controller => {
  const newButton = await VueSelector('v-btn').nth(1)
  
  await controller
    .click(newButton)
})