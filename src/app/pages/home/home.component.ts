import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DestinationService } from '../../core/services/destination.service';
import { ActivityService } from '../../core/services/activity.service';
import { StateService } from '../../core/services/state.service';
import { AttractionService } from '../../core/services/attraction.service';
import { FoodService } from '../../core/services/food.service';
import { FestivalService } from '../../core/services/festival.service';
import { DestinationCardComponent } from '../../shared/components/destination-card/destination-card.component';
import { TripService } from '../../core/services/trip.service';
import { NotificationService } from '../../core/services/notification.service';
import { Destination } from '../../models/destination.model';

import { AuthService } from '../../core/services/auth.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { AchievementService } from '../../core/services/achievement.service';

import { ExpenseCalculatorModalComponent } from '../../shared/components/expense-calculator-modal/expense-calculator-modal.component';
import { signal } from '@angular/core';

export interface DashboardModule {
  id: string;
  title: string;
  category: 'India Tourism' | 'Discovery & Culture' | 'Smart Planner Tools' | 'Travel Tracker';
  description: string;
  icon: string;
  badge: string;
  route: string;
  badgeClass: string;
  accentColor: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, DestinationCardComponent, ExpenseCalculatorModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  readonly destinationService = inject(DestinationService);
  readonly activityService = inject(ActivityService);
  readonly stateService = inject(StateService);
  readonly attractionService = inject(AttractionService);
  readonly foodService = inject(FoodService);
  readonly festivalService = inject(FestivalService);
  readonly authService = inject(AuthService);
  readonly wishlistService = inject(WishlistService);
  readonly achievementService = inject(AchievementService);
  readonly tripService = inject(TripService);
  private readonly notificationService = inject(NotificationService);

  showCalcModal = signal<boolean>(false);
  selectedDestForCalc = signal<Destination | null>(null);

  /** Minimized top picks for dashboard viewer (limited to top 4 featured destinations) */
  readonly topPicks = computed(() => this.destinationService.featuredDestinations().slice(0, 4));

  readonly dashboardModules: DashboardModule[] = [
    // 1. India Tourism & Destinations
    {
      id: 'india-explorer',
      title: 'Explore India (36 States & UTs)',
      category: 'India Tourism',
      description: 'Discover all 28 States & 8 Union Territories across 6 geographical regions.',
      icon: 'bi-globe-asia-australia',
      badge: '36 States & UTs',
      route: '/india',
      badgeClass: 'badge-tf-primary',
      accentColor: 'var(--tf-primary)'
    },
    {
      id: 'state-tourism',
      title: 'State Tourism Portals',
      category: 'India Tourism',
      description: 'Deep-dive portals into capitals, best seasons, top attractions, food, and culture.',
      icon: 'bi-map-fill',
      badge: 'Dynamic Guides',
      route: '/state/tamil-nadu',
      badgeClass: 'badge-tf-info',
      accentColor: 'var(--tf-info)'
    },
    {
      id: 'destinations-directory',
      title: 'Destinations Directory',
      category: 'India Tourism',
      description: 'Nationwide catalog filterable by region, state, budget, rating, and difficulty.',
      icon: 'bi-binoculars-fill',
      badge: 'Multi-Filter',
      route: '/explore',
      badgeClass: 'badge-tf-accent',
      accentColor: 'var(--tf-accent)'
    },
    {
      id: 'attractions-catalog',
      title: 'Tourist Attractions',
      category: 'India Tourism',
      description: 'UNESCO monuments, majestic forts, palaces, ancient temples, and lakes.',
      icon: 'bi-bank',
      badge: 'Monuments & Sites',
      route: '/attractions',
      badgeClass: 'badge-tf-warning',
      accentColor: 'var(--tf-warning)'
    },

    // 2. Discovery & Culture
    {
      id: 'adventure-activities',
      title: 'Adventure Activities',
      category: 'Discovery & Culture',
      description: 'White-water rafting, paragliding, scuba diving, Himalayan treks, and camping.',
      icon: 'bi-tree-fill',
      badge: 'High Adrenaline',
      route: '/activities',
      badgeClass: 'badge-tf-success',
      accentColor: 'var(--tf-success)'
    },
    {
      id: 'thematic-experiences',
      title: 'Thematic Experiences',
      category: 'Discovery & Culture',
      description: 'Curated spiritual retreats, wildlife tiger safaris, royal heritage, and nature.',
      icon: 'bi-lightning-charge-fill',
      badge: '6 Tourism Themes',
      route: '/experiences',
      badgeClass: 'badge-tf-primary',
      accentColor: 'var(--tf-primary)'
    },
    {
      id: 'regional-food',
      title: 'Regional Food Explorer',
      category: 'Discovery & Culture',
      description: 'Authentic regional cuisines, traditional delicacies, and top places to try.',
      icon: 'bi-cup-hot-fill',
      badge: 'Culinary Trails',
      route: '/food',
      badgeClass: 'badge-tf-accent',
      accentColor: 'var(--tf-accent)'
    },
    {
      id: 'festival-calendar',
      title: 'Indian Festival Calendar',
      category: 'Discovery & Culture',
      description: 'Month-by-month guide to cultural, harvest, and religious festivals across states.',
      icon: 'bi-calendar-event-fill',
      badge: 'Annual Calendar',
      route: '/festivals',
      badgeClass: 'badge-tf-warning',
      accentColor: 'var(--tf-warning)'
    },

    // 3. Smart Planner Tools
    {
      id: 'destination-quiz',
      title: 'Find My Destination Quiz',
      category: 'Smart Planner Tools',
      description: '4-step interactive quiz matching budget, region, and style to top destinations.',
      icon: 'bi-magic',
      badge: 'Smart Matching',
      route: '/recommend',
      badgeClass: 'badge-tf-primary',
      accentColor: 'var(--tf-primary)'
    },
    {
      id: 'compare-matrix',
      title: 'Destination Comparison',
      category: 'Smart Planner Tools',
      description: 'Side-by-side comparison matrix of up to 3 destinations with feature scoring.',
      icon: 'bi-bar-chart-steps',
      badge: 'Side-by-Side',
      route: '/compare',
      badgeClass: 'badge-tf-info',
      accentColor: 'var(--tf-info)'
    },
    {
      id: 'smart-trip-builder',
      title: 'Smart Trip Builder',
      category: 'Smart Planner Tools',
      description: 'Multi-step custom itinerary builder with live budget calculator & PDF export.',
      icon: 'bi-tools',
      badge: 'Live Calculator',
      route: '/trip-builder',
      badgeClass: 'badge-tf-accent',
      accentColor: 'var(--tf-accent)'
    },
    {
      id: 'sample-itineraries',
      title: 'Sample Itinerary Library',
      category: 'Smart Planner Tools',
      description: 'Curated 3 to 7-day tour routes ready to load directly into the Trip Builder.',
      icon: 'bi-journal-bookmark-fill',
      badge: 'Ready-Made Routes',
      route: '/itineraries',
      badgeClass: 'badge-tf-success',
      accentColor: 'var(--tf-success)'
    },

    // 4. Personal Tracker & Travel Hub
    {
      id: 'bucket-list-tracker',
      title: 'India Bucket List',
      category: 'Travel Tracker',
      description: 'Interactive checklist tracking visited states & destinations with % India coverage.',
      icon: 'bi-check2-square',
      badge: 'Interactive Tracker',
      route: '/bucket-list',
      badgeClass: 'badge-tf-success',
      accentColor: 'var(--tf-success)'
    },
    {
      id: 'achievements-badges',
      title: 'Travel Badges & Trophies',
      category: 'Travel Tracker',
      description: 'Unlockable trophies as you explore states, mountain peaks, and coastal shores.',
      icon: 'bi-trophy-fill',
      badge: 'Gamified Badges',
      route: '/achievements',
      badgeClass: 'badge-tf-warning',
      accentColor: 'var(--tf-warning)'
    },
    {
      id: 'saved-trips-hub',
      title: 'My Saved Trips',
      category: 'Travel Tracker',
      description: 'Manage, view day-by-day itineraries, duplicate, or export saved trips.',
      icon: 'bi-map-fill',
      badge: 'Trip Management',
      route: '/my-trips',
      badgeClass: 'badge-tf-primary',
      accentColor: 'var(--tf-primary)'
    },
    {
      id: 'wishlist-hub',
      title: 'My Travel Wishlist',
      category: 'Travel Tracker',
      description: 'Keep track of dream Indian places and add them instantly into new trip plans.',
      icon: 'bi-heart-fill',
      badge: 'Saved Favorites',
      route: '/wishlist',
      badgeClass: 'badge-tf-danger',
      accentColor: 'var(--tf-danger)'
    }
  ];

