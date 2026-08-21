import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { RecommendationService, TravelPreferences, RecommendedDestination } from '../../core/services/recommendation.service';
import { IndiaRegion } from '../../models/state.model';
import { DestinationCardComponent } from '../../shared/components/destination-card/destination-card.component';
import { TripService } from '../../core/services/trip.service';
import { NotificationService } from '../../core/services/notification.service';
import { Destination } from '../../models/destination.model';

import { ExpenseCalculatorModalComponent } from '../../shared/components/expense-calculator-modal/expense-calculator-modal.component';

@Component({
  selector: 'app-find-destination',
  standalone: true,
  imports: [FormsModule, DecimalPipe, DestinationCardComponent, ExpenseCalculatorModalComponent],
  templateUrl: './find-destination.component.html',
  styleUrl: './find-destination.component.css'
})
export class FindDestinationComponent {
  private readonly recommendationService = inject(RecommendationService);
  private readonly tripService = inject(TripService);
  private readonly notificationService = inject(NotificationService);

  showCalcModal = signal<boolean>(false);
  selectedDestForCalc = signal<Destination | null>(null);

  currentStep = signal<number>(1);
  totalSteps = 4;

  prefs: TravelPreferences = {
    preferredRegion: 'Any',
    budgetPerPerson: 10000,
    durationDays: 4,
    travelStyle: 'Nature',
    climatePreference: 'Any'
  };

  recommendations = signal<RecommendedDestination[]>([]);
  hasCalculated = signal<boolean>(false);

  nextStep(): void {
    if (this.currentStep() < this.totalSteps) {
      this.currentStep.update(s => s + 1);
    } else {
      this.calculateResults();
    }
  }

  prevStep(): void {
    if (this.currentStep() > 1) {
      this.currentStep.update(s => s - 1);
    }
  }

  calculateResults(): void {
    const results = this.recommendationService.getRecommendations(this.prefs);
    this.recommendations.set(results);
    this.hasCalculated.set(true);
  }

  resetQuiz(): void {
    this.currentStep.set(1);
    this.hasCalculated.set(false);
    this.recommendations.set([]);
  }

  onAddToTrip(dest: Destination): void {
    this.tripService.addDestinationToTrip(dest.id);
    this.notificationService.showToastMessage(`✓ ${dest.name} added to your active trip!`, 'success');
  }

  openCalculatorFor(dest: Destination): void {
    this.selectedDestForCalc.set(dest);
    this.showCalcModal.set(true);
  }

  closeCalculator(): void {
    this.showCalcModal.set(false);
    this.selectedDestForCalc.set(null);
  }
}
