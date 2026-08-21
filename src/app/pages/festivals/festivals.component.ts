import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FestivalService } from '../../core/services/festival.service';
import { StateService } from '../../core/services/state.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
  selector: 'app-festivals',
  standalone: true,
  imports: [RouterLink, FormsModule, LoadingSpinnerComponent, EmptyStateComponent],
  templateUrl: './festivals.component.html',
  styleUrl: './festivals.component.css'
})
export class FestivalsComponent {
  readonly festivalService = inject(FestivalService);
  readonly stateService = inject(StateService);

  selectedMonth = 'All';
  selectedState = 'All';

  onMonthChange(month: string): void {
    this.selectedMonth = month;
    this.festivalService.setMonthFilter(month);
  }

  onStateChange(): void {
    this.festivalService.setStateFilter(this.selectedState);
  }

  resetFilters(): void {
    this.selectedMonth = 'All';
    this.selectedState = 'All';
    this.festivalService.resetFilters();
  }
}
