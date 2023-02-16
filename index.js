const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const port = 8000;

const url = 'https://arynews.tv/category/pakistan/';

app.get('/', async (req, res) => {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const articles = [];

    $('.td-module-container').each((index, element) => {
      const title = $(element).find('.td-module-meta-info h3').text().trim();
      const thumbnail = $(element).find('.entry-thumb').attr('data-img-url');
      const source = $(element).find('.td-module-meta-info h3 a').attr('href');
      const article = { title, thumbnail, source, description: '' };
      articles.push(article);
    });

    // Visit each article source to get the description
    for (const article of articles) {
      const sourceResponse = await axios.get(article.source);
      const $source = cheerio.load(sourceResponse.data);
      const description = $source('.tdb-block-inner p strong').text().trim();
      article.description = description;
    }

    // Send articles as a JSON response
    res.json(articles);
  } catch (error) {
    console.error(error);
    res.status(500).send('Something went wrong');
  }
});

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});