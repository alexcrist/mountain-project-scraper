const extract = require('./extract.js');
const { request } = require('./util.js');

const SCRAPES_BEFORE_CACHING = 200;

// A Scraper that requests then extracts data from the Mountain Project
class Scraper {
  
  constructor() {
    this.numItemsScraped = 0;
  }
  
  // Reset the scraping threshold
  reset() {
    this.numItemsScraped = 0;
  }

  // If we exceed the maximum scrapes before caching, we are done scraping
  isDone() {
    return this.numItemsScraped < SCRAPES_BEFORE_CACHING;
  }

  // Scrape a node. A node can be a URL, an array, an area, or a route
  scrape(node) {
    const isUrl = typeof node === 'string';
    const isArray = Array.isArray(node);
    const isObject = typeof node === 'object';
    const isArea = isObject && 'children' in node;

    if (isUrl) {
      return this.scrapeUrl(node);
    } 
    
    else if (isArray) {
      return this.scrapeArray(node);
    }
    
    else if (isArea) {
      return this.scrapeChildren(node);
    } 
    
    // Else, node is a route (leaf node)
    return new Promise(resolve => resolve(node));
  }

  // If we've exceed our maximum scrape limit, return the given URL. Otherwise,
  // scrape it
  scrapeUrl(node) {
    const maxScrapesExceeded = this.numItemsScraped > SCRAPES_BEFORE_CACHING;
    if (maxScrapesExceeded) {
      return node;
    }

    this.numItemsScraped++;
    return request(node)
      .then($ => extract($, node))
      .then(node => this.scrape(node));
  }

  // Scrape each node in the given array
  scrapeArray(node) {
    const promises = node.map(subNode => this.scrape(subNode), this);
    return Promise.all(promises);
  }

  // Return the given area node with each of its children scraped
  scrapeChildren(node) {
    return this.scrape(node.children)
      .then(children => ({ ...node, children }));
  }
}

module.exports = Scraper;
