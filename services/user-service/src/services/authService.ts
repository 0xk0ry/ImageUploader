import bcrypt from 'bcrypt';
import { prisma } from '../config/db.js';
import { z } from 'zod';
import { registerSchema } from '../utils/validators.js';
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