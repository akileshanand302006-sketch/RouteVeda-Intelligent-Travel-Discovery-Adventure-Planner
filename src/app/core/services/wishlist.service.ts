import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';
import { API_CONFIG } from '../config/api.config';
import { map, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly authService = inject(AuthService);

  private readonly _wishlistIds = signal<number[]>([]);

  readonly wishlistIds = this._wishlistIds.asReadonly();
  readonly count = computed(() => this._wishlistIds().length);
  readonly isEmpty = computed(() => this._wishlistIds().length === 0);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loadUserWishlist(user.id);
      } else {
        this._wishlistIds.set([]);
      }
    });
  }

  loadUserWishlist(userId: number | string): void {
    this.http.get<any>(API_CONFIG.endpoints.wishlist, {
      headers: { 'x-user-id': String(userId) }
    }).pipe(
      map(res => (res && res.ids) ? res.ids : []),
      catchError(() => {
        const saved = this.storage.getUserData<number[]>(userId, 'wishlist', []);
        return of(saved);
      })
    ).subscribe({
      next: (ids: number[]) => {
        this._wishlistIds.set(ids || []);
        this.storage.setUserData(userId, 'wishlist', ids || []);
      }
    });
  }

  isWishlisted(destinationId: number): boolean {
    return this._wishlistIds().includes(destinationId);
  }

  toggle(destinationId: number): void {
    if (this.isWishlisted(destinationId)) {
      this.remove(destinationId);
    } else {
      this.add(destinationId);
    }
  }

  add(destinationId: number): void {
    if (!this.isWishlisted(destinationId)) {
      this._wishlistIds.update((ids: number[]) => [...ids, destinationId]);
      this.persist();

      const userId = this.authService.currentUser()?.id;
      if (userId) {
        this.http.post<any>(`${API_CONFIG.endpoints.wishlist}/${destinationId}`, {}, {
          headers: { 'x-user-id': String(userId) }
        }).subscribe({
          next: () => console.log(`✅ Destination ${destinationId} added to PostgreSQL wishlist`),
          error: () => {}
        });
      }
    }
  }

  remove(destinationId: number): void {
    this._wishlistIds.update((ids: number[]) =>
      ids.filter((id: number) => id !== destinationId)
    );
    this.persist();

    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.http.delete<any>(`${API_CONFIG.endpoints.wishlist}/${destinationId}`, {
        headers: { 'x-user-id': String(userId) }
      }).subscribe({
        next: () => console.log(`✅ Destination ${destinationId} removed from PostgreSQL wishlist`),
        error: () => {}
      });
    }
  }

  clear(): void {
    this._wishlistIds.set([]);
    this.persist();
  }

  getAll(): number[] {
    return this._wishlistIds();
  }

  private persist(): void {
    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.storage.setUserData(userId, 'wishlist', this._wishlistIds());
    }
  }
}
