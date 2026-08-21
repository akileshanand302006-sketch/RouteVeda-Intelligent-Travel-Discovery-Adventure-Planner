import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TripService } from '../../core/services/trip.service';
import { DestinationService } from '../../core/services/destination.service';
import { StateService } from '../../core/services/state.service';
import { ActivityService } from '../../core/services/activity.service';
import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { PdfService } from '../../core/services/pdf.service';
import { TravelStyle, Trip } from '../../models/trip.model';
import { Destination } from '../../models/destination.model';
import { Activity } from '../../models/activity.model';

@Component({
  selector: 'app-trip-builder',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './trip-builder.component.html',
  styleUrl: './trip-builder.component.css'
})
export class TripBuilderComponent implements OnInit {
  readonly Math = Math;
  readonly tripService = inject(TripService);
  readonly destinationService = inject(DestinationService);
  readonly stateService = inject(StateService);
  readonly activityService = inject(ActivityService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly pdfService = inject(PdfService);
  private readonly router = inject(Router);

  // State grouping & navigation for Step 2
  selectedStateFilter = signal<string>('All');
  searchDestQuery = signal<string>('');

  getStateSlug(stateName: string): string {
    return 'state-sec-' + (stateName || '').toLowerCase().replace(/[^a-z0-9]/g, '-');
  }

  readonly destinationsByState = computed(() => {
    const dests = this.destinationService.destinations();
    const query = this.searchDestQuery().trim().toLowerCase();

    const stateMap = new Map<string, Destination[]>();

    for (const d of dests) {
      if (
        query &&
        !d.name.toLowerCase().includes(query) &&
        !d.state.toLowerCase().includes(query) &&
        !d.location.toLowerCase().includes(query)
      ) {
        continue;
      }

      const list = stateMap.get(d.state) || [];
      list.push(d);
      stateMap.set(d.state, list);
    }

    const groups: { stateName: string; destinations: Destination[] }[] = [];
    for (const [stateName, destinations] of stateMap.entries()) {
      groups.push({ stateName, destinations });
    }

    return groups.sort((a, b) => a.stateName.localeCompare(b.stateName));
  });

  onStateFilterChange(stateName: string): void {
    this.selectedStateFilter.set(stateName);

    if (stateName === 'All') {
      const container = document.querySelector('.dest-picker-grid');
      if (container) {
        container.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } else {
      setTimeout(() => {
        const id = this.getStateSlug(stateName);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 50);
    }
  }

  onSearchDestChange(query: string): void {
    this.searchDestQuery.set(query);
  }

  // Multi-step progress (1 to 7)
  currentStep = signal<number>(1);
  generatedTrip = signal<Trip | null>(null);
  isGenerating = signal<boolean>(false);

  // Form Fields for Template-Driven Form
  tripName = '';
  travelerName = '';
  travelerEmail = '';
  numberOfTravelers = 1;
  startDate = '';
  endDate = '';
  travelStyle: TravelStyle = 'Adventure';
  budget = 25000;
  notes = '';

  readonly travelStyles: TravelStyle[] = [
    'Adventure', 'Relaxation', 'Nature', 'Luxury', 'Budget', 'Family', 'Photography'
  ];

  ngOnInit(): void {
    // Autofill user info if logged in
    const user = this.authService.currentUser();
    if (user) {
      this.travelerName = user.name;
      this.travelerEmail = user.email;
    }

    // Default dates (today and 5 days later)
    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + 5);

    this.startDate = today.toISOString().split('T')[0];
    this.endDate = future.toISOString().split('T')[0];

    this.syncCurrentTripState();
  }

  syncCurrentTripState(): void {
    this.tripService.updateCurrentTrip({
      name: this.tripName,
      travelerName: this.travelerName,
      travelerEmail: this.travelerEmail,
      numberOfTravelers: this.numberOfTravelers,
      startDate: this.startDate,
      endDate: this.endDate,
      travelStyle: this.travelStyle,
      budget: this.budget,
      notes: this.notes
    });
  }

  goToStep(step: number): void {
    if (step >= 1 && step <= 7) {
      this.syncCurrentTripState();
      this.currentStep.set(step);
    }
  }

  nextStep(): void {
    if (this.currentStep() < 7) {
      this.goToStep(this.currentStep() + 1);
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.goToStep(this.currentStep() - 1);
    }
  }

  toggleDestination(destId: number): void {
    const currentDests = this.tripService.currentTrip().destinations ?? [];
    if (currentDests.includes(destId)) {
      this.tripService.removeDestinationFromTrip(destId);
    } else {
      this.tripService.addDestinationToTrip(destId);
    }
  }

  isDestinationSelected(destId: number): boolean {
    return (this.tripService.currentTrip().destinations ?? []).includes(destId);
  }

  toggleActivity(actId: number): void {
    const currentActs = this.tripService.currentTrip().activities ?? [];
    if (currentActs.includes(actId)) {
      this.tripService.removeActivityFromTrip(actId);
    } else {
      this.tripService.addActivityToTrip(actId);
    }
  }

  isActivitySelected(actId: number): boolean {
    return (this.tripService.currentTrip().activities ?? []).includes(actId);
  }

  /**
   * Finalize and Generate Trip (Step 7)
   */
  generateAdventure(): void {
    this.syncCurrentTripState();
    this.isGenerating.set(true);

    setTimeout(() => {
      const trip = this.tripService.createTrip({
        name: this.tripName || undefined,
        travelerName: this.travelerName,
        travelerEmail: this.travelerEmail,
        numberOfTravelers: this.numberOfTravelers,
        destinations: this.tripService.currentTrip().destinations,
        activities: this.tripService.currentTrip().activities,
        startDate: this.startDate,
        endDate: this.endDate,
        travelStyle: this.travelStyle,
        budget: this.budget,
        notes: this.notes
      });

      this.generatedTrip.set(trip);
      this.isGenerating.set(false);
      this.notificationService.showToastMessage('🎉 Adventure Forged Successfully!', 'success');
    }, 1500);
  }

  viewSavedTrips(): void {
    this.router.navigate(['/my-trips']);
  }

  exportGeneratedPdf(): void {
    const trip = this.generatedTrip();
    if (trip) {
      this.notificationService.showToastMessage(`Generating "${trip.name}" PDF...`, 'info');
      const success = this.pdfService.exportTripToPdf(trip);
      if (success) {
        this.notificationService.showToastMessage(`Downloaded "${trip.name}" itinerary PDF!`, 'success');
      } else {
        this.notificationService.showToastMessage(`Could not generate PDF. Please try again.`, 'error');
      }
    }
  }
}
