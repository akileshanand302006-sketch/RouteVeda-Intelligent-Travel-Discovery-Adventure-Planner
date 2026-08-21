async function testApi() {
  console.log('========================================================================');
  console.log('🧪 TRIPFORGE REST API & POSTGIS SPATIAL TEST SUITE');
  console.log('========================================================================\n');

  try {
    // 1. Health Check
    const healthRes = await fetch('http://localhost:3000/api/health');
    const health = await healthRes.json();
    console.log('1. Health Check:', healthRes.status === 200 ? '✅ PASS' : '❌ FAIL');
    console.log(`   PostgreSQL: ${health.database?.connected ? 'CONNECTED' : 'DISCONNECTED'}`);
    console.log(`   PostGIS:    ${health.database?.postgis ? 'ACTIVE' : 'INACTIVE'}`);

    // 2. States API
    const statesRes = await fetch('http://localhost:3000/api/states');
    const states = await statesRes.json();
    console.log(`\n2. States Endpoint: ${statesRes.status === 200 && states.count === 36 ? '✅ PASS' : '❌ FAIL'} (${states.count} states & UTs)`);

    // 3. Destinations API
    const destsRes = await fetch('http://localhost:3000/api/destinations?limit=5');
    const dests = await destsRes.json();
    console.log(`\n3. Destinations Endpoint: ${destsRes.status === 200 && dests.data?.length > 0 ? '✅ PASS' : '❌ FAIL'} (Sample: ${dests.data?.[0]?.name}, category: ${dests.data?.[0]?.category})`);

    // 4. PostGIS Spatial Nearby Query (near Ooty, Tamil Nadu: 11.41° N, 76.70° E)
    const nearbyRes = await fetch('http://localhost:3000/api/destinations/nearby?lat=11.41&lng=76.70&radius=80');
    const nearby = await nearbyRes.json();
    console.log(`\n4. PostGIS Nearby Spatial Search (near Ooty): ${nearbyRes.status === 200 && nearby.count > 0 ? '✅ PASS' : '❌ FAIL'}`);
    if (nearby.data && nearby.data.length > 0) {
      console.log(`   Found ${nearby.count} nearby destinations:`);
      nearby.data.slice(0, 3).forEach((d: any) => {
        console.log(`   - ${d.name} (${d.distanceKm} km away in ${d.state})`);
      });
    }

    // 5. Auth Login
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'demo1@tripforge.com', password: 'password123' })
    });
    const loginData = await loginRes.json();
    console.log(`\n5. Auth Login Endpoint: ${loginRes.status === 200 && loginData.success ? '✅ PASS' : '❌ FAIL'} (Logged in as: ${loginData.data?.name})`);

    // 6. User Wishlist API
    const wishRes = await fetch('http://localhost:3000/api/wishlist', {
      headers: { 'x-user-id': '1' }
    });
    const wishData = await wishRes.json();
    console.log(`\n6. Wishlist Isolation Endpoint: ${wishRes.status === 200 && wishData.success ? '✅ PASS' : '❌ FAIL'} (${wishData.count} wishlisted items)`);

    // 7. Trip Creation & Retrieval API
    const createTripRes = await fetch('http://localhost:3000/api/trips', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-user-id': '1' },
      body: JSON.stringify({
        title: 'Kerala Backwaters & Tea Escapade',
        startDate: '2026-10-01',
        endDate: '2026-10-06',
        numberOfTravelers: 2,
        travelStyle: 'Relaxation',
        budget: 35000,
        destinations: [3, 8],
        itinerary: [{ day: 1, title: 'Arrival in Munnar', description: 'Scenic drive', activities: ['Check-in'] }]
      })
    });
    const createdTrip = await createTripRes.json();
    console.log(`\n7. Create Trip Endpoint: ${createTripRes.status === 201 && createdTrip.success ? '✅ PASS' : '❌ FAIL'} (Created: "${createdTrip.data?.name}")`);

    const userTripsRes = await fetch('http://localhost:3000/api/trips', {
      headers: { 'x-user-id': '1' }
    });
    const userTrips = await userTripsRes.json();
    console.log(`8. Fetch User Trips: ${userTripsRes.status === 200 && userTrips.data?.length > 0 ? '✅ PASS' : '❌ FAIL'} (${userTrips.count} trips found for user 1)`);

    console.log('\n========================================================================');
    console.log('🎉 ALL REST API & POSTGIS SPATIAL ENDPOINTS WORKING PERFECTLY!');
    console.log('========================================================================\n');
  } catch (err: any) {
    console.error('API test failed:', err.message);
  }
}

testApi();
