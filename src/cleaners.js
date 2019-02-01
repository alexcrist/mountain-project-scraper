// Cleans scraped data from the Mountain Project

module.exports = {

  // Cleans area data
  area: {
    elevation: cleanElevation,
    gps: cleanGps,
    pageViews: cleanPageViews
  },

  // Cleans route data
  route: {
    type: cleanRouteType,
    pageViews: cleanPageViews,
    rating: cleanRating,
    grade: cleanGrade,
    firstAscent: cleanFirstAscent
  }
}

function cleanElevation(elevation) {
  return elevation;
}

function cleanGps(gps) {
  return {
    longitude: gps,
    latitude: gps
  };
}

function cleanPageViews(pageViews) {
  return {
    monthlyPageViews: pageViews,
    totalPageViews: pageViews
  };


  // const regex = /\d+([\d,]?\d)*(\.\d+)?/g;
  // const matches = pageViews.match(regex);
  // const totalPageViews = parseInt(matches[0].replace(/,/g, ''));
  // const monthlyPageViews = parseInt(matches[1].replace(/,/g, ''));
  // return { totalPageViews, monthlyPageViews };
}

function cleanRouteType(type) {
  // this function will be hell
  return type;
}

function cleanRating(rating) {
  return {
    averageRating: rating,
    numVotes: rating
  };
}

function cleanGrade(grade) {
  return grade;
}

function cleanFirstAscent(firstAscent) {
  return firstAscent;
}