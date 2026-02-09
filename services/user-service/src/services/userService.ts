import { prisma } from '../config/db.js';

export const getUserProfile = async (username: string) => {
  const user = await prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      fullName: true,
      bio: true,
      profilePicUrl: true,
      createdAt: true,
    },
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};