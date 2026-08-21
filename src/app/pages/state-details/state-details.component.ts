import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { StateService } from '../../core/services/state.service';
import { DestinationService } from '../../core/services/destination.service';
import { AttractionService } from '../../core/services/attraction.service';
import { FoodService } from '../../core/services/food.service';
import { FestivalService } from '../../core/services/festival.service';
import { State } from '../../models/state.model';
import { Destination } from '../../models/destination.model';
import { Attraction } from '../../models/attraction.model';
import { FoodItem } from '../../models/food.model';
import { Festival } from '../../models/festival.model';
import { DestinationCardComponent } from '../../shared/components/destination-card/destination-card.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { TripService } from '../../core/services/trip.service';
import { NotificationService } from '../../core/services/notification.service';

@Component({
  selector: 'app-state-details',
  standalone: true,
  imports: [
    RouterLink,
    DestinationCardComponent,
    LoadingSpinnerComponent
  ],
  templateUrl: './state-details.component.html',
  styleUrl: './state-details.component.css'
})
export class StateDetailsComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  readonly stateService = inject(StateService);
  readonly destinationService = inject(DestinationService);
  readonly attractionService = inject(AttractionService);
  readonly foodService = inject(FoodService);
  readonly festivalService = inject(FestivalService);
  private readonly tripService = inject(TripService);
  private readonly notificationService = inject(NotificationService);

  stateId = signal<string>('');

  state = computed<State | undefined>(() => {
    const id = this.stateId();
    if (!id) return undefined;
    return this.stateService.getStateById(id);
  });

  destinations = computed<Destination[]>(() => {
    const s = this.state();
    if (!s) return [];
    return this.destinationService.getByState(s.name);
  });

  attractions = computed<Attraction[]>(() => {
    const s = this.state();
    if (!s) return [];
    return this.attractionService.getByState(s.name);
  });

  foodItems = computed<FoodItem[]>(() => {
    const s = this.state();
    if (!s) return [];
    return this.foodService.getByState(s.name);
  });

  festivals = computed<Festival[]>(() => {
    const s = this.state();
    if (!s) return [];
    return this.festivalService.getByState(s.name);
  });

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('stateId');
      if (id) {
        this.stateId.set(id);
      }
    });
  }

  onAddToTrip(dest: Destination): void {
    this.tripService.addDestinationToTrip(dest.id);
    this.notificationService.showToastMessage(`${dest.name} added to your trip!`, 'success');
  }
}
