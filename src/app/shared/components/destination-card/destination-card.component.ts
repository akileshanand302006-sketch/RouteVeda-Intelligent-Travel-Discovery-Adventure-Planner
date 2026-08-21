import { Component, input, output, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Destination } from '../../../models/destination.model';
import { WishlistService } from '../../../core/services/wishlist.service';
import { TripService } from '../../../core/services/trip.service';
import { DestinationImageService } from '../../../core/services/destination-image.service';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { GlowOnHoverDirective } from '../../directives/glow-on-hover.directive';
import { ImageLoaderComponent } from '../image-loader/image-loader.component';

@Component({
  selector: 'app-destination-card',
  standalone: true,
  imports: [TruncatePipe, GlowOnHoverDirective, ImageLoaderComponent],
  template: `
    <div class="glass-card destination-card" appGlowOnHover>
      <div class="card-img-wrapper">
        <app-image-loader
          [src]="imageSrc()"
          [alt]="destination().name + ', ' + destination().state"
          [category]="destination().category"
          cssClass="card-img-top"
        />
        <div class="card-img-overlay-top">
          <button
            class="wishlist-btn"
            [class.active]="wishlistService.isWishlisted(destination().id)"
            (click)="onToggleWishlist($event)"
            [attr.aria-label]="wishlistService.isWishlisted(destination().id) ? 'Remove from wishlist' : 'Add to wishlist'"
            title="Add to Wishlist"
          >
            <i [class]="wishlistService.isWishlisted(destination().id) ? 'bi bi-heart-fill' : 'bi bi-heart'"></i>
          </button>
        </div>
        @if (destination().featured) {
          <span class="featured-badge">
            <i class="bi bi-stars"></i> Featured
          </span>
        }
        <div class="card-category-badge">
          <span class="badge-tf badge-tf-primary">{{ destination().category }}</span>
        </div>
      </div>

      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start mb-1">
          <h5 class="card-title fw-bold mb-0 text-truncate">{{ destination().name }}</h5>
          <div class="star-rating ms-2" [title]="destination().ratingSource || 'Rating'">
            <i class="bi bi-star-fill text-tf-accent"></i>
            <span class="rating-value">{{ destination().googleRating || destination().rating }}</span>
          </div>
        </div>

        <p class="card-location">
          <i class="bi bi-geo-alt-fill text-tf-primary"></i>
          {{ destination().location }}, {{ destination().state }}
        </p>

        <p class="card-desc">{{ destination().shortDescription | truncate:85 }}</p>

        <div class="card-meta">
          <div class="card-difficulty">
            <span class="badge-tf"
              [class.badge-tf-success]="destination().difficulty === 'Easy'"
              [class.badge-tf-warning]="destination().difficulty === 'Moderate'"
              [class.badge-tf-danger]="destination().difficulty === 'Challenging' || destination().difficulty === 'Extreme'"
            >
              {{ destination().difficulty }}
            </span>
          </div>
          <span class="review-count">
            <i class="bi bi-google text-tf-primary extra-small me-1"></i>
            {{ (destination().googleUserRatingCount || destination().reviewCount).toLocaleString() }} ratings
          </span>
        </div>

        <div class="card-footer-section">
          <div class="card-price">
            <small class="text-tf-muted extra-small d-block">Starting from</small>
            <span class="price-label">₹{{ destination().pricePerPerson.toLocaleString() }}</span>
            <span class="price-per">/person</span>
          </div>
          <div class="card-actions">
            <button
              class="btn btn-sm btn-tf-glass icon-only-btn"
              (click)="onOpenCalculator($event)"
              title="Calculate Trip Expenses"
            >
              <i class="bi bi-calculator"></i>
            </button>
            <button class="btn btn-sm btn-tf-glass" (click)="onViewDetails()" title="Explore Destination">
              <i class="bi bi-compass"></i> Explore
            </button>
            <button
              class="btn btn-sm"
              [class.btn-tf-primary]="!isInTrip()"
              [class.btn-tf-success]="isInTrip()"
              (click)="onAddToTrip($event)"
              [disabled]="destination().available === false"
              [title]="isInTrip() ? 'In Current Trip (Click to add more)' : 'Add to Trip / Save Trip'"
            >
              @if (isInTrip()) {
                <i class="bi bi-check2-circle"></i> Added
              } @else {
                <i class="bi bi-plus-lg"></i> Add
              }
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .destination-card {
      height: 100%;
      display: flex;
      flex-direction: column;
      border-radius: var(--tf-radius-lg);
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s ease, border-color 0.4s ease;
      overflow: hidden;
      background: var(--tf-card-bg);
      border: 1px solid var(--tf-card-border);
    }

    .destination-card:hover {
      transform: translateY(-8px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2), 0 0 20px rgba(var(--tf-primary-rgb), 0.25);
      border-color: rgba(var(--tf-primary-rgb), 0.4);
    }

    .card-img-wrapper {
      position: relative;
      height: 220px;
      overflow: hidden;
    }

    .card-img-overlay-top {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 2;
    }

    .wishlist-btn {
      width: 38px;
      height: 38px;
      background: rgba(15, 23, 42, 0.65);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.1rem;
      cursor: pointer;
      transition: all 0.3s ease;
      color: rgba(255, 255, 255, 0.8);
    }

    .wishlist-btn:hover {
      background: rgba(239, 68, 68, 0.3);
      color: #ef4444;
      transform: scale(1.15);
    }

    .wishlist-btn.active {
      color: #ef4444;
      background: rgba(239, 68, 68, 0.2);
      border-color: rgba(239, 68, 68, 0.4);
      animation: heartBeat 0.6s ease;
    }

    .featured-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      background: linear-gradient(135deg, #f59e0b, #f97316);
      color: white;
      padding: 4px 12px;
      border-radius: var(--tf-radius-full);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.03em;
      display: flex;
      align-items: center;
      gap: 4px;
      z-index: 2;
      box-shadow: 0 4px 12px rgba(245, 158, 11, 0.4);
    }

    .card-category-badge {
      position: absolute;
      bottom: 12px;
      left: 12px;
      z-index: 2;
    }

    .card-body {
      padding: 1.25rem;
      flex: 1;
      display: flex;
      flex-direction: column;
    }

    .card-title {
      font-size: 1.15rem;
      color: var(--tf-text);
    }

    .card-location {
      font-size: 0.82rem;
      color: var(--tf-text-secondary);
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .card-desc {
      font-size: 0.86rem;
      color: var(--tf-text-secondary);
      margin-bottom: 12px;
      line-height: 1.5;
      flex: 1;
    }

    .card-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 12px;
    }

    .review-count {
      font-size: 0.78rem;
      color: var(--tf-text-muted);
    }

    .card-footer-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-top: 12px;
      border-top: 1px solid var(--tf-border-light);
    }

    .price-label {
      font-size: 1.25rem;
      font-weight: 800;
      color: var(--tf-primary);
      line-height: 1;
    }

    .price-per {
      font-size: 0.75rem;
      color: var(--tf-text-muted);
    }

    .card-actions {
      display: flex;
      gap: 6px;
    }
  `]
})
export class DestinationCardComponent {
  destination = input.required<Destination>();
  addToTrip = output<Destination>();
  viewDetails = output<Destination>();
  openCalculator = output<Destination>();

  readonly wishlistService = inject(WishlistService);
  readonly tripService = inject(TripService);
  readonly destinationImageService = inject(DestinationImageService);
  private readonly router = inject(Router);

  isInTrip = computed(() => {
    const currentDests = this.tripService.currentTrip().destinations ?? [];
    const savedTripsDests = this.tripService.trips().flatMap(t => t.destinations || []);
    return currentDests.includes(this.destination().id) || savedTripsDests.includes(this.destination().id);
  });

  imageSrc = computed(() => {
    return this.destinationImageService.getThumbnailImage(this.destination());
  });

  onViewDetails(): void {
    const dest = this.destination();
    this.viewDetails.emit(dest);
    this.router.navigate(['/destination', dest.id]);
  }

  onAddToTrip(event?: Event): void {
    if (event) event.stopPropagation();
    this.addToTrip.emit(this.destination());
  }

  onOpenCalculator(event?: Event): void {
    if (event) event.stopPropagation();
    this.openCalculator.emit(this.destination());
  }

  onToggleWishlist(event: Event): void {
    event.stopPropagation();
    this.wishlistService.toggle(this.destination().id);
  }
}
