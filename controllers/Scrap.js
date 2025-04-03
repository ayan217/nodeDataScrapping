const puppeteer = require('puppeteer');
const { syncModels, AllLinks } = require('../models');

class Scrap {
    async sync() {
        await syncModels();
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
    async scrapBaseLinks(url) {
        const browser = await puppeteer.launch({
            headless: true,
            executablePath: '/usr/bin/google-chrome',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();

        await page.goto(url, { waitUntil: 'networkidle2' });

        const data = await page.evaluate(() => {
            const productContainer = document.querySelector('div[data-aid="PRODUCT_LIST_RENDERED"]');
            if (!productContainer) return { error: "Product list not found" };

            const products = [];
            const productCards = productContainer.querySelectorAll('div[data-ux="Block"]');

            if (productCards.length === 0) return { error: "No products found" };

            productCards.forEach(card => {
                const link = card.querySelector('a[data-ux="Link"]')?.href || null;
                if (link !== null) {
                    products.push(link);
                }
            });

            return { products };
        });

        await browser.close();
        return data.products;
    }

    async runScrappingForBaseLinks() {
        const pageCount = 9;
        const allProductLinks = [];

        for (let k = 1; k <= pageCount; k++) {
            const url = `https://theartshoppeonline.com/shop/ols/products?page=${k}`;
            const links = await this.scrapBaseLinks(url);
            if (links) {
                allProductLinks.push(...links);
                await AllLinks.bulkCreate(
                    allProductLinks.map(link => ({ link })),
                    { ignoreDuplicates: true }
                );
            }
        }

        console.log(allProductLinks);
    }

    async getAllBaseLinks() {
        const allLinks = await AllLinks.findAll();
        console.log('All links:', JSON.stringify(allLinks, null, 2));
    }

    async truncate() {
        await AllLinks.destroy({ truncate: true });
    }
    async getSingleProduct(id) {
        const row = await AllLinks.findByPk(id);
        // console.log(JSON.stringify(row, null, 2));
        return row;
    }
}

module.exports = Scrap;
