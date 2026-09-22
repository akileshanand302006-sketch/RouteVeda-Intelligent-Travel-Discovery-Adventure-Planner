import { environment } from '../../../environments/environment';

/**
 * RouteVeda REST API Configuration
 * Connects Angular Services to the Node.js/Express PostgreSQL + PostGIS backend.
 * Uses environment-based URLs:
 * - Development: http://localhost:3000/api
 * - Production:  https://routeveda-backend.onrender.com/api
 */
const base = environment.apiUrl.replace(/\/+$/, '');

export const API_CONFIG = {
  baseUrl: base,
  endpoints: {
    auth: {
      login: `${base}/auth/login`,
      register: `${base}/auth/register`,
      me: `${base}/auth/me`,
      profile: `${base}/auth/profile`
    },
    destinations: {
      base: `${base}/destinations`,
      search: `${base}/destinations/search`,
      nearby: `${base}/destinations/nearby`
    },
    states: {
      base: `${base}/states`
    },
    activities: `${base}/activities`,
    attractions: `${base}/attractions`,
    foods: `${base}/foods`,
    festivals: `${base}/festivals`,
    trips: `${base}/trips`,
    wishlist: `${base}/wishlist`,
    dashboard: `${base}/dashboard/stats`,
    experiences: `${base}/experiences`,
    itineraries: `${base}/itineraries`,
    notifications: `${base}/notifications`
  }
};
