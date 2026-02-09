import { prisma } from "../config/db.js";
import { z } from "zod";
import { updateProfileSchema } from "../utils/validators.js";

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
    throw new Error("User not found");
  }

  return user;
};

export const updateProfile = async (
  userId: string,
  data: z.infer<typeof updateProfileSchema>,
) => {
  return await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      username: true,
      fullName: true,
      bio: true,
      profilePicUrl: true,
      updatedAt: true,
    },
  });
};
