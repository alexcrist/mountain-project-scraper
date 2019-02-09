const { readFile, writeFile, pathExistsSync } = require('fs-extra');
const Scraper = require('./scraper.js');

const FILE_NAME = 'data.json';
const INDENTATION = 2;
const HOME = 'https://www.mountainproject.com';

// Logging helper for promise chains
function promiseLog(message) {
  return function(value) {
    console.log(message);
    return value;
  }
}

function writeDataToFile(jsonData) {
  const string = JSON.stringify(jsonData, null, INDENTATION);
  return writeFile(FILE_NAME, string, 'utf8')
    .then(() => console.log(`Data saved to ${FILE_NAME}!`))
    .then(() => jsonData);
}

// Scrape the mountain project using the given cache if available
function partialScrape(scraper, cache) {

  // Either we have data cached
  if (cache) {
    console.log('Using cache in memory...');
    return scraper.scrapeChildren(cache);
  }

  // Or the data is cached in a file
  else if (pathExistsSync(FILE_NAME)) {
    console.log('Loading cache from file...')
    return readFile(FILE_NAME)
      .then(JSON.parse)
      .then(promiseLog('Cache loaded. Starting scrape...'))
      .then(scraper.scrapeChildren);
  }

  // Or we need to start from scratch
  else {
    console.log('Starting scrape from homepage...');
    return scraper.scrape(HOME);
  }
}

function completeScrape(scraper, cache) {
  partialScrape(scraper, cache)
    .then(data => writeDataToFile(data))
    .then(data => {
      if (!scraper.isComplete()) {
        scraper.reset();
        completeScrape(scraper, data);
      } else {
        console.log('Scrape complete.');
      }
    });
}

const scraper = new Scraper();
const initialCache = null;
completeScrape(scraper, initialCache);

