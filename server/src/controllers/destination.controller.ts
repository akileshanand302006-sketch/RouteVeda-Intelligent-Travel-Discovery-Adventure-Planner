import { Request, Response } from 'express';
import { query } from '../config/database';

function mapDestinationRow(row: any) {
  return {
    id: row.id,
    placeId: row.place_id,
    stateId: row.state_id,
    state: row.state_name,
    stateName: row.state_name,
    name: row.name,
    slug: row.slug,
    location: row.location,
    district: row.district,
    region: row.region,
    category: row.category,
    difficulty: row.difficulty,
    description: row.description,
    shortDescription: row.short_description,
    pricePerPerson: Number(row.price_per_person) || 0,
    budgetMin: Number(row.budget_min) || Number(row.price_per_person) || 0,
    budgetMax: Number(row.budget_max) || (Number(row.price_per_person) * 2) || 0,
    rating: Number(row.rating) || 4.5,
    reviewCount: Number(row.review_count) || 0,
    duration: row.duration,
    idealDuration: row.ideal_duration || row.duration,
    bestSeason: row.best_season,
    bestTimeToVisit: row.best_time_to_visit || row.best_time || row.best_season,
    bestTime: row.best_time || row.best_season,
    climate: row.climate,
    featured: Boolean(row.featured),
    popular: Boolean(row.popular),
    tags: row.tags || [],
    highlights: row.highlights || [],
    attractions: row.attractions || [],
    activities: row.activities || [],
    howToReach: typeof row.how_to_reach === 'string' ? JSON.parse(row.how_to_reach) : (row.how_to_reach || {}),
    travelTips: row.travel_tips || [],
    coordinates: typeof row.coordinates === 'string' ? JSON.parse(row.coordinates) : (row.coordinates || {}),
    googlePlaceId: row.google_place_id,
    googleRating: row.google_rating ? Number(row.google_rating) : Number(row.rating),
    googleUserRatingCount: row.google_user_rating_count ? Number(row.google_user_rating_count) : Number(row.review_count),
    googleMapsUri: row.google_maps_uri,
    formattedAddress: row.formatted_address,
    searchQuery: row.search_query,
    image: row.image || row.hero_image,
    heroImage: row.hero_image || row.image,
    thumbnailUrl: row.thumbnail_url,
    gallery: row.gallery || [],
    placePhotos: typeof row.place_photos === 'string' ? JSON.parse(row.place_photos) : (row.place_photos || []),
    imageStatus: row.image_status || 'verified',
    imageSource: row.image_source || 'Wikimedia Commons',
    imageLicense: row.image_license || 'CC BY-SA 4.0',
    imageAttribution: row.image_attribution,
    imageAuthor: row.image_author,
    sourceUrl: row.source_url,
    imageMetadata: typeof row.image_metadata === 'string' ? JSON.parse(row.image_metadata) : (row.image_metadata || {}),
    distanceKm: row.distance_km ? Number(Number(row.distance_km).toFixed(1)) : undefined
  };
}

export async function getDestinations(req: Request, res: Response): Promise<void> {
  try {
    const {
      state,
      region,
      category,
      difficulty,
      maxPrice,
      minRating,
      featured,
      search,
      sort,
      page,
      limit
    } = req.query;

    const conditions: string[] = [];
    const params: any[] = [];
    let paramIndex = 1;

    if (state && typeof state === 'string' && state !== 'All') {
      conditions.push(`(LOWER(state_name) = LOWER($${paramIndex}) OR LOWER(state_id) = LOWER($${paramIndex}))`);
      params.push(state.trim());
      paramIndex++;
    }

    if (region && typeof region === 'string' && region !== 'All') {
      conditions.push(`region = $${paramIndex}`);
      params.push(region);
      paramIndex++;
    }

    if (category && typeof category === 'string' && category !== '') {
      conditions.push(`category = $${paramIndex}`);
      params.push(category);
      paramIndex++;
    }

    if (difficulty && typeof difficulty === 'string' && difficulty !== '') {
      conditions.push(`difficulty = $${paramIndex}`);
      params.push(difficulty);
      paramIndex++;
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      conditions.push(`price_per_person <= $${paramIndex}`);
      params.push(Number(maxPrice));
      paramIndex++;
    }

    if (minRating && !isNaN(Number(minRating))) {
      conditions.push(`rating >= $${paramIndex}`);
      params.push(Number(minRating));
      paramIndex++;
    }

    if (featured === 'true') {
      conditions.push(`featured = TRUE`);
    }

    if (search && typeof search === 'string' && search.trim() !== '') {
      const term = `%${search.trim().toLowerCase()}%`;
      conditions.push(
        `(LOWER(name) LIKE $${paramIndex} OR LOWER(location) LIKE $${paramIndex} OR LOWER(state_name) LIKE $${paramIndex} OR LOWER(district) LIKE $${paramIndex} OR $${paramIndex + 1} = ANY(tags))`
      );
      params.push(term);
      params.push(search.trim());
      paramIndex += 2;
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    let orderBy = 'ORDER BY (CASE WHEN featured THEN 1 ELSE 0 END) DESC, rating DESC';
    if (sort === 'rating') {
      orderBy = 'ORDER BY rating DESC';
    } else if (sort === 'price-low') {
      orderBy = 'ORDER BY price_per_person ASC';
    } else if (sort === 'price-high') {
      orderBy = 'ORDER BY price_per_person DESC';
    } else if (sort === 'name-asc') {
      orderBy = 'ORDER BY name ASC';
    }

    let pagination = '';
    if (page && limit) {
      const p = Math.max(1, parseInt(page as string, 10));
      const l = Math.max(1, parseInt(limit as string, 10));
      const offset = (p - 1) * l;
      pagination = `LIMIT ${l} OFFSET ${offset}`;
    }

    const sql = `SELECT * FROM destinations ${whereClause} ${orderBy} ${pagination}`;
    const result = await query(sql, params);

    const destinations = result.rows.map(mapDestinationRow);
    res.json({ success: true, count: destinations.length, data: destinations });
  } catch (error: any) {
    console.error('Get destinations error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching destinations.' });
  }
}

