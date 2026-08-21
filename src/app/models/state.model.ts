export type IndiaRegion = 'North' | 'South' | 'East' | 'West' | 'Central' | 'North East';
export type AdministrativeType = 'State' | 'Union Territory';

export interface State {
  id: string; // e.g. "tamil-nadu", "kerala", "delhi"
  name: string;
  code: string; // e.g. "TN", "KL", "DL"
  region: IndiaRegion;
  type: AdministrativeType;
  capital: string;
  description: string;
  heroImage: string;
  bannerImage: string;
  bestTimeToVisit: string[];
  famousDestinationsCount: number;
  topAttractions: string[];
  foodSpecialties: string[];
  cultureHighlights: string[];
  festivals: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
}
