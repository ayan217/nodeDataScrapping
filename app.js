const Scrap = require('./controllers/Scrap.js');
const { BlogLinks, Blogs } = require('./models');
const baseLink = 'https://www.ccbusinessreview.com.au';
const attributesToScrap = {
    "a": {
        "text": "Continue reading"
    }
};
const scrapper = new Scrap(baseLink, BlogLinks);

(async () => {

    // await scrapper.sync();
    // await scrapper.truncate();





    // const categories = {
    //     'editorial': 13,
    //     'news': 7,
    //     'business-news': 54,
    //     'cover-story': 7,
    //     'manufacturing-news': 7,
    //     'property': 6,
    //     'tourism-news': 2
    // };


    // const promises = Object.keys(categories).map(async (category) => {
    //     const fetchedData = await scrapper.runScrappingForBaseLinks(`/blog/tag/${category}`, categories[category], attributesToScrap);
    //     console.log(fetchedData);
    // });

    // await Promise.all(promises);





    const allData = await scrapper.getAllBaseLinks();
    // const allData = await scrapper.getAllBaseLinksWithConditions({ category: 'business-news' });
    // allData.forEach(function (data, index) {
    //     console.log(`${index} || ${data.category} || ${data.link}`);
    // })

    // console.log(allData);



    for (const data of allData) {
        try {
            const singleLinkData = await scrapper.scrapSingleProduct(data.link);
    
            await Blogs.create({
                title: singleLinkData.title,
                date: singleLinkData.date,
                image: singleLinkData.image,
                body: singleLinkData.body,
                link: data.link,
                category: data.category
            });
    
            console.log('Data inserted successfully >> ' + data.link);
        } catch (error) {
            console.error('Error inserting data:', error);
        }
    }
    


    // const singleLinkRow = await scrapper.getSingleProduct(210);
    // const link = singleLinkRow.link;
    // const singleLinkData = await scrapper.scrapSingleProduct(link);
    // console.log(singleLinkData);

})();


