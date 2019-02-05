const { writeFile } = require('fs-extra');
const { requestAndScrapeHome, requestAndScrape } = require('./requesters.js');
const clean = require('./clean.js');

const OUTPUT_INDENTATION = 2;

// Write the given json data to a file
const writeDataToFile = (jsonData, fileName) => {
  const string = JSON.stringify(jsonData, null, OUTPUT_INDENTATION);
  return writeFile(fileName, string, 'utf8')
    .then(() => console.log(`Data saved to ${fileName}!`))
    .then(() => jsonData);
};

const writeDirty = dirtyData => writeDataToFile(dirtyData, 'dirty-data.json');
const writeClean = cleanData => writeDataToFile(cleanData, 'clean-data.json');

// Entry point
requestAndScrapeHome()
  .then(requestAndScrape)
  .then(writeDirty)
  .then(clean)
  .then(writeClean);