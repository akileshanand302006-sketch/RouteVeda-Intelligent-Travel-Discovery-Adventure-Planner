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
      background: var(--tf-bg-secondary);
      border-top: 1px solid var(--tf-border-light);
      padding: 4rem 0 2rem;
      margin-top: 4rem;
    }
    .footer-brand h4 { font-family: 'Outfit', sans-serif; font-size: 1.5rem; font-weight: 800; margin-bottom: 12px; }
    .footer-brand p { color: var(--tf-text-secondary); font-size: 0.92rem; line-height: 1.6; margin-bottom: 16px; }
    .social-links { display: flex; gap: 12px; }
    .social-links a {
      width: 38px; height: 38px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      background: var(--tf-surface); border: 1px solid var(--tf-border-light);
      color: var(--tf-text-secondary); font-size: 1rem;
      transition: all 0.3s ease;
    }
    .social-links a:hover { background: var(--tf-primary); color: white; border-color: var(--tf-primary); transform: translateY(-3px); }
    h6 { font-weight: 700; margin-bottom: 16px; color: var(--tf-text); font-size: 1rem; }
    .footer-links { list-style: none; padding: 0; }
    .footer-links li { margin-bottom: 8px; }
    .footer-links a { color: var(--tf-text-secondary); font-size: 0.9rem; transition: all 0.2s; }
    .footer-links a:hover { color: var(--tf-primary); padding-left: 4px; }
    .newsletter-form { display: flex; gap: 8px; }
    .newsletter-form input { flex: 1; padding: 10px 14px; font-size: 0.9rem; }
    .newsletter-form button { padding: 10px 20px; font-size: 0.85rem; white-space: nowrap; }
    .footer-divider { border-color: var(--tf-border-light); margin: 2rem 0; }
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

