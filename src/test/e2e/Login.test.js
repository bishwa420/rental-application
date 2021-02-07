import faker from "faker"
import puppeteer from "puppeteer/lib/cjs/puppeteer/node-puppeteer-core"

const person = {
    name: faker.name.firstName() + " " + faker.name.lastName(),
    email: faker.internet.email(),
    phone: faker.phone.phoneNumber(),
    message: faker.random.words()
}

describe("Login e2e tests", () => {

    test("h2 loads correctly", async () => {

        let browser = await puppeteer.launch({
            headless: false
        })

        let page = await browser.newPage()
        page.emulate({
            viewport: {
                width: 500,
                height: 2400
            },
            userAgent: ''
        })

        await page.goto('http://localhost:3000')
        await page.waitForSelector(".form-signin-heading")

        const html = await page.$eval('.form-signin-heading', e => e.innerHTML)
        expect(html).toBe("Apartment Rental App")

        await browser.close()
    }, 16000)
})