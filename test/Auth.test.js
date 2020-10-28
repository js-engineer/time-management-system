import VueSelector from 'testcafe-vue-selectors'
import { ClientFunction } from 'testcafe'
const BASE_URL = 'http://localhost:8080'
const getLocation = ClientFunction(() => document.location.href.toString())

fixture('Sign In/Sign Out')
  .page(`${BASE_URL}/login`)

test('User can sign in', async controller => {
  const emailInput = await VueSelector('v-text-field').nth(0)
  const passwordInput = await VueSelector('v-text-field').nth(1)
  const loginButton = await VueSelector('v-btn').nth(0)
  
  await controller
    .typeText(emailInput, 'regular1@gmail.com')
    .typeText(passwordInput, 'password')
    .click(loginButton)
    .expect(getLocation()).eql(`${BASE_URL}/`)
})

test('user can sign out', async controller => {
  const logoutButton = await VueSelector('v-btn').nth(0)
  await controller
    .click(logoutButton)
    .expect(getLocation()).eql(`${BASE_URL}/login`)
})

