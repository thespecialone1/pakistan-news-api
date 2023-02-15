const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const { response } = require('express');

const PORT = 8000;

const newsPapers = [
    // {
    //     paper: 'AP News',
    //     address: 'https://apnews.com/hub/pakistan'
    // },

    {
        paper: 'ARY News',
        address: 'https://arynews.tv/category/pakistan/'
    },

    // {
    //     paper: 'NPR',
    //     address: 'https://www.npr.org/search/?query=pakistan&page=1&range%5BlastModifiedDate%5D%5Bmin%5D=1675814400'
    // },

    // {
    //     paper: 'Reuters',
    //     address: 'https://www.reuters.com/news/archive/pakistan'
    // }
]






const exp = express();

exp.get('/', (req, res) => {
    res.send('welcome to the pakistan news api')
})





exp.get('/pakistan', (req, res) => {
    const articles = [];

    newsPapers.forEach(newsPapers => {
        axios.get(newsPapers.address)
            .then((response) => {
                const rawData = response.data;
                const $ = cheerio.load(rawData)


                $('div[class="td-module-meta-info"]', rawData).each(function () {
                    console.log("ok");
                    
                    const title = $(this).find('h3').text();
                    const url = $(this).find('a').attr('href');

                    articles.push({
                        title,
                        url,
                        source: newsPapers.paper
                    })
                })
                return res.json(articles);
            })
    })


    // axios.get('https://arynews.tv/?s=climate')
    //     .then((response) => {
    //         const rawData = response.data;
    //         const $ = cheerio.load(rawData);

    //         $('a:contains("climate")', rawData).each(function () {
    //             const title = $(this).text()
    //             const url = $(this).attr('href')
    //             articles.push({
    //                 title,
    //                 url,
    //             })
    //         })
    //         return res.json(articles)
    //     })
})

exp.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))



