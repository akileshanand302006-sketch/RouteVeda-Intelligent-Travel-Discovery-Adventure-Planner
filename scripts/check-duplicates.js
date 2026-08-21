const fs = require('fs');
const path = require('path');
const d = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'data', 'destinations.json'), 'utf-8'));
const map = {};
d.forEach(p => {
  const img = p.heroImage;
  if (!map[img]) map[img] = [];
  map[img].push(p.name);
});
const duplicates = Object.entries(map).filter(([k, v]) => v.length > 1);
console.log('Total destinations:', d.length);
console.log('Total unique hero images:', Object.keys(map).length);
console.log('Total duplicate image URLs:', duplicates.length);
duplicates.forEach(([k, v]) => {
  console.log(`\nURL: ${k}`);
  console.log(` Used by (${v.length} places):`, v.join(' | '));
});
