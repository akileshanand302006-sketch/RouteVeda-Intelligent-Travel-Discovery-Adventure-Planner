export type AttractionCategory =
  | 'Heritage'
  | 'Nature'
  | 'Spiritual'
  | 'Fort'
  | 'Palace'
  | 'Temple'
  | 'Waterfall'
  | 'Lake'
  | 'Viewpoint'
  | 'Museum'
  | 'Wildlife'
  | 'Beach';

export interface Attraction {
  id: number;
  name: string;
  destinationId: number;
  destinationName: string;
  state: string;
  category: AttractionCategory;
  description: string;
  image: string;
  visitDuration: string;
  bestTime: string;
  significance: string;
  entryInfo: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}
