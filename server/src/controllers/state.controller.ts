import { Request, Response } from 'express';
import { query } from '../config/database';

function mapStateRow(row: any) {
  return {
    id: row.id,
    name: row.name,
    code: row.code,
    type: row.type || 'STATE',
    capital: row.capital,
    region: row.region,
    description: row.description,
    image: row.image_url || row.banner_image,
    heroImage: row.banner_image || row.image_url,
    bannerImage: row.banner_image || row.image_url,
    thumbnailUrl: row.thumbnail_url,
    coordinates: {
      lat: row.latitude ? Number(row.latitude) : 20.5937,
      lng: row.longitude ? Number(row.longitude) : 78.9629
    },
    totalDestinations: Number(row.total_destinations) || Number(row.places_count) || 0,
    placesCount: Number(row.places_count) || Number(row.total_destinations) || 0,
    topAttractions: row.top_attractions || [],
    foodSpecialties: row.food_specialties || [],
    bestSeason: row.best_season || 'October to March',
    climate: row.climate || 'Tropical',
    languages: row.languages || []
  };
}

export async function getStates(req: Request, res: Response): Promise<void> {
  try {
    const { region } = req.query;
    let sql = 'SELECT * FROM states';
    const params: any[] = [];

    if (region && typeof region === 'string' && region !== 'All') {
      sql += ' WHERE region = $1';
      params.push(region);
    }

    sql += ' ORDER BY name ASC';
    const result = await query(sql, params);
    const states = result.rows.map(mapStateRow);

    res.json({ success: true, count: states.length, data: states });
  } catch (error: any) {
    console.error('Get states error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching states.' });
  }
}

export async function getStateById(req: Request, res: Response): Promise<void> {
  try {
    const rawId = req.params['id'];
    const id = Array.isArray(rawId) ? rawId[0] : rawId;

    if (!id) {
      res.status(400).json({ success: false, message: 'State ID is required.' });
      return;
    }

    const cleanId = String(id).toLowerCase();

    const stateRes = await query(
      'SELECT * FROM states WHERE LOWER(id) = $1 OR LOWER(code) = $1 OR LOWER(name) = $1',
      [cleanId]
    );

    if (stateRes.rows.length === 0) {
      res.status(404).json({ success: false, message: 'State not found.', code: 'NOT_FOUND' });
      return;
    }

    const stateData = mapStateRow(stateRes.rows[0]);

    // Fetch destinations for this state
    const destRes = await query(
      'SELECT id, name, category, rating, review_count, hero_image, thumbnail_url, price_per_person, location FROM destinations WHERE LOWER(state_id) = $1 OR LOWER(state_name) = $2',
      [stateData.id.toLowerCase(), stateData.name.toLowerCase()]
    );

    res.json({
      success: true,
      data: {
        ...stateData,
        destinations: destRes.rows.map(d => ({
          id: d.id,
          name: d.name,
          category: d.category,
          rating: Number(d.rating),
          reviewCount: Number(d.review_count),
          image: d.hero_image,
          heroImage: d.hero_image,
          thumbnailUrl: d.thumbnail_url,
          pricePerPerson: Number(d.price_per_person),
          location: d.location
        }))
      }
    });
  } catch (error: any) {
    console.error('Get state by ID error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching state details.' });
  }
}
