import sharp from 'sharp';
import ffmpeg from 'fluent-ffmpeg';
import { uploadToS3 } from '../utils/s3.js';
import { v4 as uuidv4 } from 'uuid';

//! Implement Worker Thread to perform video/image processing in the background.
export const processAndUploadMedia = async (file: Express.Multer.File, userId: string) => {
  const fileId = uuidv4();
  const isVideo = file.mimetype.startsWith('video');
  const key = `posts/${userId}/${fileId}`;

  if (isVideo) {
    return {
      url: await uploadToS3(file, `${key}.mp4`),
      type: 'VIDEO'
    };
  } else {
    const processedBuffer = await sharp(file.buffer)
      .resize(1080, 1080, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const uploadResult = await uploadToS3(
      { ...file, buffer: processedBuffer, mimetype: 'image/jpeg' },
      `${key}.jpg`
    );

    return { url: uploadResult, type: 'IMAGE' };
  }
};