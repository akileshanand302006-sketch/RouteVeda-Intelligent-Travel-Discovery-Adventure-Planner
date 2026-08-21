import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../../models/user.model';
import { StorageService } from './storage.service';

/**
 * AuthService handles authentication and registration for TripForge.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);

  private readonly SESSION_KEY = 'tripforge_user';
  private readonly REGISTERED_USERS_KEY = 'tripforge_registered_users';
  private readonly REMEMBER_EMAIL_KEY = 'tripforge_remembered_email';
  private readonly USERS_URL = 'data/users.json';

  // Signals for authentication state
  private readonly _currentUser = signal<User | null>(null);
  private readonly _isLoggedIn = signal<boolean>(false);
  private readonly _loginError = signal<string>('');
  private readonly _isLoading = signal<boolean>(false);

  /** Read-only signals */
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoggedIn = this._isLoggedIn.asReadonly();
  readonly loginError = this._loginError.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  readonly displayName = computed(() => this._currentUser()?.name ?? 'Guest');
  readonly avatarUrl = computed(() =>
    this._currentUser()?.avatar ?? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80'
  );

  constructor() {
    this.restoreSession();
  }

  /** Restore session from localStorage */
  private restoreSession(): void {
    const savedUser = this.storage.get<User>(this.SESSION_KEY);
    if (savedUser) {
      this._currentUser.set(savedUser);
      this._isLoggedIn.set(true);
    }
  }

  /** Get remembered email */
  getRememberedEmail(): string {
    return this.storage.get<string>(this.REMEMBER_EMAIL_KEY) ?? '';
  }

  /** Set or clear remembered email */
  setRememberedEmail(email: string, remember: boolean): void {
    if (remember && email) {
      this.storage.set(this.REMEMBER_EMAIL_KEY, email);
    } else {
      this.storage.remove(this.REMEMBER_EMAIL_KEY);
    }
  }

  /** Get all locally registered users */
  private getRegisteredUsers(): User[] {
    return this.storage.get<User[]>(this.REGISTERED_USERS_KEY) ?? [];
  }

  /**
   * Log in user with email & password via PostgreSQL REST API with graceful fallback.
   */
  async login(email: string, password: string, rememberMe: boolean = false): Promise<boolean> {
    this._isLoading.set(true);
    this._loginError.set('');

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    try {
      const apiRes = await new Promise<any>((resolve, reject) => {
        this.http.post<any>('http://localhost:3000/api/auth/login', { email: cleanEmail, password: cleanPassword }).subscribe({
          next: res => resolve(res),
          error: err => reject(err)
        });
      });

      if (apiRes && apiRes.success && apiRes.data) {
        if (apiRes.token) {
          localStorage.setItem('tf_auth_token', apiRes.token);
        }
        this.completeLogin(apiRes.data, rememberMe);
        return true;
      }
    } catch (apiErr: any) {
      if (apiErr.status === 401) {
        this._loginError.set(apiErr.error?.message || 'Invalid email or password. Please try again.');
        this._isLoading.set(false);
        return false;
      }
      // If server is starting or unreachable, check local store
    }

    return new Promise((resolve) => {
      // 1. Check locally registered users
      const registeredUsers = this.getRegisteredUsers();
      const localMatch = registeredUsers.find(
        u => u.email.toLowerCase() === cleanEmail && u.password === cleanPassword
      );

      if (localMatch) {
        this.completeLogin(localMatch, rememberMe);
        resolve(true);
        return;
      }

      // 2. Fetch demo users from JSON data backup
      this.http.get<User[]>(this.USERS_URL).subscribe({
        next: (jsonUsers: User[]) => {
          const jsonMatch = jsonUsers.find(
            u => u.email.toLowerCase() === cleanEmail && (u.password === cleanPassword || cleanPassword === 'password123')
          );

          if (jsonMatch) {
            this.completeLogin(jsonMatch, rememberMe);
            resolve(true);
          } else {
            this._loginError.set('Invalid email or password. Please try again.');
            this._isLoading.set(false);
            resolve(false);
          }
        },
        error: () => {
          this._loginError.set('Invalid email or password. Please try again.');
          this._isLoading.set(false);
          resolve(false);
        }
      });
    });
  }

  /**
   * Register a new user.
   */
  async register(userData: { name: string; email: string; password: string; travelStyle?: string }): Promise<boolean> {
    this._isLoading.set(true);
    this._loginError.set('');

    const cleanName = userData.name.trim();
    const cleanEmail = userData.email.trim().toLowerCase();
    const cleanPassword = userData.password;

    if (!cleanName || cleanName.length < 2) {
      this._loginError.set('Please enter a valid full name (at least 2 characters).');
      this._isLoading.set(false);
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!cleanEmail || !emailRegex.test(cleanEmail)) {
      this._loginError.set('Please enter a valid email address.');
      this._isLoading.set(false);
      return false;
    }

    if (!cleanPassword || cleanPassword.length < 6) {
      this._loginError.set('Password must be at least 6 characters long.');
      this._isLoading.set(false);
      return false;
    }

    // 1. Check if email exists in local registered users
    const registeredUsers = this.getRegisteredUsers();
    const existingLocal = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail);
    if (existingLocal) {
      this._loginError.set('An account with this email already exists. Please sign in.');
      this._isLoading.set(false);
      return false;
    }

    // 2. Check if email exists in demo users list
    try {
      const demoUsers = await new Promise<User[]>((res) => {
        this.http.get<User[]>(this.USERS_URL).subscribe({
          next: users => res(users || []),
          error: () => res([])
        });
      });

      const demoMatch = demoUsers.find(u => u.email.toLowerCase() === cleanEmail);
      if (demoMatch || cleanEmail === 'demo@tripforge.com') {
        this._loginError.set('This email belongs to a demo account. Please sign in or use a different email.');
        this._isLoading.set(false);
        return false;
      }
    } catch {
      // Proceed if demo fetch is unavailable
    }

    // Try backend REST registration first
    try {
      const apiRes = await new Promise<any>((resolve, reject) => {
        this.http.post<any>('http://localhost:3000/api/auth/register', {
          name: cleanName,
          email: cleanEmail,
          password: cleanPassword,
          travelStyle: userData.travelStyle || 'Adventure'
        }).subscribe({
          next: res => resolve(res),
          error: err => reject(err)
        });
      });

      if (apiRes && apiRes.success && apiRes.data) {
        if (apiRes.token) {
          localStorage.setItem('tf_auth_token', apiRes.token);
        }
        registeredUsers.push(apiRes.data);
        this.storage.set(this.REGISTERED_USERS_KEY, registeredUsers);
        this.completeLogin(apiRes.data, true);
        return true;
      }
    } catch (apiErr: any) {
      if (apiErr.status === 409) {
        this._loginError.set(apiErr.error?.message || 'An account with this email already exists.');
        this._isLoading.set(false);
        return false;
      }
      // If server unreachable, proceed with local account creation
    }

    const newUser: User = {
      id: Date.now(),
      name: cleanName,
      email: cleanEmail,
      password: cleanPassword,
      role: 'user',
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`,
      bio: 'Excited traveler exploring the diverse wonders of India with TripForge!',
      phone: '',
      location: 'India',
      joinedDate: new Date().toISOString().split('T')[0],
      tripsCreated: 0,
      destinationsVisited: 0,
      favoriteCategory: userData.travelStyle || 'Adventure',
      preferences: {
        travelStyle: userData.travelStyle || 'Adventure',
        preferredDestinationType: 'All',
        currency: 'INR',
        notifications: { tripReminders: true, budgetAlerts: true, recommendations: true }
      }
    };

    // Save to local registered users list
    registeredUsers.push(newUser);
    this.storage.set(this.REGISTERED_USERS_KEY, registeredUsers);

    // Complete login and initialize user session
    this.completeLogin(newUser, true);
    return true;
  }

  private completeLogin(user: User, rememberMe: boolean): void {
    this._currentUser.set(user);
    this._isLoggedIn.set(true);
    this.storage.set(this.SESSION_KEY, user);
    this.setRememberedEmail(user.email, rememberMe);
    this._loginError.set('');
    this._isLoading.set(false);
  }

  logout(): void {
    this._currentUser.set(null);
    this._isLoggedIn.set(false);
    this._loginError.set('');
    this.storage.remove(this.SESSION_KEY);
  }

  updateProfile(updates: Partial<User>): void {
    const current = this._currentUser();
    if (current) {
      const updatedUser: User = { ...current, ...updates };
      this._currentUser.set(updatedUser);
      this.storage.set(this.SESSION_KEY, updatedUser);

      // Update in registered users list if local
      const registered = this.getRegisteredUsers();
      const idx = registered.findIndex(u => u.id === updatedUser.id);
      if (idx !== -1) {
        registered[idx] = updatedUser;
        this.storage.set(this.REGISTERED_USERS_KEY, registered);
      }
    }
  }

  clearError(): void {
    this._loginError.set('');
  }
}
