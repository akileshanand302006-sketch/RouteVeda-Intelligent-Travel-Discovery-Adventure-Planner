import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppNotification, NotificationType } from '../../models/notification.model';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly authService = inject(AuthService);

  private readonly NOTIFICATIONS_URL = 'data/notifications.json';

  private readonly _notifications = signal<AppNotification[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _showToast = signal<boolean>(false);
  private readonly _toastMessage = signal<string>('');
  private readonly _toastType = signal<'success' | 'error' | 'warning' | 'info'>('info');

  readonly notifications = this._notifications.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly showToast = this._showToast.asReadonly();
  readonly toastMessage = this._toastMessage.asReadonly();
  readonly toastType = this._toastType.asReadonly();

  readonly unreadNotifications = computed(() =>
    this._notifications().filter((n: AppNotification) => !n.read)
  );

  readonly unreadCount = computed(() => this.unreadNotifications().length);
  readonly hasUnread = computed(() => this.unreadCount() > 0);

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loadUserNotifications(user.id);
      } else {
        this._notifications.set([]);
      }
    });
  }

  loadUserNotifications(userId: number | string): void {
    const saved = this.storage.getUserData<AppNotification[]>(userId, 'notifications', []);
    if (saved && saved.length > 0) {
      this._notifications.set(saved);
      return;
    }

    this._isLoading.set(true);
    this.http.get<AppNotification[]>(this.NOTIFICATIONS_URL).subscribe({
      next: (notifications: AppNotification[]) => {
        const sorted = [...notifications].sort((a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        this._notifications.set(sorted);
        this.storage.setUserData(userId, 'notifications', sorted);
        this._isLoading.set(false);
      },
      error: () => {
        this._isLoading.set(false);
      }
    });
  }

  markAsRead(id: number): void {
    this._notifications.update((notifications: AppNotification[]) =>
      notifications.map((n: AppNotification) =>
        n.id === id ? { ...n, read: true } : n
      )
    );
    this.persist();
  }

  markAllAsRead(): void {
    this._notifications.update((notifications: AppNotification[]) =>
      notifications.map((n: AppNotification) => ({ ...n, read: true }))
    );
    this.persist();
  }

  addNotification(
    title: string,
    message: string,
    type: NotificationType = 'system',
    icon: string = 'bi-bell-fill'
  ): void {
    const notification: AppNotification = {
      id: Date.now(),
      type,
      title,
      message,
      icon,
      timestamp: new Date().toISOString(),
      read: false
    };
    this._notifications.update((n: AppNotification[]) => [notification, ...n]);
    this.persist();
  }

  showToastMessage(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info'): void {
    this._toastMessage.set(message);
    this._toastType.set(type);
    this._showToast.set(true);

    setTimeout(() => {
      this._showToast.set(false);
    }, 4000);
  }

  hideToast(): void {
    this._showToast.set(false);
  }

  private persist(): void {
    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.storage.setUserData(userId, 'notifications', this._notifications());
    }
  }
}
