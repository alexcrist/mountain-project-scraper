const { home, area, route } = require('./selectors.js');
const { gray } = require('chalk');

// Extract data from a parsed cheerio HTML page
function extract($, url) {
  process.stdout.write(gray('.'));

  const isArea = url.includes('/area/');
  const isRoute = url.includes('/route/');
  const isHome = url == 'https://www.mountainproject.com';
  
  if (isArea) {
    return extractArea($, url);
  }
  
  else if (isRoute) {
    return extractRoute($, url);
  }

  else if (isHome) {
    return extractHome($);
  }

  throw Error('Neither area, route, nor homepage.', url);
}

// Extract top-level state URLs from the homepage
const extractHome = $ => extractLinks($, home.states);

// Extract a route
const extractRoute = ($, url) => ({
  url,
  name: $(route.name).text(),
  type: $(route.type).text(),
  grade: $(route.grade).text(),
  rating: $(route.rating).text(),
  pageViews: $(route.pageViews).text(),
  firstAscent: $(route.firstAscent).text()
});

// Extract an area
const extractArea = ($, url) => ({
  url,
  gps: $(area.gps).text(),
  name: $(area.name).text(),
  elevation: $(area.elevation).text(),
  pageViews: $(area.pageViews).text(),
  children: extractLinks($, area.children)
});

// Extract all links using the given selector
const extractLinks = ($, selector) => {
  return $(selector).map(function() {
    return $(this).attr('href');
  }).get();
};

module.exports = extract;