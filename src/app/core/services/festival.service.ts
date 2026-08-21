import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Festival } from '../../models/festival.model';
import { API_CONFIG } from '../config/api.config';
import { map, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FestivalService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = API_CONFIG.endpoints.festivals;
  private readonly SEED_BACKUP_URL = 'data/festivals.json';

  private readonly _festivals = signal<Festival[]>([]);
  private readonly _selectedMonth = signal<string>('All');
  private readonly _selectedState = signal<string>('All');
  private readonly _isLoading = signal<boolean>(false);

  readonly festivals = this._festivals.asReadonly();
  readonly selectedMonth = this._selectedMonth.asReadonly();
  readonly selectedState = this._selectedState.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  readonly months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  readonly filteredFestivals = computed(() => {
    let list = this._festivals();
    const month = this._selectedMonth();
    const state = this._selectedState();

    if (month !== 'All') {
      list = list.filter(f => f.month.toLowerCase().includes(month.toLowerCase()));
    }

    if (state !== 'All') {
      list = list.filter(f => f.state.toLowerCase() === state.toLowerCase());
    }

    return list;
  });

  constructor() {
    this.loadFestivals();
  }

  loadFestivals(): void {
    this._isLoading.set(true);
    this.http.get<any>(this.API_URL).pipe(
      map(res => (res && res.data) ? res.data : (Array.isArray(res) ? res : [])),
      catchError(() => this.http.get<Festival[]>(this.SEED_BACKUP_URL))
    ).subscribe({
      next: (data) => {
        this._festivals.set(data || []);
        this._isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load festivals:', err);
        this._isLoading.set(false);
      }
    });
  }

  getByState(stateName: string): Festival[] {
    return this._festivals().filter(f => f.state.toLowerCase() === stateName.toLowerCase());
  }

  setMonthFilter(month: string): void {
    this._selectedMonth.set(month);
  }

  setStateFilter(state: string): void {
    this._selectedState.set(state);
  }

  resetFilters(): void {
    this._selectedMonth.set('All');
    this._selectedState.set('All');
  }
}
