// Scrapes data from the Mountain Project

const { home, area, route } = require('./selectors.js');

const AREA_TYPE = 'area';
const ROUTE_TYPE = 'route';

// Scrape top-level state URIs from Mountain Project homepage
const scrapeHome = $ => scrapeLinks($, home.states);

// Scrape a Mountain Project route
const scrapeRoute = $ => ({
  nodeType: ROUTE_TYPE,
  name: $(route.name).text(),
  type: $(route.type).text(),
  grade: $(route.grade).text(),
  rating: $(route.rating).text(),
  pageViews: $(route.pageViews).text(),
  firstAscent: $(route.firstAscent).text()
});

// Scrape a Mountain Project area
const scrapeArea = $ => ({
  nodeType: AREA_TYPE,
  gps: $(area.gps).text(),
  name: $(area.name).text(),
  elevation: $(area.elevation).text(),
  pageViews: $(area.pageViews).text(),
  childUris: scrapeLinks($, area.childUris)
});

// Scrape all links using the given selector
const scrapeLinks = ($, selector) => {
  return $(selector).map(function() {
    return $(this).attr('href');
  }).get();
};

module.exports = { scrapeHome, scrapeArea, scrapeRoute };