export async function getDestinationById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;
    const isNum = !isNaN(Number(id));

    const destSql = isNum
      ? 'SELECT * FROM destinations WHERE id = $1'
      : 'SELECT * FROM destinations WHERE place_id = $1 OR slug = $1';

    const result = await query(destSql, [isNum ? Number(id) : id]);

    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Destination not found.', code: 'NOT_FOUND' });
      return;
    }

    const dest = mapDestinationRow(result.rows[0]);

    // Fetch related attractions
    const attrRes = await query('SELECT * FROM attractions WHERE destination_id = $1', [dest.id]);
    const attractions = attrRes.rows.map(a => ({
      id: a.id,
      name: a.name,
      category: a.category,
      description: a.description,
      image: a.image,
      rating: Number(a.rating),
      entryFee: a.entry_fee,
      timings: a.timings,
      highlights: a.highlights || []
    }));

    // Fetch related reviews
    const revRes = await query('SELECT * FROM reviews WHERE destination_id = $1 ORDER BY created_at DESC LIMIT 10', [dest.id]);

    res.json({
      success: true,
      data: {
        ...dest,
        attractionList: attractions,
        reviews: revRes.rows
      }
    });
  } catch (error: any) {
    console.error('Get destination by ID error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching destination details.' });
  }
}

export async function searchDestinations(req: Request, res: Response): Promise<void> {
  try {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.trim() === '') {
      res.json({ success: true, data: [] });
      return;
    }

    const term = `%${q.trim().toLowerCase()}%`;
    const sql = `
      SELECT * FROM destinations
      WHERE LOWER(name) LIKE $1 
         OR LOWER(location) LIKE $1 
         OR LOWER(state_name) LIKE $1 
         OR LOWER(district) LIKE $1 
         OR LOWER(category) LIKE $1
         OR $2 = ANY(tags)
      ORDER BY rating DESC
      LIMIT 20
    `;
    const result = await query(sql, [term, q.trim()]);
    res.json({ success: true, data: result.rows.map(mapDestinationRow) });
  } catch (error: any) {
    console.error('Search destinations error:', error);
    res.status(500).json({ success: false, message: 'Internal server error searching destinations.' });
  }
}

/**
 * PostGIS Spatial Query: Find nearby destinations within radius (km)
 */
export async function getNearbyDestinations(req: Request, res: Response): Promise<void> {
  try {
    const { lat, lng, radius, limit } = req.query;

    if (!lat || !lng || isNaN(Number(lat)) || isNaN(Number(lng))) {
      res.status(400).json({ success: false, message: 'Valid lat and lng query parameters are required.' });
      return;
    }

    const latitude = Number(lat);
    const longitude = Number(lng);
    const radiusKm = radius ? Number(radius) : 100;
    const maxResults = limit ? Number(limit) : 10;

    const sql = `
      SELECT *,
        ST_Distance(geo_location, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography) / 1000.0 AS distance_km
      FROM destinations
      WHERE geo_location IS NOT NULL
        AND ST_DWithin(geo_location, ST_SetSRID(ST_MakePoint($2, $1), 4326)::geography, $3 * 1000.0)
      ORDER BY distance_km ASC
      LIMIT $4;
    `;

    const result = await query(sql, [latitude, longitude, radiusKm, maxResults]);
    const destinations = result.rows.map(mapDestinationRow);

    res.json({
      success: true,
      origin: { lat: latitude, lng: longitude },
      radiusKm,
      count: destinations.length,
      data: destinations
    });
  } catch (error: any) {
    console.error('Nearby destinations PostGIS error:', error);
    res.status(500).json({ success: false, message: 'Internal server error calculating nearby destinations with PostGIS.' });
  }
}
