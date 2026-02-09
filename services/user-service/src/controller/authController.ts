import { Request, Response } from 'express';
import { registerSchema } from '../utils/validators.js';
import * as authService from '../services/authService.js';
import { z } from 'zod';

export const register = async (req: Request, res: Response) => {
  try {
    // Validate input
    const validatedData = registerSchema.parse(req.body);

    // Call service
    const newUser = await authService.createUser(validatedData);

    res.status(201).json({
      message: 'User registered successfully',
      user: newUser,
    });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ errors: error.errors });
    }
    res.status(400).json({ message: error.message });
  }
};