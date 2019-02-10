const cheerio = require('cheerio');
const requestPromise = require('request-promise');
const { writeFile } = require('fs-extra');

const INDENTATION = 2;

// Request the given URI, load content into cheerio parser, handle errors
function request(uri) {
  return new Promise(resolve => {
    requestPromise({
      uri,
      transform: cheerio.load,
      headers: { 'Connection': 'Keep-Alive' }
    })
    .then(data => {
      process.stdout.write('+');
      return data;
    })
    .then(resolve)
    .catch(() => {
      process.stdout.write('-');
      return requestPromise(uri);
    });
  });
}

// Returns a promise that writes data to a file then resolvew with the data
function writeDataToFile(jsonData, fileName) {
  console.log(`\nSaving data to ${fileName}...`);
  const string = JSON.stringify(jsonData, null, INDENTATION);
  return writeFile(fileName, string, 'utf8')
    .then(() => console.log(`\nData saved to ${fileName}!`))
    .then(() => jsonData);
}

// Logging helper for promise chains
function promiseLog(message) {
  return value => {
    console.log(message);
    return value;
  }
}

module.exports = { request, writeDataToFile, promiseLog };