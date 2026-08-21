import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Trip, TravelStyle, BudgetBreakdown, ItineraryDay } from '../../models/trip.model';
import { StorageService } from './storage.service';
import { DestinationService } from './destination.service';
import { ActivityService } from './activity.service';
import { AuthService } from './auth.service';
import { API_CONFIG } from '../config/api.config';
import { map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly destinationService = inject(DestinationService);
  private readonly activityService = inject(ActivityService);
  private readonly authService = inject(AuthService);

  private readonly TRIPS_URL = 'data/trips.json';

  // Signals for trip state
  private readonly _trips = signal<Trip[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string>('');

  // Current trip being built
  private readonly _currentTrip = signal<Partial<Trip>>({
    numberOfTravelers: 1,
    destinations: [],
    activities: [],
    travelStyle: 'Adventure',
    budget: 20000,
    status: 'Planning'
  });

  readonly trips = this._trips.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly currentTrip = this._currentTrip.asReadonly();

  /** Computed: total number of trips */
  readonly tripCount = computed(() => this._trips().length);

  /** Computed: trips by status */
  readonly tripsByStatus = computed(() => {
    const trips = this._trips();
    return {
      planning: trips.filter((t: Trip) => t.status === 'Planning'),
      confirmed: trips.filter((t: Trip) => t.status === 'Confirmed'),
      completed: trips.filter((t: Trip) => t.status === 'Completed'),
      cancelled: trips.filter((t: Trip) => t.status === 'Cancelled')
    };
  });

  /** Computed: total budget across all trips */
  readonly totalBudget = computed(() =>
    this._trips().reduce((sum: number, t: Trip) => sum + t.budget, 0)
  );

  /** Computed: budget breakdown for current trip */
  readonly currentBudgetBreakdown = computed((): BudgetBreakdown => {
    const trip = this._currentTrip();
    const travelers = trip.numberOfTravelers ?? 1;
    const activityCost = this.activityService.calculateCost(trip.activities ?? []);
    const days = this.calculateDuration(trip.startDate, trip.endDate);

    const accommodation = days * 2500 * Math.ceil(travelers / 2);
    const food = days * 800 * travelers;
    const transportation = days * 500 * travelers;
    const activities = activityCost * travelers;
    const miscellaneous = Math.round((accommodation + food + transportation + activities) * 0.1);

    return { accommodation, food, transportation, activities, miscellaneous };
  });

  /** Computed: estimated total cost for current trip */
  readonly estimatedCost = computed(() => {
    const breakdown = this.currentBudgetBreakdown();
    return breakdown.accommodation + breakdown.food + breakdown.transportation +
      breakdown.activities + breakdown.miscellaneous;
  });

  /** Computed: budget remaining */
  readonly budgetRemaining = computed(() => {
    const budget = this._currentTrip().budget ?? 0;
    return budget - this.estimatedCost();
  });

  /** Computed: budget percentage used */
  readonly budgetPercentage = computed(() => {
    const budget = this._currentTrip().budget ?? 0;
    if (budget <= 0) return 0;
    return Math.min(Math.round((this.estimatedCost() / budget) * 100), 100);
  });

  /** Computed: is over budget */
  readonly isOverBudget = computed(() => this.budgetRemaining() < 0);

  /** Computed: smart trip insights */
  readonly tripInsights = computed((): string[] => {
    const trip = this._currentTrip();
    const insights: string[] = [];
    const activities = (trip.activities ?? [])
      .map((id: number) => this.activityService.getById(id))
      .filter((a): a is NonNullable<typeof a> => a !== undefined);

    // Adventure activities count
    const adventureCount = activities.filter(a => a.category === 'Adventure').length;
    if (adventureCount > 0) {
      insights.push(`Your trip contains ${adventureCount} adventure ${adventureCount === 1 ? 'activity' : 'activities'}.`);
    }

    // Budget insight
    const budget = trip.budget ?? 0;
    const estimated = this.estimatedCost();
    if (budget > 0 && estimated < budget) {
      const percentUnder = Math.round(((budget - estimated) / budget) * 100);
      insights.push(`Your current itinerary is ${percentUnder}% under budget.`);
    } else if (budget > 0 && estimated > budget) {
      const percentOver = Math.round(((estimated - budget) / budget) * 100);
      insights.push(`⚠️ Your itinerary is ${percentOver}% over budget. Consider removing some activities.`);
    }

    // Nature rating insight
    const destinations = (trip.destinations ?? [])
      .map((id: number) => this.destinationService.getById(id))
      .filter((d): d is NonNullable<typeof d> => d !== undefined);
    const natureDestinations = destinations.filter(d =>
      d.category === 'Nature' || (d.tags && d.tags.includes('nature'))
    );
    if (natureDestinations.length > 0) {
      insights.push(`You have selected ${natureDestinations.length} destination${natureDestinations.length > 1 ? 's' : ''} with high nature ratings.`);
    }

    return insights;
  });

  constructor() {
    // Reactively reload user-isolated trips whenever the authenticated user changes
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loadUserTrips(user.id);
      } else {
        this._trips.set([]);
      }
    });
  }

  /** Load trips isolated for the specific user ID from PostgreSQL REST API */
  loadUserTrips(userId: number | string): void {
    this._isLoading.set(true);
    this.http.get<any>(API_CONFIG.endpoints.trips, {
      headers: { 'x-user-id': String(userId) }
    }).pipe(
      map(res => (res && res.data) ? res.data : []),
      catchError(() => {
        const savedTrips = this.storage.getUserData<Trip[]>(userId, 'trips', []);
        return of(savedTrips);
      })
    ).subscribe({
      next: (trips: Trip[]) => {
        this._trips.set(trips || []);
        this.storage.setUserData(userId, 'trips', trips || []);
        this._isLoading.set(false);
      },
      error: () => {
        this._isLoading.set(false);
      }
    });
  }

  /** Save a new trip scoped to current user in PostgreSQL */
  createTrip(tripData: Partial<Trip>): Trip {
    const destinations = (tripData.destinations ?? [])
      .map((id: number) => this.destinationService.getById(id))
      .filter((d): d is NonNullable<typeof d> => d !== undefined);

    const activities = (tripData.activities ?? [])
      .map((id: number) => this.activityService.getById(id))
      .filter((a): a is NonNullable<typeof a> => a !== undefined);

    const duration = this.calculateDuration(tripData.startDate, tripData.endDate);
    const breakdown = this.currentBudgetBreakdown();
    const currentUser = this.authService.currentUser();

    const newTrip: Trip = {
      id: `trip-${Date.now()}`,
      name: tripData.name ?? `Trip to ${destinations.map(d => d.name).join(' & ')}`,
      travelerName: tripData.travelerName || currentUser?.name || 'Traveler',
      travelerEmail: tripData.travelerEmail || currentUser?.email || '',
      numberOfTravelers: tripData.numberOfTravelers ?? 1,
      destinations: tripData.destinations ?? [],
      destinationNames: destinations.map(d => d.name),
      activities: tripData.activities ?? [],
      activityNames: activities.map(a => a.name),
      startDate: tripData.startDate ?? '',
      endDate: tripData.endDate ?? '',
      duration,
      travelStyle: tripData.travelStyle ?? 'Adventure',
      budget: tripData.budget ?? 0,
      estimatedCost: this.estimatedCost(),
      budgetBreakdown: breakdown,
      itinerary: this.generateItinerary(destinations, activities, duration, tripData.travelStyle ?? 'Adventure'),
      status: 'Planning',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: tripData.notes ?? '',
      coverImage: destinations[0]?.image ?? 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    };

    // Save to PostgreSQL via REST API
    if (currentUser?.id) {
      this.http.post<any>(API_CONFIG.endpoints.trips, {
        title: newTrip.name,
        description: newTrip.notes,
        startDate: newTrip.startDate,
        endDate: newTrip.endDate,
        numberOfTravelers: newTrip.numberOfTravelers,
        travelStyle: newTrip.travelStyle,
        budget: newTrip.budget,
        status: newTrip.status,
        destinations: newTrip.destinations,
        activities: newTrip.activities,
        itinerary: newTrip.itinerary
      }, {
        headers: { 'x-user-id': String(currentUser.id) }
      }).subscribe({
        next: () => console.log('✅ Trip synced to PostgreSQL'),
        error: (err) => console.warn('Trip saved locally, backend sync warning:', err.message)
      });
    }

    this._trips.update((trips: Trip[]) => [newTrip, ...trips]);
    this.persistTrips();
    this.resetCurrentTrip();

    if (currentUser) {
      this.authService.updateProfile({
        tripsCreated: (currentUser.tripsCreated || 0) + 1
      });
    }

    return newTrip;
  }

  /** Update an existing trip */
  updateTrip(id: string, updates: Partial<Trip>): void {
    const currentUser = this.authService.currentUser();
    if (currentUser?.id) {
      this.http.put<any>(`${API_CONFIG.endpoints.trips}/${id}`, updates, {
        headers: { 'x-user-id': String(currentUser.id) }
      }).subscribe({
        next: () => console.log('✅ Trip updated in PostgreSQL'),
        error: () => { }
      });
    }

    this._trips.update((trips: Trip[]) =>
      trips.map((t: Trip) =>
        t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
      )
    );
    this.persistTrips();
  }

  /** Delete a trip */
  deleteTrip(id: string): void {
    const currentUser = this.authService.currentUser();
    if (currentUser?.id) {
      this.http.delete<any>(`${API_CONFIG.endpoints.trips}/${id}`, {
        headers: { 'x-user-id': String(currentUser.id) }
      }).subscribe({
        next: () => console.log('✅ Trip deleted from PostgreSQL'),
        error: () => { }
      });

      this.authService.updateProfile({
        tripsCreated: Math.max(0, (currentUser.tripsCreated || 1) - 1)
      });
    }

    this._trips.update((trips: Trip[]) => trips.filter((t: Trip) => t.id !== id));
    this.persistTrips();
  }

  /** Duplicate a trip */
  duplicateTrip(id: string): void {
    const trip = this._trips().find((t: Trip) => t.id === id);
    if (trip) {
      const duplicate: Trip = {
        ...trip,
        id: `trip-${Date.now()}`,
        name: `${trip.name} (Copy)`,
        status: 'Planning',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      this._trips.update((trips: Trip[]) => [duplicate, ...trips]);
      this.persistTrips();
    }
  }

  /** Get trip by ID */
  getTripById(id: string): Trip | undefined {
    return this._trips().find((t: Trip) => t.id === id);
  }

  updateCurrentTrip(updates: Partial<Trip>): void {
    this._currentTrip.update((t) => ({ ...t, ...updates }));
  }

  addDestinationToTrip(destinationId: number): void {
    // 1. Update current in-progress trip state
    this._currentTrip.update((t) => {
      const destinations = [...(t.destinations ?? [])];
      if (!destinations.includes(destinationId)) {
        destinations.push(destinationId);
      }
      return { ...t, destinations };
    });

    // 2. Also ensure a Saved Trip is created and added to My Saved Trips
    const dest = this.destinationService.getById(destinationId);
    if (dest) {
      const existingTrip = this._trips().find(t => (t.destinations || []).includes(destinationId));
      if (!existingTrip) {
        const today = new Date();
        const future = new Date();
        future.setDate(today.getDate() + 4);

        const duration = 4;
        const activities = (dest.activities || []).slice(0, 3);
        const actObjects = activities.map((id: number) => this.activityService.getById(id)).filter((a): a is NonNullable<typeof a> => a !== undefined);

        const currentUser = this.authService.currentUser();
        const newTrip: Trip = {
          id: `trip-${Date.now()}-${destinationId}`,
          name: `Trip to ${dest.name}`,
          travelerName: currentUser?.name || 'Traveler',
          travelerEmail: currentUser?.email || '',
          numberOfTravelers: 1,
          destinations: [dest.id],
          destinationNames: [dest.name],
          activities: activities,
          activityNames: actObjects.map((a: any) => a.name),
          startDate: today.toISOString().split('T')[0],
          endDate: future.toISOString().split('T')[0],
          duration: duration,
          travelStyle: 'Adventure',
          budget: (dest.pricePerPerson || 12000) * 1.5,
          estimatedCost: dest.pricePerPerson || 12000,
          budgetBreakdown: {
            accommodation: Math.round((dest.pricePerPerson || 12000) * 0.45),
            food: Math.round((dest.pricePerPerson || 12000) * 0.25),
            transportation: Math.round((dest.pricePerPerson || 12000) * 0.15),
            activities: Math.round((dest.pricePerPerson || 12000) * 0.1),
            miscellaneous: Math.round((dest.pricePerPerson || 12000) * 0.05)
          },
          itinerary: this.generateItinerary([dest], actObjects, duration, 'Adventure'),
          status: 'Planning',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          notes: `Trip to ${dest.name}, ${dest.state}`,
          coverImage: dest.image
        };

        if (currentUser?.id) {
          this.http.post<any>(API_CONFIG.endpoints.trips, {
            title: newTrip.name,
            description: newTrip.notes,
            startDate: newTrip.startDate,
            endDate: newTrip.endDate,
            numberOfTravelers: newTrip.numberOfTravelers,
            travelStyle: newTrip.travelStyle,
            budget: newTrip.budget,
            status: newTrip.status,
            destinations: newTrip.destinations,
            activities: newTrip.activities,
            itinerary: newTrip.itinerary
          }, {
            headers: { 'x-user-id': String(currentUser.id) }
          }).subscribe({
            next: () => console.log('✅ Destination trip synced to PostgreSQL'),
            error: () => {}
          });
        }

        this._trips.update((trips: Trip[]) => [newTrip, ...trips]);
        this.persistTrips();

        if (currentUser) {
          this.authService.updateProfile({
            tripsCreated: (currentUser.tripsCreated || 0) + 1
          });
        }
      }
    }
  }

  removeDestinationFromTrip(destinationId: number): void {
    this._currentTrip.update((t) => ({
      ...t,
      destinations: (t.destinations ?? []).filter((id: number) => id !== destinationId)
    }));
  }

  addActivityToTrip(activityId: number): void {
    this._currentTrip.update((t) => {
      const activities = [...(t.activities ?? [])];
      if (!activities.includes(activityId)) {
        activities.push(activityId);
      }
      return { ...t, activities };
    });
  }

  removeActivityFromTrip(activityId: number): void {
    this._currentTrip.update((t) => ({
      ...t,
      activities: (t.activities ?? []).filter((id: number) => id !== activityId)
    }));
  }

  resetCurrentTrip(): void {
    this._currentTrip.set({
      numberOfTravelers: 1,
      destinations: [],
      activities: [],
      travelStyle: 'Adventure',
      budget: 20000,
      status: 'Planning'
    });
  }

  loadTripForEditing(id: string): void {
    const trip = this.getTripById(id);
    if (trip) {
      this._currentTrip.set({ ...trip });
    }
  }

  calculateDuration(startDate?: string, endDate?: string): number {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diff = end.getTime() - start.getTime();
    return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 0);
  }

  private generateItinerary(
    destinations: { name: string; category: string }[],
    activities: { name: string; category: string }[],
    duration: number,
    style: TravelStyle
  ): ItineraryDay[] {
    if (duration <= 0 || destinations.length === 0) return [];

    const itinerary: ItineraryDay[] = [];
    const activitiesCopy = [...activities];

    for (let day = 1; day <= duration; day++) {
      const destIndex = Math.min(
        Math.floor((day - 1) / Math.ceil(duration / destinations.length)),
        destinations.length - 1
      );
      const dest = destinations[destIndex];

      let title: string;
      let description: string;
      const dayActivities: string[] = [];
      const meals: string[] = ['Breakfast', 'Lunch', 'Dinner'];

      if (day === 1) {
        title = `Arrival in ${dest.name}`;
        description = `Arrive at ${dest.name}. Check into accommodation and settle in. Evening exploration of the local area.`;
        dayActivities.push('Arrival & Check-in', 'Local area exploration');
      } else if (day === duration) {
        title = `Departure from ${dest.name}`;
        description = `Last day in ${dest.name}. Morning at leisure for any remaining sightseeing. Pack up and depart.`;
        dayActivities.push('Morning sightseeing', 'Pack & Depart');
      } else {
        const dayActs = activitiesCopy.splice(0, 2);
        if (dayActs.length > 0) {
          title = dayActs.map(a => a.name.split(' ').slice(0, 3).join(' ')).join(' & ');
          description = `Explore ${dest.name} with exciting activities.`;
          dayActivities.push(...dayActs.map(a => a.name));
        } else {
          title = `Exploring ${dest.name}`;
          description = `A day of ${style.toLowerCase()} activities in ${dest.name}.`;
          dayActivities.push(`Discovering scenic viewpoints in ${dest.name}`);
        }
      }

      itinerary.push({
        day,
        title,
        description,
        activities: dayActivities,
        meals: day === duration ? ['Breakfast'] : meals,
        accommodation: day === duration ? 'N/A' : `${dest.name} Heritage Stay`
      });
    }

    return itinerary;
  }

  private persistTrips(): void {
    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.storage.setUserData(userId, 'trips', this._trips());
    }
  }
}
