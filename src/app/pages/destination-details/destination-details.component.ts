import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { DestinationService } from '../../core/services/destination.service';
import { ActivityService } from '../../core/services/activity.service';
import { AttractionService } from '../../core/services/attraction.service';
import { RecentlyViewedService } from '../../core/services/recently-viewed.service';
import { WishlistService } from '../../core/services/wishlist.service';
import { TripService } from '../../core/services/trip.service';
import { NotificationService } from '../../core/services/notification.service';
import { GooglePlacesService } from '../../core/services/google-places.service';
import { DestinationImageService } from '../../core/services/destination-image.service';
import { Destination, DestinationImage } from '../../models/destination.model';
import { Activity } from '../../models/activity.model';
import { Attraction } from '../../models/attraction.model';
import { ActivityCardComponent } from '../../shared/components/activity-card/activity-card.component';
import { DestinationCardComponent } from '../../shared/components/destination-card/destination-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ImageLoaderComponent } from '../../shared/components/image-loader/image-loader.component';
import { ImageService } from '../../core/services/image.service';

import { ExpenseCalculatorModalComponent } from '../../shared/components/expense-calculator-modal/expense-calculator-modal.component';

@Component({
  selector: 'app-destination-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ActivityCardComponent,
    DestinationCardComponent,
    LoadingSpinnerComponent,
    ImageLoaderComponent,
    ExpenseCalculatorModalComponent
  ],
  templateUrl: './destination-details.component.html',
  styleUrl: './destination-details.component.css'
})
export class DestinationDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  readonly destinationService = inject(DestinationService);
  readonly activityService = inject(ActivityService);
  readonly attractionService = inject(AttractionService);
  readonly recentlyViewedService = inject(RecentlyViewedService);
  readonly wishlistService = inject(WishlistService);
  readonly imageService = inject(ImageService);
  readonly googlePlacesService = inject(GooglePlacesService);
  readonly destinationImageService = inject(DestinationImageService);
  private readonly tripService = inject(TripService);
  private readonly notificationService = inject(NotificationService);

  showCalcModal = signal<boolean>(false);
  destinationId = signal<number | null>(null);
  activeTab = signal<'overview' | 'attractions' | 'activities' | 'food' | 'transport'>('overview');

  /** Computed: Destination object matching current route ID */
  destination = computed(() => {
    const id = this.destinationId();
    if (!id) return null;
    return this.destinationService.getById(id) ?? null;
  });

  /** Selected hero image from gallery */
  selectedImage = signal<string>('');

  /** Active hero image URL */
  activeImage = computed(() => {
    if (this.selectedImage()) return this.selectedImage();
    const dest = this.destination();
    if (!dest) return '';
    return this.destinationImageService.getPrimaryImage(dest);
  });

  /** Computed: Attractions belonging to this destination */
  attractions = computed<Attraction[]>(() => {
    const id = this.destinationId();
    if (!id) return [];
    return this.attractionService.getByDestination(id);
  });

  /** Computed: Activities belonging to this destination */
  destinationActivities = computed<Activity[]>(() => {
    const id = this.destinationId();
    if (!id) return [];
    return this.activityService.getByDestination(id);
  });

  /** Computed: Related destinations in same category */
  relatedDestinations = computed(() => {
    const dest = this.destination();
    if (!dest) return [];
    return this.destinationService.getRelated(dest);
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.destinationId.set(id);
        this.selectedImage.set('');
        this.recentlyViewedService.addRecentlyViewedDestination(id);
      }
    });
  }

  setActiveTab(tab: 'overview' | 'attractions' | 'activities' | 'food' | 'transport'): void {
    this.activeTab.set(tab);
  }

  setActiveImage(img: string | DestinationImage): void {
    const url = typeof img === 'string' ? img : (img?.url || img?.heroUrl || '');
    this.selectedImage.set(url);
  }

  openGalleryLightbox(index: number): void {
    const dest = this.destination();
    if (dest) {
      const hero = typeof dest.heroImage === 'string' ? dest.heroImage : (dest.heroImage?.url || dest.image);
      const galleryUrls = (dest.gallery || []).map(g => typeof g === 'string' ? g : (g.url || g.heroUrl || ''));
      const allImages = [hero, ...galleryUrls].filter(Boolean);
      this.imageService.openLightbox(allImages, index, `${dest.name} — Gallery`);
    }
  }

  toggleWishlist(): void {
    const dest = this.destination();
    if (dest) {
      this.wishlistService.toggle(dest.id);
      const isAdded = this.wishlistService.isWishlisted(dest.id);
      this.notificationService.showToastMessage(
        isAdded ? `${dest.name} added to Wishlist` : `${dest.name} removed from Wishlist`,
        isAdded ? 'success' : 'info'
      );
    }
  }

  addToTrip(): void {
    const dest = this.destination();
    if (dest) {
      this.tripService.addDestinationToTrip(dest.id);
      this.notificationService.showToastMessage(`${dest.name} added to your trip builder queue!`, 'success');
    }
  }

  createInstantTrip(): void {
    const dest = this.destination();
    if (dest) {
      const today = new Date();
      const future = new Date();
      future.setDate(today.getDate() + 4);

      const trip = this.tripService.createTrip({
        name: `Escape to ${dest.name}`,
        destinations: [dest.id],
        startDate: today.toISOString().split('T')[0],
        endDate: future.toISOString().split('T')[0],
        duration: 4,
        travelStyle: 'Adventure',
        budget: (dest.pricePerPerson || 12000) * 2,
        notes: `Trip to ${dest.name}, ${dest.state}`,
        coverImage: dest.image
      });

      this.notificationService.showToastMessage(`Trip "Escape to ${dest.name}" created and saved!`, 'success');
      this.router.navigate(['/my-trips']);
    }
  }

  addActivityToTrip(activity: Activity): void {
    this.tripService.addActivityToTrip(activity.id);
    this.notificationService.showToastMessage(`${activity.name} added to your trip!`, 'success');
  }

  buildTripNow(): void {
    this.addToTrip();
    this.router.navigate(['/trip-builder']);
  }

  openCalculator(): void {
    this.showCalcModal.set(true);
  }

  closeCalculator(): void {
    this.showCalcModal.set(false);
  }
}
