const HeadlessChrome = require('simple-headless-chrome')
const secrets = require('./secrets.json')

const browser = new HeadlessChrome({
  headless: false // If you turn this off, you can actually see the browser navigate with your instructions
  // see above if using remote interface
})

async function checkForData(ctx) {
  return await ctx.evaluate(function(selector) {
    return document.querySelector(selector) !== null
  }, 'div[data-testid="dyi/archives/row/0"] button[label="DOWNLOAD"]')
}

async function refresh(ctx) {
  let location = await ctx.evaluate(function() {
    return window.location.href
  })

  await ctx.goTo(location.result.value)
  await ctx.wait(30000)
  return getData(ctx)
}

async function getData(ctx) {
  let dataExists = await checkForData(ctx)

  return dataExists.result.value ?
    await ctx.click('div[data-testid="dyi/archives/row/0"] button[label="DOWNLOAD"]') :
    await refresh(ctx)
}

async function navigateWebsite() {
  try {
    await browser.init()

    const mainTab = await browser.newTab({ privateTab: false })

    // Navigate to a URL
    await mainTab.goTo('https://mobile.facebook.com')

    // Fill an element
    await mainTab.fill('#m_login_email', secrets.email)

    // Type in an element
    await mainTab.type('#m_login_password', secrets.password)

    // Click on a button
    await mainTab.click('[value="Log In"]')

    // Log some info in your console
    await mainTab.log('Click login')

    // Wait some time! (2s)
    await mainTab.wait(2000)

    //// Log some info in your console, ONLY if you started the app in DEBUG mode (DEBUG='HeadlessChrome*' npm start)
    //await mainTab.debugLog('Waiting 5 seconds to give some time to all the redirects')

    // Navigate a little...
    await mainTab.goTo('https://mobile.facebook.com/settings')

    await mainTab.wait(2000)

    await mainTab.click('a[href*=dyi]')

    await mainTab.wait(2000)

    await mainTab.evaluate(function(selector) {
      const form_option = document.querySelector(selector)
      form_option.setAttribute('selected', true)
      return
    }, '[value="VERY_HIGH"]')

    await mainTab.wait(2000)

    await mainTab.click('button[data-testid*="dyi/sections/create"]')

    await mainTab.wait(4000)

    await getData(mainTab)

    await mainTab.wait(2000)


    // Check the select current value
    //const myCurrentSubscriptionPlan = await mainTab.getValue('.fbSettingsListItemEditText')
    //console.log(myCurrentSubscriptionPlan) // {type: 'string', value: '1 month' }

    //// Edit the subscription
    //await mainTab.select('#subscriptionSelect', '3 months')
    //await mainTab.click('#Save')

    //// Resize the viewport to full screen size (One use is to take full size screen shots)
    //await mainTab.resizeFullScreen()

    // Take a screenshot
    await mainTab.saveScreenshot('./shc')

    //// Get a HTML tag value based on class id
    //const htmlTag = await mainTab.evaluate(function(selector) {
        //const selectorHtml = document.querySelector(selector)
        //return selectorHtml.innerHTML
    //}, '.main'); // returns innerHTML of first matching selector for class "main"

    // Close the browser
    await browser.close()
  } catch (err) {
    console.log('ERROR!', err)
  }
 }
 navigateWebsite()

