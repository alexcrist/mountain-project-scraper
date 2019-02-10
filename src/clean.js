// Cleans scraped data from the Mountain Project

// TODO - this functionality is in the works

const clean = data => {
  return data;
}

const cleanElevation = elevation => {
  return elevation;
}

const cleanGps = gps => {
  const commaIndex = gps.indexOf(',');
  const returnIndex = gps.indexOf('\n');
  
  const longitude = gps.substring(0, commaIndex).trim();
  const latitude = gps.substring(commaIndex + 1, returnIndex).trim();

  return { longitude, latitude };
}

const cleanPageViews = pageViews => {
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

const cleanRouteType = type => {
  // this function will be hell
  return type;
}

const cleanRating = rating => {
  return {
    averageRating: rating,
    numVotes: rating
  };
}

const cleanGrade = grade => {
  return grade;
}

const cleanFirstAscent = firstAscent => {
  return firstAscent;
}

module.exports = clean;
