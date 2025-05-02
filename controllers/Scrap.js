const puppeteer = require('puppeteer');
const { syncModels, AllLinks, BlogLinks } = require('../models');

class Scrap {
    constructor(baseLink, modal) {
        this.baseLink = baseLink;
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
            // executablePath: '/usr/bin/google-chrome',
            executablePath: 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });

        const data = await page.evaluate(() => {
            const container = document.querySelector('div.blog-holder');
            const title = container.querySelector('h1')?.textContent;
            const dateTimeText = container.querySelector('.blog-posted-line')?.textContent;
            const parts = dateTimeText.split('on');
            const date = parts[1] ? parts[1].trim() : null;
            const image = container.querySelector('img.blog-img')?.src;
            const body = container.querySelector('div.blog-body')?.innerHTML;

            const singleLinkData = {
                title: title,
                date: date,
                image: image,
                body: body
            };
            return { singleLinkData };

        });
        await browser.close();
        return data.singleLinkData;
    }
    async scrapUrl(url, attributesToScrap) {
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
    async runScrappingForBaseLinks(slug, pageCount, attributesToScrap) {
        const allProductLinks = [];
        const category = slug.split('/tag/')[1];
        for (let k = 1; k <= pageCount; k++) {
            const url = `${this.baseLink + slug}?page=${k}`;
            const links = await this.scrapUrl(url, attributesToScrap);
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
