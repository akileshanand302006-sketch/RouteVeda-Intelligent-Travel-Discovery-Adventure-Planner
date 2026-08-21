import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Destination, DestinationCategory, DifficultyLevel } from '../../models/destination.model';
import { IndiaRegion } from '../../models/state.model';
import { API_CONFIG } from '../config/api.config';
import { Observable, map, catchError, of } from 'rxjs';

export interface DestinationFilter {
  category?: DestinationCategory | '';
  difficulty?: DifficultyLevel | '';
  state?: string;
  region?: IndiaRegion | 'All';
  maxPrice?: number;
  minRating?: number;
}

export type SortOption = 'recommended' | 'rating' | 'price-low' | 'price-high' | 'name-asc';

@Injectable({
  providedIn: 'root'
})
export class DestinationService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = API_CONFIG.endpoints.destinations.base;
  private readonly SEED_BACKUP_URL = 'data/destinations.json';

  private readonly _destinations = signal<Destination[]>([]);
  private readonly _searchQuery = signal<string>('');
  private readonly _filters = signal<DestinationFilter>({
    category: '',
    difficulty: '',
    state: '',
    region: 'All',
    maxPrice: 50000,
    minRating: 0
  });
  private readonly _sortOption = signal<SortOption>('recommended');
  private readonly _isLoading = signal<boolean>(false);

  readonly destinations = this._destinations.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly filters = this._filters.asReadonly();
  readonly sortOption = this._sortOption.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  readonly featuredDestinations = computed(() =>
    this._destinations().filter(d => d.featured)
  );

  readonly categories = computed(() => {
    const set = new Set<DestinationCategory>();
    for (const d of this._destinations()) {
      set.add(d.category);
    }
    return Array.from(set);
  });

  readonly states = computed(() => {
    const set = new Set<string>();
    for (const d of this._destinations()) {
      set.add(d.state);
    }
    return Array.from(set).sort();
  });

  readonly filteredDestinations = computed(() => {
    let result = [...this._destinations()];
    const query = this._searchQuery().toLowerCase().trim();
    const f = this._filters();

    if (query) {
      result = result.filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.location.toLowerCase().includes(query) ||
        d.state.toLowerCase().includes(query) ||
        (d.region && d.region.toLowerCase().includes(query)) ||
        d.tags.some(t => t.toLowerCase().includes(query))
      );
    }

    if (f.category) {
      result = result.filter(d => d.category === f.category);
    }

    if (f.difficulty) {
      result = result.filter(d => d.difficulty === f.difficulty);
    }

    if (f.state) {
      result = result.filter(d => d.state === f.state);
    }

    if (f.region && f.region !== 'All') {
      result = result.filter(d => d.region === f.region);
    }

    if (f.maxPrice !== undefined) {
      result = result.filter(d => d.pricePerPerson <= f.maxPrice!);
    }

    if (f.minRating !== undefined && f.minRating > 0) {
      result = result.filter(d => d.rating >= f.minRating!);
    }

    const sort = this._sortOption();
    switch (sort) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating);
        break;
      case 'price-low':
        result.sort((a, b) => a.pricePerPerson - b.pricePerPerson);
        break;
      case 'price-high':
        result.sort((a, b) => b.pricePerPerson - a.pricePerPerson);
        break;
      case 'name-asc':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'recommended':
      default:
        result.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0) || b.rating - a.rating);
        break;
    }

    return result;
  });

  readonly stats = computed(() => {
    const dests = this._destinations();
    const total = dests.length;
    const avgRating = total > 0 ? (dests.reduce((acc, d) => acc + d.rating, 0) / total).toFixed(1) : '0';
    const totalReviews = dests.reduce((acc, d) => acc + d.reviewCount, 0);

    return { total, avgRating, totalReviews };
  });

  constructor() {
    this.loadDestinations();
  }

  loadDestinations(): void {
    this._isLoading.set(true);
    // Primary: Query Node.js/Express PostgreSQL REST API
    this.http.get<any>(this.API_URL).pipe(
      map(res => (res && res.data) ? res.data : (Array.isArray(res) ? res : [])),
      catchError(err => {
        console.warn('⚠️ REST API offline or connecting, using fallback dataset:', err.message);
        return this.http.get<Destination[]>(this.SEED_BACKUP_URL);
      })
    ).subscribe({
      next: (data) => {
        this._destinations.set(data || []);
        this._isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load destinations:', err);
        this._isLoading.set(false);
      }
    });
  }

  /**
   * PostGIS Nearby Query: find destinations within radius of a location
   */
  getNearby(lat: number, lng: number, radiusKm: number = 100): Observable<Destination[]> {
    const url = `${API_CONFIG.endpoints.destinations.nearby}?lat=${lat}&lng=${lng}&radius=${radiusKm}`;
    return this.http.get<any>(url).pipe(
      map(res => res.data || []),
      catchError(() => of([]))
    );
  }

  getById(id: number): Destination | undefined {
    return this._destinations().find(d => d.id === id);
  }

  getByState(stateName: string): Destination[] {
    return this._destinations().filter(d => d.state.toLowerCase() === stateName.toLowerCase());
  }

  getByRegion(region: IndiaRegion): Destination[] {
    return this._destinations().filter(d => d.region === region);
  }

  getRelated(dest: Destination): Destination[] {
    return this._destinations()
      .filter(d => d.id !== dest.id && (d.category === dest.category || d.state === dest.state || d.region === dest.region))
      .slice(0, 4);
  }

  updateSearch(query: string): void {
    this._searchQuery.set(query);
  }

  updateFilters(filters: Partial<DestinationFilter>): void {
    this._filters.update(prev => ({ ...prev, ...filters }));
  }

  updateSort(option: SortOption): void {
    this._sortOption.set(option);
  }

  resetFilters(): void {
    this._searchQuery.set('');
    this._filters.set({
      category: '',
      difficulty: '',
      state: '',
      region: 'All',
      maxPrice: 50000,
      minRating: 0
    });
    this._sortOption.set('recommended');
  }
}
