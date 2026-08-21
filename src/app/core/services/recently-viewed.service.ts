import { Injectable, signal, inject, effect } from '@angular/core';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class RecentlyViewedService {
  private readonly storage = inject(StorageService);
  private readonly authService = inject(AuthService);

  private readonly _recentDestinationIds = signal<number[]>([]);
  readonly recentDestinationIds = this._recentDestinationIds.asReadonly();

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loadUserRecent(user.id);
      } else {
        this._recentDestinationIds.set([]);
      }
    });
  }

  loadUserRecent(userId: number | string): void {
    const saved = this.storage.getUserData<number[]>(userId, 'recent_destinations', []);
    this._recentDestinationIds.set(saved);
  }

  addRecentlyViewedDestination(destinationId: number): void {
    const current = this._recentDestinationIds().filter(id => id !== destinationId);
    const updated = [destinationId, ...current].slice(0, 6);
    this._recentDestinationIds.set(updated);

    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.storage.setUserData(userId, 'recent_destinations', updated);
    }
  }
}
