const requestPromise = require('request-promise');
const cheerio = require('cheerio');
const extract = require('./extract.js');

const SCRAPES_BEFORE_CACHING = 10;

// Request the given URI, load content into cheerio parser, handle errors
function request(uri) {
  return requestPromise({ uri, transform: cheerio.load })
    .catch(error => {
      console.log(`${error.message} Retrying...`);
      return requestPromise(uri);
    });
}

// A Scraper that requests then extracts data from the Mountain Project
class Scraper {
  
  constructor() {
    this.numItemsScraped = 0;
  }
  
  reset() {
    this.numItemsScraped = 0;
  }

  isComplete() {
    return this.numItemsScraped < SCRAPES_BEFORE_CACHING;
  }

  // Request and scrape many URIs
  scrapeMany(uris) {
    const loadPromises = uris.map(uri => this.scrape(uri));
    return Promise.all(loadPromises);
  }

  // Request and scrape a single URI
  scrape(uri) {
    this.numItemsScraped++;
    return request(uri)
      .then($ => extract($, uri))
      .then(parent => this.handleChildren(parent));
  }

  // If the scraping threshold is reached, cache results, otherwise scrape
  handleChildren(parent) {
    const done = this.numItemsScraped > SCRAPES_BEFORE_CACHING;
    return  done ? parent : this.scrapeChildren(parent);
  }

  // Take a parent and return it with all of its scraped children
  scrapeChildren(parent) {
    console.log(typeof parent, Array.isArray(parent));

    // Parent is a string (url)
    if (typeof parent === 'string') {
      return this.scrape(parent);
    }

    // Parent is an array
    if (Array.isArray(parent)) {
      return parent.map(subParent => this.scrapeChildren(subParent));
    }

    // Parent has children and they need scraping
    else if ('childUris' in parent) {
      return this.scrapeMany(parent.childUris)
        .then(children => {
          delete parent.childUris;
          return { ...parent, children };
        });
    }

    // Parent has children and they have been scraped (results were cached)
    else if ('children' in parent) {
      const newChildren = this.scrapeChildren(parent.children);
      return { ...parent, children: newChildren };
    }

    // Parent has no children
    return (() => parent)();
  }
}

module.exports = Scraper;