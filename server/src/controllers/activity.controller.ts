import { Request, Response } from 'express';
import { query } from '../config/database';

export async function getActivities(req: Request, res: Response): Promise<void> {
  try {
    const { category, difficulty, maxPrice } = req.query;
    let sql = 'SELECT * FROM activities';
    const conditions: string[] = [];
    const params: any[] = [];
    let pIdx = 1;

    if (category && typeof category === 'string') {
      conditions.push(`category = $${pIdx}`);
      params.push(category);
      pIdx++;
    }

    if (difficulty && typeof difficulty === 'string') {
      conditions.push(`difficulty = $${pIdx}`);
      params.push(difficulty);
      pIdx++;
    }

    if (maxPrice && !isNaN(Number(maxPrice))) {
      conditions.push(`price <= $${pIdx}`);
      params.push(Number(maxPrice));
      pIdx++;
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ' ORDER BY rating DESC, name ASC';
    const result = await query(sql, params);

    const activities = result.rows.map(a => ({
      id: a.id,
      name: a.name,
      category: a.category,
      description: a.description,
      duration: a.duration,
      price: Number(a.price),
      difficulty: a.difficulty,
      rating: Number(a.rating),
      reviewCount: Number(a.review_count),
      minAge: Number(a.min_age),
      location: a.location,
      icon: a.icon,
      image: a.image_url,
      imageUrl: a.image_url,
      includes: a.includes || [],
      whatToBring: a.what_to_bring || [],
      featured: Boolean(a.featured)
    }));

    res.json({ success: true, count: activities.length, data: activities });
  } catch (error: any) {
    console.error('Get activities error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching activities.' });
  }
}

export async function getAttractions(req: Request, res: Response): Promise<void> {
  try {
    const { category, state, destinationId } = req.query;
    let sql = 'SELECT * FROM attractions';
    const conditions: string[] = [];
    const params: any[] = [];
    let pIdx = 1;

    if (category && typeof category === 'string' && category !== 'All') {
      conditions.push(`category = $${pIdx}`);
      params.push(category);
      pIdx++;
    }

    if (state && typeof state === 'string' && state !== 'All') {
      conditions.push(`(LOWER(state_name) = LOWER($${pIdx}) OR LOWER(state_id) = LOWER($${pIdx}))`);
      params.push(state.trim());
      pIdx++;
    }

    if (destinationId && !isNaN(Number(destinationId))) {
      conditions.push(`destination_id = $${pIdx}`);
      params.push(Number(destinationId));
      pIdx++;
    }

    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }

    sql += ' ORDER BY rating DESC, name ASC';
    const result = await query(sql, params);

    const attractions = result.rows.map(a => ({
      id: a.id,
      name: a.name,
      destinationId: a.destination_id,
      destinationName: a.destination_name,
      stateId: a.state_id,
      state: a.state_name,
      stateName: a.state_name,
      category: a.category,
      description: a.description,
      image: a.image,
      rating: Number(a.rating),
      entryFee: a.entry_fee,
      timings: a.timings,
      highlights: a.highlights || []
    }));

    res.json({ success: true, count: attractions.length, data: attractions });
  } catch (error: any) {
    console.error('Get attractions error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching attractions.' });
  }
}

export async function getFoods(req: Request, res: Response): Promise<void> {
  try {
    const { state } = req.query;
    let sql = 'SELECT * FROM foods';
    const params: any[] = [];

    if (state && typeof state === 'string') {
      sql += ' WHERE LOWER(state_name) = LOWER($1) OR LOWER(state_id) = LOWER($1)';
      params.push(state.trim());
    }

    sql += ' ORDER BY name ASC';
    const result = await query(sql, params);

    const foods = result.rows.map(f => {
      let region = 'North';
      const s = (f.state_name || '').toLowerCase();
      if (s.includes('kerala') || s.includes('tamil') || s.includes('karnataka') || s.includes('andhra') || s.includes('telangana')) region = 'South';
      else if (s.includes('bengal') || s.includes('odisha') || s.includes('bihar') || s.includes('jharkhand')) region = 'East';
      else if (s.includes('maharashtra') || s.includes('gujarat') || s.includes('goa') || s.includes('rajasthan')) region = 'West';
      else if (s.includes('madhya') || s.includes('chhattisgarh')) region = 'Central';
      else if (s.includes('assam') || s.includes('nagaland') || s.includes('sikkim') || s.includes('meghalaya') || s.includes('manipur') || s.includes('mizoram') || s.includes('tripura') || s.includes('arunachal')) region = 'North East';

      return {
        id: f.id,
        name: f.name,
        destinationId: f.destination_id,
        stateId: f.state_id,
        state: f.state_name,
        stateName: f.state_name,
        region: region,
        category: f.category,
        type: f.category === 'Sweet' ? 'Sweet' : f.category === 'Beverage' ? 'Beverage' : Boolean(f.is_veg) ? 'Veg' : 'Non-Veg',
        description: f.description,
        isVeg: Boolean(f.is_veg),
        priceRange: f.price_range,
        popularPlacesToTry: f.must_try_at || [],
        mustTryAt: f.must_try_at || [],
        tags: [f.category, f.state_name, region],
        image: f.image
      };
    });

    res.json({ success: true, count: foods.length, data: foods });
  } catch (error: any) {
    console.error('Get foods error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching culinary specialties.' });
  }
}

export async function getFestivals(req: Request, res: Response): Promise<void> {
  try {
    const { state } = req.query;
    let sql = 'SELECT * FROM festivals';
    const params: any[] = [];

    if (state && typeof state === 'string') {
      sql += ' WHERE LOWER(state_name) = LOWER($1) OR LOWER(state_id) = LOWER($1)';
      params.push(state.trim());
    }

    sql += ' ORDER BY name ASC';
    const result = await query(sql, params);

    const festivals = result.rows.map(fest => ({
      id: fest.id,
      name: fest.name,
      stateId: fest.state_id,
      state: fest.state_name,
      stateName: fest.state_name,
      location: fest.state_name,
      month: fest.month,
      duration: fest.duration,
      category: fest.significance || 'Cultural',
      description: fest.description,
      significance: fest.significance,
      keyAttractions: fest.highlights || [],
      highlights: fest.highlights || [],
      image: fest.image
    }));

    res.json({ success: true, count: festivals.length, data: festivals });
  } catch (error: any) {
    console.error('Get festivals error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching festivals.' });
  }
}
