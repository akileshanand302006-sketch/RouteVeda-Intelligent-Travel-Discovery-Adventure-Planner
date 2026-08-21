import { Response } from 'express';
import { pool, query } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

function calculateDays(startDate?: string, endDate?: string): number {
  if (!startDate || !endDate) return 1;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  return Math.max(Math.ceil(diff / (1000 * 60 * 60 * 24)), 1);
}

function calculateBudgetBreakdown(budget: number, travelers: number, duration: number) {
  const t = Math.max(1, travelers);
  const d = Math.max(1, duration);
  const accommodation = d * 2500 * Math.ceil(t / 2);
  const food = d * 800 * t;
  const transportation = d * 500 * t;
  const activities = d * 400 * t;
  const miscellaneous = Math.round((accommodation + food + transportation + activities) * 0.1);
  return { accommodation, food, transportation, activities, miscellaneous };
}

function mapTripRow(r: any) {
  const duration = calculateDays(r.start_date, r.end_date);
  const travelers = Number(r.number_of_travelers) || 1;
  const budget = Number(r.budget) || 20000;
  const breakdown = r.budget_breakdown || calculateBudgetBreakdown(budget, travelers, duration);
  const estimatedCost = breakdown.accommodation + breakdown.food + breakdown.transportation + breakdown.activities + breakdown.miscellaneous;

  return {
    id: String(r.id),
    name: r.title || r.name || 'Trip Adventure',
    title: r.title || r.name || 'Trip Adventure',
    travelerName: r.traveler_name || 'Traveler',
    travelerEmail: r.traveler_email || '',
    numberOfTravelers: travelers,
    destinations: r.dest_ids || [],
    destinationNames: r.dest_names || [],
    activities: r.act_ids || [],
    activityNames: r.act_names || [],
    startDate: r.start_date ? new Date(r.start_date).toISOString().split('T')[0] : '',
    endDate: r.end_date ? new Date(r.end_date).toISOString().split('T')[0] : '',
    duration,
    travelStyle: r.travel_style || 'Adventure',
    budget,
    estimatedCost,
    budgetBreakdown: breakdown,
    itinerary: typeof r.itinerary === 'string' ? JSON.parse(r.itinerary) : (r.itinerary || []),
    status: r.status || 'Planning',
    createdAt: r.created_at || new Date().toISOString(),
    updatedAt: r.updated_at || new Date().toISOString(),
    notes: r.description || '',
    coverImage: r.cover_image || r.first_image || 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
  };
}

export async function getTrips(req: AuthRequest, res: Response): Promise<void> {
  try {
    const rawUserId = req.headers['x-user-id'] || req.userId || '1';
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : String(rawUserId);

    const tripsRes = await query(
      `SELECT t.*,
              COALESCE(array_agg(td.destination_id ORDER BY td.visit_order) FILTER (WHERE td.destination_id IS NOT NULL), '{}') as dest_ids,
              COALESCE(array_agg(d.name ORDER BY td.visit_order) FILTER (WHERE d.name IS NOT NULL), '{}') as dest_names,
              (SELECT hero_image FROM destinations WHERE id = (SELECT destination_id FROM trip_destinations WHERE trip_id = t.id ORDER BY visit_order LIMIT 1)) as first_image
       FROM trips t
       LEFT JOIN trip_destinations td ON td.trip_id = t.id
       LEFT JOIN destinations d ON d.id = td.destination_id
       WHERE t.user_id = $1
       GROUP BY t.id
       ORDER BY t.created_at DESC`,
      [userId]
    );

    const trips = tripsRes.rows.map(mapTripRow);
    res.json({ success: true, count: trips.length, data: trips });
  } catch (error: any) {
    console.error('Get trips error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching trips.' });
  }
}

