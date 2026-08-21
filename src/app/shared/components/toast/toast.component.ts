import { Component, inject } from '@angular/core';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  template: `
    @if (notificationService.showToast()) {
      <div class="toast-container">
        <div class="tf-toast" [class]="'toast-' + notificationService.toastType()">
          <i [class]="toastIcon()"></i>
          <span>{{ notificationService.toastMessage() }}</span>
          <button class="toast-close" (click)="notificationService.hideToast()">
            <i class="bi bi-x"></i>
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    .toast-close {
      background: none; border: none; cursor: pointer;
      color: var(--tf-text-muted); font-size: 1.2rem;
      padding: 0 0 0 8px; transition: color 0.2s;
    }
    .toast-close:hover { color: var(--tf-text); }
  `]
})
export class ToastComponent {
  readonly notificationService = inject(NotificationService);

  toastIcon(): string {
    const icons: Record<string, string> = {
      success: 'bi bi-check-circle-fill text-tf-success',
      error: 'bi bi-x-circle-fill text-tf-danger',
      warning: 'bi bi-exclamation-triangle-fill text-tf-warning',
      info: 'bi bi-info-circle-fill text-tf-primary'
    };
    return icons[this.notificationService.toastType()] ?? icons['info'];
  }
}
