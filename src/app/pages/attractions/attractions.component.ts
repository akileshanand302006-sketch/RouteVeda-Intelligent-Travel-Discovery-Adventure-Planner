import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AttractionService } from '../../core/services/attraction.service';
import { StateService } from '../../core/services/state.service';
import { AttractionCategory } from '../../models/attraction.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-attractions',
  standalone: true,
  imports: [RouterLink, FormsModule, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './attractions.component.html',
  styleUrl: './attractions.component.css'
})
export class AttractionsComponent {
  readonly attractionService = inject(AttractionService);
  readonly stateService = inject(StateService);

  searchQuery = '';
  selectedCategory: AttractionCategory | 'All' = 'All';
  selectedState = 'All';

  onSearchChange(): void {
    this.attractionService.setSearchQuery(this.searchQuery);
  }

  onCategoryChange(cat: AttractionCategory | 'All'): void {
    this.selectedCategory = cat;
    this.attractionService.setCategoryFilter(cat);
  }

  onStateChange(): void {
    this.attractionService.setStateFilter(this.selectedState);
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = 'All';
    this.selectedState = 'All';
    this.attractionService.resetFilters();
  }
}
