const request = require('request-promise');
const cheerio = require('cheerio');
const fs = require('fs');

// Mountain Project homepage URI
const MOUNTAIN_PROJECT_URI = 'https://www.mountainproject.com';

// Homepage selectors
const STATES = 'strong .float-xs-left';

// Area selectors
const AREA_NAME = 'h1';
const AREA_ELEVATION = '.description-details tr:nth-child(1) .text-nowrap+ td';
const AREA_GPS = '.description-details tr:nth-child(2) td+ td';
const AREA_PAGE_VIEWS = 'tr:nth-child(3) .text-nowrap+ td';
const AREA_CHILDREN = 'div.mp-sidebar div.max-height :not(.small) a';

// Route selectors
const ROUTE_NAME = 'h1';
const ROUTE_GRADE = '.mr-2 .rateYDS';
const ROUTE_RATING_INFO = '#route-star-avg span.scoreStars';
const ROUTE_TYPE = '.description-details tr:nth-child(1) td+ td';
const ROUTE_FA = '.description-details tr:nth-child(2) td+ td';
const ROUTE_PAGE_VIEWS = 'tr:nth-child(3) .text-nowrap+ td';

// Entry point
loadMountainProject()
  .then(scrapeStateUris)
  .then(loadAndScrape)
  .then(writeDataToFile);

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
  }).get();
}

// Load then scrape a list of Mountain Project area or route URIs
function loadAndScrape(uris) {
  const loadPromises = uris.map(uri => {
    
    // Scrape areas
    if (uri.includes('/area/')) {
      return scrapeRequest(uri).then(scrapeArea);
    }

    // Scrape routes
    else if (uri.includes('/route/')) {
      return scrapeRequest(uri).then(scrapeRoute);
    }

    // Neither router nor area...
    console.error('Neither area nor route:', uri);
    return {};
  });

  return Promise.all(loadPromises);
}

// Scrape a Mountain Project area
function scrapeArea($) {

  // Scrape area data
  const name = $(AREA_NAME).text().trim();
  const elevationText = $(AREA_ELEVATION).text().trim();
  const gps = $(AREA_GPS).text().trim();
  const pageViews = $(AREA_PAGE_VIEWS).text().trim();
  const childUris = $(AREA_CHILDREN).map(function() {
    return $(this).attr('href');
  }).get();

  // Clean area data
  const elevation = cleanElevation(elevationText);
  const { longitude, latitude } = cleanGps(gps);
  const { totalPageViews, monthlyPageViews } = cleanPageViews(pageViews);
 

  // Recursively scrape the area's sub-areas or routes (children)
  return loadAndScrape(childUris).then(children => {
    return {
      name,
      elevation,
      gps,
      totalPageViews,
      monthlyPageViews,
      childUris
    };
  });
}

// Clean eleveation text
function cleanElevation(elevationText) {

  // TODO - finish this function

  const elevation = 1;
  return elevation;
}

// Clean GPS text to produce longitude and latitude
function cleanGps(gps) {

  // TODO - finish this function

  const longitude = '';
  const latitude = '';
  return { longitude, latitude };
}

// Clean page views text to produce total and monthly page views
function cleanPageViews(pageViews) {

  // TODO - finish this function

  const regex = /\d+([\d,]?\d)*(\.\d+)?/g;
  const matches = pageViews.match(regex);
  const totalPageViews = parseInt(matches[0].replace(/,/g, ''));
  const monthlyPageViews = parseInt(matches[1].replace(/,/g, ''));
  return { totalPageViews, monthlyPageViews };
}

// Scrape a Mountain Project route
function scrapeRoute($) {

  // TODO - finish this function

  const name = ;
  const type = ;
  const grade = ;
  const ratingInfo = ;
  const firstAscent = ;
  const pageViews = ;

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


function writeDataToFile(data) {

  // TODO - finish this function

  console.log('Done!');
  console.log(data);
}

