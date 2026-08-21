import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FoodItem } from '../../models/food.model';
import { IndiaRegion } from '../../models/state.model';
import { API_CONFIG } from '../config/api.config';
import { map, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FoodService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = API_CONFIG.endpoints.foods;
  private readonly SEED_BACKUP_URL = 'data/food.json';

  private readonly _foodItems = signal<FoodItem[]>([]);
  private readonly _selectedRegion = signal<IndiaRegion | 'All'>('All');
  private readonly _selectedType = signal<'All' | 'Veg' | 'Non-Veg' | 'Sweet' | 'Beverage'>('All');
  private readonly _searchQuery = signal<string>('');
  private readonly _isLoading = signal<boolean>(false);

  readonly foodItems = this._foodItems.asReadonly();
  readonly selectedRegion = this._selectedRegion.asReadonly();
  readonly selectedType = this._selectedType.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  readonly filteredFood = computed(() => {
    let list = this._foodItems();
    const region = this._selectedRegion();
    const type = this._selectedType();
    const query = this._searchQuery().trim().toLowerCase();

    if (region !== 'All') {
      list = list.filter(f => f.region === region);
    }

    if (type !== 'All') {
      list = list.filter(f => f.type === type);
    }

    if (query) {
      list = list.filter(f =>
        f.name.toLowerCase().includes(query) ||
        f.state.toLowerCase().includes(query) ||
        f.description.toLowerCase().includes(query) ||
        (f.tags && f.tags.some(t => t.toLowerCase().includes(query)))
      );
    }

    return list;
  });

  constructor() {
    this.loadFood();
  }

  loadFood(): void {
    this._isLoading.set(true);
    this.http.get<any>(this.API_URL).pipe(
      map(res => (res && res.data) ? res.data : (Array.isArray(res) ? res : [])),
      catchError(() => this.http.get<FoodItem[]>(this.SEED_BACKUP_URL))
    ).subscribe({
      next: (data) => {
        this._foodItems.set(data || []);
        this._isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load foods:', err);
        this._isLoading.set(false);
      }
    });
  }

  getByState(stateName: string): FoodItem[] {
    return this._foodItems().filter(f => f.state.toLowerCase().includes(stateName.toLowerCase()));
  }

  setRegionFilter(region: IndiaRegion | 'All'): void {
    this._selectedRegion.set(region);
  }

  setTypeFilter(type: 'All' | 'Veg' | 'Non-Veg' | 'Sweet' | 'Beverage'): void {
    this._selectedType.set(type);
  }

  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }

  resetFilters(): void {
    this._selectedRegion.set('All');
    this._selectedType.set('All');
    this._searchQuery.set('');
  }
}
