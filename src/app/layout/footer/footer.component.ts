import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink, FormsModule],
  template: `
    <footer class="tf-footer">
      <div class="container">
        <div class="row g-4">
          <div class="col-lg-4 col-md-6">
            <div class="footer-brand">
              <h4 class="gradient-text"><i class="bi bi-compass"></i> RouteVeda</h4>
              <p>Forge your journey. Explore more. Travel smarter. Your ultimate adventure trip planning platform.</p>
              <div class="social-links">
                <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
                <a href="#" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>
                <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
                <a href="#" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
              </div>
            </div>
          </div>
          <div class="col-lg-2 col-md-6">
            <h6>Explore</h6>
            <ul class="footer-links">
              <li><a routerLink="/explore">Destinations</a></li>
              <li><a routerLink="/activities">Activities</a></li>
              <li><a routerLink="/trip-builder">Trip Builder</a></li>
              <li><a routerLink="/about">About Us</a></li>
            </ul>
          </div>
          <div class="col-lg-2 col-md-6">
            <h6>Account</h6>
            <ul class="footer-links">
              <li><a routerLink="/my-trips">My Trips</a></li>
              <li><a routerLink="/wishlist">Wishlist</a></li>
              <li><a routerLink="/profile">Profile</a></li>
              <li><a routerLink="/settings">Settings</a></li>
            </ul>
          </div>
          <div class="col-lg-4 col-md-6">
            <h6>Stay Updated</h6>
            <p class="small text-tf-secondary">Get travel tips and destination recommendations.</p>
            @if (isSubscribed()) {
              <div class="alert alert-success d-flex align-items-center gap-2 py-2 px-3 mb-0">
                <i class="bi bi-check-circle-fill text-success"></i>
                <span class="small">You're subscribed! Weekly guides will arrive in your inbox.</span>
              </div>
            } @else {
              <form class="newsletter-form" (ngSubmit)="onSubscribe()">
                <input
                  type="email"
                  name="subscriberEmail"
                  placeholder="Enter your email"
                  class="form-control-tf"
                  aria-label="Email for newsletter"
                  [(ngModel)]="subscriberEmail"
                  [disabled]="isSubmitting()"
                  required
                >
                <button type="submit" class="btn-tf-primary" [disabled]="isSubmitting()">
                  @if (isSubmitting()) {
                    <span class="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                  } @else {
                    Subscribe
                  }
                </button>
              </form>
            }
          </div>
        </div>
        <hr class="footer-divider">
        <div class="footer-bottom">
          <p>&copy; 2026 RouteVeda. Built with Angular.</p>
          <p class="small text-tf-muted">Designed & Developed By Akilesh A</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .tf-footer {
      background: var(--glass-bg-soft);
      backdrop-filter: blur(32px) saturate(var(--glass-saturation));
      -webkit-backdrop-filter: blur(32px) saturate(var(--glass-saturation));
      border-top: 1px solid var(--glass-border);
      padding: 4.5rem 0 2rem;
      margin-top: 5rem;
      box-shadow: 0 -12px 36px var(--glass-shadow);
      position: relative;
    }
    .tf-footer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 10%;
      right: 10%;
      height: 1.5px;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.75), transparent);
      border-radius: 9999px;
      pointer-events: none;
    }
    :host-context([data-theme="dark"]) .tf-footer::before,
    :host-context(.theme-dark) .tf-footer::before {
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.32), transparent);
    }
    :host-context([data-theme="dark"]) .tf-footer,
    :host-context(.theme-dark) .tf-footer {
      background: linear-gradient(180deg, rgba(14, 20, 38, 0.75) 0%, rgba(9, 13, 24, 0.85) 100%);
      border-top-color: rgba(255, 255, 255, 0.12);
      box-shadow: 0 -12px 45px rgba(0, 0, 0, 0.65);
    }
    .footer-brand h4 { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 800; margin-bottom: 12px; }
    .footer-brand p { color: var(--text-secondary); font-size: 0.92rem; line-height: 1.6; margin-bottom: 16px; }
    .social-links { display: flex; gap: 12px; }
    .social-links a {
      width: 40px; height: 40px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: var(--glass-bg);
      backdrop-filter: blur(16px) saturate(var(--glass-saturation));
      -webkit-backdrop-filter: blur(16px) saturate(var(--glass-saturation));
      border: 1px solid var(--glass-border);
      color: var(--text-secondary); font-size: 1.05rem;
      box-shadow: inset 0 1px 1.5px 0 var(--glass-highlight), 0 4px 12px var(--glass-shadow);
      transition: all var(--transition-fast);
      text-decoration: none;
    }
    .social-links a:hover {
      background: var(--tf-gradient-primary);
      color: #ffffff;
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-3px) scale(1.08);
      box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.6), 0 8px 24px rgba(99, 102, 241, 0.45);
    }
    :host-context([data-theme="dark"]) .social-links a,
    :host-context(.theme-dark) .social-links a {
      background: rgba(255, 255, 255, 0.08);
      border-color: rgba(255, 255, 255, 0.15);
      color: #cbd5e1;
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.18);
    }
    :host-context([data-theme="dark"]) .social-links a:hover,
    :host-context(.theme-dark) .social-links a:hover {
      background: var(--tf-gradient-primary);
      border-color: rgba(255, 255, 255, 0.45);
      color: #ffffff;
      box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.35), 0 0 20px rgba(99, 102, 241, 0.45);
    }
    h6 { font-weight: 700; margin-bottom: 16px; color: var(--tf-text); font-size: 1rem; }
    .footer-links { list-style: none; padding: 0; }
    .footer-links li { margin-bottom: 8px; }
    .footer-links a { color: var(--tf-text-secondary); font-size: 0.9rem; transition: all 0.2s; text-decoration: none; }
    .footer-links a:hover { color: var(--tf-primary); padding-left: 5px; }
    .newsletter-form { display: flex; gap: 8px; }
    .newsletter-form input {
      flex: 1;
      padding: 12px 18px;
      font-size: 0.92rem;
      border-radius: var(--tf-radius-full);
      background: var(--glass-bg);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      border: 1px solid var(--glass-border);
      color: var(--tf-text);
      box-shadow: inset 0 1.5px 2px rgba(0, 0, 0, 0.04), inset 0 1px 1px var(--glass-highlight);
      transition: all var(--transition-fast);
    }
    .newsletter-form input:focus {
      outline: none;
      border-color: var(--tf-primary);
      box-shadow: 0 0 0 3.5px rgba(var(--tf-primary-rgb), 0.22), 0 0 20px rgba(var(--tf-primary-rgb), 0.18);
    }
    .newsletter-form button {
      padding: 12px 24px;
      font-size: 0.9rem;
      font-weight: 600;
      white-space: nowrap;
      border-radius: var(--tf-radius-full);
    }
    .footer-divider { border-color: var(--tf-border-light); margin: 2.5rem 0 1.5rem; }
    .footer-bottom { text-align: center; }
    .footer-bottom p { color: var(--tf-text-secondary); font-size: 0.88rem; margin-bottom: 4px; }
    @media (max-width: 768px) {
      .newsletter-form { flex-direction: column; }
    }
  `]
})
export class FooterComponent {
  private readonly notificationService = inject(NotificationService);

  subscriberEmail = '';
  isSubmitting = signal<boolean>(false);
  isSubscribed = signal<boolean>(false);

  onSubscribe(): void {
    const email = this.subscriberEmail.trim();
    if (!email) {
      this.notificationService.showToastMessage('Please enter a valid email address.', 'warning');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      this.notificationService.showToastMessage('Please enter a valid email address (e.g. name@example.com).', 'warning');
      return;
    }

    this.isSubmitting.set(true);

    setTimeout(() => {
      try {
        const currentSubs: string[] = JSON.parse(localStorage.getItem('tf_newsletter_subscribers') || '[]');
        if (!currentSubs.includes(email)) {
          currentSubs.push(email);
          localStorage.setItem('tf_newsletter_subscribers', JSON.stringify(currentSubs));
        }
      } catch { }

      this.isSubmitting.set(false);
      this.isSubscribed.set(true);
      this.subscriberEmail = '';

      this.notificationService.showToastMessage(
        `🎉 Successfully subscribed! Travel tips and itineraries will be sent to ${email}.`,
        'success'
      );
    }, 400);
  }
}

