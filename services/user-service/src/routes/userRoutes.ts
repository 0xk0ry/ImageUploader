import { Router } from 'express';
import { register, login } from '../controllers/authController.js';
import { getProfile, updateMyProfile   } from '../controllers/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile/:username', getProfile);
router.patch('/profile', authenticate, updateMyProfile);

export default router;