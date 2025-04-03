const Scrap = require('./controllers/Scrap.js');

const scrapper = new Scrap();

(async () => {
    const product = await scrapper.getSingleProduct(28018);
    const linkToScrap = product.link;
})();


