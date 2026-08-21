import { Router } from 'express';
import {
  getDestinations,
  getDestinationById,
  searchDestinations,
  getNearbyDestinations
} from '../controllers/destination.controller';

const router = Router();

router.get('/', getDestinations);
router.get('/search', searchDestinations);
router.get('/nearby', getNearbyDestinations);
router.get('/:id', getDestinationById);

export default router;
