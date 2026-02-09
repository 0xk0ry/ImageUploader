import { Router } from 'express';
import { register, login } from '../controller/authController.js';
import { getProfile } from '../controller/userController.js';
import { authenticate, AuthRequest } from '../middleware/authMiddleware.js';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.get('/profile/:username', getProfile);

export default router;