export type DestinationCategory =
  | 'Hill Station'
  | 'Beach'
  | 'Nature'
  | 'Adventure'
  | 'Heritage'
  | 'Spiritual'
  | 'Wildlife'
  | 'Desert'
  | 'Island'
  | 'Rural'
  | 'Offbeat'
  | 'City';

export type DifficultyLevel = 'Easy' | 'Moderate' | 'Challenging' | 'Extreme';

export interface BudgetTier {
  budget: number;
  midRange: number;
  premium: number;
}

export interface TransportationInfo {
  airport?: string;
  railway?: string;
  road?: string;
  localTransport?: string;
}

export interface AuthorAttribution {
  displayName: string;
  uri?: string;
  photoUri?: string;
}

export interface PlaceImage {
  name?: string;
  photoName?: string;
  photoUri?: string;
  url?: string;
  thumbnailUrl?: string;
  heroUrl?: string;
  widthPx?: number;
  heightPx?: number;
  authorAttributions?: AuthorAttribution[];
  source?: string;
  sourceUrl?: string;
  author?: string;
  license?: string;
  attribution?: string;
  fileName?: string;
  verified?: boolean;
  imageStatus?: 'verified' | 'needs-verification' | 'broken' | 'missing';
}

export type DestinationImage = PlaceImage;

export interface ImageMetadata {
  source: string;
  sourceUrl: string;
  author?: string;
  license?: string;
  attribution?: string;
}

export interface Destination {
  id: number;
  placeId?: string;
  name: string;
  location: string;
  state: string;
  stateId?: string;
  region?: 'North' | 'South' | 'East' | 'West' | 'Central' | 'North East';
  country: string;
  description: string;
  shortDescription: string;

  // Google Places API (New) Data
  googlePlaceId?: string;
  googleMapsUri?: string;
  googleRating?: number;
  googleUserRatingCount?: number;
  ratingSource?: string;
  searchQuery?: string;
  formattedAddress?: string;
  primaryImage?: PlaceImage;

  // Imagery & Galleries
  image: string;
  heroImage?: string | PlaceImage;
  thumbnailUrl?: string;
  gallery: (string | PlaceImage)[];
  placePhotos?: PlaceImage[];
  imageMetadata?: ImageMetadata;
  imageDetails?: PlaceImage;
  imageStatus?: 'verified' | 'needs-verification' | 'broken' | 'missing';
  imageSource?: string;
  imageLicense?: string;
  imageAttribution?: string;
  imageAuthor?: string;
  sourceUrl?: string;

  // Ratings & Pricing
  rating: number;
  reviewCount: number;
  category: DestinationCategory;
  pricePerPerson: number;
  estimatedBudget?: BudgetTier;
  bestSeason: string;
  idealDuration?: string;
  elevation?: string;
  available: boolean;
  featured: boolean;
  difficulty: DifficultyLevel;
  tags: string[];
  highlights?: string[];
  attractions?: string[];
  foodSpecialties?: string[];
  localCulture?: string[];
  travelTips?: string[];
  transportation?: TransportationInfo;
  coordinates: {
    lat: number;
    lng: number;
  };
  activities: number[];
}
