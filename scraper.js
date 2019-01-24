const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

// Mountain Project homepage URI
MOUNTAIN_PROJECT_URI = 'https://www.mountainproject.com';

// Homepage selectors
STATES = 'strong .float-xs-left';

// Area selectors
CHILD_URIS = '';

// Route selectors
ROUTE_NAME = 'h1';
ROUTE_GRADE = '.mr-2 .rateYDS';
ROUTE_RATING_INFO = '#route-star-avg span.scoreStars';
ROUTE_TYPE = '.description-details tr:nth-child(1) td+ td';
ROUTE_FA = '.description-details tr:nth-child(2) td+ td';
ROUTE_PAGE_VIEWS = 'tr:nth-child(3) .text-nowrap+ td';

// Entry point
loadMountainProject
  .then(scrapeStateUris)
  .then(loadAndScrape)
  .then(writeDataToFile)
  .catch(console.error);

// Load the given URI into the cheerio HTML parser
function scrapeRequest(uri) {
  const transform = cheerio.load;
  const options = { uri, transform };
  return request(options);
}

// Load the Mountain Project homepage
function loadMountainProject() {
  return scrapeRequest(MOUNTAIN_PROJECT_URI);
}

// Scrape top-level state URIs from Mountain Project homepage
function scrapeStateUris($) {
  return $(STATES).map(function() {
    return $(this).attr('href');
  });
}

// Load then scrape a list of Mountain Project area or route URIs
function loadAndScrape(uris) {
  const loadPromises = uris.map(uri => {
    // Scrape areas
    if (uri.includes('/area/')) {
      return scrapeRequest.then(scrapeArea);
    }

    // Scrape routes
    else if (uri.includes('/route/')) {
      return scrapeRequest.then(scrapeRoute);
    }

    // Neither router nor area...
    console.error('Neither area nor route:', uri);
    return {};
  });

  return Promise.all(loadPromises);
}

// Scrape a Mountain Project area
function scrapeArea($) {
  const name = ;
  const elevation = ;
  const gps = ;
  const pageViews = ;

  const childUris = $(CHILD_URI_SELECTOR).map(function() {
    return $(this).attr('href');
  });

  // Recursively scrape the area's sub-areas or routes (children)
  return loadAndScrape(childUris).then(children => {
    return {
      name,
      elevation,
      gps,
      pageViews,
      children
    };
  });

}

// Scrape a Mountain Project route
function scrapeRoute($) {
  const name = ;
  const type = ;
  const grade = ;
  const ratingInfo = ;
  const firstAscent = ;
  const pageViews = ;

  // TODO
  // - pull apart rating and numVotes with regex 'Avg: 3.6 from 684 votes'

  return {
    name,
    type,
    grade,
    rating,
    numVotes,
    firstAscent,
    pageViews
  };
}




