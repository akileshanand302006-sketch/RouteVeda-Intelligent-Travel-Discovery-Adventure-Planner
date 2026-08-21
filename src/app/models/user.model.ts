export interface UserPreferences {
  travelStyle: string;
  preferredDestinationType: string;
  currency: string;
  notifications: {
    tripReminders: boolean;
    budgetAlerts: boolean;
    recommendations: boolean;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  avatar: string;
  bio?: string;
  phone?: string;
  location?: string;
  joinedDate: string;
  tripsCreated: number;
  destinationsVisited: number;
  favoriteCategory: string;
  preferences: UserPreferences;
}
