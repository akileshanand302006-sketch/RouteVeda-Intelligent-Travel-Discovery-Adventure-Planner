export type TravelStyle =
  | 'Adventure'
  | 'Relaxation'
  | 'Nature'
  | 'Luxury'
  | 'Budget'
  | 'Family'
  | 'Photography';

export type TripStatus = 'Planning' | 'Confirmed' | 'Completed' | 'Cancelled';

export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  transportation: number;
  activities: number;
  miscellaneous: number;
}

export interface ItineraryDay {
  day: number;
  title: string;
  description: string;
  activities: string[];
  meals: string[];
  accommodation: string;
}

export interface Trip {
  id: string;
  name: string;
  travelerName: string;
  travelerEmail: string;
  numberOfTravelers: number;
  destinations: number[];
  destinationNames?: string[];
  activities: number[];
  activityNames?: string[];
  startDate: string;
  endDate: string;
  duration: number;
  travelStyle: TravelStyle;
  budget: number;
  estimatedCost: number;
  budgetBreakdown: BudgetBreakdown;
  itinerary: ItineraryDay[];
  status: TripStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  coverImage?: string;
}