export async function getTripById(req: AuthRequest, res: Response): Promise<void> {
  try {
    const rawUserId = req.headers['x-user-id'] || req.userId || '1';
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : String(rawUserId);
    const rawId = req.params['id'];
    const id = Array.isArray(rawId) ? rawId[0] : String(rawId);

    const tripsRes = await query(
      `SELECT t.*,
              COALESCE(array_agg(td.destination_id ORDER BY td.visit_order) FILTER (WHERE td.destination_id IS NOT NULL), '{}') as dest_ids,
              COALESCE(array_agg(d.name ORDER BY td.visit_order) FILTER (WHERE d.name IS NOT NULL), '{}') as dest_names,
              (SELECT hero_image FROM destinations WHERE id = (SELECT destination_id FROM trip_destinations WHERE trip_id = t.id ORDER BY visit_order LIMIT 1)) as first_image
       FROM trips t
       LEFT JOIN trip_destinations td ON td.trip_id = t.id
       LEFT JOIN destinations d ON d.id = td.destination_id
       WHERE t.id = $1 AND t.user_id = $2
       GROUP BY t.id`,
      [id, userId]
    );

    if (tripsRes.rows.length === 0) {
      res.status(404).json({ success: false, message: 'Trip not found.', code: 'NOT_FOUND' });
      return;
    }

    res.json({ success: true, data: mapTripRow(tripsRes.rows[0]) });
  } catch (error: any) {
    console.error('Get trip by ID error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching trip.' });
  }
}

