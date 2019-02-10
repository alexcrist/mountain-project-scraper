const { readFile, pathExistsSync } = require('fs-extra');
const Scraper = require('./scraper.js');
const { writeDataToFile, promiseLog } = require('./util.js');

const FILE_NAME = 'data.json';
const ROOT = 'https://www.mountainproject.com';

// Attempt to completely scrape the mountain project (periodically caches and
// saves data to disk, then restarts scraper with data from memory cache
function completeScrape(scraper, cache) {
  return partialScrape(scraper, cache)
    .then(data => writeDataToFile(data, FILE_NAME))
    .then(data => {
      if (scraper.isDone()) {
        return data;
      }

      // Reset the caching threshold of the scraper
      scraper.reset();

      // Scrape again using already-scraped data to populate the cache
      return completeScrape(scraper, data);
    });
}

// Scrape one cache's worth of data from the mountain project using the given
// scraper and the given data cache
function partialScrape(scraper, cache) {
  const memoryCacheExists = cache !== null;
  const fileCacheExists = pathExistsSync(FILE_NAME);

  if (memoryCacheExists) {
    return scrapeWithMemoryCache(scraper, cache);
  }

  else if (fileCacheExists) {
    return scrapeWithFileCache(scraper);
  }

  return scrapeFromRoot(scraper);
}

// Scrape the mountain project but using the data from the cache object which is
// a partially scraped tree of all of the data
function scrapeWithMemoryCache(scraper, cache) {
  console.log('\nScraping from memory cache...');
  return scraper.scrape(cache);
}

// Scrape the mountain project but using data loaded from a file that is caching
// a partially scraped tree of all of the data
function scrapeWithFileCache(scraper) {
  console.log('\nLoading cache from file...')
  return readFile(FILE_NAME)
    .then(JSON.parse)
    .then(promiseLog('\nCache loaded from file. Starting scrape...'))
    .then(data => scraper.scrape(data));
}

// Scrape from the very beginning, using the homepage of the mountain project
// to scrape the array of root nodes (in this case, these are generally the 
// areas representing US states)
function scrapeFromRoot(scraper) {
  console.log('\nStarting scrape from homepage...');
  return scraper.scrape(ROOT);
}

// Entry point =================================================================

const scraper = new Scraper();
const cache = null;
completeScrape(scraper, cache)
  .then(() => console.log('\nScrape complete.'))

