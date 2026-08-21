import { Injectable, signal, computed, inject, effect } from '@angular/core';
import { StorageService } from './storage.service';
import { Achievement } from '../../models/achievement.model';
import { DestinationService } from './destination.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AchievementService {
  private readonly storage = inject(StorageService);
  private readonly destinationService = inject(DestinationService);
  private readonly authService = inject(AuthService);

  private readonly _visitedDestinationIds = signal<number[]>([]);
  readonly visitedDestinationIds = this._visitedDestinationIds.asReadonly();

  readonly totalVisitedDestinations = computed(() => this._visitedDestinationIds().length);

  readonly visitedStates = computed(() => {
    const visitedIds = this._visitedDestinationIds();
    const allDests = this.destinationService.destinations();
    const statesSet = new Set<string>();

    for (const id of visitedIds) {
      const d = allDests.find(dest => dest.id === id);
      if (d && d.state) {
        statesSet.add(d.state.toLowerCase());
      }
    }
    return Array.from(statesSet);
  });

  readonly totalVisitedStates = computed(() => this.visitedStates().length);
  readonly totalStatesInIndia = 36; // 28 states + 8 UTs

  readonly indiaExplorationPercent = computed(() => {
    return Math.min(100, Math.round((this.totalVisitedStates() / this.totalStatesInIndia) * 100));
  });

  readonly achievements = computed((): Achievement[] => {
    const vDests = this.totalVisitedDestinations();
    const vStates = this.totalVisitedStates();

    return [
      {
        id: 'ach-first-step',
        title: 'First Step',
        badgeIcon: 'bi-compass-fill',
        description: 'Mark your very first visited destination in India.',
        requiredCount: 1,
        category: 'Destinations',
        unlocked: vDests >= 1,
        progressPercent: Math.min(100, (vDests / 1) * 100)
      },
      {
        id: 'ach-mountain',
        title: '🏔️ Mountain Explorer',
        badgeIcon: 'bi-snow',
        description: 'Visit at least 3 hill stations or mountain Himalayan destinations.',
        requiredCount: 3,
        category: 'Category',
        unlocked: vDests >= 3,
        progressPercent: Math.min(100, (vDests / 3) * 100)
      },
      {
        id: 'ach-states-5',
        title: '🗺️ State Hopper',
        badgeIcon: 'bi-map-fill',
        description: 'Explore 5 different Indian States or Union Territories.',
        requiredCount: 5,
        category: 'States',
        unlocked: vStates >= 5,
        progressPercent: Math.min(100, (vStates / 5) * 100)
      },
      {
        id: 'ach-states-10',
        title: '🇮🇳 India Nomad',
        badgeIcon: 'bi-globe-asia-australia',
        description: 'Explore 10 different Indian States or Union Territories.',
        requiredCount: 10,
        category: 'States',
        unlocked: vStates >= 10,
        progressPercent: Math.min(100, (vStates / 10) * 100)
      },
      {
        id: 'ach-dests-10',
        title: '⭐ Explorer Pro',
        badgeIcon: 'bi-star-fill',
        description: 'Mark 10 destinations visited on your Bucket List.',
        requiredCount: 10,
        category: 'Destinations',
        unlocked: vDests >= 10,
        progressPercent: Math.min(100, (vDests / 10) * 100)
      }
    ];
  });

  constructor() {
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.loadUserBucketList(user.id);
      } else {
        this._visitedDestinationIds.set([]);
      }
    });
  }

  loadUserBucketList(userId: number | string): void {
    const saved = this.storage.getUserData<number[]>(userId, 'bucket_list', []);
    this._visitedDestinationIds.set(saved);
  }

  toggleVisited(destinationId: number): boolean {
    const current = this._visitedDestinationIds();
    let updated: number[];
    let isNowVisited = false;

    if (current.includes(destinationId)) {
      updated = current.filter(id => id !== destinationId);
    } else {
      updated = [...current, destinationId];
      isNowVisited = true;
    }

    this._visitedDestinationIds.set(updated);
    this.persist();
    return isNowVisited;
  }

  isVisited(destinationId: number): boolean {
    return this._visitedDestinationIds().includes(destinationId);
  }

  private persist(): void {
    const userId = this.authService.currentUser()?.id;
    if (userId) {
      this.storage.setUserData(userId, 'bucket_list', this._visitedDestinationIds());
    }
  }
}
