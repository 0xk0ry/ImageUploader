import { prisma } from '../config/db.js';
import { processAndUploadMedia } from './mediaService.js';

export const createPost = async (userId: string, caption: string, files: Express.Multer.File[]) => {
  const mediaResults = await Promise.all(
    files.map((file, index) => processAndUploadMedia(file, userId))
  );

  return await prisma.post.create({
    data: {
      authorId: userId,
      caption,
      media: {
        create: mediaResults.map((m, index) => ({
          url: m.url,
          type: m.type,
          order: index,
        })),
      },
    },
    include: { media: true },
  });
};