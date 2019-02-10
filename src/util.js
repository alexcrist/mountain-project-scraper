const cheerio = require('cheerio');
const requestPromise = require('request-promise');
const { writeFile } = require('fs-extra');
const { gray, yellow } = require('chalk');

const INDENTATION = 2;

// Request the given url, load content into cheerio parser, handle errors
function request(url) {
  return new Promise(resolve => {
    requestPromise({
      uri: url,
      transform: cheerio.load,
      headers: { 'Connection': 'Keep-Alive' }
    })
    .then(data => {
      process.stdout.write(gray('+'));
      return data;
    })
    .then(resolve)
    .catch(() => {
      process.stdout.write(yellow('-'));
      return request(url);
    });
  });
}

// Returns a promise that writes data to a file then resolvew with the data
function writeDataToFile(jsonData, fileName) {
  console.log(`\nSaving data to ${fileName}...`);
  const string = JSON.stringify(jsonData, null, INDENTATION);
  return writeFile(fileName, string, 'utf8')
    .then(() => console.log(`Data saved!`))
    .then(() => jsonData);
}

// Logging helper for promise chains
function promiseLog(message) {
  return value => {
    console.log(message);
    return value;
  }
}

// Remove empty fields from an object
function purgeEmptyFields(obj) {
  Object.keys(obj).forEach(key => {
    const val = obj[key];
    if (val === '' || val === undefined || val === null || val === NaN) {
      delete obj[key];
    }
  });
  return obj;
}

module.exports = { request, writeDataToFile, promiseLog, purgeEmptyFields };