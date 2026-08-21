const fs = require('fs');
const path = require('path');
const { verifiedMasterMap } = require('./verified-wikimedia-master-database');

const files = [
  'data-south.js',
  'data-south-extended.js',
  'data-west.js',
  'data-west-extended.js',
  'data-north.js',
  'data-north-extended.js',
  'data-north-uts.js',
  'data-east.js',
  'data-central.js',
  'data-northeast.js',
  'data-northeast-extended.js'
];

let totalUpdated = 0;
let missingKeys = [];

files.forEach(filename => {
  const filePath = path.join(__dirname, filename);
  const places = require(filePath);
  
  const updatedPlaces = places.map(place => {
    const wm = verifiedMasterMap[place.name];
    if (!wm) {
      missingKeys.push(`${place.name} in ${filename}`);
      return place;
    }
    totalUpdated++;
    return {
      ...place,
      heroImage: wm.heroImage,
      gallery: wm.gallery,
      imageSource: wm.imageSource,
      imageLicense: wm.imageLicense,
      imageAttribution: wm.imageAttribution,
      imageAuthor: wm.imageAuthor,
      sourceUrl: wm.sourceUrl,
      imageMetadata: wm.imageMetadata
    };
  });

  const content = `// ${filename.replace('.js', '').toUpperCase()} - 100% Verified Wikimedia Commons Photography
module.exports = ${JSON.stringify(updatedPlaces, null, 2)};
`;
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Updated ${filename} with ${updatedPlaces.length} verified places.`);
});

console.log(`\n🎉 Total Places Updated: ${totalUpdated} / 247`);
if (missingKeys.length > 0) {
  console.error(`⚠️ Missing keys:`, missingKeys);
}
