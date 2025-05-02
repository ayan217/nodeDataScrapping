const Scrap = require('./controllers/Scrap.js');
const { BlogLinks } = require('./models');
const baseLink = 'https://www.ccbusinessreview.com.au';
const attributesToScrap = {
    "a": {
        "text": "Continue reading"
    }
};
const pageCount = 54;
const scrapper = new Scrap(baseLink, attributesToScrap, pageCount);

(async () => {

    // await scrapper.sync();
    // await scrapper.truncate(BlogLinks);

    // const allData = await scrapper.getAllBaseLinks();
    // console.log(allData);
    // const product = await scrapper.getSingleProduct(28022);
    // const linkToScrap = product.link;
    // console.log(linkToScrap);
    // const singleProductData = await scrapper.scrapSingleProduct(linkToScrap);
    // console.log(singleProductData);




    const fetchedData = await scrapper.runScrappingForBaseLinks('/blog/tag/business-news');
    // const allData = await scrapper.getAllBaseLinks(BlogLinks);
    console.log(fetchedData);

})();


