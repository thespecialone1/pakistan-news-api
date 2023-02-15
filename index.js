const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const { response } = require('express');

const PORT = 8000;

const newsPapers = [
    {
        paper: 'ARY News',
        address: 'https://arynews.tv/category/pakistan/'
    }
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
                    // console.log("ok");
                    
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

})

exp.listen(PORT, () => console.log(`Server is listening on port ${PORT}`))