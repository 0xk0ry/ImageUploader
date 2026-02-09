import { Request, Response } from 'express';
import { registerSchema, loginSchema } from '../utils/validators.js';
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

export const login = async (req: Request, res: Response) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const result = await authService.loginUser(validatedData);

    res.status(200).json({
      message: 'Login successful',
      ...result,
    });
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.flatten().fieldErrors });
    }
    // For security, keep error messages vague (don't tell them if the email was right but pass was wrong)
    res.status(401).json({ message: 'Invalid credentials' });
  }
};