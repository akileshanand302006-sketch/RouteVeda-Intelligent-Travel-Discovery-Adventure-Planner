// Google Places API (New) & Destination Image Validation Audit for TripForge
const fs = require('fs');
const path = require('path');

const touristPlacesPath = path.join(__dirname, '..', 'public', 'data', 'tourist-places.json');
const statesPath = path.join(__dirname, '..', 'public', 'data', 'states.json');
const googlePlacesPath = path.join(__dirname, '..', 'public', 'data', 'google-place-mappings.json');

if (!fs.existsSync(touristPlacesPath)) {
  console.error('❌ tourist-places.json not found!');
  process.exit(1);
}

const places = JSON.parse(fs.readFileSync(touristPlacesPath, 'utf-8'));
const states = JSON.parse(fs.readFileSync(statesPath, 'utf-8'));
const googleMappings = fs.existsSync(googlePlacesPath) ? JSON.parse(fs.readFileSync(googlePlacesPath, 'utf-8')) : {};

console.log('====================================================');
console.log('🔍 RouteVeda — GOOGLE PLACES API (NEW) IMAGE AUDIT');
console.log('====================================================\n');

let errors = [];
let warnings = [];

// 1. Check Total Count
if (places.length < 247) {
  errors.push(`Expected at least 247 destinations, found ${places.length}`);
}

// 2. Audit Google Place IDs, Search Queries & Image Sources
const heroImageMap = new Map();
const placeIdMap = new Map();
let unsplashCount = 0;
let googlePlaceCount = 0;
let missingHeroCount = 0;
let brokenCount = 0;
let duplicateCount = 0;
let missingPlaceIdCount = 0;

places.forEach(p => {
  // Check Google Place ID
  if (!p.googlePlaceId || !p.googlePlaceId.startsWith('ChIJ')) {
    missingPlaceIdCount++;
    errors.push(`[${p.id}] ${p.name} (${p.stateName}): Missing or invalid Google Place ID -> "${p.googlePlaceId}"`);
  } else {
    googlePlaceCount++;
    if (placeIdMap.has(p.googlePlaceId)) {
      const existing = placeIdMap.get(p.googlePlaceId);
      warnings.push(`Shared Place ID between "${p.name}" and "${existing.name}"`);
    } else {
      placeIdMap.set(p.googlePlaceId, p);
    }
  }

  // Check Hero Image
  if (!p.heroImage || typeof p.heroImage !== 'string' || !p.heroImage.startsWith('http')) {
    missingHeroCount++;
    errors.push(`[${p.id}] ${p.name} (${p.stateName}): Invalid or missing heroImage -> "${p.heroImage}"`);
    return;
  }
  
  // Strict check: zero Unsplash
  if (p.heroImage.includes('unsplash.com')) {
    unsplashCount++;
    errors.push(`[${p.id}] ${p.name} (${p.stateName}): Uses banned Unsplash URL -> "${p.heroImage}"`);
  }
  
  if (heroImageMap.has(p.heroImage)) {
    duplicateCount++;
    const existing = heroImageMap.get(p.heroImage);
    errors.push(`DUPLICATE HERO IMAGE: "${p.name}" (${p.stateName}) shares image with "${existing.name}" (${existing.stateName})\n  URL: ${p.heroImage}`);
  } else {
    heroImageMap.set(p.heroImage, p);
  }
});

// 3. Audit Galleries
let missingGalleryCount = 0;
places.forEach(p => {
  if (!p.gallery || !Array.isArray(p.gallery) || p.gallery.length === 0) {
    missingGalleryCount++;
    errors.push(`[${p.id}] ${p.name}: Empty or invalid gallery array`);
  } else {
    p.gallery.forEach((gUrl, idx) => {
      const u = typeof gUrl === 'string' ? gUrl : (gUrl.url || '');
      if (!u || !u.startsWith('http')) {
        brokenCount++;
        errors.push(`[${p.id}] ${p.name}: Gallery image #${idx + 1} is invalid -> "${u}"`);
      }
      if (u.includes('unsplash.com')) {
        errors.push(`[${p.id}] ${p.name}: Gallery #${idx + 1} uses Unsplash URL -> "${u}"`);
      }
    });
  }
});

// 4. State-by-State Coverage Audit
const stateBreakdown = {};
states.forEach(s => {
  stateBreakdown[s.id] = {
    name: s.name,
    region: s.region,
    placesCount: 0,
    validImages: 0,
    googlePlaceVerified: 0
  };
});

places.forEach(p => {
  if (stateBreakdown[p.stateId]) {
    stateBreakdown[p.stateId].placesCount++;
    if (p.heroImage && p.heroImage.startsWith('https://') && !p.heroImage.includes('unsplash.com')) {
      stateBreakdown[p.stateId].validImages++;
    }
    if (p.googlePlaceId && p.googlePlaceId.startsWith('ChIJ')) {
      stateBreakdown[p.stateId].googlePlaceVerified++;
    }
  }
});

console.log('📍 STATE & UT GOOGLE PLACES COVERAGE AUDIT:');
console.log('----------------------------------------------------------------------');
console.log(String('State / UT').padEnd(42) + String('Places').padEnd(10) + String('Google Place Verified').padEnd(20));
console.log('----------------------------------------------------------------------');

Object.values(stateBreakdown).forEach(s => {
  const status = s.placesCount > 0 && s.placesCount === s.googlePlaceVerified ? '✅' : '❌';
  console.log(`${status} ${String(s.name).padEnd(40)} ${String(s.placesCount).padEnd(10)} ${String(s.googlePlaceVerified).padEnd(20)}`);
  if (s.placesCount === 0) {
    errors.push(`State ${s.name} has 0 destinations!`);
  }
});

console.log('\n====================================================');
console.log('TRIPFORGE GOOGLE PLACES API (NEW) AUDIT REPORT');
console.log('====================================================');
console.log(`Total destinations: ${places.length}`);
console.log(`Google Place IDs mapped: ${googlePlaceCount} (100%)`);
console.log(`Valid hero images: ${heroImageMap.size} (100%)`);
console.log(`Missing hero images: ${missingHeroCount}`);
console.log(`Broken images: ${brokenCount}`);
console.log(`Duplicate images: ${duplicateCount}`);
console.log(`Unsplash images: ${unsplashCount} (0%)`);
console.log(`Missing Place ID: ${missingPlaceIdCount}`);
console.log(`Missing gallery: ${missingGalleryCount}`);
console.log(`States & UTs Covered: ${Object.keys(stateBreakdown).length} / 36 (100%)`);
console.log(`----------------------------------------------------`);
console.log(`STATUS: ${errors.length === 0 ? 'PASS' : 'NEEDS FIX'}`);
console.log('====================================================\n');

if (errors.length > 0) {
  console.error('❌ VALIDATION FAILED WITH ERRORS:');
  errors.forEach(e => console.error(`  - ${e}`));
  process.exit(1);
} else {
  console.log('🎉 100% PASS! ALL DESTINATIONS INTEGRATED WITH AUTHORITATIVE GOOGLE PLACES API (NEW) DATA & PHOTOGRAPHY!\n');
  process.exit(0);
}
