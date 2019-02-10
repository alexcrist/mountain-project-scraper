const extract = require('./extract.js');
const { request } = require('./util.js');

const SCRAPES_BEFORE_CACHING = 10;

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

  // Take a node and return it with all of its scraped children
  scrape(node) {
    const isUrl = typeof node === 'string';
    const isArray = Array.isArray(node);
    const isObject = typeof node === 'object';
    const hasChildUris = isObject && 'childUris' in node;
    const hasChildren = isObject && 'children' in node;

    if (isUrl) {
      return this.scrapeUrl(node);
    } 
    
    else if (isArray) {
      return this.scrapeArray(node);
    }
    
    else if (hasChildUris) {
      return this.scrapeChildUris(node);
    } 
    
    else if (hasChildren) {
      return this.scrapeChildren(node);
    } 
    
    // Else, node is a leaf
    return new Promise(resolve => resolve(node));
  }

  scrapeUrl(node) {
    this.numItemsScraped++;
    return request(node)
      .then($ => extract($, node))
      .then(node => this.scrape(node));
  }

  scrapeArray(node) {
    const promises = node.map(subNode => this.scrape(subNode), this);
    return Promise.all(promises);
  }

  scrapeChildUris(node) {
    const maxScrapesExceeded = this.numItemsScraped > SCRAPES_BEFORE_CACHING;
    if (maxScrapesExceeded) {
      return node;
    }

    return this.scrape(node.childUris)
      .then(children => {
        delete node.childUris;
        return { ...node, children: children };
      })
    }

  scrapeChildren(node) {
    return this.scrape(node.children)
      .then(children => ({ ...node, children }));
  }
}

module.exports = Scraper;
