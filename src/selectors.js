// Mountain Project CSS selectors for web scraping

module.exports = {

  // Selectors for scraping the homepage
  home: {
    states: 'strong .float-xs-left'
  },

  // Selectors for scraping an area
  area: {
    name: 'h1',
    elevation: '.description-details tr:nth-child(1) .text-nowrap+ td',
    gps: '.description-details tr:nth-child(2) td+ td',
    pageViews: 'tr:nth-child(3) .text-nowrap+ td',
    children:  'div.mp-sidebar div.max-height :not(.small) a'
  },

  // Selectors for scraping a route
  route: {
    name:'h1',
    grade:'.mr-2 .rateYDS',
    ratingInfo:'#route-star-avg span.scoreStars',
    type:'.description-details tr:nth-child(1) td+ td',
    fa:'.description-details tr:nth-child(2) td+ td',
    pageViews:'tr:nth-child(3) .text-nowrap+ td'
  }
};