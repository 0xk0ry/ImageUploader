import { Router } from 'express';
import { register, login } from '../controller/authController.js';
import { getProfile, updateMyProfile   } from '../controller/userController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile/:username', getProfile);
router.patch('/profile', authenticate, updateMyProfile);

export default router;