  readonly categories = ['India Tourism', 'Discovery & Culture', 'Smart Planner Tools', 'Travel Tracker'] as const;

  getModulesByCategory(category: string): DashboardModule[] {
    return this.dashboardModules.filter(m => m.category === category);
  }

  readonly popularActivities = [
    { icon: 'bi-tree', name: 'Trekking', count: 15 },
    { icon: 'bi-water', name: 'Water Sports', count: 12 },
    { icon: 'bi-camera', name: 'Photography', count: 18 },
    { icon: 'bi-cup-hot', name: 'Food Tours', count: 10 },
    { icon: 'bi-flower1', name: 'Nature Walks', count: 20 },
    { icon: 'bi-building', name: 'Heritage', count: 8 }
  ];

  readonly howItWorks = [
    { step: 1, icon: 'bi-binoculars', title: 'Explore', desc: 'Browse stunning destinations and activities across India.' },
    { step: 2, icon: 'bi-tools', title: 'Build', desc: 'Select destinations, dates, activities, and budget for your trip.' },
    { step: 3, icon: 'bi-calendar-check', title: 'Plan', desc: 'Get a personalized itinerary generated automatically.' },
    { step: 4, icon: 'bi-airplane', title: 'Travel', desc: 'Save your trip and embark on your adventure!' }
  ];

  readonly testimonials = [
    { name: 'Rahul Verma', role: 'Adventure Traveler', text: 'TripForge made planning my Spiti Valley road trip effortless. The budget calculator saved me from overspending!', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80' },
    { name: 'Sneha Iyer', role: 'Solo Explorer', text: 'The itinerary generator is brilliant. I planned a 5-day Kerala trip in under 10 minutes with perfect day-by-day plans.', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&q=80' },
    { name: 'Amit Kapoor', role: 'Family Traveler', text: 'With 4 kids, trip planning was always chaotic. TripForge helped us create a structured, budget-friendly Rajasthan tour.', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80' }
  ];

  onAddToTrip(destination: Destination): void {
    this.tripService.addDestinationToTrip(destination.id);
    this.notificationService.showToastMessage(`✓ ${destination.name} added to your active trip!`, 'success');
  }

  openCalculatorFor(destination: Destination): void {
    this.selectedDestForCalc.set(destination);
    this.showCalcModal.set(true);
  }

  closeCalculator(): void {
    this.showCalcModal.set(false);
    this.selectedDestForCalc.set(null);
  }
}
