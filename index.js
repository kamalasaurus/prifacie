const HeadlessChrome = require('simple-headless-chrome')

const browser = new HeadlessChrome({
  headless: true // If you turn this off, you can actually see the browser navigate with your instructions
  // see above if using remote interface
})
async function navigateWebsite() {
  try {
    await browser.init()

    const mainTab = await browser.newTab({ privateTab: false })

    // Navigate to a URL
    await mainTab.goTo('http://www.mywebsite.com/login')

    // Fill an element
    await mainTab.fill('#username', 'myUser')

    // Type in an element
    await mainTab.type('#password', 'Yey!ImAPassword!')

    // Click on a button
    await mainTab.click('#Login')

    // Log some info in your console
    await mainTab.log('Click login')

    // Wait some time! (2s)
    await mainTab.wait(2000)

    // Log some info in your console, ONLY if you started the app in DEBUG mode (DEBUG='HeadlessChrome*' npm start)
    await mainTab.debugLog('Waiting 5 seconds to give some time to all the redirects')

    // Navigate a little...
    await mainTab.goTo('http://www.mywebsite.com/myProfile')

    // Check the select current value
    const myCurrentSubscriptionPlan = await mainTab.getValue('#subscriptionSelect')
    console.log(myCurrentSubscriptionPlan) // {type: 'string', value: '1 month' }

    // Edit the subscription
    await mainTab.select('#subscriptionSelect', '3 months')
    await mainTab.click('#Save')

    // Resize the viewport to full screen size (One use is to take full size screen shots)
    await mainTab.resizeFullScreen()

    // Take a screenshot
    await mainTab.saveScreenshot('./shc.png')

    // Get a HTML tag value based on class id
    const htmlTag = await mainTab.evaluate(function(selector) {
        const selectorHtml = document.querySelector(selector)
        return selectorHtml.innerHTML
    }, '.main'); // returns innerHTML of first matching selector for class "main"

    // Close the browser
    await browser.close()
  } catch (err) {
    console.log('ERROR!', err)
  }
 }
 navigateWebsite()

