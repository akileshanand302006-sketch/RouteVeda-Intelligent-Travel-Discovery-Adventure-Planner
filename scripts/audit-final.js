const fs = require('fs');
const path = require('path');
const https = require('https');

const destinations = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'public', 'data', 'destinations.json'), 'utf-8'));

function check(url) {
  return new Promise((resolve) => {
    if (!url) return resolve(false);
    const req = https.get(url, { headers: { 'User-Agent': 'TripForgeApp/1.0 (contact@tripforge.app)' } }, (res) => {
      resolve(res.statusCode === 200 || res.statusCode === 301 || res.statusCode === 302 || res.statusCode === 304);
    });
    req.on('error', () => resolve(false));
    req.setTimeout(4000, () => { req.destroy(); resolve(false); });
  });
}

async function audit() {
  console.log(`Auditing ${destinations.length} destination image URLs...`);
  let ok = 0;
  let fail = 0;
  const failed = [];
  
  for (let i = 0; i < destinations.length; i += 25) {
    const chunk = destinations.slice(i, i + 25);
    const results = await Promise.all(chunk.map(async p => {
      const isOk = await check(p.thumbnailUrl);
      return { p, isOk };
    }));
    results.forEach(r => {
      if (r.isOk) ok++;
      else {
        fail++;
        failed.push({ name: r.p.name, url: r.p.thumbnailUrl });
      }
    });
  }
  console.log('\n====================================================');
  console.log('🏁 FINAL AUDIT RESULTS:');
  console.log('====================================================');
  console.log(`✅ Working Images: ${ok} / ${destinations.length} (${((ok / destinations.length) * 100).toFixed(1)}%)`);
  console.log(`❌ Failed Images: ${fail}`);
  if (failed.length > 0) {
    console.log('Failed items:');
    failed.forEach(f => console.log(` - ${f.name}: ${f.url}`));
  }
  console.log('====================================================\n');
}

audit().catch(console.error);
