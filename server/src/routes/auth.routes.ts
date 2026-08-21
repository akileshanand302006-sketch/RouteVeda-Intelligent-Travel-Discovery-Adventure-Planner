import { Router } from 'express';
import { login, register, getProfile, updateProfile } from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.post('/login', login);
router.post('/register', register);
router.get('/me', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

export default router;
