const path = require('path');
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

let total = 0;
files.forEach(f => {
  const ps = require(path.join(__dirname, f));
  console.log(`=== ${f} (${ps.length}) ===`);
  ps.forEach(p => console.log(`  "${p.name}"`));
  total += ps.length;
});
console.log(`TOTAL: ${total}`);
