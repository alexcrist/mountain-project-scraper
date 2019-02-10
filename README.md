# Mountain Project Scraper

> Scrape area and route data from The Mountain Project

## Requirements

- `npm 3.5.2`
- `node 8.10.0` 

## Running

### Install dependencies

- `npm install`

### Initiate scrape

- `npm start`

## How does it work?

The Mountain Project is a tree structure with top-level areas (California, etc.)
being root nodes. Every area is a branch node that has one parent area and
many child nodes which can either be sub-areas or routes. Routes are leaf nodes.

We start off by scraping the top-level area nodes, then we do a breadth-first
search scraping the tree of data. Every 200 URL scrapes, we save the data to
disk and restart the scraper with the scraped data as an input.

If there is already scraped data on disk when we start the scraper, it will load
this data and scrape from there. This is handy since the Mountain Project tree
structure is large and it could be useful to scrape it over multiple sessions.