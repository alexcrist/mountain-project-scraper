const { home, area, route } = require('./selectors.js');

// Extract data from a parsed cheerio HTML page
function extract($, uri) {
  process.stdout.write('.');

  const isArea = uri.includes('/area/');
  const isRoute = uri.includes('/route/');
  const isHome = uri == 'https://www.mountainproject.com';
  
  if (isArea) {
    return extractArea($, uri);
  }
  
  else if (isRoute) {
    return extractRoute($, uri);
  }

  else if (isHome) {
    return extractHome($);
  }

  throw Error('Neither area, route, nor homepage.', uri);
}

// Extract top-level state URIs from the homepage
const extractHome = $ => extractLinks($, home.states);

// Extract a route
const extractRoute = ($, uri) => ({
  uri,
  name: $(route.name).text(),
  type: $(route.type).text(),
  grade: $(route.grade).text(),
  rating: $(route.rating).text(),
  pageViews: $(route.pageViews).text(),
  firstAscent: $(route.firstAscent).text()
});

// Extract an area
const extractArea = ($, uri) => ({
  uri,
  gps: $(area.gps).text(),
  name: $(area.name).text(),
  elevation: $(area.elevation).text(),
  pageViews: $(area.pageViews).text(),
  childUris: extractLinks($, area.childUris)
});

// Extract all links using the given selector
const extractLinks = ($, selector) => {
  return $(selector).map(function() {
    return $(this).attr('href');
  }).get();
};

module.exports = extract;