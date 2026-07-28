const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    console.log('Navigating to community page...');
    const response = await page.goto('http://localhost:3000/community?tab=groups', { waitUntil: 'networkidle0' });
    console.log('Status code:', response.status());

    await new Promise(r => setTimeout(r, 5000));
    const html = await page.evaluate(() => document.body.innerHTML);
    fs.writeFileSync('page.html', html);
    console.log('Saved page.html');
  } catch (error) {
    console.error('Error during execution:', error);
  } finally {
    await browser.close();
  }
})();
