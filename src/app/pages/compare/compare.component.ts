import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ComparisonService } from '../../core/services/comparison.service';
import { DestinationService } from '../../core/services/destination.service';
import { Destination } from '../../models/destination.model';

@Component({
  selector: 'app-compare',
  standalone: true,
  imports: [RouterLink, FormsModule, DecimalPipe],
  templateUrl: './compare.component.html',
  styleUrl: './compare.component.css'
})
export class CompareComponent {
  readonly comparisonService = inject(ComparisonService);
  readonly destinationService = inject(DestinationService);

  selectedDestId: number | '' = '';

  addSelected(): void {
    if (this.selectedDestId) {
      const dest = this.destinationService.getById(Number(this.selectedDestId));
      if (dest) {
        this.comparisonService.addDestination(dest);
        this.selectedDestId = '';
      }
    }
  }

  remove(id: number): void {
    this.comparisonService.removeDestination(id);
  }

  clear(): void {
    this.comparisonService.clear();
  }

  getWinner(): Destination | undefined {
    const list = this.comparisonService.selectedDestinations();
    if (list.length === 0) return undefined;
    return [...list].sort((a, b) => b.rating - a.rating)[0];
  }
}
