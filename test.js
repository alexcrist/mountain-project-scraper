const request = require('request-promise');
const cheerio = require('cheerio');

const URI = 'https://www.mountainproject.com/route/105732281/crimson-chrysalis';

function scrapeRequest(uri) {
  const transform = cheerio.load;
  const options = { uri, transform };
  return request(options);
}

scrapeRequest(URI).then($ => {
  const thing = $('h1').text().trim();
  console.log(thing);
});
