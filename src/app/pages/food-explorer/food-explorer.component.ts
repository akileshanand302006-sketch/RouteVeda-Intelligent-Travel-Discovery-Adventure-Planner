import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { FoodService } from '../../core/services/food.service';
import { IndiaRegion } from '../../models/state.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-food-explorer',
  standalone: true,
  imports: [FormsModule, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './food-explorer.component.html',
  styleUrl: './food-explorer.component.css'
})
export class FoodExplorerComponent {
  readonly foodService = inject(FoodService);

  searchQuery = '';
  selectedRegion: IndiaRegion | 'All' = 'All';
  selectedType: 'All' | 'Veg' | 'Non-Veg' | 'Sweet' | 'Beverage' = 'All';

  onSearchChange(): void {
    this.foodService.setSearchQuery(this.searchQuery);
  }

  onRegionChange(region: IndiaRegion | 'All'): void {
    this.selectedRegion = region;
    this.foodService.setRegionFilter(region);
  }

  onTypeChange(type: 'All' | 'Veg' | 'Non-Veg' | 'Sweet' | 'Beverage'): void {
    this.selectedType = type;
    this.foodService.setTypeFilter(type);
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedRegion = 'All';
    this.selectedType = 'All';
    this.foodService.resetFilters();
  }
}
