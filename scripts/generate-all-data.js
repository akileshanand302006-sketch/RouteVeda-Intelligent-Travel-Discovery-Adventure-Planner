const fs = require('fs');
const path = require('path');

const publicDataDir = path.join(__dirname, '..', 'public', 'data');
if (!fs.existsSync(publicDataDir)) {
  fs.mkdirSync(publicDataDir, { recursive: true });
}

console.log('Generating Complete Structured India Tourism Dataset...');

// Helper to create valid place objects
let globalId = 1;
function createPlace(data) {
  const numId = globalId++;
  const strId = data.id || `${data.stateId}-${data.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;
  
  return {
    id: numId,
    placeId: strId,
    name: data.name,
    stateId: data.stateId,
    state: data.stateName,
    stateName: data.stateName,
    region: data.region,
    district: data.district || data.location || data.name,
    location: data.location || `${data.name}, ${data.stateName}`,
    country: "India",
    category: data.category || (data.type ? data.type[0] : "Heritage"),
    type: data.type || [data.category || "Heritage"],
    shortDescription: data.shortDescription,
    description: data.description,
    whyVisit: data.whyVisit || data.highlights || [],
    highlights: data.highlights || [],
    attractions: data.attractions || [],
    activities: data.activities || [1, 2, 3],
    bestSeason: data.bestSeason || "October to March",
    bestTimeToVisit: data.bestTimeToVisit || ["October", "November", "December", "January", "February", "March"],
    idealDuration: data.idealDuration || "2-3 days",
    pricePerPerson: data.pricePerPerson || (data.estimatedBudget ? data.estimatedBudget.budget : 5500),
    estimatedBudget: data.estimatedBudget || {
      budget: data.pricePerPerson || 5500,
      moderate: (data.pricePerPerson || 5500) * 1.8,
      midRange: (data.pricePerPerson || 5500) * 1.8,
      premium: (data.pricePerPerson || 5500) * 3.2
    },
    suitableFor: data.suitableFor || ["Solo", "Couples", "Family", "Groups"],
    difficulty: data.difficulty || "Easy",
    famousFor: data.famousFor || data.highlights || [],
    localFood: data.localFood || data.foodSpecialties || [],
    foodSpecialties: data.foodSpecialties || data.localFood || [],
    culture: data.culture || data.localCulture || [],
    localCulture: data.localCulture || data.culture || [],
    festivals: data.festivals || [],
    nearbyPlaces: data.nearbyPlaces || [],
    transportation: data.transportation || {
      airport: "Nearest major domestic airport",
      railway: "Nearest major railway junction",
      road: "Well connected via National Highways",
      localTransport: "Taxis, auto-rickshaws, and local buses available"
    },
    accommodation: data.accommodation || ["Luxury Resorts", "Heritage Homestays", "Budget Hotels", "Eco Lodges"],
    travelTips: data.travelTips || ["Carry valid ID proof", "Book transport in advance during peak season"],
    coordinates: data.coordinates || { lat: data.latitude || 20.5937, lng: data.longitude || 78.9629 },
    latitude: data.latitude || (data.coordinates ? data.coordinates.lat : 20.5937),
    longitude: data.longitude || (data.coordinates ? data.coordinates.lng : 78.9629),
    rating: data.rating || 4.7,
    reviewCount: data.reviewCount || 1250,
    featured: !!data.featured,
    available: true,
    tags: data.tags || [data.category ? data.category.toLowerCase() : "tourism", data.region ? data.region.toLowerCase() : "india", "travel"],
    image: data.heroImage || data.image,
    heroImage: data.heroImage || data.image,
    gallery: data.gallery && data.gallery.length > 0 ? data.gallery : [
      data.heroImage || data.image
    ]
  };
}

module.exports = { createPlace, publicDataDir };
