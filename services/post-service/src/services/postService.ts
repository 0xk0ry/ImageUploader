import { uuidv4 } from "zod/v4/mini";
import { prisma } from "../config/db.js";
import { processAndUploadMedia } from "./mediaService.js";
import { Queue } from "bullmq";
import { uploadToS3 } from "../utils/s3.js";

const mediaQueue = new Queue("media-processing", {
  connection: { host: "localhost", port: 6379 },
});

// post-service/src/services/postService.ts
export const createPost = async (
  userId: string,
  caption: string,
  files: Express.Multer.File[],
) => {
  const post = await prisma.post.create({
    data: { authorId: userId, caption, status: "PROCESSING" },
  });

  for (const file of files) {
    const rawKey = `temp/${uuidv4()}-${file.originalname}`;
    // Upload raw file to MinIO
    await uploadToS3(file.buffer, rawKey, file.mimetype);

    // Send the KEY to the worker, not the BUFFER
    await mediaQueue.add("process-media", {
      postId: post.id,
      userId,
      rawKey,
      mimetype: file.mimetype,
    });
  }
  return post;
};
