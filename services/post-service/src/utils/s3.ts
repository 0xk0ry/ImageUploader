import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";

export const s3Client = new S3Client({
  region: process.env.AWS_REGION || "ap-southeast-1",
  endpoint: process.env.S3_ENDPOINT, // This points to MinIO
  forcePathStyle: true, // Required for MinIO
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const uploadToS3 = async (
  file: Express.Multer.File | Buffer,
  key: string,
  mimetype?: string,
) => {
  const buffer = file instanceof Buffer ? file : file.buffer;
  const contentType =
    mimetype ||
    (file instanceof Buffer
      ? "application/octet-stream"
      : (file as Express.Multer.File).mimetype);

  const body = Buffer.isBuffer(buffer) ? buffer : new Uint8Array(buffer);

  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET_NAME,
    Key: key,
    Body: body,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return `${process.env.S3_ENDPOINT}/${process.env.S3_BUCKET_NAME}/${key}`;
};

export const downloadFromS3 = async (key: string): Promise<Buffer> => {
  try {
    const command = new GetObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });
    const response = await s3Client.send(command);

    if (!response.Body) {
      throw new Error(`No content found for key: ${key}`);
    }

    // Convert the stream to a buffer
    const bodyContents = await response.Body.transformToByteArray();
    return Buffer.from(bodyContents);
  } catch (error) {
    throw new Error(`Failed to download from S3: ${key} - ${error}`);
  }
};

export const deleteFromS3 = async (key: string): Promise<void> => {
  try {
    const command = new DeleteObjectCommand({
      Bucket: process.env.S3_BUCKET_NAME,
      Key: key,
    });
    await s3Client.send(command);
  } catch (error) {
    throw new Error(`Failed to delete from S3: ${key} - ${error}`);
  }
};

// Batch delete multiple files at once
export const deleteMultipleFromS3 = async (keys: string[]): Promise<void> => {
  await Promise.all(keys.map((key) => deleteFromS3(key)));
};
