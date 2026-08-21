import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StateService } from '../../core/services/state.service';
import { IndiaRegion } from '../../models/state.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-india-explorer',
  standalone: true,
  imports: [RouterLink, FormsModule, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './india-explorer.component.html',
  styleUrl: './india-explorer.component.css'
})
export class IndiaExplorerComponent {
  readonly stateService = inject(StateService);

  searchQuery = '';
  selectedRegion: IndiaRegion | 'All' = 'All';

  onSearchChange(): void {
    this.stateService.setSearchQuery(this.searchQuery);
  }

  selectRegion(region: IndiaRegion | 'All'): void {
    this.selectedRegion = region;
    this.stateService.setRegionFilter(region);
  }

  resetFilters(): void {
    this.searchQuery = '';
    this.selectedRegion = 'All';
    this.stateService.resetFilters();
  }
}
