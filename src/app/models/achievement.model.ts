export interface Achievement {
  id: string;
  title: string;
  badgeIcon: string;
  description: string;
  requiredCount: number;
  category: 'States' | 'Destinations' | 'Trips' | 'Wishlist' | 'Category';
  unlocked: boolean;
  progressPercent: number;
}

export interface BucketListItem {
  destinationId: number;
  destinationName: string;
  state: string;
  visited: boolean;
  visitedDate?: string;
  notes?: string;
}
