const puppeteer = require("puppeteer");
const path = require("path");
const fs = require("fs");

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
  });

  const page = await browser.newPage();
  await page.goto("http://127.0.0.1:5500/test/e2e/mysite.html");

  await page.type("input[id='name']", "Test User");
  await page.type("input[id='email']", "test@example.com");
  await page.type("input[id='password']", "123456");

  // Create screenshot folder if missing
  const folderPath = path.join(__dirname, "imgs");
  if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);

  // Timestamped file
  const timestamp = (() => {
    const now = new Date();
    return (
      now.getFullYear() +
      "-" +
      String(now.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(now.getDate()).padStart(2, "0") +
      "T" +
      String(now.getHours()).padStart(2, "0") +
      "-" +
      String(now.getMinutes()).padStart(2, "0") +
      "-" +
      String(now.getSeconds()).padStart(2, "0")
    );
  })();

  const filePath = path.join(folderPath, `test-${timestamp}.png`);

  await page.screenshot({ path: filePath });
  console.log("Screenshot saved at:", filePath);

  await page.click("button[type='submit']");

  // Wait for home page to load
  await page.waitForSelector("p", { timeout: 5000 });

  const text = await page.$eval("p", (el) => el.textContent);
  console.log("Home Page Text:", text);

  await browser.close();
}

main();
