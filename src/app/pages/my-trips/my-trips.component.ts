import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TripService } from '../../core/services/trip.service';
import { NotificationService } from '../../core/services/notification.service';
import { PdfService } from '../../core/services/pdf.service';
import { Trip, TripStatus } from '../../models/trip.model';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal/confirm-modal.component';
import { GlowOnHoverDirective } from '../../shared/directives/glow-on-hover.directive';

@Component({
  selector: 'app-my-trips',
  standalone: true,
  imports: [RouterLink, EmptyStateComponent, ConfirmModalComponent, GlowOnHoverDirective],
  templateUrl: './my-trips.component.html',
  styleUrl: './my-trips.component.css'
})
export class MyTripsComponent {
  readonly tripService = inject(TripService);
  private readonly notificationService = inject(NotificationService);
  private readonly pdfService = inject(PdfService);
  private readonly router = inject(Router);

  selectedStatus = signal<TripStatus | 'All'>('All');
  tripToDelete = signal<Trip | null>(null);
  tripToView = signal<Trip | null>(null);

  onBuildTrip(): void {
    this.router.navigate(['/trip-builder']);
  }

  get filteredTrips(): Trip[] {
    const status = this.selectedStatus();
    const trips = this.tripService.trips();
    if (status === 'All') return trips;
    return trips.filter(t => t.status === status);
  }

  filterByStatus(status: TripStatus | 'All'): void {
    this.selectedStatus.set(status);
  }

  openDeleteModal(trip: Trip): void {
    this.tripToDelete.set(trip);
  }

  cancelDelete(): void {
    this.tripToDelete.set(null);
  }

  confirmDelete(): void {
    const trip = this.tripToDelete();
    if (trip) {
      this.tripService.deleteTrip(trip.id);
      this.notificationService.showToastMessage(`Trip "${trip.name}" deleted`, 'info');
      this.tripToDelete.set(null);
    }
  }

  duplicateTrip(trip: Trip): void {
    this.tripService.duplicateTrip(trip.id);
    this.notificationService.showToastMessage(`Duplicated "${trip.name}"`, 'success');
  }

  viewTrip(trip: Trip): void {
    this.tripToView.set(trip);
  }

  closeView(): void {
    this.tripToView.set(null);
  }

  exportTripUI(trip: Trip): void {
    this.notificationService.showToastMessage(`Generating "${trip.name}" PDF...`, 'info');
    const success = this.pdfService.exportTripToPdf(trip);
    if (success) {
      this.notificationService.showToastMessage(`Downloaded "${trip.name}" itinerary PDF!`, 'success');
    } else {
      this.notificationService.showToastMessage(`Could not generate PDF. Please try again.`, 'error');
    }
  }
}
