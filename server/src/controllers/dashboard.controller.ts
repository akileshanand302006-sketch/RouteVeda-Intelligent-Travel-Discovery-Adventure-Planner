import { Response } from 'express';
import { query } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export async function getDashboardStats(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId || '1';

    const [userStats, globalStats, featuredDests] = await Promise.all([
      query(
        `SELECT 
          (SELECT COUNT(*) FROM trips WHERE user_id = $1) as user_trips_count,
          (SELECT COUNT(*) FROM wishlists WHERE user_id = $1) as user_wishlist_count,
          (SELECT COALESCE(SUM(budget), 0) FROM trips WHERE user_id = $1) as user_total_budget;`,
        [userId]
      ),
      query(
        `SELECT 
          (SELECT COUNT(*) FROM destinations) as total_destinations,
          (SELECT COUNT(*) FROM states) as total_states,
          (SELECT COUNT(*) FROM activities) as total_activities,
          (SELECT AVG(rating) FROM destinations) as avg_destination_rating;`
      ),
      query(
        `SELECT id, name, category, rating, review_count, hero_image, thumbnail_url, state_name, price_per_person
         FROM destinations
         WHERE featured = TRUE
         ORDER BY rating DESC
         LIMIT 6;`
      )
    ]);

    const u = userStats.rows[0];
    const g = globalStats.rows[0];

    res.json({
      success: true,
      data: {
        user: {
          tripsCount: parseInt(u.user_trips_count, 10),
          wishlistCount: parseInt(u.user_wishlist_count, 10),
          totalBudget: parseFloat(u.user_total_budget)
        },
        global: {
          totalDestinations: parseInt(g.total_destinations, 10),
          totalStates: parseInt(g.total_states, 10),
          totalActivities: parseInt(g.total_activities, 10),
          avgRating: parseFloat(Number(g.avg_destination_rating).toFixed(1))
        },
        featuredDestinations: featuredDests.rows.map(d => ({
          id: d.id,
          name: d.name,
          category: d.category,
          rating: Number(d.rating),
          reviewCount: Number(d.review_count),
          image: d.hero_image,
          heroImage: d.hero_image,
          thumbnailUrl: d.thumbnail_url,
          state: d.state_name,
          pricePerPerson: Number(d.price_per_person)
        }))
      }
    });
  } catch (error: any) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching dashboard stats.' });
  }
}
