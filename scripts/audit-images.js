const path = require('path');
const d = require(path.join(__dirname, '..', 'public', 'data', 'tourist-places.json'));
const states = {};
d.forEach(p => {
  if (!states[p.stateName]) states[p.stateName] = [];
  states[p.stateName].push(p.name);
});
Object.entries(states).sort((a,b) => a[0].localeCompare(b[0])).forEach(([s, ps]) => {
  console.log(`${s} (${ps.length}): ${ps.join(', ')}`);
});
console.log('\\nTOTAL DESTINATIONS:', d.length);

// Also check for duplicate heroImages
const heroMap = {};
const dupes = [];
d.forEach(p => {
  if (heroMap[p.heroImage]) {
    dupes.push(`DUPLICATE: "${p.name}" and "${heroMap[p.heroImage]}" share: ${p.heroImage}`);
  }
  heroMap[p.heroImage] = p.name;
});
console.log(`\\nUNIQUE hero images: ${Object.keys(heroMap).length}`);
console.log(`DUPLICATE hero images: ${dupes.length}`);
dupes.forEach(d => console.log(d));

// Check for Unsplash URLs
const unsplashCount = d.filter(p => p.heroImage && p.heroImage.includes('unsplash')).length;
console.log(`\\nDestinations using Unsplash hero images: ${unsplashCount} / ${d.length}`);
