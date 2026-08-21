import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DestinationService, SortOption } from '../../core/services/destination.service';
import { DestinationCardComponent } from '../../shared/components/destination-card/destination-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { Destination, DestinationCategory, DifficultyLevel } from '../../models/destination.model';
import { IndiaRegion } from '../../models/state.model';
import { TripService } from '../../core/services/trip.service';
import { NotificationService } from '../../core/services/notification.service';

import { ExpenseCalculatorModalComponent } from '../../shared/components/expense-calculator-modal/expense-calculator-modal.component';
import { signal } from '@angular/core';

@Component({
  selector: 'app-explore',
  standalone: true,
  imports: [
    FormsModule,
    DestinationCardComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent,
    ExpenseCalculatorModalComponent
  ],
  templateUrl: './explore.component.html',
  styleUrl: './explore.component.css'
})
export class ExploreComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly destinationService = inject(DestinationService);
  private readonly tripService = inject(TripService);
  private readonly notificationService = inject(NotificationService);

  showCalcModal = signal<boolean>(false);
  selectedDestForCalc = signal<Destination | null>(null);

  searchQuery = '';
  selectedCategory: DestinationCategory | '' = '';
  selectedDifficulty: DifficultyLevel | '' = '';
  selectedState = '';
  selectedRegion: IndiaRegion | 'All' = 'All';
  maxPrice = 50000;
  minRating = 0;
  sortOption: SortOption = 'recommended';

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['state']) {
        this.selectedState = params['state'];
      }
      if (params['category']) {
        this.selectedCategory = params['category'];
      }
      if (params['region']) {
        this.selectedRegion = params['region'];
      }
      this.onFilterChange();
    });
  }

  onSearchChange(): void {
    this.destinationService.updateSearch(this.searchQuery);
  }

  onFilterChange(): void {
    this.destinationService.updateFilters({
      category: this.selectedCategory,
      difficulty: this.selectedDifficulty,
      state: this.selectedState,
      region: this.selectedRegion,
      maxPrice: this.maxPrice,
      minRating: this.minRating
    });
  }

  onSortChange(): void {
    this.destinationService.updateSort(this.sortOption);
  }

  resetAllFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedDifficulty = '';
    this.selectedState = '';
    this.selectedRegion = 'All';
    this.maxPrice = 50000;
    this.minRating = 0;
    this.sortOption = 'recommended';
    this.destinationService.resetFilters();
  }

  onAddToTrip(destination: Destination): void {
    this.tripService.addDestinationToTrip(destination.id);
    this.notificationService.showToastMessage(
      `✓ ${destination.name} added to your active trip! You can also calculate live expenses.`,
      'success'
    );
  }

  openCalculatorFor(destination: Destination): void {
    this.selectedDestForCalc.set(destination);
    this.showCalcModal.set(true);
  }

  closeCalculator(): void {
    this.showCalcModal.set(false);
    this.selectedDestForCalc.set(null);
  }
}
