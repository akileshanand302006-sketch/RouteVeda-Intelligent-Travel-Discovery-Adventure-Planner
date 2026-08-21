import { Router } from 'express';
import {
  getActivities,
  getAttractions,
  getFoods,
  getFestivals
} from '../controllers/activity.controller';

const router = Router();

router.get('/activities', getActivities);
router.get('/attractions', getAttractions);
router.get('/foods', getFoods);
router.get('/festivals', getFestivals);

export default router;
