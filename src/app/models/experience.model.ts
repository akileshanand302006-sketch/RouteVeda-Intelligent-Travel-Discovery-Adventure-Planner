export type ExperienceCategory =
  | 'Adventure'
  | 'Spiritual'
  | 'Heritage'
  | 'Wildlife'
  | 'Food'
  | 'Wellness'
  | 'Nature'
  | 'Rural'
  | 'Culture';

export interface Experience {
  id: string;
  category: ExperienceCategory;
  title: string;
  description: string;
  image: string;
  states: string[];
  highlightTag: string;
  popularSpotsCount: number;
}
