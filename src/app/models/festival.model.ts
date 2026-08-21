export interface Festival {
  id: string;
  name: string;
  state: string;
  location: string;
  month: string;
  category: 'Cultural' | 'Religious' | 'Music & Art' | 'Folk & Harvest' | 'Fair';
  description: string;
  image: string;
  duration: string;
  keyAttractions: string[];
}
