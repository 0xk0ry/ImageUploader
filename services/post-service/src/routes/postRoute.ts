import { Router } from 'express';
import { handleCreatePost } from '../controllers/postController.js';
import { authenticate } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

// Use upload.array('files') to handle multiple media items
router.post('/', authenticate, upload, handleCreatePost);

export default router;