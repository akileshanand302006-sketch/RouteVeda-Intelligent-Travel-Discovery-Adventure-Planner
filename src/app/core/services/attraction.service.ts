import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Attraction, AttractionCategory } from '../../models/attraction.model';
import { API_CONFIG } from '../config/api.config';
import { map, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AttractionService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = API_CONFIG.endpoints.attractions;
  private readonly SEED_BACKUP_URL = 'data/attractions.json';

  private readonly _attractions = signal<Attraction[]>([]);
  private readonly _selectedCategory = signal<AttractionCategory | 'All'>('All');
  private readonly _selectedState = signal<string>('All');
  private readonly _searchQuery = signal<string>('');
  private readonly _isLoading = signal<boolean>(false);

  readonly attractions = this._attractions.asReadonly();
  readonly selectedCategory = this._selectedCategory.asReadonly();
  readonly selectedState = this._selectedState.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  readonly categories: AttractionCategory[] = [
    'Heritage', 'Nature', 'Spiritual', 'Fort', 'Palace', 'Temple', 'Waterfall', 'Lake', 'Viewpoint', 'Museum', 'Wildlife', 'Beach'
  ];

  readonly filteredAttractions = computed(() => {
    let list = this._attractions();
    const cat = this._selectedCategory();
    const st = this._selectedState();
    const q = this._searchQuery().trim().toLowerCase();

    if (cat !== 'All') {
      list = list.filter(a => a.category === cat);
    }

    if (st !== 'All') {
      list = list.filter(a => a.state.toLowerCase() === st.toLowerCase());
    }

    if (q) {
      list = list.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.destinationName.toLowerCase().includes(q) ||
        a.state.toLowerCase().includes(q) ||
        a.description.toLowerCase().includes(q)
      );
    }

    return list;
  });

  constructor() {
    this.loadAttractions();
  }

  loadAttractions(): void {
    this._isLoading.set(true);
    this.http.get<any>(this.API_URL).pipe(
      map(res => (res && res.data) ? res.data : (Array.isArray(res) ? res : [])),
      catchError(() => this.http.get<Attraction[]>(this.SEED_BACKUP_URL))
    ).subscribe({
      next: (data) => {
        this._attractions.set(data || []);
        this._isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load attractions:', err);
        this._isLoading.set(false);
      }
    });
  }

  getById(id: number): Attraction | undefined {
    return this._attractions().find(a => a.id === id);
  }

  getByDestination(destinationId: number): Attraction[] {
    return this._attractions().filter(a => a.destinationId === destinationId);
  }

  getByState(stateName: string): Attraction[] {
    return this._attractions().filter(a => a.state.toLowerCase() === stateName.toLowerCase());
  }

  setCategoryFilter(category: AttractionCategory | 'All'): void {
    this._selectedCategory.set(category);
  }

  setStateFilter(state: string): void {
    this._selectedState.set(state);
  }

  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }

  resetFilters(): void {
    this._selectedCategory.set('All');
    this._selectedState.set('All');
    this._searchQuery.set('');
  }
}
