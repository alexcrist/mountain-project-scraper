// Scrapes data from the Mountain Project

const selectors = require('./selectors.js');
const cleaners = require('./cleaners.js');

// Scrape top-level state URIs from Mountain Project homepage
function scrapeHome($) {
  return $(STATES).map(function() {
    return $(this).attr('href');
  }).get();
}

// Scrape a Mountain Project area
function scrapeArea($) {

  const select = selectors.area;
  const clean = cleaners.area;

  const name = scrapeText($, select.name, clean.name);
  const elevation = scrapeText($, select.elevation, clean.elevation);
  const gps = scrapeText($, select.gps, clean.gps);
  const pageViews = scrapeText($, select.pageViews, clean.pageViews);
  
  const childUris = $(select.children).map(function() {
    return $(this).attr('href');
  }).get();

  const { longitude, latitude } = gps;
  const { totalPageViews, monthlyPageViews } = pageViews;

  return {
    name,
    elevation,
    longitude,
    latitude,
    totalPageViews,
    monthlyPageViews,
    childUris
  };
}

// Scrape a Mountain Project route
function scrapeRoute($) {

  const select = selectors.route;
  const clean = cleaners.route;

  const name = scrapeText($, select.name, clean.name);
  const type = scrapeText($, select.type, clean.type);
  const grade = scrapeText($, select.grade, clean.grade);
  const rating = scrapeText($, select.rating, clean.rating);
  const firstAscent = scrapeText($, select.firstAscent, clean.firstAscent);
  const pageViews = scrapeText($, select.pageViews, clean.pageViews);

  const { averageRating, numVotes } = rating;
  const { totalPageViews, monthlyPageViews } = pageViews;

  return {
    name,
    type,
    grade,
    averageRating,
    numVotes,
    firstAscent,
    totalPageViews,
    monthlyPageViews
  };
}

function scrapeText($, selector, cleaner) {
  const element = $(selector);
  const text = element.text().trim();
  return cleaner ? cleaner(text) : text;
}

module.exports = { scrapeHome, scrapeArea, scrapeRoute };
