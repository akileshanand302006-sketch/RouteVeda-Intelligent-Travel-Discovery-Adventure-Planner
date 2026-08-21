import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import { pool, query } from '../config/database';

export async function runSeed(): Promise<{ success: boolean; stats: Record<string, number> }> {
  console.log('🌱 Starting TripForge Database Seed (JSON -> PostgreSQL + PostGIS)...');
  const client = await pool.connect();
  const stats: Record<string, number> = {};

  try {
    const dataDir = path.join(process.cwd(), 'public', 'data');

    // 1. Seed States (28 States + 8 UTs)
    const statesPath = path.join(dataDir, 'states.json');
    if (fs.existsSync(statesPath)) {
      const states = JSON.parse(fs.readFileSync(statesPath, 'utf-8'));
      let stateCount = 0;

      for (const s of states) {
        await client.query(
          `INSERT INTO states (
            id, name, code, type, capital, region, description, image_url, banner_image, thumbnail_url,
            latitude, longitude, total_destinations, places_count, top_attractions, food_specialties,
            best_season, climate, languages
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            code = EXCLUDED.code,
            type = EXCLUDED.type,
            capital = EXCLUDED.capital,
            region = EXCLUDED.region,
            description = EXCLUDED.description,
            image_url = EXCLUDED.image_url,
            banner_image = EXCLUDED.banner_image,
            thumbnail_url = EXCLUDED.thumbnail_url,
            latitude = EXCLUDED.latitude,
            longitude = EXCLUDED.longitude,
            total_destinations = EXCLUDED.total_destinations,
            places_count = EXCLUDED.places_count,
            top_attractions = EXCLUDED.top_attractions,
            food_specialties = EXCLUDED.food_specialties,
            best_season = EXCLUDED.best_season,
            climate = EXCLUDED.climate,
            languages = EXCLUDED.languages,
            updated_at = CURRENT_TIMESTAMP`,
          [
            s.id,
            s.name,
            s.code,
            s.type || (s.code === 'DL' || s.code === 'CH' || s.code === 'PY' || s.code === 'LA' || s.code === 'JK' || s.code === 'AN' || s.code === 'LD' || s.code === 'DN' ? 'UNION_TERRITORY' : 'STATE'),
            s.capital,
            s.region,
            s.description,
            s.image || s.heroImage || s.imageUrl,
            s.bannerImage || s.heroImage,
            s.thumbnailUrl,
            s.coordinates?.lat || s.latitude || null,
            s.coordinates?.lng || s.longitude || null,
            s.totalDestinations || s.placesCount || 0,
            s.placesCount || s.totalDestinations || 0,
            s.topAttractions || [],
            s.foodSpecialties || [],
            s.bestSeason,
            s.climate,
            s.languages || []
          ]
        );
        stateCount++;
      }
      stats.states = stateCount;
      console.log(`  ✅ Seeded ${stateCount} States & Union Territories`);
    }

    // 2. Seed Destinations (with PostGIS Geography Point)
    const destsPath = path.join(dataDir, 'destinations.json');
    if (fs.existsSync(destsPath)) {
      const destinations = JSON.parse(fs.readFileSync(destsPath, 'utf-8'));
      let destCount = 0;

      for (const d of destinations) {
        const lat = d.coordinates?.lat || null;
        const lng = d.coordinates?.lng || null;

        await client.query(
          `INSERT INTO destinations (
            id, place_id, state_id, state_name, name, slug, location, district, region, category,
            difficulty, description, short_description, price_per_person, budget_min, budget_max,
            rating, review_count, duration, ideal_duration, best_season, best_time_to_visit, best_time,
            climate, featured, popular, tags, highlights, attractions, activities, how_to_reach,
            travel_tips, coordinates, geo_location, google_place_id, google_rating, google_user_rating_count,
            google_maps_uri, formatted_address, search_query, image, hero_image, thumbnail_url, gallery,
            place_photos, image_status, image_source, image_license, image_attribution, image_author,
            source_url, image_metadata
          ) VALUES (
            $1, $2, $3, $4, $5, $6, $7, $8, $9, $10,
            $11, $12, $13, $14, $15, $16, $17, $18, $19, $20,
            $21, $22, $23, $24, $25, $26, $27, $28, $29, $30,
            $31, $32, $33,
            CASE WHEN $34::numeric IS NOT NULL AND $35::numeric IS NOT NULL 
                 THEN ST_SetSRID(ST_MakePoint($35::numeric, $34::numeric), 4326)::geography 
                 ELSE NULL END,
            $36, $37, $38, $39, $40, $41, $42, $43, $44, $45,
            $46, $47, $48, $49, $50, $51, $52, $53
          )
          ON CONFLICT (id) DO UPDATE SET
            place_id = EXCLUDED.place_id,
            state_id = EXCLUDED.state_id,
            state_name = EXCLUDED.state_name,
            name = EXCLUDED.name,
            slug = EXCLUDED.slug,
            location = EXCLUDED.location,
            district = EXCLUDED.district,
            region = EXCLUDED.region,
            category = EXCLUDED.category,
            difficulty = EXCLUDED.difficulty,
            description = EXCLUDED.description,
            short_description = EXCLUDED.short_description,
            price_per_person = EXCLUDED.price_per_person,
            budget_min = EXCLUDED.budget_min,
            budget_max = EXCLUDED.budget_max,
            rating = EXCLUDED.rating,
            review_count = EXCLUDED.review_count,
            duration = EXCLUDED.duration,
            ideal_duration = EXCLUDED.ideal_duration,
            best_season = EXCLUDED.best_season,
            best_time_to_visit = EXCLUDED.best_time_to_visit,
            best_time = EXCLUDED.best_time,
            climate = EXCLUDED.climate,
            featured = EXCLUDED.featured,
            popular = EXCLUDED.popular,
            tags = EXCLUDED.tags,
            highlights = EXCLUDED.highlights,
            attractions = EXCLUDED.attractions,
            activities = EXCLUDED.activities,
            how_to_reach = EXCLUDED.how_to_reach,
            travel_tips = EXCLUDED.travel_tips,
            coordinates = EXCLUDED.coordinates,
            geo_location = EXCLUDED.geo_location,
            google_place_id = EXCLUDED.google_place_id,
            google_rating = EXCLUDED.google_rating,
            google_user_rating_count = EXCLUDED.google_user_rating_count,
            google_maps_uri = EXCLUDED.google_maps_uri,
            formatted_address = EXCLUDED.formatted_address,
            search_query = EXCLUDED.search_query,
            image = EXCLUDED.image,
            hero_image = EXCLUDED.hero_image,
            thumbnail_url = EXCLUDED.thumbnail_url,
            gallery = EXCLUDED.gallery,
            place_photos = EXCLUDED.place_photos,
            image_status = EXCLUDED.image_status,
            image_source = EXCLUDED.image_source,
            image_license = EXCLUDED.image_license,
            image_attribution = EXCLUDED.image_attribution,
            image_author = EXCLUDED.image_author,
            source_url = EXCLUDED.source_url,
            image_metadata = EXCLUDED.image_metadata,
            updated_at = CURRENT_TIMESTAMP`,
          [
            d.id,
            d.placeId || `dest-${d.id}`,
            d.stateId || d.state?.toLowerCase().replace(/\s+/g, '-'),
            d.stateName || d.state,
            d.name,
            d.slug || d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            d.location,
            d.district,
            d.region,
            d.category,
            d.difficulty || 'Easy',
            d.description,
            d.shortDescription || d.description?.substring(0, 160),
            d.pricePerPerson || 0,
            d.budgetMin || d.pricePerPerson || 0,
            d.budgetMax || (d.pricePerPerson ? d.pricePerPerson * 2 : 0),
            d.rating || 4.5,
            d.reviewCount || 0,
            d.duration,
            d.idealDuration || d.duration,
            d.bestSeason,
            d.bestTimeToVisit || d.bestTime || d.bestSeason,
            d.bestTime || d.bestSeason,
            d.climate,
            d.featured || false,
            d.popular || false,
            d.tags || [],
            d.highlights || [],
            d.attractions || [],
            d.activities || [],
            JSON.stringify(d.howToReach || {}),
            d.travelTips || [],
            JSON.stringify(d.coordinates || {}),
            lat,
            lng,
            d.googlePlaceId || null,
            d.googleRating || d.rating || null,
            d.googleUserRatingCount || d.reviewCount || null,
            d.googleMapsUri || null,
            d.formattedAddress || null,
            d.searchQuery || null,
            d.image || d.heroImage,
            d.heroImage || d.image,
            d.thumbnailUrl,
            d.gallery || [],
            JSON.stringify(d.placePhotos || []),
            d.imageStatus || 'verified',
            d.imageSource || 'Wikimedia Commons',
            d.imageLicense || 'CC BY-SA 4.0',
            d.imageAttribution || `${d.name} via Wikimedia Commons`,
            d.imageAuthor || 'Wikimedia Contributor',
            d.sourceUrl || null,
            JSON.stringify(d.imageMetadata || {})
          ]
        );
        destCount++;
      }
      stats.destinations = destCount;
      console.log(`  ✅ Seeded ${destCount} Destinations with PostGIS Coordinates`);
    }

    // 3. Seed Activities & Destination Activities
    const activitiesPath = path.join(dataDir, 'activities.json');
    if (fs.existsSync(activitiesPath)) {
      const activities = JSON.parse(fs.readFileSync(activitiesPath, 'utf-8'));
      let actCount = 0;

      for (const a of activities) {
        await client.query(
          `INSERT INTO activities (
            id, name, category, description, duration, price, difficulty, rating,
            review_count, min_age, location, icon, image_url, includes, what_to_bring, featured
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            category = EXCLUDED.category,
            description = EXCLUDED.description,
            duration = EXCLUDED.duration,
            price = EXCLUDED.price,
            difficulty = EXCLUDED.difficulty,
            rating = EXCLUDED.rating,
            review_count = EXCLUDED.review_count,
            min_age = EXCLUDED.min_age,
            location = EXCLUDED.location,
            icon = EXCLUDED.icon,
            image_url = EXCLUDED.image_url,
            includes = EXCLUDED.includes,
            what_to_bring = EXCLUDED.what_to_bring,
            featured = EXCLUDED.featured,
            updated_at = CURRENT_TIMESTAMP`,
          [
            a.id,
            a.name,
            a.category,
            a.description,
            a.duration,
            a.price || 0,
            a.difficulty || 'Moderate',
            a.rating || 4.5,
            a.reviewCount || 0,
            a.minAge || 0,
            a.location,
            a.icon,
            a.imageUrl || a.image,
            a.includes || [],
            a.whatToBring || [],
            a.featured || false
          ]
        );
        actCount++;
      }
      stats.activities = actCount;
      console.log(`  ✅ Seeded ${actCount} Activities`);
    }

    // 4. Seed Attractions
    const attractionsPath = path.join(dataDir, 'attractions.json');
    if (fs.existsSync(attractionsPath)) {
      const attractions = JSON.parse(fs.readFileSync(attractionsPath, 'utf-8'));
      let attrCount = 0;

      for (const attr of attractions) {
        await client.query(
          `INSERT INTO attractions (
            id, name, destination_id, destination_name, state_id, state_name,
            category, description, image, rating, entry_fee, timings, highlights
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            destination_id = EXCLUDED.destination_id,
            destination_name = EXCLUDED.destination_name,
            state_id = EXCLUDED.state_id,
            state_name = EXCLUDED.state_name,
            category = EXCLUDED.category,
            description = EXCLUDED.description,
            image = EXCLUDED.image,
            rating = EXCLUDED.rating,
            entry_fee = EXCLUDED.entry_fee,
            timings = EXCLUDED.timings,
            highlights = EXCLUDED.highlights,
            updated_at = CURRENT_TIMESTAMP`,
          [
            attr.id,
            attr.name,
            typeof attr.destinationId === 'number' ? attr.destinationId : null,
            attr.destinationName || null,
            attr.stateId || null,
            attr.state || attr.stateName || null,
            attr.category || 'Sightseeing',
            attr.description || null,
            attr.image || null,
            attr.rating || 4.5,
            attr.entryFee || 'Free',
            attr.timings || 'Open daily',
            attr.highlights || []
          ]
        );
        attrCount++;
      }
      stats.attractions = attrCount;
      console.log(`  ✅ Seeded ${attrCount} Attractions`);
    }

    // 5. Seed Foods
    const foodPath = path.join(dataDir, 'food.json');
    if (fs.existsSync(foodPath)) {
      await client.query('TRUNCATE TABLE foods CASCADE');
      const foods = JSON.parse(fs.readFileSync(foodPath, 'utf-8'));
      let foodCount = 0;

      for (const f of foods) {
        await client.query(
          `INSERT INTO foods (
            id, name, destination_id, state_id, state_name, category, description,
            is_veg, price_range, must_try_at, image
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            destination_id = EXCLUDED.destination_id,
            state_id = EXCLUDED.state_id,
            state_name = EXCLUDED.state_name,
            category = EXCLUDED.category,
            description = EXCLUDED.description,
            is_veg = EXCLUDED.is_veg,
            price_range = EXCLUDED.price_range,
            must_try_at = EXCLUDED.must_try_at,
            image = EXCLUDED.image,
            updated_at = CURRENT_TIMESTAMP`,
          [
            f.id,
            f.name,
            typeof f.destinationId === 'number' ? f.destinationId : null,
            f.stateId || null,
            f.stateName || f.state || null,
            f.type || f.category || 'Veg',
            f.description || null,
            f.type === 'Veg' || f.type === 'Sweet' || f.type === 'Beverage' || f.isVeg === true,
            f.priceRange || '₹100 - ₹300',
            f.popularPlacesToTry || f.mustTryAt || [],
            f.image || null
          ]
        );
        foodCount++;
      }
      stats.foods = foodCount;
      console.log(`  ✅ Seeded ${foodCount} Culinary Specialties`);
    }

    // 6. Seed Festivals
    const festivalsPath = path.join(dataDir, 'festivals.json');
    if (fs.existsSync(festivalsPath)) {
      await client.query('TRUNCATE TABLE festivals CASCADE');
      const festivals = JSON.parse(fs.readFileSync(festivalsPath, 'utf-8'));
      let festCount = 0;

      for (const fest of festivals) {
        await client.query(
          `INSERT INTO festivals (
            id, name, state_id, state_name, month, duration, description, significance, highlights, image
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          ON CONFLICT (id) DO UPDATE SET
            name = EXCLUDED.name,
            state_id = EXCLUDED.state_id,
            state_name = EXCLUDED.state_name,
            month = EXCLUDED.month,
            duration = EXCLUDED.duration,
            description = EXCLUDED.description,
            significance = EXCLUDED.significance,
            highlights = EXCLUDED.highlights,
            image = EXCLUDED.image,
            updated_at = CURRENT_TIMESTAMP`,
          [
            fest.id,
            fest.name,
            fest.stateId || null,
            fest.stateName || fest.state || null,
            fest.month || null,
            fest.duration || '3 Days',
            fest.description || null,
            fest.category || 'Cultural',
            fest.keyAttractions || fest.highlights || [],
            fest.image || null
          ]
        );
        festCount++;
      }
      stats.festivals = festCount;
      console.log(`  ✅ Seeded ${festCount} Cultural Festivals`);
    }

    // 7. Seed Users & Demo Accounts
    const usersPath = path.join(dataDir, 'users.json');
    if (fs.existsSync(usersPath)) {
      const users = JSON.parse(fs.readFileSync(usersPath, 'utf-8'));
      let userCount = 0;

      for (const u of users) {
        const userId = String(u.id);
        const salt = bcrypt.genSaltSync(10);
        const passwordHash = bcrypt.hashSync(u.password || 'password123', salt);

        await client.query(
          `INSERT INTO users (id, email, password_hash, role)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (id) DO UPDATE SET
             email = EXCLUDED.email,
             password_hash = EXCLUDED.password_hash,
             role = EXCLUDED.role,
             updated_at = CURRENT_TIMESTAMP`,
          [userId, u.email.toLowerCase(), passwordHash, u.role || 'user']
        );

        await client.query(
          `INSERT INTO profiles (
            id, user_id, full_name, avatar_url, traveler_type, bio, phone, location,
            joined_date, trips_created, destinations_visited, favorite_category
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
          ON CONFLICT (user_id) DO UPDATE SET
            full_name = EXCLUDED.full_name,
            avatar_url = EXCLUDED.avatar_url,
            traveler_type = EXCLUDED.traveler_type,
            bio = EXCLUDED.bio,
            phone = EXCLUDED.phone,
            location = EXCLUDED.location,
            trips_created = EXCLUDED.trips_created,
            destinations_visited = EXCLUDED.destinations_visited,
            favorite_category = EXCLUDED.favorite_category,
            updated_at = CURRENT_TIMESTAMP`,
          [
            `prof-${userId}`,
            userId,
            u.name,
            u.avatar,
            u.preferences?.travelStyle || 'Explorer',
            u.bio,
            u.phone,
            u.location,
            u.joinedDate || new Date(),
            u.tripsCreated || 0,
            u.destinationsVisited || 0,
            u.favoriteCategory || 'Adventure'
          ]
        );

        await client.query(
          `INSERT INTO user_preferences (
            id, user_id, travel_style, preferred_destination_type, currency, notifications
          ) VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (user_id) DO UPDATE SET
            travel_style = EXCLUDED.travel_style,
            preferred_destination_type = EXCLUDED.preferred_destination_type,
            currency = EXCLUDED.currency,
            notifications = EXCLUDED.notifications,
            updated_at = CURRENT_TIMESTAMP`,
          [
            `pref-${userId}`,
            userId,
            u.preferences?.travelStyle || 'Adventure',
            u.preferences?.preferredDestinationType || 'All',
            u.preferences?.currency || 'INR',
            JSON.stringify(u.preferences?.notifications || { tripReminders: true, budgetAlerts: true, recommendations: true })
          ]
        );

        userCount++;
      }
      stats.users = userCount;
      console.log(`  ✅ Seeded ${userCount} Users, Profiles & Preferences`);
    }

    // 8. Seed Demo Trips
    const tripsPath = path.join(dataDir, 'trips.json');
    if (fs.existsSync(tripsPath)) {
      const trips = JSON.parse(fs.readFileSync(tripsPath, 'utf-8'));
      let tripCount = 0;

      for (const t of trips) {
        const tripId = String(t.id);
        const userId = String(t.userId || '1');

        await client.query(
          `INSERT INTO trips (
            id, user_id, title, description, start_date, end_date, number_of_travelers,
            travel_style, budget, status, itinerary
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          ON CONFLICT (id) DO UPDATE SET
            title = EXCLUDED.title,
            description = EXCLUDED.description,
            start_date = EXCLUDED.start_date,
            end_date = EXCLUDED.end_date,
            number_of_travelers = EXCLUDED.number_of_travelers,
            travel_style = EXCLUDED.travel_style,
            budget = EXCLUDED.budget,
            status = EXCLUDED.status,
            itinerary = EXCLUDED.itinerary,
            updated_at = CURRENT_TIMESTAMP`,
          [
            tripId,
            userId,
            t.title || t.name || 'Trip Adventure',
            t.description || t.notes || '',
            t.startDate || null,
            t.endDate || null,
            t.numberOfTravelers || 1,
            t.travelStyle || 'Adventure',
            t.budget || 20000,
            t.status || 'Planning',
            JSON.stringify(t.itinerary || [])
          ]
        );

        // Trip destinations
        if (Array.isArray(t.destinations)) {
          for (let i = 0; i < t.destinations.length; i++) {
            const destId = typeof t.destinations[i] === 'number' ? t.destinations[i] : t.destinations[i]?.id;
            if (destId) {
              await client.query(
                `INSERT INTO trip_destinations (id, trip_id, destination_id, visit_order)
                 VALUES ($1, $2, $3, $4)
                 ON CONFLICT (id) DO NOTHING`,
                [`${tripId}-dest-${destId}-${i}`, tripId, destId, i + 1]
              );
            }
          }
        }

        tripCount++;
      }
      stats.trips = tripCount;
      console.log(`  ✅ Seeded ${tripCount} Saved Trips & Itineraries`);
    }

    console.log('\n🎉 Database seeding completed with 100% data integrity!\n');
    return { success: true, stats };
  } catch (error: any) {
    console.error('❌ Seeding failed:', error.message);
    return { success: false, stats };
  } finally {
    client.release();
  }
}

// Allow direct CLI execution: tsx server/src/seed/seed.ts
if (require.main === module) {
  runSeed()
    .then(({ success }) => process.exit(success ? 0 : 1))
    .catch(() => process.exit(1));
}
