import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'college-project-showcase/progress',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'docx', 'jfif', 'mp4', 'webm', 'mov'],
    resource_type: 'auto',
  },
});

const genericStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'college-project-showcase/general',
    allowed_formats: ['jpg', 'png', 'jpeg', 'pdf', 'jfif', 'mp4', 'webm', 'mov'],
    resource_type: 'auto', // Important for videos
  },
});

export { cloudinary, storage, genericStorage };
