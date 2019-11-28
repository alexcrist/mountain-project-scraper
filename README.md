# 🏔️ Mountain Project Scraper

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

    California                   (top-level area)
    ├── Joshua Tree              (area)
    │   └─ Barker Dam Area       (area)
    │      └─ Room to Shroom     (route)
    └── Yosemite                 (area)
        └─ Yosemite Valley       (area)
           ├─ El Capitan         (area)
           │  └─ Southwest Face  (area)
           │     └─ The Nose     (route)
           └─ Half Dome          (area)
              └─ Southwest Face  (area)
                 └─ Snake Dyke   (route)

## 📃 Scraping Strategy

We start off by scraping the top-level area nodes, then we do a depth-first
scrape each area's children. Every n URL scrapes, we save the data to disk and
restart the scraper. We keep our already-scraped data in memory to avoid loading
our progress from disk in between partial-scrapes.

When we start the scraper, if there is scraped data on disk already, we load
this data and scrape only the unscraped data. This allows us to perform our
scrape across multiple sessions.

### How do we know if we have already scraped something?

When we restart our scraper with some already-scraped data, we need some way to
pick up our progress and decide how to continue scraping.

This is done by traversing our already-scraped data tree and processing nodes
which can be one of four different types:

**The node can be an array** in which case we process each node in the array.

**The node can be a URL** in which case we scrape it to produce either an area
or a route.

**The node can be an area** in which case we process each of its children.

**The node can be a route** in which case no scraping needs to occur.

### Scraping Iteration Example

**Iteration 1**
```
[
  "https://www.mountainproject.com/area/105833388/yosemite-valley",
  "https://www.mountainproject.com/area/105720495/joshua-tree-national-park",
  ...
]
```

**Iteration 2** (URL #1 is scraped)
```
[
  {
    "url": "https://www.mountainproject.com/area/105833388/yosemite-valley",
    "name": "Yosemite Valley",
    "elevation": 4000,
    "long": 37.744,
    "lat": -119.599,
    "totalViews": 3126052,
    "monthlyViews": 20269,
    "children": [
      "https://www.mountainproject.com/area/105833392/el-capitan",
      "https://www.mountainproject.com/area/105833395/half-dome",
      ...
    ]
  },
  "https://www.mountainproject.com/area/105720495/joshua-tree-national-park",
  ...
]
```

**Iteration 3** (Area #1's first child is scraped)
```
[
  {
    "url": "https://www.mountainproject.com/area/105833388/yosemite-valley",
    "name": "Yosemite Valley",
    "elevation": 4000,
    "lat": 37.744,
    "long": -119.599,
    "totalViews": 3126052,
    "monthlyViews": 20269,
    "children": [
      {
        "url": "https://www.mountainproject.com/area/105833392/el-capitan",
        "name": "El Capitan",
        "elevation": 7118,
        "lat": 37.731,
        "long": -119.636,
        "totalViews": 750490,
        "monthlyViews": 4886,
        "children": [
          "https://www.mountainproject.com/area/113804909/southwest-face",
          ...
        ]
      },
      "https://www.mountainproject.com/area/105833395/half-dome",
      ...
    ]
  },
  "https://www.mountainproject.com/area/105720495/joshua-tree-national-park",
  ...
]
```
