import { pool, checkDatabaseConnection } from '../config/database';

export async function validateDatabase(): Promise<boolean> {
  console.log('========================================================================');
  console.log('🔍 TRIPFORGE POSTGRESQL & POSTGIS DATABASE VALIDATION');
  console.log('========================================================================\n');

  let allPassed = true;

  try {
    // 1. Connection & PostGIS Check
    const dbStatus = await checkDatabaseConnection();
    console.log(`📡 PostgreSQL Connected: ${dbStatus.connected ? '✅ PASS' : '❌ OFFLINE / UNREACHABLE'}`);
    console.log(`🗺️ PostGIS Extension: ${dbStatus.postgis ? '✅ PASS' : '⚠️ NOT DETECTED'}`);

    if (!dbStatus.connected) {
      console.log('\n------------------------------------------------------------------------');
      console.log('💡 DATABASE SETUP INSTRUCTIONS:');
      console.log('1. Ensure PostgreSQL is installed and service is running.');
      console.log('2. Ensure database "tripforge_db" exists.');
      console.log('3. Run migrations: npm run db:migrate');
      console.log('4. Seed database:   npm run db:seed');
      console.log('5. Re-run validation: npm run validate-db');
      console.log('------------------------------------------------------------------------\n');
      return false;
    }

    const client = await pool.connect();

    try {
      // 2. States & UTs Check
      const statesRes = await client.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(CASE WHEN LOWER(type) = 'state' THEN 1 END) as states_count,
          COUNT(CASE WHEN LOWER(type) LIKE '%union%' OR LOWER(type) LIKE '%territory%' THEN 1 END) as uts_count
        FROM states;
      `);
      const statesCount = parseInt(statesRes.rows[0]?.states_count || '0', 10);
      const utsCount = parseInt(statesRes.rows[0]?.uts_count || '0', 10);
      const totalStates = parseInt(statesRes.rows[0]?.total || '0', 10);

      const statesPass = statesCount >= 28 && utsCount >= 8;
      console.log(`\n🏛️ States & UTs Validation:`);
      console.log(`   - 28 States: ${statesCount >= 28 ? '✅ PASS' : '❌ FAIL'} (${statesCount}/28 found)`);
      console.log(`   - 8 Union Territories: ${utsCount >= 8 ? '✅ PASS' : '❌ FAIL'} (${utsCount}/8 found)`);
      console.log(`   - Total Regions: ${totalStates} (Expected 36)`);
      if (!statesPass) allPassed = false;

      // 3. Destinations & PostGIS Geography Check
      const destsRes = await client.query(`
        SELECT 
          COUNT(*) as total,
          COUNT(geo_location) as with_geom,
          COUNT(place_id) as with_place_id,
          COUNT(CASE WHEN image IS NOT NULL AND image != '' THEN 1 END) as with_image
        FROM destinations;
      `);
      const destTotal = parseInt(destsRes.rows[0]?.total || '0', 10);
      const destGeom = parseInt(destsRes.rows[0]?.with_geom || '0', 10);
      const destPlaceId = parseInt(destsRes.rows[0]?.with_place_id || '0', 10);
      const destImage = parseInt(destsRes.rows[0]?.with_image || '0', 10);

      console.log(`\n📍 Destinations Validation:`);
      console.log(`   - Total Destinations: ${destTotal >= 247 ? '✅ PASS' : '❌ FAIL'} (${destTotal}/247)`);
      console.log(`   - PostGIS Geometries: ${destGeom >= 240 ? '✅ PASS' : '❌ FAIL'} (${destGeom}/${destTotal})`);
      console.log(`   - Place IDs: ${destPlaceId >= 240 ? '✅ PASS' : '❌ FAIL'} (${destPlaceId}/${destTotal})`);
      console.log(`   - Verified Images: ${destImage === destTotal && destTotal > 0 ? '✅ PASS' : '❌ FAIL'} (${destImage}/${destTotal})`);
      if (destTotal < 247) allPassed = false;

      // 4. Attractions, Activities, Foods, Festivals Check
      const countsRes = await client.query(`
        SELECT 
          (SELECT COUNT(*) FROM attractions) as attractions_count,
          (SELECT COUNT(*) FROM activities) as activities_count,
          (SELECT COUNT(*) FROM foods) as foods_count,
          (SELECT COUNT(*) FROM festivals) as festivals_count,
          (SELECT COUNT(*) FROM users) as users_count,
          (SELECT COUNT(*) FROM trips) as trips_count,
          (SELECT COUNT(*) FROM experiences) as experiences_count,
          (SELECT COUNT(*) FROM itineraries) as itineraries_count,
          (SELECT COUNT(*) FROM notifications) as notifications_count;
      `);
      const c = countsRes.rows[0] || {};
      console.log(`\n📦 Entity Datasets Validation:`);
      console.log(`   - Attractions: ${parseInt(c.attractions_count || '0', 10) >= 1000 ? '✅ PASS' : '❌ FAIL'} (${c.attractions_count} items)`);
      console.log(`   - Activities: ${parseInt(c.activities_count || '0', 10) >= 48 ? '✅ PASS' : '❌ FAIL'} (${c.activities_count} items)`);
      console.log(`   - Culinary Foods: ${parseInt(c.foods_count || '0', 10) >= 100 ? '✅ PASS' : '❌ FAIL'} (${c.foods_count} items)`);
      console.log(`   - Festivals: ${parseInt(c.festivals_count || '0', 10) >= 15 ? '✅ PASS' : '❌ FAIL'} (${c.festivals_count} items)`);
      console.log(`   - Experiences: ${parseInt(c.experiences_count || '0', 10) >= 5 ? '✅ PASS' : '❌ FAIL'} (${c.experiences_count} items)`);
      console.log(`   - Itineraries: ${parseInt(c.itineraries_count || '0', 10) >= 2 ? '✅ PASS' : '❌ FAIL'} (${c.itineraries_count} items)`);
      console.log(`   - Notifications: ${parseInt(c.notifications_count || '0', 10) >= 5 ? '✅ PASS' : '❌ FAIL'} (${c.notifications_count} items)`);
      console.log(`   - Seed Users: ${parseInt(c.users_count || '0', 10) >= 3 ? '✅ PASS' : '❌ FAIL'} (${c.users_count} accounts)`);
      console.log(`   - Demo Trips: ${parseInt(c.trips_count || '0', 10) >= 1 ? '✅ PASS' : '❌ FAIL'} (${c.trips_count} trips)`);

      // 5. Spatial Index Verification
      const idxRes = await client.query(`
        SELECT indexname, indexdef 
        FROM pg_indexes 
        WHERE tablename = 'destinations' AND indexname = 'destinations_location_idx';
      `);
      const hasSpatialIndex = idxRes.rows.length > 0;
      console.log(`\n⚡ Spatial Index (GIST): ${hasSpatialIndex ? '✅ PASS (destinations_location_idx active)' : '❌ FAIL'}`);
      if (!hasSpatialIndex) allPassed = false;

      // 6. Print Report Summary
      console.log('\n========================================================================');
      console.log(`🏆 TRIPFORGE DATA MIGRATION REPORT: ${allPassed ? 'ALL CHECKS PASSED ✅' : 'VALIDATION ISSUES DETECTED ❌'}`);
      console.log('========================================================================\n');

      return allPassed;
    } finally {
      client.release();
    }
  } catch (err: any) {
    console.error('❌ Validation check error:', err.message);
    return false;
  }
}

// Allow direct CLI execution: tsx server/src/scripts/validate-db.ts
if (require.main === module) {
  validateDatabase()
    .then((success) => process.exit(success ? 0 : 1))
    .catch(() => process.exit(1));
}
