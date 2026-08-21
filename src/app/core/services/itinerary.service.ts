import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { PredefinedItinerary } from '../../models/itinerary.model';

@Injectable({
  providedIn: 'root'
})
export class ItineraryService {
  private readonly http = inject(HttpClient);
  private readonly ITINERARIES_URL = 'data/itineraries.json';

  private readonly _itineraries = signal<PredefinedItinerary[]>([]);
  private readonly _isLoading = signal<boolean>(false);

  readonly itineraries = this._itineraries.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  constructor() {
    this.loadItineraries();
  }

  private loadItineraries(): void {
    this._isLoading.set(true);
    this.http.get<PredefinedItinerary[]>(this.ITINERARIES_URL).subscribe({
      next: (data) => {
        this._itineraries.set(data);
        this._isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to load itineraries.json:', err);
        this._isLoading.set(false);
      }
    });
  }

  getById(id: string): PredefinedItinerary | undefined {
    return this._itineraries().find(i => i.id === id);
  }
}
