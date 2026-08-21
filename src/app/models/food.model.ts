export interface FoodItem {
  id: string;
  name: string;
  state: string;
  region: 'North' | 'South' | 'East' | 'West' | 'Central' | 'North East';
  description: string;
  image: string;
  type: 'Veg' | 'Non-Veg' | 'Sweet' | 'Beverage';
  popularPlacesToTry: string[];
  tags: string[];
}
