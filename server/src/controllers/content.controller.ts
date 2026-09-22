import { Request, Response } from 'express';
import { query } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export async function getExperiences(req: Request, res: Response): Promise<void> {
  try {
    const { category } = req.query;
    let sql = 'SELECT * FROM experiences';
    const params: any[] = [];

    if (category && typeof category === 'string' && category !== 'All') {
      sql += ' WHERE LOWER(category) = LOWER($1)';
      params.push(category);
    }

    sql += ' ORDER BY popular_spots_count DESC, title ASC';
    const result = await query(sql, params);

    const experiences = result.rows.map(e => ({
      id: e.id,
      category: e.category,
      title: e.title,
      description: e.description,
      image: e.image,
      states: e.states || [],
      highlightTag: e.highlight_tag,
      popularSpotsCount: Number(e.popular_spots_count) || 0
    }));

    res.json({ success: true, count: experiences.length, data: experiences });
  } catch (error: any) {
    console.error('Get experiences error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching experiences.' });
  }
}

export async function getItineraries(req: Request, res: Response): Promise<void> {
  try {
    const { region, travelStyle } = req.query;
    const conditions: string[] = [];
    const params: any[] = [];
    let pIdx = 1;

    if (region && typeof region === 'string' && region !== 'All') {
      conditions.push(`region = $${pIdx}`);
      params.push(region);
      pIdx++;
    }

    if (travelStyle && typeof travelStyle === 'string') {
      conditions.push(`travel_style = $${pIdx}`);
      params.push(travelStyle);
      pIdx++;
    }

    let sql = 'SELECT * FROM itineraries';
    if (conditions.length > 0) {
      sql += ` WHERE ${conditions.join(' AND ')}`;
    }
    sql += ' ORDER BY duration_days ASC, title ASC';

    const result = await query(sql, params);
    const itineraries = result.rows.map(it => ({
      id: it.id,
      title: it.title,
      subtitle: it.subtitle,
      region: it.region,
      states: it.states || [],
      durationDays: Number(it.duration_days),
      travelStyle: it.travel_style,
      estimatedBudgetPerPerson: Number(it.estimated_budget_per_person),
      coverImage: it.cover_image,
      destinationIds: it.destination_ids || [],
      destinationNames: it.destination_names || [],
      highlights: it.highlights || [],
      dayByDayPlan: typeof it.day_by_day_plan === 'string' ? JSON.parse(it.day_by_day_plan) : (it.day_by_day_plan || [])
    }));

    res.json({ success: true, count: itineraries.length, data: itineraries });
  } catch (error: any) {
    console.error('Get itineraries error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching itineraries.' });
  }
}

export async function getItineraryById(req: Request, res: Response): Promise<void> {
  try {
    const rawId = req.params['id'];
    const id = Array.isArray(rawId) ? rawId[0] : String(rawId);

    const result = await query('SELECT * FROM itineraries WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Itinerary not found.' });
      return;
    }

    const it = result.rows[0];
    res.json({
      success: true,
      data: {
        id: it.id,
        title: it.title,
        subtitle: it.subtitle,
        region: it.region,
        states: it.states || [],
        durationDays: Number(it.duration_days),
        travelStyle: it.travel_style,
        estimatedBudgetPerPerson: Number(it.estimated_budget_per_person),
        coverImage: it.cover_image,
        destinationIds: it.destination_ids || [],
        destinationNames: it.destination_names || [],
        highlights: it.highlights || [],
        dayByDayPlan: typeof it.day_by_day_plan === 'string' ? JSON.parse(it.day_by_day_plan) : (it.day_by_day_plan || [])
      }
    });
  } catch (error: any) {
    console.error('Get itinerary by ID error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching itinerary.' });
  }
}

export async function getNotifications(req: AuthRequest, res: Response): Promise<void> {
  try {
    const rawUserId = req.headers['x-user-id'] || req.userId || '1';
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : String(rawUserId);

    const result = await query(
      'SELECT * FROM notifications WHERE user_id = $1 OR user_id IS NULL ORDER BY timestamp DESC',
      [userId]
    );

    const notifications = result.rows.map(n => ({
      id: isNaN(Number(n.id)) ? n.id : Number(n.id),
      type: n.type || 'system',
      title: n.title,
      message: n.message,
      icon: n.icon || 'bi-bell-fill',
      timestamp: n.timestamp ? new Date(n.timestamp).toISOString() : new Date().toISOString(),
      read: Boolean(n.read),
      actionUrl: n.action_url
    }));

    res.json({ success: true, count: notifications.length, data: notifications });
  } catch (error: any) {
    console.error('Get notifications error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching notifications.' });
  }
}
