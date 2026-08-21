import { Response } from 'express';
import { query } from '../config/database';
import { AuthRequest } from '../middleware/auth.middleware';

export async function getWishlist(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId || '1';

    const result = await query(
      `SELECT w.destination_id, d.name, d.category, d.rating, d.hero_image, d.thumbnail_url,
              d.price_per_person, d.state_name, d.location
       FROM wishlists w
       LEFT JOIN destinations d ON d.id = w.destination_id
       WHERE w.user_id = $1
       ORDER BY w.created_at DESC`,
      [userId]
    );

    const ids = result.rows.map(r => Number(r.destination_id));
    const items = result.rows.map(r => ({
      id: Number(r.destination_id),
      destinationId: Number(r.destination_id),
      name: r.name,
      category: r.category,
      rating: Number(r.rating),
      image: r.hero_image,
      heroImage: r.hero_image,
      thumbnailUrl: r.thumbnail_url,
      pricePerPerson: Number(r.price_per_person),
      state: r.state_name,
      location: r.location
    }));

    res.json({ success: true, count: ids.length, ids, data: items });
  } catch (error: any) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ success: false, message: 'Internal server error fetching wishlist.' });
  }
}

export async function addToWishlist(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId || '1';
    const rawDestId = req.params['destinationId'];
    const destIdStr = Array.isArray(rawDestId) ? rawDestId[0] : rawDestId;
    const destId = parseInt(destIdStr || '', 10);

    if (isNaN(destId)) {
      res.status(400).json({ success: false, message: 'Invalid destination ID.' });
      return;
    }

    const id = `${userId}-wish-${destId}`;
    await query(
      `INSERT INTO wishlists (id, user_id, destination_id)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, destination_id) DO NOTHING`,
      [id, userId, destId]
    );

    res.json({ success: true, message: 'Destination added to wishlist.', destinationId: destId });
  } catch (error: any) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ success: false, message: 'Internal server error adding to wishlist.' });
  }
}

export async function removeFromWishlist(req: AuthRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId || '1';
    const rawDestId = req.params['destinationId'];
    const destIdStr = Array.isArray(rawDestId) ? rawDestId[0] : rawDestId;
    const destId = parseInt(destIdStr || '', 10);

    if (isNaN(destId)) {
      res.status(400).json({ success: false, message: 'Invalid destination ID.' });
      return;
    }

    await query(
      'DELETE FROM wishlists WHERE user_id = $1 AND destination_id = $2',
      [userId, destId]
    );

    res.json({ success: true, message: 'Destination removed from wishlist.', destinationId: destId });
  } catch (error: any) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ success: false, message: 'Internal server error removing from wishlist.' });
  }
}
