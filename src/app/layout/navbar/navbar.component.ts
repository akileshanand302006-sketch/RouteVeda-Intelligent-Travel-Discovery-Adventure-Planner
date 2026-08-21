import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ThemeService } from '../../core/services/theme.service';
import { NotificationService } from '../../core/services/notification.service';
import { DateTimeService } from '../../core/services/date-time.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ConfirmModalComponent],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  readonly authService = inject(AuthService);
  readonly themeService = inject(ThemeService);
  readonly notificationService = inject(NotificationService);
  readonly dateTimeService = inject(DateTimeService);
  readonly wishlistService = inject(WishlistService);
  private readonly router = inject(Router);

  showNotifications = signal<boolean>(false);
  showProfileDropdown = signal<boolean>(false);
  showLogoutConfirm = signal<boolean>(false);

  toggleNotifications(): void {
    this.showNotifications.update(v => !v);
    this.showProfileDropdown.set(false);
  }

  toggleProfile(): void {
    this.showProfileDropdown.update(v => !v);
    this.showNotifications.set(false);
  }

  closeDropdowns(): void {
    this.showNotifications.set(false);
    this.showProfileDropdown.set(false);
  }

  promptLogout(): void {
    this.closeDropdowns();
    this.showLogoutConfirm.set(true);
  }

  confirmLogout(): void {
    this.showLogoutConfirm.set(false);
    this.authService.logout();
    this.notificationService.showToastMessage('You have been signed out successfully.', 'info');
    this.router.navigate(['/login']);
  }

  cancelLogout(): void {
    this.showLogoutConfirm.set(false);
  }

  getTimeAgo(timestamp: string): string {
    const now = new Date().getTime();
    const time = new Date(timestamp).getTime();
    const diff = now - time;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  }
}
