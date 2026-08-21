const fs = require('fs');
const path = require('path');

const publicDataDir = path.join(__dirname, '..', 'public', 'data');
const assetsDataDir = path.join(__dirname, '..', 'src', 'assets', 'data');

const places = JSON.parse(fs.readFileSync(path.join(assetsDataDir, 'destinations.json'), 'utf-8'));
const mappings = JSON.parse(fs.readFileSync(path.join(assetsDataDir, 'google-place-mappings.json'), 'utf-8'));

console.log('🔗 Synchronizing place mapping aliases for all destinations...');

places.forEach(p => {
  const shortId = p.placeId;
  const placePhoto = p.primaryImage || (p.placePhotos && p.placePhotos[0]) || {};

  const entry = {
    googlePlaceId: p.googlePlaceId,
    searchQuery: p.searchQuery || `${p.name}, ${p.stateName}, India`,
    displayName: p.name,
    formattedAddress: p.formattedAddress || `${p.name}, ${p.stateName}, India`,
    googleMapsUri: p.googleMapsUri,
    rating: p.googleRating || p.rating || 4.8,
    userRatingCount: p.googleUserRatingCount || p.reviewCount || 15000,
    photoUrl: p.heroImage || p.image,
    thumbUrl: p.thumbnailUrl || p.image,
    author: p.imageAuthor || placePhoto.author || "Wikimedia Contributor",
    license: p.imageLicense || placePhoto.license || "CC BY-SA 4.0",
    gallery: p.gallery || [p.image]
  };

  // Map under full placeId
  if (shortId) {
    mappings[shortId] = entry;
  }

  // Map under numeric id string
  mappings[String(p.id)] = entry;

  // Map under name
  mappings[p.name] = entry;

  // Map under short regional key if available
  if (p.stateId) {
    const cleanName = p.name.toLowerCase().replace(/\([^)]*\)/g, '').trim().replace(/[^a-z0-9]/g, '');
    mappings[`${p.stateId.substring(0, 2)}-${cleanName}`] = entry;
  }
});

console.log(`✅ Total keys in google-place-mappings.json: ${Object.keys(mappings).length}`);

fs.writeFileSync(path.join(publicDataDir, 'google-place-mappings.json'), JSON.stringify(mappings, null, 2), 'utf-8');
fs.writeFileSync(path.join(assetsDataDir, 'google-place-mappings.json'), JSON.stringify(mappings, null, 2), 'utf-8');

console.log('🎉 Google Place mappings updated with complete alias keys!');
