const puppeteer = require('puppeteer');

async function scrap(url) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
        const productContainer = document.querySelector('div[data-aid="PRODUCT_LIST_RENDERED"]');
        if (!productContainer) return { error: "Product list not found" };

        const products = [];
        const productCards = productContainer.querySelectorAll('div[data-ux="GridCell"');

        if (productCards.length === 0) return { error: "No products found" };

        productCards.forEach(card => {
            const link = card.querySelector('a[data-ux="Link"]')?.href || null;
            const title = card.querySelector('div[data-ux="CommerceCardTitle"]')?.textContent.trim() || null;
            const price = card.querySelector('div[data-ux="CommerceItemPrice"]')?.textContent.trim() || null;
            const image = (() => {
                const imgDiv = card.querySelector('div[role="img"]');
                if (imgDiv) {
                    const bg = window.getComputedStyle(imgDiv).backgroundImage;
                    const match = bg.match(/url\(["']?(.*?)["']?\)/);
                    return match ? match[1] : null;
                }
                return null;
            })();

            products.push({ title, price, image, link });
        });

        return { products };
    });

    await browser.close();
    return JSON.stringify(data, null, 2);
}


async function runScrapping() {
    const pageCount = 9;
    for (let k = 1; k <= pageCount; k++) {
        const url = `https://theartshoppeonline.com/shop/ols/products?page=${k}`;
        console.log(url);
        await scrap(url).then(json => console.log(json));
    }
}

runScrapping();