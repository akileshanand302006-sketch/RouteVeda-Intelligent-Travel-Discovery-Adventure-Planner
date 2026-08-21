import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AttractionService } from '../../core/services/attraction.service';
import { DestinationService } from '../../core/services/destination.service';
import { Attraction } from '../../models/attraction.model';
import { Destination } from '../../models/destination.model';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { TripService } from '../../core/services/trip.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-attraction-details',
  standalone: true,
  imports: [RouterLink, LoadingSpinnerComponent],
  templateUrl: './attraction-details.component.html',
  styleUrl: './attraction-details.component.css'
})
export class AttractionDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly attractionService = inject(AttractionService);
  readonly destinationService = inject(DestinationService);
  private readonly tripService = inject(TripService);
  private readonly notificationService = inject(NotificationService);

  attractionId = signal<number | null>(null);

  attraction = computed<Attraction | undefined>(() => {
    const id = this.attractionId();
    if (!id) return undefined;
    return this.attractionService.getById(id);
  });

  parentDestination = computed<Destination | undefined>(() => {
    const att = this.attraction();
    if (!att) return undefined;
    return this.destinationService.getById(att.destinationId);
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));
      if (id) {
        this.attractionId.set(id);
      }
    });
  }

  addToTrip(): void {
    const dest = this.parentDestination();
    if (dest) {
      this.tripService.addDestinationToTrip(dest.id);
      this.notificationService.showToastMessage(`${dest.name} added to your trip!`, 'success');
    }
  }
}
