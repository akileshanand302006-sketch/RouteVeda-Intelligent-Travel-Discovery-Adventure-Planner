import { Component, input, output, signal, computed, inject, effect } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule, DecimalPipe } from '@angular/common';
import { Destination } from '../../../models/destination.model';
import { TripService } from '../../../core/services/trip.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Router } from '@angular/router';

export type ExpenseTier = 'budget' | 'standard' | 'luxury';

@Component({
  selector: 'app-expense-calculator-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  template: `
    @if (isOpen()) {
      <div class="modal-backdrop-glass" (click)="onClose()">
        <div class="modal-dialog-glass animate-scale-in" (click)="$event.stopPropagation()">
          <!-- Header -->
          <div class="modal-header-glass">
            <div class="d-flex align-items-center gap-2">
              <div class="modal-icon-badge">
                <i class="bi bi-calculator-fill text-tf-primary fs-4"></i>
              </div>
              <div>
                <h5 class="mb-0 fw-bold">Trip Expense & Budget Calculator</h5>
                <small class="text-tf-muted">
                  @if (destination()) {
                    Calculating estimate for <strong class="text-tf-primary">{{ destination()?.name }}</strong> ({{ destination()?.state }})
                  } @else {
                    Calculate live travel costs with intelligent defaults
                  }
                </small>
              </div>
            </div>
            <button class="btn-close-glass" (click)="onClose()" aria-label="Close">
              <i class="bi bi-x-lg"></i>
            </button>
          </div>

          <!-- Body -->
          <div class="modal-body-glass">
            <!-- Tier Presets & Quick Controls -->
            <div class="row g-3 mb-4">
              <!-- Tier Selector -->
              <div class="col-md-12">
                <label class="form-label-tf mb-2">Travel Tier (Presets)</label>
                <div class="tier-pill-group">
                  <button
                    type="button"
                    class="tier-pill"
                    [class.active]="tier() === 'budget'"
                    (click)="setTier('budget')"
                  >
                    <i class="bi bi-piggy-bank text-tf-warning"></i>
                    <span>Budget / Backpacker</span>
                  </button>
                  <button
                    type="button"
                    class="tier-pill"
                    [class.active]="tier() === 'standard'"
                    (click)="setTier('standard')"
                  >
                    <i class="bi bi-award text-tf-primary"></i>
                    <span>Standard / Comfortable (Default)</span>
                  </button>
                  <button
                    type="button"
                    class="tier-pill"
                    [class.active]="tier() === 'luxury'"
                    (click)="setTier('luxury')"
                  >
                    <i class="bi bi-gem text-tf-accent"></i>
                    <span>Luxury / Premium</span>
                  </button>
                </div>
              </div>

              <!-- Travelers and Duration -->
              <div class="col-sm-6">
                <label class="form-label-tf">
                  <i class="bi bi-people me-1 text-tf-primary"></i> Travelers: <strong>{{ travelers() }}</strong>
                </label>
                <div class="input-group-glass">
                  <button class="btn btn-sm btn-tf-glass" (click)="adjustTravelers(-1)" [disabled]="travelers() <= 1">-</button>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    class="form-control-glass text-center"
                    [ngModel]="travelers()"
                    (ngModelChange)="travelers.set(Math.max(1, $event))"
                  >
                  <button class="btn btn-sm btn-tf-glass" (click)="adjustTravelers(1)" [disabled]="travelers() >= 20">+</button>
                </div>
              </div>

              <div class="col-sm-6">
                <label class="form-label-tf">
                  <i class="bi bi-calendar-event me-1 text-tf-primary"></i> Trip Duration: <strong>{{ days() }} Days</strong>
                </label>
                <div class="input-group-glass">
                  <button class="btn btn-sm btn-tf-glass" (click)="adjustDays(-1)" [disabled]="days() <= 1">-</button>
                  <input
                    type="number"
                    min="1"
                    max="30"
                    class="form-control-glass text-center"
                    [ngModel]="days()"
                    (ngModelChange)="days.set(Math.max(1, $event))"
                  >
                  <button class="btn btn-sm btn-tf-glass" (click)="adjustDays(1)" [disabled]="days() >= 30">+</button>
                </div>
              </div>
            </div>

            <!-- Itemized Expenses Breakdown (with customizable sliders & defaults) -->
            <div class="expense-breakdown-box glass-card p-3 rounded-4 mb-4">
              <div class="d-flex justify-content-between align-items-center mb-3">
                <h6 class="fw-bold mb-0"><i class="bi bi-sliders me-1 text-tf-primary"></i> Expense Breakdown & Daily Rates</h6>
                <button class="btn btn-sm btn-tf-glass py-1 px-2 extra-small" (click)="resetToDefaults()">
                  <i class="bi bi-arrow-counterclockwise"></i> Reset Defaults
                </button>
              </div>

              <!-- Accommodation -->
              <div class="expense-row mb-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="small fw-semibold">
                    <i class="bi bi-building me-1 text-tf-primary"></i> Accommodation (per room/night)
                  </span>
                  <span class="fw-bold text-tf-primary">₹{{ accommodationRate() | number }} / night</span>
                </div>
                <input
                  type="range"
                  class="form-range"
                  min="500"
                  max="15000"
                  step="250"
                  [ngModel]="accommodationRate()"
                  (ngModelChange)="accommodationRate.set($event)"
                >
                <div class="d-flex justify-content-between extra-small text-tf-muted">
                  <span>{{ Math.ceil(travelers() / 2) }} room(s) × {{ days() }} night(s)</span>
                  <span>Total: ₹{{ totalAccommodation() | number }}</span>
                </div>
              </div>

              <!-- Food & Dining -->
              <div class="expense-row mb-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="small fw-semibold">
                    <i class="bi bi-cup-hot me-1 text-tf-accent"></i> Food & Dining (per person/day)
                  </span>
                  <span class="fw-bold text-tf-accent">₹{{ foodRate() | number }} / day</span>
                </div>
                <input
                  type="range"
                  class="form-range"
                  min="200"
                  max="5000"
                  step="100"
                  [ngModel]="foodRate()"
                  (ngModelChange)="foodRate.set($event)"
                >
                <div class="d-flex justify-content-between extra-small text-tf-muted">
                  <span>{{ travelers() }} person(s) × {{ days() }} day(s)</span>
                  <span>Total: ₹{{ totalFood() | number }}</span>
                </div>
              </div>

              <!-- Transportation -->
              <div class="expense-row mb-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="small fw-semibold">
                    <i class="bi bi-car-front me-1 text-tf-info"></i> Local Transportation (per person/day)
                  </span>
                  <span class="fw-bold text-tf-info">₹{{ transportRate() | number }} / day</span>
                </div>
                <input
                  type="range"
                  class="form-range"
                  min="100"
                  max="3000"
                  step="50"
                  [ngModel]="transportRate()"
                  (ngModelChange)="transportRate.set($event)"
                >
                <div class="d-flex justify-content-between extra-small text-tf-muted">
                  <span>Local cabs, rentals, transfers</span>
                  <span>Total: ₹{{ totalTransport() | number }}</span>
                </div>
              </div>

              <!-- Sightseeing & Activities -->
              <div class="expense-row mb-3">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="small fw-semibold">
                    <i class="bi bi-ticket-perforated me-1 text-tf-success"></i> Sightseeing & Activities (per person/day)
                  </span>
                  <span class="fw-bold text-tf-success">₹{{ activitiesRate() | number }} / day</span>
                </div>
                <input
                  type="range"
                  class="form-range"
                  min="100"
                  max="3000"
                  step="50"
                  [ngModel]="activitiesRate()"
                  (ngModelChange)="activitiesRate.set($event)"
                >
                <div class="d-flex justify-content-between extra-small text-tf-muted">
                  <span>Entry fees, guides, permits</span>
                  <span>Total: ₹{{ totalActivities() | number }}</span>
                </div>
              </div>

              <!-- Miscellaneous & Buffer -->
              <div class="expense-row">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <span class="small fw-semibold">
                    <i class="bi bi-shield-check me-1 text-tf-warning"></i> Contingency & Misc Buffer ({{ miscPercent() }}%)
                  </span>
                  <span class="fw-bold text-tf-warning">₹{{ totalMisc() | number }}</span>
                </div>
              </div>
            </div>

            <!-- Cost Summary Banner -->
            <div class="summary-gradient-card p-3 rounded-4 mb-4">
              <div class="row align-items-center text-center text-sm-start g-3">
                <div class="col-sm-6">
                  <span class="small text-white-50 d-block">Estimated Total Trip Cost</span>
                  <h3 class="display-6 fw-bold text-white mb-0">₹{{ grandTotal() | number }}</h3>
                  <small class="text-white-50">For {{ travelers() }} traveler(s) • {{ days() }} day(s)</small>
                </div>
                <div class="col-sm-6 text-sm-end">
                  <span class="small text-white-50 d-block">Cost Per Person</span>
                  <h4 class="fw-bold text-warning mb-0">₹{{ perPersonTotal() | number }}</h4>
                  <small class="text-white-50">₹{{ Math.round(perPersonTotal() / days()) | number }} / day / person</small>
                </div>
              </div>
            </div>

            <!-- Trip Name for Saving -->
            <div class="mb-3">
              <label for="customTripName" class="form-label-tf">Save as Trip Title</label>
              <input
                type="text"
                id="customTripName"
                class="form-control-tf"
                [(ngModel)]="tripTitle"
                placeholder="e.g. Dream Trip to {{ destination()?.name || 'India' }}"
              >
            </div>
          </div>

          <!-- Footer Actions -->
          <div class="modal-footer-glass">
            <button type="button" class="btn btn-tf-glass" (click)="onClose()">
              Cancel
            </button>
            <button type="button" class="btn btn-tf-accent" (click)="loadIntoBuilder()">
              <i class="bi bi-tools me-1"></i> Customize in Builder
            </button>
            <button type="button" class="btn btn-tf-primary" (click)="saveAsSavedTrip()">
              <i class="bi bi-bookmark-check-fill me-1"></i> Save to My Trips
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .modal-backdrop-glass {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 23, 42, 0.7);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      z-index: 1200;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      overflow-y: auto;
    }

    .modal-dialog-glass {
      width: 100%;
      max-width: 680px;
      background: var(--tf-card-bg);
      backdrop-filter: blur(28px);
      -webkit-backdrop-filter: blur(28px);
      border: 1px solid var(--tf-glass-border);
      border-radius: var(--tf-radius-xl);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.4), inset 0 1px 2px rgba(255, 255, 255, 0.3);
      display: flex;
      flex-direction: column;
      max-height: 90vh;
      overflow: hidden;
    }

    .modal-header-glass {
      padding: 1.25rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--tf-border-light);
      background: rgba(var(--tf-primary-rgb), 0.05);
    }

    .modal-icon-badge {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      background: rgba(var(--tf-primary-rgb), 0.15);
      border: 1px solid rgba(var(--tf-primary-rgb), 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .btn-close-glass {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.05);
      border: 1px solid var(--tf-border-light);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: var(--tf-text-secondary);
      transition: all 0.2s ease;
    }

    .btn-close-glass:hover {
      background: rgba(239, 68, 68, 0.2);
      color: var(--tf-danger);
      transform: rotate(90deg);
    }

    .modal-body-glass {
      padding: 1.5rem;
      overflow-y: auto;
      flex: 1;
    }

    .modal-footer-glass {
      padding: 1rem 1.5rem;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: flex-end;
      border-top: 1px solid var(--tf-border-light);
      background: rgba(0, 0, 0, 0.02);
    }

    .tier-pill-group {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
      gap: 8px;
    }

    .tier-pill {
      background: var(--tf-surface-glass);
      border: 1px solid var(--tf-border-light);
      padding: 10px 12px;
      border-radius: var(--tf-radius);
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--tf-text);
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .tier-pill:hover {
      border-color: var(--tf-primary);
      background: rgba(var(--tf-primary-rgb), 0.08);
    }

    .tier-pill.active {
      background: var(--tf-gradient-primary);
      color: #fff !important;
      border-color: transparent;
      box-shadow: 0 4px 15px rgba(var(--tf-primary-rgb), 0.35);
    }

    .tier-pill.active i {
      color: #fff !important;
    }

    .input-group-glass {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .form-control-glass {
      width: 60px;
      background: var(--tf-surface-glass);
      border: 1px solid var(--tf-border-light);
      border-radius: var(--tf-radius);
      padding: 4px 8px;
      font-weight: bold;
      color: var(--tf-text);
    }

    .summary-gradient-card {
      background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #db2777 100%);
      box-shadow: 0 10px 30px rgba(79, 70, 229, 0.35);
    }

    .extra-small {
      font-size: 0.75rem;
    }
  `]
})
export class ExpenseCalculatorModalComponent {
  readonly Math = Math;
  destination = input<Destination | null>(null);
  isOpen = input<boolean>(false);
  close = output<void>();

  private readonly tripService = inject(TripService);
  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);
  private readonly router = inject(Router);

  tier = signal<ExpenseTier>('standard');
  travelers = signal<number>(2);
  days = signal<number>(4);

  // Rates
  accommodationRate = signal<number>(2500);
  foodRate = signal<number>(800);
  transportRate = signal<number>(500);
  activitiesRate = signal<number>(400);
  miscPercent = signal<number>(10);

  tripTitle = '';

  constructor() {
    effect(() => {
      const dest = this.destination();
      if (dest) {
        this.tripTitle = `Tour of ${dest.name}`;
        if (dest.pricePerPerson) {
          // Adjust base rates relative to destination base price
          const basePerDay = Math.round(dest.pricePerPerson / 3);
          this.accommodationRate.set(Math.max(1500, Math.round(basePerDay * 0.8)));
          this.foodRate.set(Math.max(600, Math.round(basePerDay * 0.35)));
        }
      } else {
        this.tripTitle = 'My Custom India Trip';
      }
    });
  }

  setTier(newTier: ExpenseTier): void {
    this.tier.set(newTier);
    if (newTier === 'budget') {
      this.accommodationRate.set(1200);
      this.foodRate.set(400);
      this.transportRate.set(250);
      this.activitiesRate.set(200);
    } else if (newTier === 'standard') {
      this.accommodationRate.set(2500);
      this.foodRate.set(800);
      this.transportRate.set(500);
      this.activitiesRate.set(400);
    } else if (newTier === 'luxury') {
      this.accommodationRate.set(6500);
      this.foodRate.set(2000);
      this.transportRate.set(1500);
      this.activitiesRate.set(1200);
    }
  }

  resetToDefaults(): void {
    this.setTier('standard');
    this.travelers.set(2);
    this.days.set(4);
    this.miscPercent.set(10);
  }

  adjustTravelers(delta: number): void {
    this.travelers.update(t => Math.max(1, Math.min(20, t + delta)));
  }

  adjustDays(delta: number): void {
    this.days.update(d => Math.max(1, Math.min(30, d + delta)));
  }

  totalAccommodation = computed(() => {
    const rooms = Math.ceil(this.travelers() / 2);
    return this.days() * this.accommodationRate() * rooms;
  });

  totalFood = computed(() => {
    return this.days() * this.foodRate() * this.travelers();
  });

  totalTransport = computed(() => {
    return this.days() * this.transportRate() * this.travelers();
  });

  totalActivities = computed(() => {
    return this.days() * this.activitiesRate() * this.travelers();
  });

  subtotal = computed(() => {
    return this.totalAccommodation() + this.totalFood() + this.totalTransport() + this.totalActivities();
  });

  totalMisc = computed(() => {
    return Math.round(this.subtotal() * (this.miscPercent() / 100));
  });

  grandTotal = computed(() => {
    return this.subtotal() + this.totalMisc();
  });

  perPersonTotal = computed(() => {
    return Math.round(this.grandTotal() / Math.max(1, this.travelers()));
  });

  onClose(): void {
    this.close.emit();
  }

  saveAsSavedTrip(): void {
    const dest = this.destination();
    const destIds = dest ? [dest.id] : [];
    const destNames = dest ? [dest.name] : ['India Adventure'];

    const today = new Date();
    const future = new Date();
    future.setDate(today.getDate() + this.days());

    const createdTrip = this.tripService.createTrip({
      name: this.tripTitle || (dest ? `Trip to ${dest.name}` : 'Custom India Adventure'),
      travelerName: this.authService.currentUser()?.name || 'Traveler',
      travelerEmail: this.authService.currentUser()?.email || '',
      numberOfTravelers: this.travelers(),
      destinations: destIds,
      destinationNames: destNames,
      startDate: today.toISOString().split('T')[0],
      endDate: future.toISOString().split('T')[0],
      duration: this.days(),
      travelStyle: this.tier() === 'luxury' ? 'Luxury' : (this.tier() === 'budget' ? 'Budget' : 'Adventure'),
      budget: this.grandTotal(),
      estimatedCost: this.grandTotal(),
      budgetBreakdown: {
        accommodation: this.totalAccommodation(),
        food: this.totalFood(),
        transportation: this.totalTransport(),
        activities: this.totalActivities(),
        miscellaneous: this.totalMisc()
      },
      itinerary: [
        {
          day: 1,
          title: `Arrival & Check-in at ${destNames[0]}`,
          description: `Arrive, settle into accommodation (₹${this.accommodationRate().toLocaleString()}/night), explore local markets.`,
          activities: ['Arrival & Check-in', 'Welcome dinner'],
          meals: ['Dinner'],
          accommodation: `${destNames[0]} Hotel & Resort`
        },
        {
          day: 2,
          title: `Full Day Exploration & Sightseeing`,
          description: `Guided tour of key attractions and local culinary spots.`,
          activities: ['Sightseeing', 'Photography', 'Food Walk'],
          meals: ['Breakfast', 'Lunch', 'Dinner'],
          accommodation: `${destNames[0]} Hotel & Resort`
        }
      ],
      notes: `Calculated with ${this.tier()} tier expense breakdown. Total estimate: ₹${this.grandTotal().toLocaleString()}`,
      coverImage: dest?.image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    });

    this.notificationService.showToastMessage(
      `Trip "${createdTrip.name}" created and saved to My Trips!`,
      'success'
    );
    this.onClose();
    this.router.navigate(['/my-trips']);
  }

  loadIntoBuilder(): void {
    const dest = this.destination();
    if (dest) {
      this.tripService.addDestinationToTrip(dest.id);
    }
    this.tripService.updateCurrentTrip({
      name: this.tripTitle,
      numberOfTravelers: this.travelers(),
      budget: this.grandTotal(),
      travelStyle: this.tier() === 'luxury' ? 'Luxury' : (this.tier() === 'budget' ? 'Budget' : 'Adventure')
    });

    this.notificationService.showToastMessage('Calculated budget loaded into Trip Builder!', 'success');
    this.onClose();
    this.router.navigate(['/trip-builder']);
  }
}
