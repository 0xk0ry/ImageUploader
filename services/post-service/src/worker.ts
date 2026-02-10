import { Worker } from "bullmq";
import sharp from "sharp";
import { prisma } from "./config/db.js";
import { downloadFromS3, uploadToS3, deleteFromS3 } from "./utils/s3.js";

const worker = new Worker(
  "media-processing",
  async (job) => {
    const { postId, userId, rawKey, mimetype } = job.data;

    try {
      console.log(`🛠️ Processing job ${job.id} for post ${postId}`);

      const rawBuffer = await downloadFromS3(rawKey);

      const processedBuffer = await sharp(rawBuffer)
        .resize(1080, 1080, { fit: "cover" })
        .toBuffer();

      const finalKey = `posts/${userId}/${job.id}.jpg`;
      const finalUrl = await uploadToS3(
        processedBuffer,
        finalKey,
        "image/jpeg",
      );

      await prisma.postMedia.create({
        data: {
          postId,
          url: finalUrl,
          type: "IMAGE",
          order: 0,
        },
      });

      await deleteFromS3(rawKey);

      console.log(`✅ Job ${job.id} finished.`);
    } catch (error) {
      console.error(`❌ Job ${job.id} failed:`, error);
      throw error;
    }
  },
  {
    connection: { host: "localhost", port: 6379 },
  },
);
