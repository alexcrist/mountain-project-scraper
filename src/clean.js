const { purgeEmptyFields } = require('./util.js');

function clean(node) {
  const isArray = Array.isArray(node);
  const isArea = 'children' in node;
  
  if (isArray) {
    return node.map(clean);
  }

  else if (isArea) {
    return cleanArea(node);
  }

  return cleanRoute(node);
}

// Clean an area ===============================================================

function cleanArea(area) {
  const url = area.url;
  const { lat, long } = cleanGps(area.gps);
  const name = area.name.trim();
  const elevation = cleanElevation(area.elevation);
  const { totalViews, monthlyViews } = cleanPageViews(area.pageViews);
  const children = clean(area.children);

  return purgeEmptyFields({
    url, lat, long, name, elevation, totalViews, monthlyViews, children
  });
}

function cleanGps(gps) {
  const regex = /(\-?\d+(\.\d+)?),\s*(\-?\d+(\.\d+)?)/g;
  const latLongString = gps.match(regex)[0];
  const latLongArray = latLongString.split(/,\s*/g);
  const lat = latLongArray[0].trim();
  const long = latLongArray[1].trim();
  
  return { lat, long };
}

function cleanElevation(elevation) {
  const elevationString = elevation
    .replace(/,/g, '')
    .replace(/ft/g, '')
    .trim();
  return parseInt(elevationString);
}

function cleanPageViews(pageViews) {
  const regex = /\d+([\d,]?\d)*(\.\d+)?/g;
  const groups = pageViews.match(regex);
  const totalViews = parseInt(groups[0].replace(/,/g, '').trim());
  const monthlyViews = parseInt(groups[1].replace(/,/g, '').trim());
  return { totalViews, monthlyViews };
}

// Clean a route ===============================================================

function cleanRoute(route) {
  const url = route.url;
  const name = route.name.trim();
  const { types, height, pitches, lengthGrade } = cleanType(route.type);
  const grade = cleanGrade(route.grade); 
  const { avgRating, numRatings } = cleanRating(route.rating);
  const { totalViews, monthlyViews } = cleanPageViews(route.pageViews);
  const firstAscent = route.firstAscent.trim();

  return purgeEmptyFields({
    url, name, types, height, pitches, lengthGrade, grade, avgRating, numRatings,
    totalViews, monthlyViews, firstAscent
  });
}

function cleanType(typeInfo) {
  typeInfo = typeInfo.toLowerCase().trim();

  const possibleTypes = [
    'trad', 'sport', 'alpine', 'tr', 'boulder', 'mixed', 'ice', 'snow', 'aid'
  ];

  let types = [];
  let height = NaN;
  let pitches = NaN;
  let lengthGrade = '';
  
  const typeInfoArray = typeInfo.split(/,\s*/g);
  typeInfoArray.forEach(token => {
    const isType = token in possibleTypes;
    const isHeight = token.includes('ft');
    const isPitches = token.includes('pitches');
    const isLengthGrade = token.includes('grade');

    if (isType) {
      types.push(token);
    }

    if (isHeight) {
      height = parseInt(token.replace(/,/g, '').replace(/ft/g, '').trim());
    }

    if (isPitches) {
      pitches = parseInt(token.replace(/,/g, '').replace(/pitches/g, '').trim());
    }

    if (isLengthGrade) {
      lengthGrade = token.replace(/grade/g, '').trim();
    }
  });

  return { types, height, pitches, lengthGrade };
}

function cleanGrade(grade) {
  grade = grade.toLowerCase().trim();
  lengthGrade = grade.replace(/yds/g, '').trim();
  return grade;
}

function cleanRating(rating) {
  const regex = /\d+([\d,]?\d)*(\.\d+)?/g;
  const groups = rating.match(regex);
  const avgRating = parseFloat(groups[0]);
  const numRatings = parseInt(groups[1].replace(/,/g, ''));
  return { avgRating, numRatings };
}

module.exports = clean;