export async function createTrip(req: AuthRequest, res: Response): Promise<void> {
  const client = await pool.connect();
  try {
    const rawUserId = req.headers['x-user-id'] || req.userId || '1';
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : String(rawUserId);
    const {
      name,
      title,
      description,
      notes,
      travelerName,
      travelerEmail,
      startDate,
      endDate,
      numberOfTravelers,
      travelStyle,
      budget,
      status,
      destinations,
      activities,
      itinerary
    } = req.body;

    const tripTitle = (title || name || `Trip to India`).trim();
    const tripId = `trip-${Date.now()}`;

    await client.query('BEGIN');

    // Ensure user and profile exist to satisfy foreign keys
    await client.query(
      `INSERT INTO users (id, email, password_hash, role)
       VALUES ($1, $2, 'password123', 'user')
       ON CONFLICT (id) DO NOTHING`,
      [userId, `user_${userId}@tripforge.com`]
    );

    await client.query(
      `INSERT INTO profiles (id, user_id, full_name)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id) DO NOTHING`,
      [`prof-${userId}`, userId, travelerName || 'Traveler']
    );

    await client.query(
      `INSERT INTO trips (
        id, user_id, title, description, start_date, end_date, number_of_travelers,
        travel_style, budget, status, itinerary
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
      [
        tripId,
        userId,
        tripTitle,
        description || notes || '',
        startDate || null,
        endDate || null,
        numberOfTravelers || 1,
        travelStyle || 'Adventure',
        budget || 20000,
        status || 'Planning',
        JSON.stringify(itinerary || [])
      ]
    );

    // Insert destinations safely
    const destinationNames: string[] = [];
    if (Array.isArray(destinations)) {
      for (let i = 0; i < destinations.length; i++) {
        const dest = destinations[i];
        const destId = typeof dest === 'number' ? dest : (dest?.id || dest?.destinationId);
        if (destId) {
          const checkDest = await client.query('SELECT name FROM destinations WHERE id = $1', [destId]);
          if (checkDest.rows.length > 0) {
            destinationNames.push(checkDest.rows[0].name);
            await client.query(
              `INSERT INTO trip_destinations (id, trip_id, destination_id, visit_order)
               VALUES ($1, $2, $3, $4)
               ON CONFLICT (id) DO NOTHING`,
              [`${tripId}-d-${destId}-${i}`, tripId, destId, i + 1]
            );
          }
        }
      }
    }

    // Update user profile trips count
    await client.query(
      'UPDATE profiles SET trips_created = trips_created + 1 WHERE user_id = $1',
      [userId]
    );

    await client.query('COMMIT');

    const duration = calculateDays(startDate, endDate);
    const travelers = Number(numberOfTravelers) || 1;
    const tripBudget = Number(budget) || 20000;
    const breakdown = calculateBudgetBreakdown(tripBudget, travelers, duration);
    const estimatedCost = breakdown.accommodation + breakdown.food + breakdown.transportation + breakdown.activities + breakdown.miscellaneous;

    const createdTrip = {
      id: tripId,
      name: tripTitle,
      title: tripTitle,
      travelerName: travelerName || 'Traveler',
      travelerEmail: travelerEmail || '',
      numberOfTravelers: travelers,
      destinations: destinations || [],
      destinationNames,
      activities: activities || [],
      startDate: startDate || '',
      endDate: endDate || '',
      duration,
      travelStyle: travelStyle || 'Adventure',
      budget: tripBudget,
      estimatedCost,
      budgetBreakdown: breakdown,
      itinerary: itinerary || [],
      status: status || 'Planning',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: notes || description || '',
      coverImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80'
    };

    res.status(201).json({
      success: true,
      message: 'Trip created successfully in PostgreSQL.',
      data: createdTrip
    });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Create trip error:', error);
    res.status(500).json({ success: false, message: 'Internal server error saving trip.' });
  } finally {
    client.release();
  }
}

export async function updateTrip(req: AuthRequest, res: Response): Promise<void> {
  const client = await pool.connect();
  try {
    const rawUserId = req.headers['x-user-id'] || req.userId || '1';
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : String(rawUserId);
    const rawId = req.params['id'];
    const id = Array.isArray(rawId) ? rawId[0] : String(rawId);

    const { name, title, description, notes, startDate, endDate, numberOfTravelers, travelStyle, budget, status, itinerary } = req.body;

    await client.query('BEGIN');

    const check = await client.query('SELECT id FROM trips WHERE id = $1 AND user_id = $2', [id, userId]);
    if (check.rows.length === 0) {
      await client.query('ROLLBACK');
      res.status(404).json({ success: false, message: 'Trip not found or unauthorized.' });
      return;
    }

    await client.query(
      `UPDATE trips SET
        title = COALESCE($1, title),
        description = COALESCE($2, description),
        start_date = COALESCE($3, start_date),
        end_date = COALESCE($4, end_date),
        number_of_travelers = COALESCE($5, number_of_travelers),
        travel_style = COALESCE($6, travel_style),
        budget = COALESCE($7, budget),
        status = COALESCE($8, status),
        itinerary = COALESCE($9, itinerary),
        updated_at = CURRENT_TIMESTAMP
       WHERE id = $10 AND user_id = $11`,
      [
        title || name,
        description || notes,
        startDate,
        endDate,
        numberOfTravelers,
        travelStyle,
        budget,
        status,
        itinerary ? JSON.stringify(itinerary) : null,
        id,
        userId
      ]
    );

    await client.query('COMMIT');
    res.json({ success: true, message: 'Trip updated successfully.' });
  } catch (error: any) {
    await client.query('ROLLBACK');
    console.error('Update trip error:', error);
    res.status(500).json({ success: false, message: 'Internal server error updating trip.' });
  } finally {
    client.release();
  }
}

export async function deleteTrip(req: AuthRequest, res: Response): Promise<void> {
  try {
    const rawUserId = req.headers['x-user-id'] || req.userId || '1';
    const userId = Array.isArray(rawUserId) ? rawUserId[0] : String(rawUserId);
    const rawId = req.params['id'];
    const id = Array.isArray(rawId) ? rawId[0] : String(rawId);

    const result = await query('DELETE FROM trips WHERE id = $1 AND user_id = $2', [id, userId]);
    if (result.rowCount === 0) {
      res.status(404).json({ success: false, message: 'Trip not found or unauthorized.' });
      return;
    }

    // Decrement trips count in profile
    await query('UPDATE profiles SET trips_created = GREATEST(0, trips_created - 1) WHERE user_id = $1', [userId]);

    res.json({ success: true, message: 'Trip deleted successfully.' });
  } catch (error: any) {
    console.error('Delete trip error:', error);
    res.status(500).json({ success: false, message: 'Internal server error deleting trip.' });
  }
}
