import { Component, inject, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/wishlist.service';
import { DestinationService } from '../../core/services/destination.service';
import { TripService } from '../../core/services/trip.service';
import { NotificationService } from '../../core/services/notification.service';
import { DestinationCardComponent } from '../../shared/components/destination-card/destination-card.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { Destination } from '../../models/destination.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [RouterLink, DestinationCardComponent, EmptyStateComponent],
  templateUrl: './wishlist.component.html',
  styleUrl: './wishlist.component.css'
})
export class WishlistComponent {
  readonly wishlistService = inject(WishlistService);
  private readonly destinationService = inject(DestinationService);
  private readonly tripService = inject(TripService);
  private readonly notificationService = inject(NotificationService);

  readonly wishlistedDestinations = computed(() => {
    const ids = this.wishlistService.wishlistIds();
    return ids
      .map(id => this.destinationService.getById(id))
      .filter((d): d is Destination => d !== undefined);
  });

  onAddToTrip(destination: Destination): void {
    this.tripService.addDestinationToTrip(destination.id);
    this.notificationService.showToastMessage(`${destination.name} added to your trip!`, 'success');
  }

  clearAllWishlist(): void {
    this.wishlistService.clear();
    this.notificationService.showToastMessage('Wishlist cleared', 'info');
  }
}
