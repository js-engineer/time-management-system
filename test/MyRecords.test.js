import VueSelector from 'testcafe-vue-selectors'
import { Selector } from 'testcafe'
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

test('user can create record', async controller => {
  const newButton = await VueSelector('v-btn').nth(2)
  await controller.click(newButton)

  const datePickerWrapper = await VueSelector('v-text-field').nth(0)
  const datePickerItem = await Selector('td').nth(10)
  const plusButton = await Selector('i').nth(1)
  await controller
    .click(datePickerWrapper)
    .click(datePickerItem)
    .click(plusButton)

  const noteText = await Selector('textarea').nth(0)
  const noteHours = await VueSelector('v-text-field').nth(1)
  const saveNoteButton = await Selector('.v-dialog button')
  await controller
    .typeText(noteText, 'Went skiing')
    .typeText(noteHours, '5')
    .click(saveNoteButton)

  const saveButton = await Selector('button').nth(4)
  await controller
    .click(saveButton)

  const snackBar = await VueSelector('v-snackbar').nth(0)
  await controller
    .expect(snackBar.innerText).eql('Record created successfully.')
})

test('user can export record sheet', async controller => {
  const newButton = await VueSelector('v-btn').nth(1)
  
  await controller
    .click(newButton)
})

test('user can delete record', async controller => {
  const deleteButton = await Selector('.v-data-table button').nth(1)
  await controller.click(deleteButton)

  const confirmButton = await Selector('.v-dialog button')
  await controller
    .click(confirmButton)

  const snackBar = await VueSelector('v-snackbar').nth(0)
  await controller
    .expect(snackBar.innerText).eql('Record deleted successfully.')
})