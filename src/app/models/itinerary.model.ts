import { TravelStyle, ItineraryDay } from './trip.model';

export interface PredefinedItinerary {
  id: string;
  title: string;
  subtitle: string;
  region: string;
  states: string[];
  durationDays: number;
  travelStyle: TravelStyle;
  estimatedBudgetPerPerson: number;
  coverImage: string;
  destinationIds: number[];
  destinationNames: string[];
  highlights: string[];
  dayByDayPlan: ItineraryDay[];
}
