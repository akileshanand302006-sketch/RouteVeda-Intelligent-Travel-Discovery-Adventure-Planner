import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Activity, ActivityCategory, DifficultyLevel } from '../../models/activity.model';
import { API_CONFIG } from '../config/api.config';
import { map, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = API_CONFIG.endpoints.activities;
  private readonly SEED_BACKUP_URL = '/data/activities.json';

  private readonly _activities = signal<Activity[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _error = signal<string>('');
  private readonly _searchTerm = signal<string>('');
  private readonly _categoryFilter = signal<ActivityCategory | ''>('');
  private readonly _difficultyFilter = signal<DifficultyLevel | ''>('');
  private readonly _maxPrice = signal<number>(50000);

  readonly activities = this._activities.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly error = this._error.asReadonly();
  readonly searchTerm = this._searchTerm.asReadonly();
  readonly categoryFilter = this._categoryFilter.asReadonly();
  readonly difficultyFilter = this._difficultyFilter.asReadonly();

  /** Computed: filtered activities list */
  readonly filteredActivities = computed(() => {
    const all = this._activities();
    const search = this._searchTerm().toLowerCase();
    const category = this._categoryFilter();
    const difficulty = this._difficultyFilter();
    const maxPrice = this._maxPrice();

    return all.filter((a: Activity) => {
      const matchesSearch = !search ||
        a.name.toLowerCase().includes(search) ||
        a.description.toLowerCase().includes(search);
      const matchesCategory = !category || a.category === category;
      const matchesDifficulty = !difficulty || a.difficulty === difficulty;
      const matchesPrice = a.price <= maxPrice;
      return matchesSearch && matchesCategory && matchesDifficulty && matchesPrice;
    });
  });

  /** Computed: unique activity categories */
  readonly categories = computed((): ActivityCategory[] => {
    const cats = this._activities().map((a: Activity) => a.category);
    return [...new Set(cats)] as ActivityCategory[];
  });

  /** Computed: activities grouped by category */
  readonly groupedByCategory = computed(() => {
    const grouped: Record<string, Activity[]> = {};
    this._activities().forEach((activity: Activity) => {
      if (!grouped[activity.category]) {
        grouped[activity.category] = [];
      }
      grouped[activity.category].push(activity);
    });
    return grouped;
  });

  constructor() {
    this.loadActivities();
  }

  loadActivities(): void {
    this._isLoading.set(true);
    this._error.set('');

    this.http.get<any>(this.API_URL).pipe(
      map(res => (res && res.data) ? res.data : (Array.isArray(res) ? res : [])),
      catchError(() => this.http.get<Activity[]>(this.SEED_BACKUP_URL))
    ).subscribe({
      next: (activities: Activity[]) => {
        this._activities.set(activities || []);
        this._isLoading.set(false);
      },
      error: () => {
        this._error.set('Failed to load activities.');
        this._isLoading.set(false);
      }
    });
  }

  /** Get activities for a specific destination */
  getByDestination(destinationId: number): Activity[] {
    return this._activities().filter((a: Activity) => a.destinationId === destinationId);
  }

  /** Get activity by ID */
  getById(id: number): Activity | undefined {
    return this._activities().find((a: Activity) => a.id === id);
  }

  /** Calculate total cost for selected activities */
  calculateCost(activityIds: number[]): number {
    return this._activities()
      .filter((a: Activity) => activityIds.includes(a.id))
      .reduce((total: number, a: Activity) => total + a.price, 0);
  }

  /** Update search term */
  updateSearch(term: string): void {
    this._searchTerm.set(term);
  }

  /** Update category filter */
  updateCategoryFilter(category: ActivityCategory | ''): void {
    this._categoryFilter.set(category);
  }

  /** Update difficulty filter */
  updateDifficultyFilter(difficulty: DifficultyLevel | ''): void {
    this._difficultyFilter.set(difficulty);
  }

  /** Update max price filter */
  updateMaxPrice(price: number): void {
    this._maxPrice.set(price);
  }

  /** Reset all filters */
  resetFilters(): void {
    this._searchTerm.set('');
    this._categoryFilter.set('');
    this._difficultyFilter.set('');
    this._maxPrice.set(50000);
  }
}
