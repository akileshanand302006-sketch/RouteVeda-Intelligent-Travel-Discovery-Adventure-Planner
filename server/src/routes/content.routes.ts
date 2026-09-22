import { Router } from 'express';
import {
  getExperiences,
  getItineraries,
  getItineraryById,
  getNotifications
} from '../controllers/content.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.get('/experiences', getExperiences);
router.get('/itineraries', getItineraries);
router.get('/itineraries/:id', getItineraryById);
router.get('/notifications', authenticate, getNotifications);

export default router;
