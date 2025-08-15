import { nextTestSetup } from 'e2e-utils'
import { assertNoRedbox } from 'next-test-utils'

describe('hmr-parallel-routes', () => {
  const { next } = nextTestSetup({
    files: __dirname,
  })

  it('should update intercept routes via HMR', async () => {
    const browser = await next.browser('/')
    expect(await browser.elementByCss('h1').text()).toBe('Main Page')

    await assertNoRedbox(browser)

    const parallelDefaultContent = await next.readFile(
      'fixtures/@intercept/default.js'
    )

    const parallelInterceptContent = await next.readFile(
      'fixtures/@intercept/(.)intercept/page.js'
    )

    // Write the fixture files to the associated output location
    await next.patchFile('app/@intercept/default.js', parallelDefaultContent)
    await next.patchFile(
      'app/@intercept/(.)intercept/page.js',
      parallelInterceptContent
    )

    // Read the original code of the root layout page
    const rootLayoutContent = await next.readFile('app/layout.js')
    const fixtureLayoutContent = await next.readFile('fixture/layout.js')

    // Update the root layout file with the fixture layout which includes the new parallel routes
    await next.patchFile('app/layout.js', fixtureLayoutContent)

    // Check to make sure that the main page now has the correct layout changes
    expect(await browser.elementById('default-intercept').text()).toBe(
      "I'm the default intercept"
    )

    // Go to the intercept route and check that the intercept worked correctly
    await browser.elementById('to-intercept').click()

    await assertNoRedbox(browser)
    expect(await browser.elementById('intercept').text()).toBe(
      "I'm the intercept"
    )

    // Reset the file statuses
    await next.patchFile('app/layout.js', rootLayoutContent)
    await next.deleteFile('app/@intercept')
  })
})
