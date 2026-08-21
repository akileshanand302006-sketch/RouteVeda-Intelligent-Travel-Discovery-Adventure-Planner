/**
 * TripForge REST API Configuration
 * Connects Angular Services to the Node.js/Express PostgreSQL + PostGIS backend.
 */
export const API_CONFIG = {
  baseUrl: 'http://localhost:3000/api',
  endpoints: {
    auth: {
      login: 'http://localhost:3000/api/auth/login',
      register: 'http://localhost:3000/api/auth/register',
      me: 'http://localhost:3000/api/auth/me',
      profile: 'http://localhost:3000/api/auth/profile'
    },
    destinations: {
      base: 'http://localhost:3000/api/destinations',
      search: 'http://localhost:3000/api/destinations/search',
      nearby: 'http://localhost:3000/api/destinations/nearby'
    },
    states: {
      base: 'http://localhost:3000/api/states'
    },
    activities: 'http://localhost:3000/api/activities',
    attractions: 'http://localhost:3000/api/attractions',
    foods: 'http://localhost:3000/api/foods',
    festivals: 'http://localhost:3000/api/festivals',
    trips: 'http://localhost:3000/api/trips',
    wishlist: 'http://localhost:3000/api/wishlist',
    dashboard: 'http://localhost:3000/api/dashboard/stats'
  }
};
