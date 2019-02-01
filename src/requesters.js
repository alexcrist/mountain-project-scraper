// Makes requests to the Mountain Project for web pages

const request = require('request-promise');
const cheerio = require('cheerio');
const { scrapeHome, scrapeArea, scrapeRoute } = require('./scrapers.js');

const HOME_URI = 'https://www.mountainproject.com';

// Load and then scrape state URIs from the Mountain Project homepage
function requestAndScrapeHome() {
  return scrapeRequest(HOME_URI).then(scrapeHome);
}

// Load then scrape a list of Mountain Project area or route URIs
function requestAndScrape(uris) {
  const loadPromises = uris.map(uri => {
    if (uri.includes('/area/')) {
      return scrapeRequest(uri)
        .then(scrapeArea)
        .then(requestAndScrapeAreaChildren);
    }
    else if (uri.includes('/route/')) {
      return scrapeRequest(uri)
        .then(scrapeRoute);
    }
    console.error('Neither area nor route:', uri);
    return {};
  });
  return Promise.all(loadPromises);
}

// Take an area and return it with all of its scraped children
function requestAndScrapeAreaChildren(area) {
  return requestAndScrape(area.childUris)
    .then(children => {
      delete area.childUris;
      return { ...area, children };
    });
}

// Load the given URI into the cheerio HTML parser
function scrapeRequest(uri) {
  const transform = cheerio.load;
  const options = { uri, transform };
  return request(options);
}

module.exports = { requestAndScrapeHome, requestAndScrape };
