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
              <h4 class="footer-logo"><i class="bi bi-compass-fill gradient-icon"></i> <span class="gradient-text">RouteVeda</span></h4>
              <p class="footer-tagline">Forge your journey. Explore more. Travel smarter. Your ultimate adventure trip planning platform across all 36 States & Union Territories of India.</p>
              <div class="social-links">
                <a href="#" aria-label="Instagram"><i class="bi bi-instagram"></i></a>
                <a href="#" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>
                <a href="#" aria-label="Facebook"><i class="bi bi-facebook"></i></a>
                <a href="#" aria-label="YouTube"><i class="bi bi-youtube"></i></a>
              </div>
            </div>
          </div>
          <div class="col-lg-2 col-md-6">
            <h6 class="footer-heading">Explore</h6>
            <ul class="footer-links">
              <li><a routerLink="/explore">Destinations</a></li>
              <li><a routerLink="/activities">Activities</a></li>
              <li><a routerLink="/trip-builder">Trip Builder</a></li>
              <li><a routerLink="/about">About Us</a></li>
            </ul>
          </div>
          <div class="col-lg-2 col-md-6">
            <h6 class="footer-heading">Account</h6>
            <ul class="footer-links">
              <li><a routerLink="/my-trips">My Trips</a></li>
              <li><a routerLink="/wishlist">Wishlist</a></li>
              <li><a routerLink="/profile">Profile</a></li>
              <li><a routerLink="/settings">Settings</a></li>
            </ul>
          </div>
          <div class="col-lg-4 col-md-6">
            <h6 class="footer-heading">Stay Updated</h6>
            <p class="footer-newsletter-text">Get curated travel tips, hidden gems, and seasonal destination guides.</p>
            @if (isSubscribed()) {
              <div class="alert alert-success d-flex align-items-center gap-2 py-2 px-3 mb-0">
                <i class="bi bi-check-circle-fill text-success"></i>
                <span class="small fw-semibold">You're subscribed! Weekly guides will arrive in your inbox.</span>
              </div>
            } @else {
              <form class="newsletter-form" (ngSubmit)="onSubscribe()">
                <input
                  type="email"
                  name="subscriberEmail"
                  placeholder="Enter your email address"
                  class="form-control-tf newsletter-input"
                  aria-label="Email for newsletter"
                  [(ngModel)]="subscriberEmail"
                  [disabled]="isSubmitting()"
                  required
                >
                <button type="submit" class="btn-tf-primary newsletter-btn" [disabled]="isSubmitting()">
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
          <p class="footer-copyright">&copy; 2026 RouteVeda. Intelligent Travel Discovery & Adventure Planner.</p>
          <p class="footer-author">Designed & Developed By Akilesh A</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .tf-footer {
      background: linear-gradient(180deg, rgba(255, 255, 255, 0.90) 0%, rgba(240, 246, 255, 0.98) 100%) !important;
      backdrop-filter: blur(48px) saturate(210%) !important;
      -webkit-backdrop-filter: blur(48px) saturate(210%) !important;
      border-top: 1.5px solid rgba(255, 255, 255, 0.95) !important;
      padding: 4.5rem 0 2.5rem;
      margin-top: 5rem;
      box-shadow: 0 -20px 60px rgba(15, 23, 42, 0.12), inset 0 2px 3px rgba(255, 255, 255, 1.0) !important;
      position: relative;
    }
    .tf-footer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 5%;
      right: 5%;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.6), rgba(255, 255, 255, 1.0), rgba(99, 102, 241, 0.6), transparent);
      border-radius: 9999px;
      pointer-events: none;
    }
    :host-context([data-theme="dark"]) .tf-footer,
    :host-context(.theme-dark) .tf-footer {
      background: linear-gradient(180deg, rgba(16, 24, 46, 0.92) 0%, rgba(8, 12, 24, 0.98) 100%) !important;
      border-top: 1.5px solid rgba(255, 255, 255, 0.16) !important;
      box-shadow: 0 -20px 60px rgba(0, 0, 0, 0.8), inset 0 1px 2px rgba(255, 255, 255, 0.2) !important;
    }
    :host-context([data-theme="dark"]) .tf-footer::before,
    :host-context(.theme-dark) .tf-footer::before {
      background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.8), rgba(255, 255, 255, 0.5), rgba(99, 102, 241, 0.8), transparent) !important;
    }

    .footer-logo {
      font-family: 'Outfit', sans-serif;
      font-size: 1.65rem;
      font-weight: 800;
      margin-bottom: 12px;
      display: inline-flex;
      align-items: center;
      gap: 10px;
    }
    .gradient-icon {
      color: #6366f1;
      font-size: 1.5rem;
    }
    .footer-tagline {
      color: #1e293b !important;
      font-size: 0.95rem;
      line-height: 1.65;
      margin-bottom: 20px;
      font-weight: 500;
    }
    :host-context([data-theme="dark"]) .footer-tagline,
    :host-context(.theme-dark) .footer-tagline {
      color: #cbd5e1 !important;
    }

    .footer-heading {
      font-family: 'Outfit', sans-serif;
      font-weight: 800 !important;
      margin-bottom: 18px;
      color: #0f172a !important;
      font-size: 1.05rem;
      letter-spacing: -0.01em;
    }
    :host-context([data-theme="dark"]) .footer-heading,
    :host-context(.theme-dark) .footer-heading {
      color: #ffffff !important;
    }

    .footer-links {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .footer-links li {
      margin-bottom: 10px;
    }
    .footer-links a {
      color: #1e293b !important;
      font-size: 0.92rem;
      font-weight: 600;
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
      text-decoration: none;
      display: inline-block;
    }
    .footer-links a:hover {
      color: #4f46e5 !important;
      transform: translateX(5px);
    }
    :host-context([data-theme="dark"]) .footer-links a,
    :host-context(.theme-dark) .footer-links a {
      color: #94a3b8 !important;
    }
    :host-context([data-theme="dark"]) .footer-links a:hover,
    :host-context(.theme-dark) .footer-links a:hover {
      color: #a5b4fc !important;
    }

    .social-links {
      display: flex;
      gap: 12px;
      margin-top: 14px;
    }
    .social-links a {
      width: 42px;
      height: 42px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #ffffff !important;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border: 1.5px solid rgba(255, 255, 255, 0.95);
      color: #1e293b !important;
      font-size: 1.1rem;
      box-shadow: inset 0 1px 1.5px 0 rgba(255, 255, 255, 1.0), 0 4px 12px rgba(15, 23, 42, 0.08);
      transition: all var(--transition-fast);
      text-decoration: none;
    }
    .social-links a:hover {
      background: var(--tf-gradient-primary) !important;
      color: #ffffff !important;
      border-color: rgba(255, 255, 255, 0.5);
      transform: translateY(-4px) scale(1.1);
      box-shadow: inset 0 1px 1.5px rgba(255, 255, 255, 0.6), 0 8px 24px rgba(99, 102, 241, 0.45);
    }
    :host-context([data-theme="dark"]) .social-links a,
    :host-context(.theme-dark) .social-links a {
      background: rgba(255, 255, 255, 0.08) !important;
      border-color: rgba(255, 255, 255, 0.16) !important;
      color: #f8fafc !important;
      box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.2);
    }

    .footer-newsletter-text {
      color: #1e293b !important;
      font-size: 0.92rem;
      line-height: 1.55;
      margin-bottom: 14px;
      font-weight: 500;
    }
    :host-context([data-theme="dark"]) .footer-newsletter-text,
    :host-context(.theme-dark) .footer-newsletter-text {
      color: #cbd5e1 !important;
    }

    .newsletter-form {
      display: flex;
      gap: 10px;
    }
    .newsletter-input {
      flex: 1;
      padding: 13px 20px !important;
      font-size: 0.92rem !important;
      border-radius: var(--tf-radius-full) !important;
      background: #ffffff !important;
      border: 1.5px solid rgba(99, 102, 241, 0.32) !important;
      color: #0f172a !important;
      box-shadow: inset 0 2px 4px rgba(15, 23, 42, 0.04), 0 4px 12px rgba(15, 23, 42, 0.04) !important;
      font-weight: 500 !important;
      transition: all var(--transition-fast);
    }
    .newsletter-input::placeholder {
      color: #64748b !important;
      font-weight: 500;
    }
    .newsletter-input:focus {
      outline: none;
      border-color: #6366f1 !important;
      box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.22), 0 4px 16px rgba(99, 102, 241, 0.15) !important;
    }
    :host-context([data-theme="dark"]) .newsletter-input,
    :host-context(.theme-dark) .newsletter-input {
      background: rgba(22, 32, 58, 0.9) !important;
      border-color: rgba(255, 255, 255, 0.16) !important;
      color: #ffffff !important;
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3) !important;
    }
    :host-context([data-theme="dark"]) .newsletter-input::placeholder,
    :host-context(.theme-dark) .newsletter-input::placeholder {
      color: #94a3b8 !important;
    }

    .newsletter-btn {
      padding: 13px 26px !important;
      font-size: 0.92rem !important;
      font-weight: 700 !important;
      white-space: nowrap;
      border-radius: var(--tf-radius-full) !important;
    }

    .footer-divider {
      border: none;
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(148, 163, 184, 0.35), transparent);
      margin: 3rem 0 1.75rem;
    }
    :host-context([data-theme="dark"]) .footer-divider,
    :host-context(.theme-dark) .footer-divider {
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent);
    }

    .footer-bottom {
      text-align: center;
    }
    .footer-copyright {
      color: #1e293b !important;
      font-size: 0.92rem;
      font-weight: 600;
      margin-bottom: 4px;
    }
    :host-context([data-theme="dark"]) .footer-copyright,
    :host-context(.theme-dark) .footer-copyright {
      color: #cbd5e1 !important;
    }
    .footer-author {
      color: #4f46e5 !important;
      font-size: 0.88rem;
      font-weight: 700;
      letter-spacing: 0.02em;
    }
    :host-context([data-theme="dark"]) .footer-author,
    :host-context(.theme-dark) .footer-author {
      color: #a5b4fc !important;
    }
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

