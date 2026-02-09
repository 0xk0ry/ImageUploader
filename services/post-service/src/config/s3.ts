import { S3Client } from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-1",
  endpoint: process.env.S3_ENDPOINT, // This points to MinIO
  forcePathStyle: true, // Required for MinIO
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});