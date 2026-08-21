export type ActivityCategory =
  | 'Adventure'
  | 'Nature'
  | 'Trekking'
  | 'Water'
  | 'Food'
  | 'Culture'
  | 'Photography'
  | 'Relaxation';

export type DifficultyLevel = 'Easy' | 'Moderate' | 'Challenging' | 'Extreme';

export interface Activity {
  id: number;
  destinationId: number;
  name: string;
  description: string;
  category: ActivityCategory;
  price: number;
  duration: string;
  difficulty: DifficultyLevel;
  image: string;
  rating: number;
  included?: boolean;
}
