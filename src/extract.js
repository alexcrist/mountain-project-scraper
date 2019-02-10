const { home, area, route, general } = require('./selectors.js');
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
function extractHome($) {
  return extractLinks($, home.states);
}

// Extract a route
function extractRoute($, url) {
  const descriptionDetails = extractDescriptionDetails($);
  return {
    url,
    name: $(route.name).text(),
    rating: $(route.rating).text(),
    grade: $(route.grade).text(),
    ...descriptionDetails
  };
}

// Extract an area
function extractArea($, url) {
  const descriptionDetails = extractDescriptionDetails($)
  return {
    url,
    name: $(area.name).text(),
    children: extractLinks($, area.children),
    ...descriptionDetails  
  };
}

// Extract all links using the given selector
function extractLinks($, selector) {
  return $(selector).map(function() {
    return $(this).attr('href');
  }).get();
}

// Extract data from the description details table
function extractDescriptionDetails($) {
  const keyMap = {
    'Elevation:': 'elevation',
    'GPS:': 'gps',
    'Page Views:': 'pageViews',
    'Type:': 'type',
    'FA:': 'firstAscent'
  };

  let key = '';
  let descriptionDetails = {};

  $(general.descriptionDetails).map(function(index) {
    const isKey = index % 2 == 0;
    const text = $(this).text().trim();
    
    if (isKey) {
      key = text;
    }

    else {
      for (const keyText of Object.keys(keyMap)) {
        if (key.includes(keyText)) {
          descriptionDetails[keyMap[keyText]] = text;
          break;
        }
      }
    }
  });

  return descriptionDetails;
}

module.exports = extract;