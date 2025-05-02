const puppeteer = require('puppeteer');
const { syncModels, AllLinks, BlogLinks } = require('../models');

class Scrap {
    constructor(baseLink, attributesToScrap, modal) {
        this.baseLink = baseLink;
        this.attributesToScrap = attributesToScrap;
        this.modal = modal;
    }
    async sync() {
        await syncModels();
    }
    async truncate() {
        await this.modal.truncate();
    }
    async scrapSingleProduct(url) {
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: '/usr/bin/google-chrome',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });

        const data = await page.evaluate(() => {
            const productName = document.querySelector('h1[data-aid="PRODUCT_NAME_RENDERED"]')?.innerText;
            const productPrice = document.querySelector('div[data-aid="PRODUCT_PRICE_RENDERED"]')?.innerText;
            const productDes = document.querySelector('div[data-aid="PRODUCT_DESCRIPTION_RENDERED"]')?.innerHTML;
            const productImage = document.querySelector('img[data-ux="Image"]')?.src;
            const selectBox = document.querySelector('select[data-ux="InputSelectElement"]');
            const options = selectBox ? Array.from(selectBox.options).map(option => option.innerText).filter(option => option !== "-- Select --") : [];
            return { productName, productPrice, productImage, productDes, options };
        });
        await browser.close();
        return data;
    }
    async scrapBaseLinks(url, attributesToScrap) {
        const browser = await puppeteer.launch({
            headless: true,
            // executablePath: '/usr/bin/google-chrome',
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });

        const data = await page.evaluate((attrs, baseLink) => {


            const result = [];

            for (const selector in attrs) {
                const criteria = attrs[selector];

                document.querySelectorAll(selector).forEach(el => {
                    const item = {};

                    if (criteria.text && el.textContent.includes(criteria.text)) {
                        item.href = baseLink + el.getAttribute('href');
                        result.push(item);
                    }
                });
            }

            return { result };


        }, attributesToScrap, this.baseLink);

        await browser.close();
        return data.result;
    }
    async runScrappingForBaseLinks(slug, pageCount) {
        const allProductLinks = [];
        const category = slug.split('/tag/')[1];
        for (let k = 1; k <= pageCount; k++) {
            const url = `${this.baseLink + slug}?page=${k}`;
            const links = await this.scrapBaseLinks(url, this.attributesToScrap);
            if (links) {
                allProductLinks.push(...links);
                // console.log(allProductLinks);
                await this.modal.bulkCreate(
                    allProductLinks.map(link => ({
                        link: link.href,
                        category: category
                    })),
                    { ignoreDuplicates: true }
                );
            }
        }
        return allProductLinks;
    }

    async getAllBaseLinks() {
        const allData = await this.modal.findAll();
        return allData;
    }

    async getAllBaseLinksWithConditions(condition) {
        const allData = await this.modal.findAll({
            where: condition
        });
        return allData;
    }

    async getSingleProduct(id) {
        const row = await this.modal.findByPk(id);
        return row;
    }
}

module.exports = Scrap;
