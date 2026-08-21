import { Router } from 'express';
import { getWishlist, addToWishlist, removeFromWishlist } from '../controllers/wishlist.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getWishlist);
router.post('/:destinationId', addToWishlist);
router.delete('/:destinationId', removeFromWishlist);

export default router;
