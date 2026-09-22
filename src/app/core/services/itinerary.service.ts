import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PredefinedItinerary } from '../../models/itinerary.model';
import { API_CONFIG } from '../config/api.config';
import { map, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = API_CONFIG.endpoints.itineraries;
  private readonly SEED_BACKUP_URL = 'data/itineraries.json';

  private readonly _itineraries = signal<PredefinedItinerary[]>([]);
  private readonly _isLoading = signal<boolean>(false);

  readonly itineraries = this._itineraries.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  constructor() {
    this.loadItineraries();
  }

  private loadItineraries(): void {
    this._isLoading.set(true);
    this.http.get<any>(this.API_URL).pipe(
      map(res => (res && res.data) ? res.data : (Array.isArray(res) ? res : [])),
      catchError(err => {
        console.warn('⚠️ REST API itineraries offline, using fallback dataset:', err.message);
        return this.http.get<PredefinedItinerary[]>(this.SEED_BACKUP_URL);
      })
    ).subscribe({
      next: (data) => {
        this._itineraries.set(data || []);
        this._isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load itineraries:', err);
        this._isLoading.set(false);
      }
    });
  }

  getById(id: string): PredefinedItinerary | undefined {
    return this._itineraries().find(i => i.id === id);
  }
}
