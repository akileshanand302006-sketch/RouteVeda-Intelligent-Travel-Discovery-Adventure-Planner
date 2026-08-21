import { Injectable, inject } from '@angular/core';
import { DestinationService } from './destination.service';
import { Destination } from '../../models/destination.model';

export interface TravelPreferences {
  preferredRegion?: string; // "North", "South", "East", "West", "Central", "North East", or "Any"
  budgetPerPerson?: number; // e.g. 10000
  durationDays?: number; // e.g. 4
  travelStyle?: string; // "Adventure", "Relaxation", "Heritage", "Nature", "Luxury", etc.
  climatePreference?: string; // "Cool / Mountains", "Warm / Beach", "Moderate", "Any"
  travelerType?: string; // "Solo", "Couple", "Family", "Friends"
}

export interface RecommendedDestination {
  destination: Destination;
  score: number; // 0 to 100
  matchReasons: string[];
}

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  private readonly destinationService = inject(DestinationService);

  getRecommendations(prefs: TravelPreferences): RecommendedDestination[] {
    const all = this.destinationService.destinations();
    if (!all || all.length === 0) return [];

    const results: RecommendedDestination[] = all.map(dest => {
      let score = 50; // base score
      const matchReasons: string[] = [];

      // 1. Region match (+20)
      if (prefs.preferredRegion && prefs.preferredRegion !== 'Any') {
        if (dest.region === prefs.preferredRegion) {
          score += 20;
          matchReasons.push(`Located in your preferred region (${dest.region} India)`);
        }
      }

      // 2. Budget match (+20)
      if (prefs.budgetPerPerson) {
        if (dest.pricePerPerson <= prefs.budgetPerPerson) {
          score += 20;
          matchReasons.push(`Fits comfortably within your budget of ₹${prefs.budgetPerPerson.toLocaleString()}`);
        } else if (dest.pricePerPerson <= prefs.budgetPerPerson * 1.25) {
          score += 10;
          matchReasons.push('Slightly over budget but offers high value');
        }
      }

      // 3. Travel Style match (+20)
      if (prefs.travelStyle) {
        const style = prefs.travelStyle.toLowerCase();
        const cat = dest.category.toLowerCase();
        const tags = dest.tags.map(t => t.toLowerCase());

        if (cat === style || tags.includes(style)) {
          score += 20;
          matchReasons.push(`Matches your target travel style (${dest.category})`);
        }
      }

      // 4. Climate match (+15)
      if (prefs.climatePreference && prefs.climatePreference !== 'Any') {
        if (prefs.climatePreference.includes('Cool') && (dest.category === 'Hill Station' || dest.tags.includes('mountains') || dest.tags.includes('snow'))) {
          score += 15;
          matchReasons.push('Offers cool mountain climate');
        } else if (prefs.climatePreference.includes('Warm') && (dest.category === 'Beach' || dest.category === 'Island')) {
          score += 15;
          matchReasons.push('Offers warm coastal beach vibes');
        }
      }

      // 5. Rating bonus (+10)
      if (dest.rating >= 4.7) {
        score += 10;
        matchReasons.push(`Top rated destination (${dest.rating}/5 stars)`);
      }

      const finalScore = Math.min(99, Math.max(40, score));

      return {
        destination: dest,
        score: finalScore,
        matchReasons
      };
    });

    // Sort by score descending
    results.sort((a, b) => b.score - a.score);
    return results;
  }
}
