import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  // Public Routes
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent),
    title: 'RouteVeda – Sign In'
  },
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about.component').then(m => m.AboutComponent),
    title: 'RouteVeda – About'
  },

  // Protected Routes (Mandatory Authentication)
  {
    path: '',
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent),
    title: 'RouteVeda – Dashboard',
    canActivate: [authGuard]
  },
  {
    path: 'india',
    loadComponent: () => import('./pages/india-explorer/india-explorer.component').then(m => m.IndiaExplorerComponent),
    title: 'RouteVeda – India Explorer',
    canActivate: [authGuard]
  },
  {
    path: 'state/:stateId',
    loadComponent: () => import('./pages/state-details/state-details.component').then(m => m.StateDetailsComponent),
    title: 'RouteVeda – State Tourism',
    canActivate: [authGuard]
  },
  {
    path: 'explore',
    loadComponent: () => import('./pages/explore/explore.component').then(m => m.ExploreComponent),
    title: 'RouteVeda – Destinations',
    canActivate: [authGuard]
  },
  {
    path: 'destination/:id',
    loadComponent: () => import('./pages/destination-details/destination-details.component').then(m => m.DestinationDetailsComponent),
    title: 'RouteVeda – Destination Details',
    canActivate: [authGuard]
  },
  {
    path: 'attractions',
    loadComponent: () => import('./pages/attractions/attractions.component').then(m => m.AttractionsComponent),
    title: 'RouteVeda – Attractions',
    canActivate: [authGuard]
  },
  {
    path: 'attraction/:id',
    loadComponent: () => import('./pages/attraction-details/attraction-details.component').then(m => m.AttractionDetailsComponent),
    title: 'RouteVeda – Attraction Details',
    canActivate: [authGuard]
  },
  {
    path: 'activities',
    loadComponent: () => import('./pages/activities/activities.component').then(m => m.ActivitiesComponent),
    title: 'RouteVeda – Activities',
    canActivate: [authGuard]
  },
  {
    path: 'experiences',
    loadComponent: () => import('./pages/experiences/experiences.component').then(m => m.ExperiencesComponent),
    title: 'RouteVeda – Experiences',
    canActivate: [authGuard]
  },
  {
    path: 'food',
    loadComponent: () => import('./pages/food-explorer/food-explorer.component').then(m => m.FoodExplorerComponent),
    title: 'RouteVeda – Food Explorer',
    canActivate: [authGuard]
  },
  {
    path: 'festivals',
    loadComponent: () => import('./pages/festivals/festivals.component').then(m => m.FestivalsComponent),
    title: 'RouteVeda – Festivals',
    canActivate: [authGuard]
  },
  {
    path: 'compare',
    loadComponent: () => import('./pages/compare/compare.component').then(m => m.CompareComponent),
    title: 'RouteVeda – Compare',
    canActivate: [authGuard]
  },
  {
    path: 'recommend',
    loadComponent: () => import('./pages/find-destination/find-destination.component').then(m => m.FindDestinationComponent),
    title: 'RouteVeda – Find Destination',
    canActivate: [authGuard]
  },
  {
    path: 'bucket-list',
    loadComponent: () => import('./pages/bucket-list/bucket-list.component').then(m => m.BucketListComponent),
    title: 'RouteVeda – Bucket List',
    canActivate: [authGuard]
  },
  {
    path: 'achievements',
    loadComponent: () => import('./pages/achievements/achievements.component').then(m => m.AchievementsComponent),
    title: 'RouteVeda – Achievements',
    canActivate: [authGuard]
  },
  {
    path: 'itineraries',
    loadComponent: () => import('./pages/itineraries/itineraries.component').then(m => m.ItinerariesComponent),
    title: 'RouteVeda – Itineraries',
    canActivate: [authGuard]
  },
  {
    path: 'trip-builder',
    loadComponent: () => import('./pages/trip-builder/trip-builder.component').then(m => m.TripBuilderComponent),
    title: 'RouteVeda – Trip Builder',
    canActivate: [authGuard]
  },
  {
    path: 'my-trips',
    loadComponent: () => import('./pages/my-trips/my-trips.component').then(m => m.MyTripsComponent),
    title: 'RouteVeda – My Trips',
    canActivate: [authGuard]
  },
  {
    path: 'wishlist',
    loadComponent: () => import('./pages/wishlist/wishlist.component').then(m => m.WishlistComponent),
    title: 'RouteVeda – Wishlist',
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent),
    title: 'RouteVeda – Profile',
    canActivate: [authGuard]
  },
  {
    path: 'settings',
    loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent),
    title: 'RouteVeda – Settings',
    canActivate: [authGuard]
  },
  {
    path: '**',
    loadComponent: () => import('./pages/not-found/not-found.component').then(m => m.NotFoundComponent),
    title: 'RouteVeda – Not Found'
  }
];
