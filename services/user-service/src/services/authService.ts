import bcrypt from 'bcrypt';
import { prisma } from '../config/db.js';
import { z } from 'zod';
import { registerSchema, loginSchema } from '../utils/validators.js';
import jwt from 'jsonwebtoken';

export const createUser = async (data: z.infer<typeof registerSchema>) => {
  // 1. Check if user/email already exists
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [{ email: data.email }, { username: data.username }],
    },
  });

  if (existingUser) {
    throw new Error('Username or Email already taken');
  }

  // 2. Hash the password
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(data.password, saltRounds);

  // 3. Save to DB
  return await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash,
      fullName: data.fullName,
    },
    select: { id: true, username: true, email: true, createdAt: true }
  });
};

export const loginUser = async (data: z.infer<typeof loginSchema>) => {
  // 1. Find the user by EITHER email OR username
  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.identifier },
        { username: data.identifier }
      ],
    },
  });

  if (!user) {
    throw new Error('Invalid credentials');
  }

  // 2. Compare passwords (remains the same)
  const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // 3. Generate JWT (remains the same)
  const token = jwt.sign(
    { userId: user.id, username: user.username },
    process.env.JWT_SECRET || 'fallback_secret',
    { expiresIn: '1d' }
  );

  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  };
};