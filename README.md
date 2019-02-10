# Mountain Project Scraper

> Scrapes area and route data from the Mountain Project

## 🚲 Running the Scraper

### Requirements

- `npm 3.5.2`
- `node 8.10.0` 

### Install dependencies

- `npm install`

### Start scraping

- `npm start`

## 🏛️ Site Structure

The Mountain Project is a tree structure with top-level areas (California, etc.)
being root nodes. Every area is a branch node that has one parent area and
many child nodes which can either be sub-areas or routes. Routes are leaf nodes.

    California                  (top-level area)
    ├── Joshua Tree             (area)
    │   └─ Barker Dam Area      (area)
    │      └─ Room to Shroom    (route)
    └── Yosemite                (area)
        └─ Yosemite Valley      (area)
          ├─ El Capitan         (area)
          │  └─ Southwest Face  (area)
          │     └─ The Nose     (route)
          └─ Half Dome          (area)
              └─ Southwest Face (area)
                └─ Snake Dyke   (route)

## 📃 Scraping Strategy

We start off by scraping the top-level area nodes, then we do a breadth-first
scrape each area's children in a breadth-first traversal of the data tree.
Every 200 URL scrapes, we save the data to disk and restart the scraper. We
keep our already-scraped data in memory to avoid loading our progress from
disk in between partial-scrapes.

When we start the scraper, if there is scraped data on disk already, we load
this data and scrape only the unscraped data. This allows us to perform our
scrape across multiple sessions.

### How do we know if we have already scraped something?

When we restart our scraper with some already-scraped data, we need some way to
pick up our progress and decide how to continue scraping.

This is done by traversing our already-scraped data tree and for each node we
handle four different possible cases.

**The node can be an array** in which case we process each node in the array.

**The node can be a URL** in which case we scrape it to produce a either an area
or a route.

**The node can be an area** in which case we process each of its children.

**The node can be a route** in which case no scraping needs to occur.
