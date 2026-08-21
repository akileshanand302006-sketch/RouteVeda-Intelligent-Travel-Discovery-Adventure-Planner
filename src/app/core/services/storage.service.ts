import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private readonly PREFIX = 'tripforge';

  /**
   * Retrieves a global value from localStorage.
   */
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return null;
      return JSON.parse(item) as T;
    } catch {
      return null;
    }
  }

  /**
   * Stores a global value in localStorage.
   */
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving to localStorage key "${key}":`, error);
    }
  }

  /**
   * Removes a specific global key.
   */
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clears all localStorage keys for TripForge.
   */
  clear(): void {
    localStorage.clear();
  }

  /**
   * Checks if a key exists in localStorage.
   */
  has(key: string): boolean {
    return localStorage.getItem(key) !== null;
  }

  // ============================================================
  // USER-SCOPED STORAGE (COMPLETE USER ISOLATION)
  // ============================================================

  /**
   * Generates a namespaced key for the specified user.
   */
  getUserKey(userId: number | string, key: string): string {
    return `${this.PREFIX}_user_${userId}_${key}`;
  }

  /**
   * Retrieves user-isolated data from localStorage.
   */
  getUserData<T>(userId: number | string, key: string, fallback: T): T {
    try {
      const userKey = this.getUserKey(userId, key);
      const item = localStorage.getItem(userKey);
      if (item === null) return fallback;
      return JSON.parse(item) as T;
    } catch {
      return fallback;
    }
  }

  /**
   * Stores user-isolated data in localStorage.
   */
  setUserData<T>(userId: number | string, key: string, value: T): void {
    try {
      const userKey = this.getUserKey(userId, key);
      localStorage.setItem(userKey, JSON.stringify(value));
    } catch (error) {
      console.error(`Error saving user data for user "${userId}" key "${key}":`, error);
    }
  }

  /**
   * Removes a user-isolated key from localStorage.
   */
  removeUserData(userId: number | string, key: string): void {
    const userKey = this.getUserKey(userId, key);
    localStorage.removeItem(userKey);
  }

  /**
   * Clears all user-isolated keys for a given user.
   */
  clearUserData(userId: number | string): void {
    const prefix = `${this.PREFIX}_user_${userId}_`;
    const keysToRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(prefix)) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(k => localStorage.removeItem(k));
  }
}
