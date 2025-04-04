const Scrap = require('./controllers/Scrap.js');

const scrapper = new Scrap();

(async () => {
    const allProducts = await scrapper.getAllBaseLinks();
    console.log(allProducts);
    // const product = await scrapper.getSingleProduct(28022);
    // const linkToScrap = product.link;
    // console.log(linkToScrap);
    // const singleProductData = await scrapper.scrapSingleProduct(linkToScrap);
    // console.log(singleProductData);
})();


