import { Injectable, signal, computed } from '@angular/core';
import { Destination } from '../../models/destination.model';

@Injectable({
  providedIn: 'root'
})
export class ComparisonService {
  private readonly MAX_COMPARISON_COUNT = 3;
  private readonly _selectedDestinations = signal<Destination[]>([]);

  readonly selectedDestinations = this._selectedDestinations.asReadonly();
  readonly count = computed(() => this._selectedDestinations().length);
  readonly isFull = computed(() => this.count() >= this.MAX_COMPARISON_COUNT);

  addDestination(destination: Destination): boolean {
    const current = this._selectedDestinations();
    if (current.some(d => d.id === destination.id)) {
      return false; // already added
    }
    if (current.length >= this.MAX_COMPARISON_COUNT) {
      return false; // limit reached
    }
    this._selectedDestinations.set([...current, destination]);
    return true;
  }

  removeDestination(destinationId: number): void {
    this._selectedDestinations.set(this._selectedDestinations().filter(d => d.id !== destinationId));
  }

  isSelected(destinationId: number): boolean {
    return this._selectedDestinations().some(d => d.id === destinationId);
  }

  clear(): void {
    this._selectedDestinations.set([]);
  }
}
