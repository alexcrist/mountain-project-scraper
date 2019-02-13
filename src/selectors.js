// CSS selectors extracting data

const selectors = {

  // Selectors for scraping the homepage
  home: {
    states: '.hidden-lg-up strong a.float-xs-left'
  },

  // Selectors for scraping an area
  area: {
    name: 'h1',
    children: 'div.mp-sidebar div.max-height :not(.small) a'
  },

  // Selectors for scraping a route
  route: {
    name: 'h1',
    grade: '.mr-2 .rateYDS',
    rating: '#route-star-avg span'
  },

  general: {
    descriptionDetails: '.description-details td'
  }
};

module.exports = selectors;
