const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://google.co.uk');
    await page.screenshot({path: 'google.co.uk.png'});

    await browser.close();
})();
