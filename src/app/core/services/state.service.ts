import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { State, IndiaRegion } from '../../models/state.model';
import { API_CONFIG } from '../config/api.config';
import { map, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = API_CONFIG.endpoints.states.base;
  private readonly SEED_BACKUP_URL = 'data/states.json';

  private readonly _states = signal<State[]>([]);
  private readonly _selectedRegion = signal<IndiaRegion | 'All'>('All');
  private readonly _searchQuery = signal<string>('');
  private readonly _isLoading = signal<boolean>(false);

  readonly states = this._states.asReadonly();
  readonly selectedRegion = this._selectedRegion.asReadonly();
  readonly searchQuery = this._searchQuery.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  readonly regions: IndiaRegion[] = ['North', 'South', 'East', 'West', 'Central', 'North East'];

  readonly filteredStates = computed(() => {
    let list = this._states();
    const region = this._selectedRegion();
    const query = this._searchQuery().trim().toLowerCase();

    if (region !== 'All') {
      list = list.filter(s => s.region === region);
    }

    if (query) {
      list = list.filter(s =>
        s.name.toLowerCase().includes(query) ||
        s.capital.toLowerCase().includes(query) ||
        s.topAttractions.some(a => a.toLowerCase().includes(query)) ||
        s.foodSpecialties.some(f => f.toLowerCase().includes(query))
      );
    }

    return list;
  });

  readonly statesByRegion = computed(() => {
    const map: Record<IndiaRegion, State[]> = {
      North: [],
      South: [],
      East: [],
      West: [],
      Central: [],
      'North East': []
    };
    for (const state of this._states()) {
      if (map[state.region]) {
        map[state.region].push(state);
      }
    }
    return map;
  });

  constructor() {
    this.loadStates();
  }

  loadStates(): void {
    this._isLoading.set(true);
    this.http.get<any>(this.API_URL).pipe(
      map(res => (res && res.data) ? res.data : (Array.isArray(res) ? res : [])),
      catchError(err => {
        console.warn('⚠️ REST API states offline, using fallback dataset:', err.message);
        return this.http.get<State[]>(this.SEED_BACKUP_URL);
      })
    ).subscribe({
      next: (data) => {
        this._states.set(data || []);
        this._isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load states:', err);
        this._isLoading.set(false);
      }
    });
  }

  getStateById(id: string): State | undefined {
    return this._states().find(s => s.id.toLowerCase() === id.toLowerCase() || s.code.toLowerCase() === id.toLowerCase());
  }

  setRegionFilter(region: IndiaRegion | 'All'): void {
    this._selectedRegion.set(region);
  }

  setSearchQuery(query: string): void {
    this._searchQuery.set(query);
  }

  resetFilters(): void {
    this._selectedRegion.set('All');
    this._searchQuery.set('');
  }
}
