const Scrap = require('./controllers/Scrap.js');
const baseLink = 'https://www.ccbusinessreview.com.au';
const attributesToScrap = {
    "a": {
        "text": "Continue reading"
    }
};
const pageCount = 10;
const scrapper = new Scrap(baseLink, attributesToScrap, pageCount);

(async () => {

    // await scrapper.sync();

    // const allData = await scrapper.getAllBaseLinks();
    // console.log(allData);
    // const product = await scrapper.getSingleProduct(28022);
    // const linkToScrap = product.link;
    // console.log(linkToScrap);
    // const singleProductData = await scrapper.scrapSingleProduct(linkToScrap);
    // console.log(singleProductData);




    const blogBaseLinks = await scrapper.runScrappingForBaseLinks('/blog/tag/editorial');
    console.log(blogBaseLinks);

})();


