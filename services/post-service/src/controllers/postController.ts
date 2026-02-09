import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware.js';
import * as postService from '../services/postService.js';

export const handleCreatePost = async (req: AuthRequest, res: Response) => {
  try {
    const { caption } = req.body;
    const files = req.files as Express.Multer.File[];
    const userId = req.user?.userId;

    if (!userId || !files || files.length === 0) {
      return res.status(400).json({ message: "Missing files or unauthorized" });
    }

    const post = await postService.createPost(userId, caption, files);

    res.status(201).json(post);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};