const Scrap = require('./controllers/Scrap.js');

const scrapper = new Scrap();

(async () => {
    const product = await scrapper.getSingleProduct(28022);
    const linkToScrap = product.link;
    console.log(linkToScrap);
    const singleProductData = await scrapper.scrapSingleProduct(linkToScrap);
    console.log(singleProductData);
})();

// console.log(scrapper.getAllBaseLinks());
