import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivityService } from '../../core/services/activity.service';
import { TripService } from '../../core/services/trip.service';
import { NotificationService } from '../../core/services/notification.service';
import { ActivityCardComponent } from '../../shared/components/activity-card/activity-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { Activity, ActivityCategory, DifficultyLevel } from '../../models/activity.model';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [
    FormsModule,
    ActivityCardComponent,
    LoadingSpinnerComponent,
    EmptyStateComponent
  ],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.css'
})
export class ActivitiesComponent {
  readonly activityService = inject(ActivityService);
  private readonly tripService = inject(TripService);
  private readonly notificationService = inject(NotificationService);

  searchQuery = '';
  selectedCategory: ActivityCategory | '' = '';
  selectedDifficulty: DifficultyLevel | '' = '';
  maxPrice = 50000;

  onSearchChange(): void {
    this.activityService.updateSearch(this.searchQuery);
  }

  onCategorySelect(category: ActivityCategory | ''): void {
    this.selectedCategory = category;
    this.activityService.updateCategoryFilter(category);
  }

  onFilterChange(): void {
    this.activityService.updateDifficultyFilter(this.selectedDifficulty);
    this.activityService.updateMaxPrice(this.maxPrice);
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedDifficulty = '';
    this.maxPrice = 50000;
    this.activityService.resetFilters();
  }

  onAddActivityToTrip(activity: Activity): void {
    this.tripService.addActivityToTrip(activity.id);
    this.notificationService.showToastMessage(`${activity.name} added to your trip!`, 'success');
  }
}
