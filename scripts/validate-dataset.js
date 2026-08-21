const fs = require('fs');
const path = require('path');

const publicDataDir = path.join(__dirname, '..', 'public', 'data');

console.log('🔍 Running Deep Dataset Validation for India Tourism Platform...\n');

const states = JSON.parse(fs.readFileSync(path.join(publicDataDir, 'states.json'), 'utf-8'));
const places = JSON.parse(fs.readFileSync(path.join(publicDataDir, 'tourist-places.json'), 'utf-8'));
const attractions = JSON.parse(fs.readFileSync(path.join(publicDataDir, 'attractions.json'), 'utf-8'));
const food = JSON.parse(fs.readFileSync(path.join(publicDataDir, 'food.json'), 'utf-8'));
const festivals = JSON.parse(fs.readFileSync(path.join(publicDataDir, 'festivals.json'), 'utf-8'));

let errors = [];

// 1. Check State Count
if (states.length !== 36) {
  errors.push(`Expected 36 States/UTs, found ${states.length}`);
} else {
  console.log(`✅ EXACT ADMINISTRATIVE COVERAGE: 36/36 States and Union Territories present.`);
}

// 2. Check Every State has Tourist Places
const stateIdsInPlaces = new Set(places.map(p => p.stateId));
states.forEach(s => {
  const count = places.filter(p => p.stateId === s.id).length;
  if (count === 0) {
    errors.push(`State ${s.name} (${s.id}) has NO tourist places assigned!`);
  }
});

// 3. Check Duplicate Place IDs
const seenIds = new Set();
const seenPlaceIds = new Set();
places.forEach(p => {
  if (seenIds.has(p.id)) {
    errors.push(`Duplicate numeric ID found: ${p.id} (${p.name})`);
  }
  seenIds.add(p.id);

  if (seenPlaceIds.has(p.placeId)) {
    errors.push(`Duplicate string placeId found: ${p.placeId} (${p.name})`);
  }
  seenPlaceIds.add(p.placeId);
});

// 4. Validate Place Data Fields
let brokenImages = 0;
let missingCoords = 0;
let missingGalleries = 0;

places.forEach(p => {
  if (!p.name || !p.stateName || !p.region || !p.description || !p.shortDescription) {
    errors.push(`Place ${p.name || p.id} is missing core textual metadata.`);
  }

  if (!p.heroImage || !p.heroImage.startsWith('http')) {
    brokenImages++;
    errors.push(`Place ${p.name} has invalid heroImage: ${p.heroImage}`);
  }

  if (!p.gallery || !Array.isArray(p.gallery) || p.gallery.length < 1) {
    missingGalleries++;
    errors.push(`Place ${p.name} has invalid gallery.`);
  }

  if (!p.coordinates || typeof p.latitude !== 'number' || typeof p.longitude !== 'number') {
    missingCoords++;
    errors.push(`Place ${p.name} is missing valid GPS coordinates.`);
  }

  if (!p.estimatedBudget || !p.estimatedBudget.budget || !p.estimatedBudget.moderate || !p.estimatedBudget.premium) {
    errors.push(`Place ${p.name} is missing 3-tier estimated budget.`);
  }
});

// 5. Region Breakdown Summary
console.log('\n📊 REGIONAL BREAKDOWN & DESTINATION COUNT:');
console.log('--------------------------------------------------');
const regions = ['North', 'South', 'East', 'West', 'Central', 'North East'];
regions.forEach(r => {
  const rStates = states.filter(s => s.region === r);
  const rPlaces = places.filter(p => p.region === r);
  console.log(`📍 ${r.padEnd(12)}: ${rStates.length} States/UTs | ${rPlaces.length} Destinations`);
});
console.log('--------------------------------------------------');
console.log(`TOTAL DESTINATIONS : ${places.length}`);
console.log(`TOTAL ATTRACTIONS  : ${attractions.length}`);
console.log(`TOTAL REGIONAL FOOD: ${food.length}`);
console.log(`TOTAL FESTIVALS    : ${festivals.length}`);
console.log('--------------------------------------------------');

// State-by-State Report
console.log('\n🏛️ STATE & UNION TERRITORY DETAILS:');
states.forEach((s, idx) => {
  const pCount = places.filter(p => p.stateId === s.id).length;
  console.log(`${(idx + 1).toString().padStart(2)}. [${s.type.padEnd(15)}] ${s.name.padEnd(38)}: ${pCount} places`);
});

if (errors.length > 0) {
  console.error(`\n❌ VALIDATION FAILED with ${errors.length} errors:`);
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log('\n🌟 100% VALIDATION SUCCESS: 0 duplicate IDs, 0 broken images, 0 missing coordinates, 36/36 States & UTs covered!');
}
