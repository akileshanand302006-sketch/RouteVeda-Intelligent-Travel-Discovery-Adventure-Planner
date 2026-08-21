import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { ItineraryService } from '../../core/services/itinerary.service';
import { PredefinedItinerary } from '../../models/itinerary.model';
import { TripService } from '../../core/services/trip.service';
import { NotificationService } from '../../core/services/notification.service';
import { AuthService } from '../../core/services/auth.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';

@Component({
  selector: 'app-itineraries',
  standalone: true,
  imports: [DecimalPipe, LoadingSpinnerComponent],
  templateUrl: './itineraries.component.html',
  styleUrl: './itineraries.component.css'
})
export class ItinerariesComponent {
  readonly itineraryService = inject(ItineraryService);
  private readonly tripService = inject(TripService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  loadIntoTripBuilder(itin: PredefinedItinerary): void {
    if (itin.destinationIds && itin.destinationIds.length > 0) {
      this.tripService.resetCurrentTrip();
      itin.destinationIds.forEach(id => this.tripService.addDestinationToTrip(id));
      this.tripService.updateCurrentTrip({
        name: itin.title,
        travelStyle: (itin.travelStyle as any) || 'Adventure',
        budget: (itin.estimatedBudgetPerPerson || 15000) * 2,
        notes: itin.subtitle || ''
      });
      this.notificationService.showToastMessage(`Loaded '${itin.title}' into Trip Builder!`, 'success');
      this.router.navigate(['/trip-builder']);
    }
  }

  saveDirectlyToTrips(itin: PredefinedItinerary): void {
    this.tripService.createTrip({
      name: itin.title,
      travelerName: this.authService.currentUser()?.name || 'Traveler',
      travelerEmail: this.authService.currentUser()?.email || '',
      numberOfTravelers: 2,
      destinations: itin.destinationIds || [],
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + (itin.durationDays || 5) * 86400000).toISOString().split('T')[0],
      duration: itin.durationDays || 5,
      travelStyle: (itin.travelStyle as any) || 'Adventure',
      budget: itin.estimatedBudgetPerPerson ? itin.estimatedBudgetPerPerson * 2 : 35000,
      itinerary: (itin.dayByDayPlan || []).map(d => ({
        day: d.day,
        title: d.title,
        description: d.description,
        activities: d.activities || [],
        meals: ['Breakfast', 'Lunch', 'Dinner'],
        accommodation: `${d.title} Stay`
      })),
      notes: itin.subtitle || '',
      coverImage: itin.coverImage
    });

    this.notificationService.showToastMessage(`Saved "${itin.title}" to My Trips!`, 'success');
    this.router.navigate(['/my-trips']);
  }
}
